#!/usr/bin/env python3
"""Work ledger collector for the portfolio's Daily Work Log section.

Reads only timestamps and working-directory paths from local Claude Code and
Codex logs, reduces them to per-day totals, and publishes those totals. Prompt
text, code, file paths and repo names never leave the machine: a path is
mapped to one of a few public bucket names by the private config file and
then discarded.

Standard library only, Python 3.9+, so the same file runs on Windows and macOS.

Commands:
  collect   Update this machine's private event store (~/.work-ledger).
  publish   Merge every machine's store into work-ledger.json.
  run       collect, pull the MacBook, publish, upload (what the scheduled task runs).
  sample    Record whether the keyboard or mouse was used in the last few minutes.
  install   Copy this script to ~/.work-ledger and register the scheduled jobs.
"""

import argparse
from bisect import bisect_left
from collections import defaultdict, deque
from contextlib import closing, contextmanager
from datetime import datetime, timedelta
import hashlib
import json
import os
import re
import shutil
import sqlite3
import subprocess
import sys
import time
from pathlib import Path
from tempfile import NamedTemporaryFile
from zoneinfo import ZoneInfo

HOME = Path.home()
LEDGER_DIR = HOME / ".work-ledger"
CONFIG_PATH = LEDGER_DIR / "config.json"
LEDGER_PATH = LEDGER_DIR / "work-ledger.json"
LOG_PATH = LEDGER_DIR / "run.log"

# A day starts at 4 AM Pacific, including on clock-change days.
DAY_START_HOUR = 4
PACIFIC = ZoneInfo("America/Los_Angeles")
# Active prompting time: gaps between prompts longer than this are treated as away time.
IDLE_GAP_SECONDS = 30 * 60
# Agent time: a session is considered running while its log lines are this close together.
AGENT_GAP_SECONDS = 5 * 60
# At the computer: a sampled minute counts when there was input this recently.
PRESENCE_IDLE_SECONDS = 3 * 60
SAME_PROMPT_SECONDS = 90
# Codex item types that are an action the agent took (the Claude side counts tool_use blocks).
CODEX_TOOL_ITEMS = ("commandExecution", "mcpToolCall", "fileChange", "webSearch", "collabAgentToolCall", "imageView")
PUBLISH_DAYS = 400
MIN_EPOCH = 1704067200
TASK_NAME = "WorkLedgerCollector"
PRESENCE_TASK_NAME = "WorkLedgerPresence"
MAC_AGENT_LABEL = "xyz.spragginsdesigns.work-ledger-presence"

NO_WINDOW = getattr(subprocess, "CREATE_NO_WINDOW", 0)
PUBLIC_BUCKETS = ("LineCrush", "LineCrush Games", "SureWord", "Client sites", "Personal & tooling")
CLAUDE_AGENT_TRACKING_SINCE = "2026-09-21"
IMAGE_REF = re.compile(r"\[Image #\d+\]")
PASTE_REF = re.compile(r"\[Pasted text #(\d+)(?: [^\]]*)?\]")


def log(message):
    LEDGER_DIR.mkdir(exist_ok=True)
    stamp = time.strftime("%Y-%m-%d %H:%M:%S")
    lines = []
    if LOG_PATH.exists():
        lines = LOG_PATH.read_text(encoding="utf-8", errors="replace").splitlines()[-300:]
    lines.append(f"{stamp} {message}")
    LOG_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def parse_iso_utc(text):
    try:
        stamp = datetime.fromisoformat(text.replace("Z", "+00:00"))
        return stamp.timestamp() if stamp.tzinfo is not None else None
    except (AttributeError, ValueError):
        return None


def valid_epoch(epoch):
    return isinstance(epoch, (int, float)) and MIN_EPOCH <= epoch <= time.time() + 60


def day_of(epoch):
    local = datetime.fromtimestamp(epoch, PACIFIC).replace(tzinfo=None)
    return (local - timedelta(hours=DAY_START_HOUR)).date().isoformat()


def split_run(start, end):
    """Yield (day, start, end) slices at actual Pacific 4 AM boundaries."""
    while start < end:
        day = day_of(start)
        next_day = datetime.fromisoformat(day).replace(hour=DAY_START_HOUR, tzinfo=PACIFIC)
        boundary = (next_day + timedelta(days=1)).timestamp()
        stop = min(end, boundary)
        yield day, start, stop
        start = stop


def read_json(path, default):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return default


def write_json(path, value):
    write_atomic(path, json.dumps(value, separators=(",", ":"), allow_nan=False).encode("utf-8"))


def write_atomic(path, data):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with NamedTemporaryFile(dir=path.parent, delete=False) as handle:
        tmp = Path(handle.name)
        handle.write(data)
    try:
        os.replace(tmp, path)
    finally:
        tmp.unlink(missing_ok=True)


@contextmanager
def ledger_lock(name):
    """Use an OS lock that is released on exit, including after a crash."""
    LEDGER_DIR.mkdir(exist_ok=True)
    with (LEDGER_DIR / name).open("a+b") as handle:
        handle.seek(0)
        if os.name == "nt":
            import msvcrt

            msvcrt.locking(handle.fileno(), msvcrt.LK_NBLCK, 1)
        else:
            import fcntl

            fcntl.flock(handle, fcntl.LOCK_EX | fcntl.LOCK_NB)
        yield


