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
  install   Copy this script to ~/.work-ledger and register the hourly task (Windows).
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
PUBLISH_DAYS = 400
MIN_EPOCH = calendar.timegm((2024, 1, 1, 0, 0, 0))
TASK_NAME = "WorkLedgerCollector"

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


def claude_session_stamps(path):
    """Return (activity stamps, one stamp per tool call) for a Claude Code session log."""
    stamps, tools = [], []
    for line in iter_lines(path):
        if '"type":"assistant"' not in line and '"type":"user"' not in line:
            continue
        match = TS_KEY_RE.search(line)
        if match:
            epoch = parse_iso_utc(match.group(1))
            if epoch is not None and valid_epoch(epoch):
                stamps.append(epoch)
                tools.extend([epoch] * line.count('"type":"tool_use"'))
    return stamps, tools


def codex_session_stamps(path):
    """Return (activity stamps, one stamp per tool call) for a Codex rollout."""
    stamps, tools = [], []
    for line in iter_lines(path):
        if line.startswith('{"timestamp":"'):
            epoch = parse_iso_utc(line[14:40])
            if epoch is not None and valid_epoch(epoch):
                stamps.append(epoch)
                if '"type":"function_call"' in line or '"type":"custom_tool_call"' in line:
                    tools.append(epoch)
    return stamps, tools


def collect_agent(previous):
    """Return {file id: {m, s, main, days, runs, tools}}; unchanged files are not re-read.

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
        # "runs" was added after the first release; entries without it are re-read once.
        if unchanged and "runs" in known:
            continue
        if is_main is None:
            is_main = not codex_session_meta(path)[2]
        stamps, tools = reader(path)
        stamps.sort()
        sessions[key] = {
            "m": int(stat.st_mtime),
            "s": stat.st_size,
            "main": bool(is_main),
            "days": session_day_minutes(stamps),
            "runs": session_runs(stamps),
            "tools": count_by_day(tools),
        }
    return sessions


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
        "agent": collect_agent(store.get("agent") or {}),
    }
    write_json(store_path, store)
    print(f"{args.machine}: {len(store['human'])} prompts, {len(store['agent'])} sessions")


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

    peaks = peak_parallel(all_runs)
    all_days = set(days) | set(agent_minutes) | {d for d, n in contributions.items() if n}
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


def cmd_install(_args):
    load_config()
    target = LEDGER_DIR / "collect.py"
    shutil.copyfile(Path(__file__).resolve(), target)
    print(f"copied collector to {target}")
    if os.name != "nt":
        print("not Windows: no scheduled task registered (this machine is pulled over SSH)")
        return
    # pythonw has no console, so the hourly run never flashes a window.
    pythonw = Path(sys.executable).with_name("pythonw.exe")
    command = f'"{pythonw}" "{target}" run'
    result = subprocess.run(
        ["schtasks", "/Create", "/F", "/TN", TASK_NAME, "/SC", "HOURLY", "/TR", command],
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
    commands.add_parser("install").set_defaults(handler=cmd_install)
    args = parser.parse_args()
    args.handler(args)


if __name__ == "__main__":
    main()
