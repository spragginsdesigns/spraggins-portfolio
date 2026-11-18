# Work ledger (Daily Work Log section)

The homepage "Daily Work Log" section (`src/components/WorkLedger.tsx`, `#work-log`) shows how much Austin works each day. The numbers are measured from his machines, not typed in by hand.

## What is measured

| Field | Meaning | Source |
|-------|---------|--------|
| `span` | Workday length: first prompt to last prompt of the day, breaks included | Prompt timestamps |
| `hours` | Hands-on time: time between prompts, gaps over 30 minutes dropped | Prompt timestamps |
| `active` | At the computer: minutes with keyboard or mouse input in the last 3 minutes, on either machine, games left out | Per-minute presence sampler |
| `byBucket` | `hours` split across the public buckets | Working directory of each prompt |
| `prompts` | Prompts Austin sent to coding agents | `~/.claude/history.jsonl`, Claude Code session logs, `~/.codex/history.jsonl`, Codex rollouts |
| `agentHours` | Running time of the agent sessions he drove; parallel sessions add up | Claude Code and Codex session logs |
| `sessions` | Agent sessions that day (subagents not counted) | Same |
| `contributions` | GitHub contributions, public and private, including fleet commits | GitHub GraphQL via `gh` |

A day runs 4 AM to 4 AM Pacific so a late night counts for the day it started.

`hours` is a floor, not the whole workday: reviewing agent output, testing, calls and meetings between prompts are not in it. `span` is the whole day but includes breaks. The section shows both and labels them so neither is mistaken for the other. Do not relabel `span` as hours worked.

History: prompts go back to August 2025. Agent session time starts in late September 2026 (`agentTrackingSince`), because the tools prune their own session logs; the collector keeps the totals from then on.

Two gaps to know about:

- `~/.claude/history.jsonl` does not record a prompt sent while an agent is still working (a queued prompt). Those are read from the session logs instead (`origin.kind` = `human`) and added when no history entry sits within 90 seconds. This was fixed on 2026-11-17 and recovered prompts back to 2026-11-09. Before that date the session logs were already pruned, so older days undercount `hours` and can undercount `span`.
- `active` starts on 2026-11-17 (`presenceSince`). That first day is partial, so the site shows the number from the following day. It cannot be backfilled. It misses time with no input for over 3 minutes (reading, calls), and counts any app that is not on the private exclude list.

## Presence sampler

`collect.py sample` runs once a minute (Windows task `WorkLedgerPresence`, macOS launchd job `xyz.spragginsdesigns.work-ledger-presence`). If there was keyboard or mouse input in the last 3 minutes it appends one line to `~/.work-ledger/presence-<machine>.log`: the minute, the file name of the app in front, and a flag when that app matches `presence.exclude` in the private config (game folders). `presence.include` overrides the exclude list for game engines used for work. The log stays on the machines; only the daily total is published. The MacBook's log is pulled with its event store each hour.

## Privacy

Only daily totals are published. The collector reads timestamps and working-directory paths, maps each path to one of five bucket names, and discards the path. Prompt text, code, file paths and repo names never leave the machine. This repo is public, so the path-to-bucket patterns (which contain private repo names) live only in `~/.work-ledger/config.json` and must never be committed. `scripts/work-ledger/config.example.json` shows the shape with placeholder names.

## How it runs

1. `scripts/work-ledger/collect.py` (standard library only, Python 3.9+). `collect.py install` copies it to `~/.work-ledger/collect.py` and registers two Windows tasks, hourly `WorkLedgerCollector` and per-minute `WorkLedgerPresence`, both run with `pythonw` so no window appears. On the MacBook, `python3 ~/.work-ledger/collect.py install --machine mac` registers the presence job.
2. Each hourly `run`:
   - collects on the PC into `~/.work-ledger/events-pc.json`;
   - copies the script and config to the MacBook over SSH (`ssh macbook`), runs it there, and pulls back `events-mac.json`. If the Mac is asleep, the last pulled copy is used;
   - merges both machines before measuring gaps, so time on two machines at once counts once;
   - writes `~/.work-ledger/work-ledger.json` and, if anything changed, uploads it to the gist named by `gistId` in the config.
3. The site imports the snapshot `src/data/work-ledger.json` for the static render, then fetches the gist in the browser and swaps in the newer data. No deploy is needed for the numbers to update.

`~/.work-ledger/run.log` holds the last 300 log lines (pull and upload results).

## Common jobs

- Refresh the bundled snapshot: `python scripts/work-ledger/collect.py publish --out src/data/work-ledger.json`, then commit the JSON.
- After editing `collect.py`: run `python scripts/work-ledger/collect.py install` again so the scheduled copy matches the repo.
- Add a repo to a bucket: edit `match` in `~/.work-ledger/config.json`. Past days are re-bucketed on the next run for Claude Code prompts.
- Force an upload: `python ~/.work-ledger/collect.py run --force`.
- Stop publishing: `schtasks /Delete /TN WorkLedgerCollector /F`. The site keeps showing the last data.
- Stop the presence sampler: `schtasks /Delete /TN WorkLedgerPresence /F` on the PC, and on the MacBook `launchctl bootout gui/$(id -u)/xyz.spragginsdesigns.work-ledger-presence` then delete its plist in `~/Library/LaunchAgents`.
- Keep a game out of `active`: add part of its install folder or file name to `presence.exclude` in `~/.work-ledger/config.json`.

The event stores and presence logs in `~/.work-ledger` are the only copy of agent-session history older than about a week and of all presence history. Do not delete them.