def load_config():
    config = read_json(CONFIG_PATH, None)
    if not isinstance(config, dict) or tuple(
        bucket.get("name") if isinstance(bucket, dict) else None for bucket in config.get("buckets", [])
    ) != PUBLIC_BUCKETS or config.get("defaultBucket") not in PUBLIC_BUCKETS or config.get(
        "timezone", PACIFIC.key
    ) != PACIFIC.key:
        sys.exit(
            f"Missing or invalid {CONFIG_PATH}. Copy config.example.json there and "
            "fill in the bucket patterns."
        )
    return config


def bucket_index(path, config):
    """Map a working directory to a public bucket; the path itself is not kept."""
    normalized = (path or "").replace("\\", "/").lower()
    for index, bucket in enumerate(config["buckets"]):
        if any(pattern.lower() in normalized for pattern in bucket.get("match", [])):
            return index
    names = [bucket["name"] for bucket in config["buckets"]]
    return names.index(config["defaultBucket"])


def file_id(path):
    return fingerprint(str(path))[:16]


def fingerprint(text):
    return hashlib.sha1(text.encode("utf-8", "replace")).hexdigest()


def iter_lines(path):
    try:
        handle = open(path, encoding="utf-8", errors="replace")
    except FileNotFoundError:
        return
    with handle:
        yield from handle


def records(path):
    for line in iter_lines(path):
        try:
            entry = json.loads(line)
        except ValueError:
            continue
        if isinstance(entry, dict):
            yield entry


# --- prompt and session collection --------------------------------------------


def prompt_text(content):
    if isinstance(content, list):
        content = "\n".join(
            block.get("text", "") for block in content if isinstance(block, dict) and block.get("type") == "text"
        )
    return content.strip() if isinstance(content, str) else ""


def history_text(entry):
    text = entry.get("display") or ""
    for pasted in (entry.get("pastedContents") or {}).values():
        if pasted.get("type") == "text" and isinstance(pasted.get("content"), str):
            number = pasted.get("id")
            text = re.sub(rf"\[Pasted text #{number}(?: [^\]]*)?\]", lambda _: pasted["content"], text)
    return IMAGE_REF.sub("", text).strip()


def paste_template(entry):
    """Recognize a send even when history retains only hashes of its pastes."""
    pasted = {str(item.get("id")): item for item in (entry.get("pastedContents") or {}).values()}
    display = IMAGE_REF.sub("", entry.get("display") or "").strip()
    pieces, hashes = [], []
    end = 0
    for match in PASTE_REF.finditer(display):
        item = pasted.get(match[1], {})
        digest = item.get("contentHash")
        content = item.get("content")
        if not digest and not isinstance(content, str):
            return None
        pieces.append(re.escape(display[end:match.start()]))
        if digest:
            hashes.append(digest)
            pieces.append("(.*?)")
        else:
            pieces.append(re.escape(content))
        end = match.end()
    if not hashes:
        return None
    pieces.append(re.escape(display[end:]))
    return re.compile("".join(pieces), re.DOTALL), hashes


def claude_history(config, previous):
    human = {key: value for key, value in previous.items() if not re.fullmatch(r"x\d+", key)}
    candidates = defaultdict(list)
    paste_candidates = defaultdict(list)
    collisions = defaultdict(set)
    for entry in records(HOME / ".claude" / "history.jsonl"):
        stamp = entry.get("timestamp")
        if not isinstance(stamp, (int, float)) or not valid_epoch(stamp / 1000):
            continue
        session = entry.get("sessionId")
        identity = stamp, session, fingerprint(history_text(entry))
        if identity[1:] in collisions[stamp]:
            continue
        suffix = f":{len(collisions[stamp])}" if collisions[stamp] else ""
        collisions[stamp].add(identity[1:])
        key = f"c{int(stamp)}{suffix}"
        human[key] = [stamp / 1000, bucket_index(entry.get("project"), config)]
        if session:
            for signature in {identity[2], fingerprint(IMAGE_REF.sub("", (entry.get("display") or "")).strip())}:
                candidates[session, signature].append((stamp / 1000, key))
            template = paste_template(entry)
            if template:
                paste_candidates[session].append((stamp / 1000, key, *template))
    return human, candidates, paste_candidates


def session_runs(stamps):
    """Merge activity separated by at most five minutes."""
    runs = []
    for epoch in sorted(stamps):
        if runs and epoch - runs[-1][1] <= AGENT_GAP_SECONDS:
            runs[-1][1] = epoch
        else:
            runs.append([epoch, epoch])
    return [run for run in runs if run[1] > run[0]]


def count_by_day(stamps):
    per_day = {}
    for epoch in stamps:
        day = day_of(epoch)
        per_day[day] = per_day.get(day, 0) + 1
    return per_day


def is_human_claude(entry):
    source = entry.get("promptSource")
    from_desktop = (
        source == "sdk" and entry.get("entrypoint") == "claude-desktop" and entry.get("turnOrigin") == "human"
    )
    return (
        entry.get("type") == "user"
        and (entry.get("origin") or {}).get("kind") == "human"
        and (source in (None, "typed", "queued") or from_desktop)
        and entry.get("turnOrigin") in (None, "human")
        and not (entry.get("isMeta") or entry.get("isSidechain") or entry.get("toolUseResult"))
    )


