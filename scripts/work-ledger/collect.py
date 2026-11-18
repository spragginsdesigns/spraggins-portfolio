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
import calendar
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import time
from pathlib import Path

HOME = Path.home()
LEDGER_DIR = HOME / ".work-ledger"
CONFIG_PATH = LEDGER_DIR / "config.json"
LEDGER_PATH = LEDGER_DIR / "work-ledger.json"
LOG_PATH = LEDGER_DIR / "run.log"

# A day runs 4 AM to 4 AM local time so a late night counts for the day it started.
DAY_START_HOUR = 4
# Hands-on time: gaps between prompts longer than this are treated as away time.
IDLE_GAP_SECONDS = 30 * 60
# Agent time: a session is considered running while its log lines are this close together.
AGENT_GAP_SECONDS = 5 * 60
# At the computer: a sampled minute counts when there was input this recently.
PRESENCE_IDLE_SECONDS = 3 * 60
# A prompt found in a session log is the same prompt as a history entry this close to it.
SAME_PROMPT_SECONDS = 90
PUBLISH_DAYS = 400
MIN_EPOCH = calendar.timegm((2024, 1, 1, 0, 0, 0))
TASK_NAME = "WorkLedgerCollector"
PRESENCE_TASK_NAME = "WorkLedgerPresence"
MAC_AGENT_LABEL = "xyz.spragginsdesigns.work-ledger-presence"

ISO_RE = re.compile(r"(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)")
# Unescaped key only, so timestamps quoted inside tool output are not matched.
TS_KEY_RE = re.compile(r'"timestamp":"(\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d)')
NO_WINDOW = getattr(subprocess, "CREATE_NO_WINDOW", 0)


def log(message):
    LEDGER_DIR.mkdir(exist_ok=True)
    stamp = time.strftime("%Y-%m-%d %H:%M:%S")
    lines = []
    if LOG_PATH.exists():
        lines = LOG_PATH.read_text(encoding="utf-8", errors="replace").splitlines()[-300:]
    lines.append(f"{stamp} {message}")
    LOG_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


def parse_iso_utc(text):
    match = ISO_RE.match(text)
    if not match:
        return None
    return calendar.timegm(tuple(int(part) for part in match.groups()))


def valid_epoch(epoch):
    return epoch is not None and MIN_EPOCH <= epoch <= time.time() + 86400


def day_of(epoch):
    shifted = time.localtime(epoch - DAY_START_HOUR * 3600)
    return f"{shifted.tm_year:04d}-{shifted.tm_mon:02d}-{shifted.tm_mday:02d}"


def read_json(path, default):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return default


def write_json(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(value, separators=(",", ":")), encoding="utf-8")
    os.replace(tmp, path)


def load_config():
    config = read_json(CONFIG_PATH, None)
    if not isinstance(config, dict) or not config.get("buckets"):
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
    return hashlib.sha1(str(path).encode("utf-8", "replace")).hexdigest()[:16]


def iter_lines(path):
    try:
        with open(path, encoding="utf-8", errors="replace") as handle:
            for line in handle:
                yield line
    except OSError:
        return


# --- hands-on events (prompts the human sent) ------------------------------


def codex_rollouts():
    root = HOME / ".codex" / "sessions"
    return sorted(root.rglob("*.jsonl")) if root.exists() else []


def codex_session_meta(path):
    """Return (session ids, cwd, is_subagent) from a rollout's session_meta line."""
    for line in iter_lines(path):
        if '"type":"session_meta"' not in line:
            continue
        try:
            payload = json.loads(line).get("payload") or {}
        except ValueError:
            break
        ids = {str(payload[key]) for key in ("id", "session_id") if payload.get(key)}
        source = payload.get("source")
        is_subagent = isinstance(source, dict) and "subagent" in source
        return ids, payload.get("cwd") or "", is_subagent
    return set(), "", False