def claude_session(path, config, human, candidates, paste_candidates, matched):
    stamps, tools = [], []
    queued = defaultdict(deque)
    main = "subagents" not in path.parts
    for entry in records(path):
        epoch = parse_iso_utc(entry.get("timestamp"))
        if not valid_epoch(epoch):
            continue
        kind = entry.get("type")
        if kind == "queue-operation" and entry.get("operation") == "enqueue":
            queued[prompt_text(entry.get("content"))].append(epoch)
        if kind not in ("assistant", "user"):
            continue
        stamps.append(epoch)
        content = (entry.get("message") or {}).get("content")
        if kind == "assistant" and isinstance(content, list):
            tools.extend(epoch for block in content if block.get("type") == "tool_use")
        if not main or not is_human_claude(entry):
            continue
        prompt_id = entry.get("promptId") or entry.get("uuid")
        if not prompt_id:
            continue
        key = f"q{prompt_id}"
        if key in matched:
            continue
        text = prompt_text(content)
        is_queued = entry.get("promptSource") == "queued"
        if is_queued and text and queued[text]:
            # Enqueue is when the human sent it; the user line is delivery to the model.
            epoch = queued[text].popleft()
        text = IMAGE_REF.sub("", text).strip()
        session = entry.get("sessionId")
        possible = candidates[session, fingerprint(text)]
        # Claude writes history before the session message. A queued delivery
        # only matches history when the two send timestamps closely agree.
        tolerance = 2 if is_queued else SAME_PROMPT_SECONDS
        matches = [
            (abs(stamp - epoch), history_key) for stamp, history_key in possible
            if history_key not in matched and -2 <= epoch - stamp <= tolerance
        ]
        if not matches:
            for stamp, history_key, pattern, hashes in paste_candidates[session]:
                if history_key in matched or not -2 <= epoch - stamp <= min(tolerance, 10):
                    continue
                match = pattern.fullmatch(text)
                if match and all(
                    hashlib.sha256(chunk.encode("utf-8")).hexdigest().startswith(digest)
                    for chunk, digest in zip(match.groups(), hashes)
                ):
                    matches.append((abs(stamp - epoch), history_key))
        if matches:
            matched.update((key, min(matches)[1]))
            human.pop(key, None)
        else:
            human[key] = [epoch, bucket_index(entry.get("cwd"), config)]
    return {"source": "claude", "main": main, "runs": session_runs(stamps), "tools": count_by_day(tools)}


def collect_claude(config, previous_agent, previous_human):
    human, candidates, paste_candidates = claude_history(config, previous_human)
    matched = set()
    claude_root = HOME / ".claude" / "projects"
    agent = dict(previous_agent)
    for path in sorted(claude_root.rglob("*.jsonl")):
        # Do not replace a cached session if its log is removed mid-scan.
        if path.exists():
            key = file_id(path)
            session = claude_session(path, config, human, candidates, paste_candidates, matched)
            if session["runs"] or session["tools"] or key not in agent:
                agent[key] = session

    # Preserve previously recovered prompts whose Claude transcripts were pruned.
    # Their old format has no session/prompt identity beyond the enclosing file.
    history = sorted(value[0] for key, value in human.items() if key.startswith("c"))
    for key, session in agent.items():
        for epoch, bucket in session.get("prompts", []):
            position = bisect_left(history, epoch - SAME_PROMPT_SECONDS)
            if position == len(history) or history[position] > epoch + SAME_PROMPT_SECONDS:
                human.setdefault(f"qlegacy:{key}:{epoch}", [epoch, bucket])
    return human, agent


def newest(pattern):
    """The highest numeric schema version, independent of filename sort order."""
    matches = (HOME / ".codex").glob(pattern)
    return max(matches, key=lambda path: int(path.stem.rsplit("_", 1)[-1]), default=None)


def rollout_file_ids(rollout_path):
    """Store keys the old rollout-file reader could have used for a Codex thread."""
    name = re.split(r"[\\/]", rollout_path or "")[-1].removesuffix(".zst")
    match = re.match(r"rollout-(\d{4})-(\d\d)-(\d\d)T", name)
    if not match:
        return []
    return [file_id(HOME / ".codex" / "sessions" / Path(*match.groups()) / name)]


def codex_turn_interval(start, end, duration_ms, status):
    if status not in ("completed", "interrupted", "failed"):
        return None
    if not valid_epoch(start) or not valid_epoch(end) or end <= start:
        return None
    if not isinstance(duration_ms, (int, float)) or duration_ms <= 0:
        return None
    # The completion time anchors the interval when the wall clock and the
    # recorded elapsed runtime disagree (for example after sleep or resume).
    return [max(start, end - duration_ms / 1000), end]