def collect_human(config, previous):
    """Return {event key: [epoch seconds, bucket index]} merged with the previous store."""
    events = dict(previous)

    for line in iter_lines(HOME / ".claude" / "history.jsonl"):
        try:
            entry = json.loads(line)
        except ValueError:
            continue
        stamp = entry.get("timestamp")
        if not isinstance(stamp, (int, float)):
            continue
        epoch = int(stamp / 1000)
        if valid_epoch(epoch):
            events[f"c{int(stamp)}"] = [epoch, bucket_index(entry.get("project"), config)]

    session_cwd = {}
    for rollout in codex_rollouts():
        ids, cwd, is_subagent = codex_session_meta(rollout)
        for session in ids:
            session_cwd[session] = cwd
        if is_subagent:
            continue
        bucket = bucket_index(cwd, config)
        for line in iter_lines(rollout):
            if '"type":"task_started"' not in line:
                continue
            epoch = parse_iso_utc(line[14:40])
            if epoch is not None and valid_epoch(epoch):
                # Keyed by minute so the same turn seen in history.jsonl is not counted twice.
                events[f"x{epoch // 60}"] = [epoch, bucket]

    for line in iter_lines(HOME / ".codex" / "history.jsonl"):
        try:
            entry = json.loads(line)
        except ValueError:
            continue
        epoch = entry.get("ts")
        if not isinstance(epoch, (int, float)) or not valid_epoch(int(epoch)):
            continue
        epoch = int(epoch)
        key = f"x{epoch // 60}"
        if key not in events:
            cwd = session_cwd.get(str(entry.get("session_id")), "")
            events[key] = [epoch, bucket_index(cwd, config)]

    return events


# --- agent session time -----------------------------------------------------


def session_day_minutes(stamps):
    stamps.sort()
    per_day = {}
    for earlier, later in zip(stamps, stamps[1:]):
        gap = later - earlier
        if 0 < gap <= AGENT_GAP_SECONDS:
            day = day_of(later)
            per_day[day] = per_day.get(day, 0) + gap / 60
    return {day: round(minutes, 1) for day, minutes in per_day.items() if minutes >= 0.1}


def session_runs(stamps):
    """Merge sorted activity stamps into [start, end] stretches of continuous running."""
    runs = []
    for epoch in stamps:
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


def human_prompt_cwd(line):
    """Working directory of a prompt the human sent, or None for any other log line.

    history.jsonl misses prompts sent while an agent is still working (they are
    queued), so the session log is the only record of them.
    """
    try:
        entry = json.loads(line)
    except ValueError:
        return None
    origin = entry.get("origin")
    if entry.get("type") != "user" or not isinstance(origin, dict) or origin.get("kind") != "human":
        return None
    if entry.get("isMeta") or entry.get("isSidechain"):
        return None
    return entry.get("cwd") or ""


def claude_session_stamps(path, config):
    """Return (activity stamps, tool-call stamps, human prompts) for a Claude Code session log."""
    stamps, tools, prompts = [], [], []
    for line in iter_lines(path):
        if '"type":"assistant"' not in line and '"type":"user"' not in line:
            continue
        match = TS_KEY_RE.search(line)
        if match:
            epoch = parse_iso_utc(match.group(1))
            if epoch is not None and valid_epoch(epoch):
                stamps.append(epoch)
                tools.extend([epoch] * line.count('"type":"tool_use"'))
                if '"origin":{"kind":"human"' in line:
                    cwd = human_prompt_cwd(line)
                    if cwd is not None:
                        prompts.append([epoch, bucket_index(cwd, config)])
    return stamps, tools, prompts


def codex_session_stamps(path, _config):
    """Return (activity stamps, tool-call stamps, []) for a Codex rollout.

    Codex prompts are already complete in collect_human, so none are returned here.
    """
    stamps, tools = [], []
    for line in iter_lines(path):
        if line.startswith('{"timestamp":"'):
            epoch = parse_iso_utc(line[14:40])
            if epoch is not None and valid_epoch(epoch):
                stamps.append(epoch)
                if '"type":"function_call"' in line or '"type":"custom_tool_call"' in line:
                    tools.append(epoch)
    return stamps, tools, []


def collect_agent(previous, config):
    """Return {file id: {m, s, main, days, runs, tools, prompts}}; unchanged files are not re-read.

    Entries for log files that were later pruned are kept, which is how the
    ledger holds history longer than the tools keep their own logs.
    """
    sessions = dict(previous)
    sources = []
    claude_root = HOME / ".claude" / "projects"
    if claude_root.exists():
        for path in claude_root.rglob("*.jsonl"):
            sources.append((path, "subagents" not in path.parts, claude_session_stamps))
    for path in codex_rollouts():
        sources.append((path, None, codex_session_stamps))

    for path, is_main, reader in sources:
        try:
            stat = path.stat()
        except OSError:
            continue
        key = file_id(path)
        known = sessions.get(key)
        unchanged = known and known.get("m") == int(stat.st_mtime) and known.get("s") == stat.st_size
        # "runs" and "prompts" were added after the first release; entries without them are re-read once.
        if unchanged and "runs" in known and "prompts" in known:
            continue
        if is_main is None:
            is_main = not codex_session_meta(path)[2]
        stamps, tools, prompts = reader(path, config)
        stamps.sort()
        sessions[key] = {
            "m": int(stat.st_mtime),
            "s": stat.st_size,
            "main": bool(is_main),
            "days": session_day_minutes(stamps),
            "runs": session_runs(stamps),
            "tools": count_by_day(tools),
            "prompts": prompts if is_main else [],
        }
    return sessions


def missed_prompts(store):
    """Session-log prompts of one machine that have no history entry close to them."""
    known = sorted(value[0] for value in (store.get("human") or {}).values())
    found = {}
    for session in (store.get("agent") or {}).values():
        for epoch, bucket in session.get("prompts") or []:
            found[epoch] = bucket
    missed = []
    position = 0
    for epoch in sorted(found):
        while position < len(known) and known[position] < epoch - SAME_PROMPT_SECONDS:
            position += 1
        if position == len(known) or known[position] > epoch + SAME_PROMPT_SECONDS:
            missed.append([epoch, found[epoch]])
    return missed


def peak_parallel(runs):
    """Most sessions running at the same moment, per day, from every session's runs."""
    edges = []
    for start, end in runs:
        edges.append((start, 1))
        edges.append((end, -1))
    # Ends sort before starts at the same second so back-to-back runs do not count as overlap.
    edges.sort(key=lambda edge: (edge[0], edge[1]))
    peaks = {}
    active = 0
    for epoch, change in edges:
        active += change
        day = day_of(epoch)
        if active > peaks.get(day, 0):
            peaks[day] = active
    return peaks


def cmd_collect(args):
    config = load_config()
    store_path = LEDGER_DIR / f"events-{args.machine}.json"
    store = read_json(store_path, {})
    store = {
        "machine": args.machine,
        "updatedAt": int(time.time()),
        "human": collect_human(config, store.get("human") or {}),
        "agent": collect_agent(store.get("agent") or {}, config),
    }
    write_json(store_path, store)
    print(f"{args.machine}: {len(store['human'])} prompts, {len(store['agent'])} sessions")


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
                ["lsappinfo", "info", "-only", "name", front.stdout.strip()],
                capture_output=True, text=True, timeout=10,
            ).stdout
        except (OSError, subprocess.SubprocessError):
            return ""
        names = re.findall(r'"([^"]+)"', info)
        return names[-1].lower() if names else ""
    return ""


def app_is_excluded(app, config):
    """True when the app in front is one the private config says is not work (games)."""
    presence = config.get("presence") or {}
    if any(pattern.lower() in app for pattern in presence.get("include", [])):
        return False
    return any(pattern.lower() in app for pattern in presence.get("exclude", []))


def cmd_sample(args):
    """Append this minute to the presence log when there was recent input.

    Only the minute, the app's file name and a work/not-work flag are kept, and
    only on this machine. Nothing here is published except the daily total.
    """
    config = load_config()
    idle = idle_seconds()
    if idle is None or idle > PRESENCE_IDLE_SECONDS:
        return
    app = foreground_app()
    flag = "x" if app_is_excluded(app, config) else ""
    name = re.split(r"[\\/]", app)[-1].replace("\t", " ")
    machine = args.machine or config.get("machine", "pc")
    with open(LEDGER_DIR / f"presence-{machine}.log", "a", encoding="utf-8") as handle:
        handle.write(f"{int(time.time()) // 60}\t{name}\t{flag}\n")


def presence_minutes(config):
    """Minutes with someone at a keyboard, across every machine, games left out."""
    minutes = set()
    for path in LEDGER_DIR.glob("presence-*.log"):
        for line in iter_lines(path):
            parts = line.rstrip("\n").split("\t")
            if len(parts) != 3 or not parts[0].isdigit():
                continue
            if parts[2] != "x" and not app_is_excluded(parts[1], config):
                minutes.add(int(parts[0]))
    return minutes


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
        weeks = json.loads(result.stdout)["data"]["viewer"]["contributionsCollection"][
            "contributionCalendar"]["weeks"]
    except (OSError, ValueError, KeyError, TypeError, subprocess.SubprocessError):
        return None
    return {
        day["date"]: day["contributionCount"]
        for week in weeks for day in week["contributionDays"]
    }