def read_codex_db(config, agent, human):
    history, state = newest("thread_history_*.sqlite"), newest("state_*.sqlite")
    known_threads = {}
    db_prompts = defaultdict(list)
    if history is None or state is None:
        if history or state or any(key.startswith("cx") for key in agent):
            raise ValueError("Codex database missing")
    else:
        with closing(sqlite3.connect(history.as_uri() + "?mode=ro", uri=True, timeout=20)) as con:
            con.execute("attach database ? as st", (state.as_uri() + "?mode=ro",))
            con.execute("begin")
            # Establish the read snapshot for both attached databases
            # before iterating the threads while Codex continues to write.
            con.execute(
                "select (select id from st.threads limit 1), "
                "(select thread_id from thread_turns limit 1)"
            ).fetchone()
            threads = con.execute(
                "select id, source, cwd, rollout_path, thread_source, attached_thread_parent_id from st.threads"
            ).fetchall()
            for thread, source, cwd, rollout_path, thread_source, parent in threads:
                key = f"cx{thread}"
                main = source in ("vscode", "cli") and thread_source in (None, "user") and not parent
                subagent = json.loads(source).get("subagent") if (source or "").startswith("{") else None
                child = isinstance(subagent, dict) and "thread_spawn" in subagent
                known_threads[thread] = main
                for old_key in rollout_file_ids(rollout_path):
                    agent.pop(old_key, None)
                if not (main or child):
                    agent.pop(key, None)
                    continue
                if main:
                    bucket = bucket_index(cwd, config)
                    for turn, item, stamp, payload in con.execute(
                        "select turn_id, item_id, created_at_ms, item_json from thread_items "
                        "where thread_id = ? and item_type = 'userMessage' order by created_at_ms, rollout_ordinal",
                        (thread,),
                    ):
                        if stamp is None or not valid_epoch(stamp / 1000):
                            continue
                        item_data = json.loads(payload) if payload else {}
                        client = item_data.get("clientId")
                        identity = f"client:{client}" if client else f"turn:{turn or thread}:{item}"
                        human.pop(f"xid:{thread}:{item}", None)
                        prompt_key = f"xid:{identity}"
                        known_prompt = human.get(prompt_key)
                        if known_prompt is None or stamp / 1000 < known_prompt[0]:
                            human[prompt_key] = [stamp / 1000, bucket]
                        signature = fingerprint(prompt_text(item_data.get("content")))
                        db_prompts[thread, signature].append((stamp / 1000, identity))

                intervals = [
                    interval for row in con.execute(
                        "select started_at, completed_at, duration_ms, status from thread_turns "
                        "where thread_id = ? order by started_at", (thread,),
                    )
                    if (interval := codex_turn_interval(*row)) is not None
                ]
                tools = [
                    stamp / 1000 for (stamp,) in con.execute(
                        f"select created_at_ms from thread_items where thread_id = ? and item_type in "
                        f"({','.join('?' * len(CODEX_TOOL_ITEMS))})", (thread, *CODEX_TOOL_ITEMS),
                    )
                    if stamp is not None and valid_epoch(stamp / 1000)
                ]
                # A newly indexed thread may be absent from history while the
                # writer catches up. Preserve its last usable completed data.
                known = agent.get(key, {})
                if known.get("source") == "codex" and (
                    len(intervals) < known.get("turns", 0) or len(tools) < sum(known.get("tools", {}).values())
                ):
                    continue
                agent[key] = {
                    "source": "codex", "main": main, "runs": merge_intervals(intervals),
                    "tools": count_by_day(tools), "turns": len(intervals),
                }

    # CLI history can contain a prompt the database never indexed, even
    # within an indexed thread. Consume duplicates one to one.
    live_cli = set()
    matched = set()
    for entry in records(HOME / ".codex" / "history.jsonl"):
        epoch, thread = entry.get("ts"), entry.get("session_id")
        if not valid_epoch(epoch) or not thread:
            continue
        identity = f"xcli:{thread}:{epoch}"
        ordinal = 0
        while (key := f"{identity}:{ordinal}") in live_cli:
            ordinal += 1
        live_cli.add(key)
        signature = fingerprint(prompt_text(entry.get("text")))
        matches = [
            (abs(epoch - stamp), item) for stamp, item in db_prompts[thread, signature]
            if item not in matched and abs(epoch - stamp) <= SAME_PROMPT_SECONDS
        ]
        if matches or known_threads.get(thread) is False:
            if matches:
                matched.add(min(matches)[1])
            human.pop(key, None)
        else:
            human[key] = [epoch, bucket_index("", config)]
    return human, agent


def merge_intervals(intervals):
    runs = []
    for start, end in sorted(intervals):
        if runs and start <= runs[-1][1]:
            runs[-1][1] = max(runs[-1][1], end)
        else:
            runs.append([start, end])
    return runs


def read_store(path, machine):
    return validate_store(read_json(path, None), machine)


def validate_store(store, machine):
    if not isinstance(store, dict) or store.get("machine") != machine:
        raise ValueError("missing or invalid event store")
    if not isinstance(store.get("updatedAt"), int):
        raise ValueError("invalid store timestamp")
    if not isinstance(store.get("human"), dict) or not isinstance(store.get("agent"), dict):
        raise ValueError("invalid event store")
    if not store["human"] or not store["agent"]:
        raise ValueError("empty event store")
    if store.get("version") is not None and (
        store.get("version") != 2 or store.get("checksum") != store_checksum(store)
    ):
        raise ValueError("event store checksum mismatch")
    for row in store["human"].values():
        if (
            not isinstance(row, list) or len(row) != 2 or not valid_epoch(row[0])
            or type(row[1]) is not int or not 0 <= row[1] < len(PUBLIC_BUCKETS)
        ):
            raise ValueError("invalid prompt in event store")
    for session in store["agent"].values():
        if not isinstance(session, dict) or not isinstance(session.get("main"), bool):
            raise ValueError("invalid session in event store")
        for start, end in session.get("runs", []):
            if not valid_epoch(start) or not valid_epoch(end) or end <= start:
                raise ValueError("invalid session interval")
        for field in ("days", "tools"):
            for day, value in session.get(field, {}).items():
                datetime.strptime(day, "%Y-%m-%d")
                if not isinstance(value, (int, float)) or not 0 <= value < float("inf"):
                    raise ValueError("invalid session total")
        for epoch, bucket in session.get("prompts", []):
            if not valid_epoch(epoch) or type(bucket) is not int or not 0 <= bucket < len(PUBLIC_BUCKETS):
                raise ValueError("invalid cached prompt")
    return store