def build_ledger(config):
    bucket_names = [bucket["name"] for bucket in config["buckets"]]
    human = {}
    agent_minutes = {}
    sessions = {}
    tool_calls = {}
    all_runs = []
    machines = []
    for store_path in sorted(LEDGER_DIR.glob("events-*.json")):
        store = read_json(store_path, {})
        machines.append(store.get("machine", store_path.stem))
        for key, value in (store.get("human") or {}).items():
            human[f"{store.get('machine')}:{key}"] = value
        for epoch, bucket in missed_prompts(store):
            human[f"{store.get('machine')}:s{epoch}"] = [epoch, bucket]
        for session in (store.get("agent") or {}).values():
            all_runs.extend(session.get("runs") or [])
            for day, count in (session.get("tools") or {}).items():
                tool_calls[day] = tool_calls.get(day, 0) + count
            for day, minutes in (session.get("days") or {}).items():
                agent_minutes[day] = agent_minutes.get(day, 0) + minutes
                if session.get("main"):
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
            gap = epoch - ordered[index - 1][0]
            if 0 < gap <= IDLE_GAP_SECONDS:
                entry["seconds"][bucket] += gap

    previous = read_json(LEDGER_PATH, {})
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

    peaks = peak_parallel(all_runs)
    all_days = set(days) | set(agent_minutes) | set(present) | {d for d, n in contributions.items() if n}
    cutoff = day_of(time.time() - PUBLISH_DAYS * 86400)
    rows = []
    for day in sorted(d for d in all_days if d >= cutoff):
        entry = days.get(day) or {
            "seconds": [0] * len(bucket_names), "prompts": 0, "first": 0, "last": 0,
        }
        by_bucket = [round(seconds / 3600, 2) for seconds in entry["seconds"]]
        rows.append({
            "date": day,
            "hours": round(sum(entry["seconds"]) / 3600, 2),
            # First prompt to last prompt of the day: how long the workday ran, breaks included.
            "span": round((entry["last"] - entry["first"]) / 3600, 1),
            # Minutes with keyboard or mouse input on any machine, games left out.
            "active": round(present.get(day, 0) / 60, 2),
            "byBucket": by_bucket,
            "prompts": entry["prompts"],
            "agentHours": round(agent_minutes.get(day, 0) / 60, 1),
            "sessions": sessions.get(day, 0),
            "peakAgents": peaks.get(day, 0),
            "toolCalls": tool_calls.get(day, 0),
            "contributions": contributions.get(day, 0),
        })

    tracked = sorted(day for day, minutes in agent_minutes.items() if minutes > 0)
    return {
        "version": 1,
        "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "timezone": config.get("timezone", "America/Los_Angeles"),
        "dayStartHour": DAY_START_HOUR,
        "idleGapMinutes": IDLE_GAP_SECONDS // 60,
        "agentTrackingSince": tracked[0] if tracked else None,
        # The first day is partial, so the site starts using presence the day after.
        "presenceSince": min(present) if present else None,
        "machines": len(machines),
        "buckets": bucket_names,
        "days": rows,
    }


def cmd_publish(args):
    ledger = build_ledger(load_config())
    write_json(LEDGER_PATH, ledger)
    if args.out:
        Path(args.out).write_text(json.dumps(ledger, separators=(",", ":")) + "\n", encoding="utf-8")
    print(f"published {len(ledger['days'])} days to {LEDGER_PATH}")
    return ledger


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
            run_quiet(base + [f"cat > ~/.work-ledger/{name}"], source, 30).check_returncode()
        run_quiet(
            base + [f"python3 ~/.work-ledger/collect.py collect --machine {machine}"], timeout=900,
        ).check_returncode()
        fetched = run_quiet(base + [f"cat ~/.work-ledger/events-{machine}.json"], timeout=60)
        fetched.check_returncode()
        store = json.loads(fetched.stdout.decode("utf-8"))
        if store.get("machine") != machine:
            raise ValueError("unexpected store contents")
        write_json(LEDGER_DIR / f"events-{machine}.json", store)
        presence = run_quiet(base + [f"cat ~/.work-ledger/presence-{machine}.log 2>/dev/null"], timeout=60)
        if presence.stdout:
            (LEDGER_DIR / f"presence-{machine}.log").write_bytes(presence.stdout)
        log(f"{machine}: pulled {len(store.get('human', {}))} prompts")
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
    config = load_config()
    cmd_collect(argparse.Namespace(machine=config.get("machine", "pc")))
    for remote in config.get("remotes", []):
        pull_remote(remote["host"], remote["machine"])
    before = read_json(LEDGER_PATH, {}).get("days")
    ledger = cmd_publish(argparse.Namespace(out=None))
    if not config.get("gistId"):
        log("run: no gistId in config, not uploaded")
    elif ledger["days"] == before and not args.force:
        log("run: no change")
    elif upload_gist(config["gistId"], ledger):
        log(f"run: uploaded {len(ledger['days'])} days")


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
        shutil.copyfile(source, target)
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
    for name, handler in (("sample", cmd_sample), ("install", cmd_install)):
        command = commands.add_parser(name)
        command.add_argument("--machine", help="machine name, when it differs from the config")
        command.set_defaults(handler=handler)
    args = parser.parse_args()
    args.handler(args)


if __name__ == "__main__":
    main()