def store_checksum(store):
    payload = {key: value for key, value in store.items() if key != "checksum"}
    return fingerprint(json.dumps(payload, sort_keys=True, separators=(",", ":")))


def cmd_collect(args):
    with ledger_lock("collect.lock"):
        config = load_config()
        store_path = LEDGER_DIR / f"events-{args.machine}.json"
        marker = store_path.with_suffix(".initialized")
        if not store_path.exists() and (marker.exists() or LEDGER_PATH.exists()):
            raise ValueError("previous event store missing")
        store = read_store(store_path, args.machine) if store_path.exists() else {"human": {}, "agent": {}}
        human, agent = collect_claude(config, store["agent"], store["human"])
        human, agent = read_codex_db(config, agent, human)
        store = {"version": 2, "machine": args.machine, "updatedAt": int(time.time()), "human": human, "agent": agent}
        store["checksum"] = store_checksum(store)
        validate_store(store, args.machine)
        write_json(store_path, store)
        if not marker.exists():
            marker.touch()
        print(f"{args.machine}: {len(human)} prompts, {len(agent)} sessions")


# --- presence: was anyone at the keyboard ----------------------------------------


def idle_seconds():
    """Seconds since the last keyboard or mouse input, or None when it cannot be read."""
    if os.name == "nt":
        import ctypes

        class LastInputInfo(ctypes.Structure):
            _fields_ = [("cbSize", ctypes.c_uint), ("dwTime", ctypes.c_uint)]

        info = LastInputInfo()
        info.cbSize = ctypes.sizeof(info)
        if not ctypes.windll.user32.GetLastInputInfo(ctypes.byref(info)):
            return None
        return ((ctypes.windll.kernel32.GetTickCount() - info.dwTime) & 0xFFFFFFFF) / 1000
    if sys.platform == "darwin":
        try:
            output = subprocess.run(
                ["ioreg", "-c", "IOHIDSystem"], capture_output=True, text=True, timeout=10,
            ).stdout
        except (OSError, subprocess.SubprocessError):
            return None
        match = re.search(r'"HIDIdleTime" = (\d+)', output)
        return int(match.group(1)) / 1e9 if match else None
    return None


def foreground_app():
    """Lowercase path (Windows) or name (macOS) of the app in front, or "" when unknown."""
    if os.name == "nt":
        import ctypes
        from ctypes import wintypes

        user32, kernel32 = ctypes.windll.user32, ctypes.windll.kernel32
        user32.GetForegroundWindow.restype = wintypes.HWND
        kernel32.OpenProcess.restype = wintypes.HANDLE
        pid = wintypes.DWORD()
        user32.GetWindowThreadProcessId(user32.GetForegroundWindow(), ctypes.byref(pid))
        handle = kernel32.OpenProcess(0x1000, False, pid.value)
        if not handle:
            return ""
        try:
            buffer = ctypes.create_unicode_buffer(1024)
            size = wintypes.DWORD(len(buffer))
            ok = kernel32.QueryFullProcessImageNameW(wintypes.HANDLE(handle), 0, buffer, ctypes.byref(size))
            return buffer.value.lower() if ok else ""
        finally:
            kernel32.CloseHandle(wintypes.HANDLE(handle))
    if sys.platform == "darwin":
        try:
            front = subprocess.run(["lsappinfo", "front"], capture_output=True, text=True, timeout=10)
            info = subprocess.run(
                ["lsappinfo", "info", "-only", "bundlepath", "-only", "name", front.stdout.strip()],
                capture_output=True, text=True, timeout=10,
            ).stdout
        except (OSError, subprocess.SubprocessError):
            return ""
        attributes = dict(re.findall(r'"?(bundle path|bundlepath|executable path|name)"?\s*=\s*"([^"]+)"', info.lower()))
        return attributes.get("bundle path") or attributes.get("bundlepath") or attributes.get("executable path") or attributes.get("name", "")
    return ""


def app_is_excluded(app, config):
    """True when the app in front is one the private config says is not work (games)."""
    presence = config.get("presence") or {}
    app = app.lower().replace("\\", "/")
    if any(pattern.lower().replace("\\", "/") in app for pattern in presence.get("include", [])):
        return False
    return any(pattern.lower().replace("\\", "/") in app for pattern in presence.get("exclude", []))


def cmd_sample(args):
    """Append this minute to the presence log when there was recent input.

    Only the minute and exclusion flag are kept. Start a new file each month.
    """
    config = load_config()
    idle = idle_seconds()
    if idle is None or idle > PRESENCE_IDLE_SECONDS:
        return
    app = foreground_app()
    if not app:
        return
    flag = "x" if app_is_excluded(app, config) else ""
    machine = args.machine or config.get("machine", "pc")
    minute = int(time.time()) // 60
    with ledger_lock("presence.lock"):
        path = presence_path(machine, minute)
        with path.open("a+b") as handle:
            size = handle.tell()
            handle.seek(max(0, size - 64))
            tail = handle.read().splitlines()
            if not tail or tail[-1].split(b"\t")[0] != str(minute).encode("ascii"):
                handle.write(f"{minute}\t\t{flag}\n".encode("ascii"))


def presence_path(machine, minute):
    return LEDGER_DIR / f"presence-{machine}-{day_of(minute * 60)[:7]}.log"


def presence_minutes(config, machine=None):
    """Minutes with someone at a keyboard, across every machine, games left out."""
    minutes = set()
    for path in LEDGER_DIR.glob(f"presence-{machine or '*'}*.log"):
        for line in iter_lines(path):
            parts = line.rstrip("\n").split("\t")
            if len(parts) != 3 or not parts[0].isdigit():
                continue
            minute = int(parts[0])
            if valid_epoch(minute * 60) and parts[2] == "" and not app_is_excluded(parts[1], config):
                minutes.add(minute)
    return minutes


def cmd_presence_export(args):
    print(json.dumps(sorted(presence_minutes(load_config(), args.machine))))


# --- publish ------------------------------------------------------------------


def github_contributions():
    """Per-day contribution counts for the past year (public and private), or None."""
    gh = shutil.which("gh")
    if not gh:
        return None
    query = (
        "query{viewer{contributionsCollection{contributionCalendar{weeks{"
        "contributionDays{date contributionCount}}}}}}"
    )
    try:
        result = subprocess.run(
            [gh, "api", "graphql", "-f", f"query={query}"],
            capture_output=True, text=True, timeout=60, creationflags=NO_WINDOW,
        )
        result.check_returncode()
        response = json.loads(result.stdout)
        if response.get("errors"):
            return None
        weeks = response["data"]["viewer"]["contributionsCollection"][
            "contributionCalendar"]["weeks"]
    except (OSError, ValueError, KeyError, TypeError, subprocess.SubprocessError):
        return None
    return {
        day["date"]: day["contributionCount"]
        for week in weeks for day in week["contributionDays"]
    }


def last_publication():
    if not LEDGER_PATH.exists() and not (LEDGER_DIR / "upload.json").exists():
        return {"days": []}
    ledger = read_json(LEDGER_PATH, None)
    if not isinstance(ledger, dict) or not isinstance(ledger.get("days"), list) or not ledger["days"]:
        raise ValueError("missing or invalid publication checkpoint")
    return ledger


def build_ledger(config):
    bucket_names = [bucket["name"] for bucket in config["buckets"]]
    human = {}
    agent_minutes = {}
    sessions = {}
    tool_calls = {}
    runs_by_day = defaultdict(list)
    machines = [config.get("machine", "pc"), *(remote["machine"] for remote in config.get("remotes", []))]
    merged_sessions = {}
    for machine in machines:
        store = read_store(LEDGER_DIR / f"events-{machine}.json", machine)
        for key, value in store["human"].items():
            # Native IDs deduplicate copies of the same prompt. Legacy history
            # timestamps have no global identity and are scoped to the machine.
            identity = key if key.startswith(("x", "q")) and not key.startswith("qlegacy:") else f"{machine}:{key}"
            human.setdefault(identity, value)
        for key, session in store["agent"].items():
            identity = key if key.startswith("cx") else f"{machine}:{key}"
            # A recently copied store can contain an older copy of a thread.
            known = merged_sessions.get(identity)
            completeness = (session.get("turns", 0), sum(session.get("tools", {}).values()), store["updatedAt"])
            if known is None or completeness > known[0]:
                merged_sessions[identity] = (completeness, session)

    for _, session in merged_sessions.values():
        for day, count in session.get("tools", {}).items():
            tool_calls[day] = tool_calls.get(day, 0) + count
        days_with_runs = set()
        for start, end in session.get("runs", []):
            for day, first, last in split_run(start, end):
                days_with_runs.add(day)
                runs_by_day[day].append((first, last))
                agent_minutes[day] = agent_minutes.get(day, 0) + (last - first) / 60
        if "runs" not in session:
            for day, minutes in session.get("days", {}).items():
                days_with_runs.add(day)
                agent_minutes[day] = agent_minutes.get(day, 0) + minutes
        if session["main"]:
            for day in days_with_runs:
                sessions[day] = sessions.get(day, 0) + 1

    days = {}

    def day_entry(day):
        return days.setdefault(day, {
            "seconds": [0] * len(bucket_names), "prompts": 0, "first": None, "last": None,
        })

    # Machines are merged before measuring gaps so time on two machines at once counts once.
    ordered = sorted(human.values())
    for index, (epoch, bucket) in enumerate(ordered):
        entry = day_entry(day_of(epoch))
        entry["prompts"] += 1
        if entry["first"] is None:
            entry["first"] = epoch
        entry["last"] = epoch
        if index:
            previous_epoch = ordered[index - 1][0]
            gap = epoch - previous_epoch
            if 0 < gap <= IDLE_GAP_SECONDS and day_of(previous_epoch) == day_of(epoch):
                entry["seconds"][bucket] += gap

    previous = last_publication()
    contributions = {
        day["date"]: day.get("contributions", 0)
        for day in previous.get("days", []) if day.get("contributions")
    }
    fresh = github_contributions()
    if fresh is None:
        log("contributions: gh query failed, kept previous counts")
    else:
        contributions.update(fresh)

    present = {}
    for minute in presence_minutes(config):
        day = day_of(minute * 60)
        present[day] = present.get(day, 0) + 1

    peaks = {}
    for day, runs in runs_by_day.items():
        edges = sorted((epoch, change) for start, end in runs for epoch, change in ((start, 1), (end, -1)))
        running = 0
        for _, change in edges:
            running += change
            peaks[day] = max(peaks.get(day, 0), running)
    all_days = set(days) | set(agent_minutes) | set(present) | {d for d, n in contributions.items() if n}
    cutoff = (datetime.fromisoformat(day_of(time.time())) - timedelta(days=PUBLISH_DAYS)).date().isoformat()
    rows = []
    for day in sorted(d for d in all_days if d >= cutoff):
        entry = days.get(day) or {
            "seconds": [0] * len(bucket_names), "prompts": 0, "first": 0, "last": 0,
        }
        by_bucket = [round(seconds / 3600, 2) for seconds in entry["seconds"]]
        row = {
            "date": day,
            "hours": round(sum(entry["seconds"]) / 3600, 2),
            # First prompt to last prompt of the day, breaks included.
            "span": (entry["last"] - entry["first"]) / 3600,
            # Minutes with keyboard or mouse input on any machine, games left out.
            "active": round(present.get(day, 0) / 60, 2),
            "byBucket": by_bucket,
            "prompts": entry["prompts"],
            "agentHours": round(agent_minutes.get(day, 0) / 60, 1),
            "sessions": sessions.get(day, 0),
            "peakAgents": peaks.get(day, 0),
            "toolCalls": tool_calls.get(day, 0),
            "contributions": contributions.get(day, 0),
        }
        if entry["prompts"]:
            # Pacific wall-clock times of the first and last prompt, so the site can show
            # the span as a time range instead of a bar that reads like hours worked.
            row["start"], row["end"] = (
                datetime.fromtimestamp(epoch, PACIFIC).strftime("%H:%M")
                for epoch in (entry["first"], entry["last"])
            )
        rows.append(row)

    tracked = sorted(day for day, minutes in agent_minutes.items() if minutes > 0)
    return {
        "version": 1,
        "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "timezone": PACIFIC.key,
        "dayStartHour": DAY_START_HOUR,
        "idleGapMinutes": IDLE_GAP_SECONDS // 60,
        "agentTrackingSince": tracked[0] if tracked else None,
        "claudeAgentTrackingSince": CLAUDE_AGENT_TRACKING_SINCE,
        # The first day is partial, so the site starts using presence the day after.
        "presenceSince": min(present) if present else None,
        "machines": len(machines),
        "buckets": bucket_names,
        "days": rows,
    }


def cmd_publish(args):
    with ledger_lock("run.lock"):
        if load_config().get("gistId"):
            # Export the acknowledged upload so the fallback and gist agree.
            ledger = last_publication()
            if not ledger["days"]:
                raise ValueError("no prior upload")
        else:
            ledger = build_ledger(load_config())
            write_json(LEDGER_PATH, ledger)
        if args.out:
            write_atomic(args.out, (json.dumps(ledger, separators=(",", ":")) + "\n").encode("utf-8"))
        print(f"published {len(ledger['days'])} days")


# --- run: collect everywhere, publish, upload --------------------------------


def run_quiet(command, stdin_bytes=None, timeout=120):
    return subprocess.run(
        command, input=stdin_bytes, capture_output=True, timeout=timeout,
        creationflags=NO_WINDOW,
    )


def pull_remote(host, machine):
    """Run the collector on another machine over SSH and fetch its event store."""
    ssh = shutil.which("ssh")
    if not ssh:
        log(f"{machine}: ssh not found, skipped")
        return
    base = [ssh, "-o", "BatchMode=yes", "-o", "ConnectTimeout=8", host]
    try:
        run_quiet(base + ["mkdir -p ~/.work-ledger"], timeout=20).check_returncode()
        for name in ("collect.py", "config.json"):
            source = (Path(__file__).resolve() if name == "collect.py" else CONFIG_PATH).read_bytes()
            command = (
                f'umask 077; target=~/.work-ledger/{name}; tmp=$(mktemp "$target.XXXXXX") && '
                'cat > "$tmp" && mv -f "$tmp" "$target"'
            )
            run_quiet(base + [command], source, 30).check_returncode()
        run_quiet(
            base + [f"python3 ~/.work-ledger/collect.py collect --machine {machine}"], timeout=900,
        ).check_returncode()
        fetched = run_quiet(base + [f"cat ~/.work-ledger/events-{machine}.json"], timeout=60)
        fetched.check_returncode()
        store = validate_store(json.loads(fetched.stdout), machine)
        write_json(LEDGER_DIR / f"events-{machine}.json", store)
        log(f"{machine}: pulled {len(store.get('human', {}))} prompts")
        fetched = run_quiet(
            base + [f"python3 ~/.work-ledger/collect.py presence-export --machine {machine}"], timeout=60,
        )
        fetched.check_returncode()
        minutes = json.loads(fetched.stdout)
        if not isinstance(minutes, list) or not all(type(m) is int and valid_epoch(m * 60) for m in minutes):
            raise ValueError("invalid remote presence")
        grouped = defaultdict(list)
        for minute in sorted(set(minutes) | presence_minutes(load_config(), machine)):
            grouped[presence_path(machine, minute)].append(minute)
        for path, values in grouped.items():
            data = "".join(f"{minute}\t\t\n" for minute in values).encode("ascii")
            if not path.exists() or path.read_bytes() != data:
                write_atomic(path, data)
        log(f"{machine}: pulled {len(minutes)} presence minutes")
    except (OSError, ValueError, subprocess.SubprocessError) as error:
        # An asleep or off-network laptop is normal; its last pulled store is still used.
        log(f"{machine}: not pulled ({type(error).__name__})")


def upload_gist(gist_id, ledger):
    gh = shutil.which("gh")
    if not gh:
        log("upload: gh not found")
        return False
    body = json.dumps({"files": {"work-ledger.json": {"content": json.dumps(ledger, separators=(",", ":"))}}})
    try:
        result = run_quiet(
            [gh, "api", "-X", "PATCH", f"gists/{gist_id}", "--input", "-"], body.encode("utf-8"), 60,
        )
    except (OSError, subprocess.SubprocessError) as error:
        log(f"upload: failed ({type(error).__name__})")
        return False
    if result.returncode != 0:
        log(f"upload: gh exited {result.returncode}")
        return False
    return True


def cmd_run(args):
    with ledger_lock("run.lock"):
        config = load_config()
        before = last_publication()["days"]
        cmd_collect(argparse.Namespace(machine=config.get("machine", "pc")))
        for remote in config.get("remotes", []):
            pull_remote(remote["host"], remote["machine"])
        ledger = build_ledger(config)
        if not ledger["days"]:
            raise ValueError("empty ledger")
        if not config.get("gistId"):
            write_json(LEDGER_PATH, ledger)
            log("run: no gistId in config, not uploaded")
        elif not args.force and ledger["days"] == before and read_json(LEDGER_DIR / "upload.json", None) == ledger_hash(ledger):
            log("run: no change")
        elif upload_gist(config["gistId"], ledger):
            write_json(LEDGER_PATH, ledger)
            write_json(LEDGER_DIR / "upload.json", ledger_hash(ledger))
            log(f"run: uploaded {len(ledger['days'])} days")
        else:
            raise RuntimeError("gist upload failed")


def ledger_hash(ledger):
    return fingerprint(json.dumps({key: value for key, value in ledger.items() if key != "generatedAt"}))


def install_mac_presence(target, machine):
    """Register a per-user launchd job that samples presence every minute."""
    plist = HOME / "Library" / "LaunchAgents" / f"{MAC_AGENT_LABEL}.plist"
    # The unversioned python3 on PATH survives a Homebrew upgrade; sys.executable does not.
    python = shutil.which("python3") or sys.executable
    arguments = [python, str(target), "sample", "--machine", machine]
    plist.parent.mkdir(parents=True, exist_ok=True)
    plist.write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" '
        '"http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n'
        '<plist version="1.0"><dict>\n'
        f"<key>Label</key><string>{MAC_AGENT_LABEL}</string>\n"
        "<key>ProgramArguments</key><array>"
        + "".join(f"<string>{argument}</string>" for argument in arguments)
        + "</array>\n"
        "<key>StartInterval</key><integer>60</integer>\n"
        "<key>RunAtLoad</key><true/>\n"
        "</dict></plist>\n",
        encoding="utf-8",
    )
    domain = f"gui/{os.getuid()}"
    subprocess.run(["launchctl", "bootout", f"{domain}/{MAC_AGENT_LABEL}"], capture_output=True)
    result = subprocess.run(["launchctl", "bootstrap", domain, str(plist)], capture_output=True, text=True)
    print(f"presence job: {'registered' if result.returncode == 0 else result.stderr.strip()}")


def cmd_install(args):
    config = load_config()
    target = LEDGER_DIR / "collect.py"
    source = Path(__file__).resolve()
    if source != target:
        write_atomic(target, source.read_bytes())
        print(f"copied collector to {target}")
    if sys.platform == "darwin":
        # The hourly collect is run from the PC over SSH; only presence runs here.
        install_mac_presence(target, args.machine or config.get("machine", "mac"))
        return
    if os.name != "nt":
        print("no scheduled jobs registered on this platform")
        return
    # pythonw has no console, so neither job ever flashes a window.
    pythonw = Path(sys.executable).with_name("pythonw.exe")
    jobs = (
        (TASK_NAME, ["/SC", "HOURLY"], "run"),
        (PRESENCE_TASK_NAME, ["/SC", "MINUTE", "/MO", "1"], "sample"),
    )
    for name, schedule, command in jobs:
        result = subprocess.run(
            ["schtasks", "/Create", "/F", "/TN", name, *schedule, "/TR", f'"{pythonw}" "{target}" {command}'],
            capture_output=True, text=True,
        )
        result.check_returncode()
        print((result.stdout or result.stderr).strip())


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    commands = parser.add_subparsers(dest="command", required=True)
    collect = commands.add_parser("collect")
    collect.add_argument("--machine", required=True)
    collect.set_defaults(handler=cmd_collect)
    publish = commands.add_parser("publish")
    publish.add_argument("--out", help="also write the ledger to this path (the repo snapshot)")
    publish.set_defaults(handler=cmd_publish)
    run = commands.add_parser("run")
    run.add_argument("--force", action="store_true", help="upload even if nothing changed")
    run.set_defaults(handler=cmd_run)
    for name, handler in (("sample", cmd_sample), ("install", cmd_install), ("presence-export", cmd_presence_export)):
        command = commands.add_parser(name)
        command.add_argument("--machine", help="machine name, when it differs from the config")
        command.set_defaults(handler=handler)
    args = parser.parse_args()
    try:
        args.handler(args)
    except (OSError, ValueError, TypeError, KeyError, AttributeError, sqlite3.Error, RuntimeError) as error:
        log(f"{args.command}: stopped ({type(error).__name__})")
        print(f"{args.command}: stopped ({type(error).__name__}); see run.log", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
