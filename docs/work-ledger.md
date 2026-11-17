# Work ledger (Daily Work Log section)

The homepage "Daily Work Log" section (`src/components/WorkLedger.tsx`, `#work-log`) shows how much Austin works each day. The numbers are measured from his machines, not typed in by hand.

## What is measured

| Field | Meaning | Source |
|-------|---------|--------|
| `span` | Workday length: first prompt to last prompt of the day, breaks included | Prompt timestamps |
| `hours` | Hands-on time: time between prompts, gaps over 30 minutes dropped | Prompt timestamps |
| `byBucket` | `hours` split across the public buckets | Working directory of each prompt |
| `prompts` | Prompts Austin sent to coding agents | `~/.claude/history.jsonl`, `~/.codex/history.jsonl`, Codex rollouts |
| `agentHours` | Running time of the agent sessions he drove; parallel sessions add up | Claude Code and Codex session logs |
| `sessions` | Agent sessions that day (subagents not counted) | Same |
| `contributions` | GitHub contributions, public and private, including fleet commits | GitHub GraphQL via `gh` |

A day runs 4 AM to 4 AM Pacific so a late night counts for the day it started.

`hours` is a floor, not the whole workday: reviewing agent output, testing, calls and meetings between prompts are not in it. `span` is the whole day but includes breaks. The section shows both and labels them so neither is mistaken for the other. Do not relabel `span` as hours worked.

History: prompts go back to August 2025. Agent session time starts November 2026 (`agentTrackingSince`), because the tools prune their own session logs after about a week; the collector keeps the totals from then on.

## Privacy

Only daily totals are published. The collector reads timestamps and working-directory paths, maps each path to one of five bucket names, and discards the path. Prompt text, code, file paths and repo names never leave the machine. This repo is public, so the path-to-bucket patterns (which contain private repo names) live only in `~/.work-ledger/config.json` and must never be committed. `scripts/work-ledger/config.example.json` shows the shape with placeholder names.

## How it runs

1. `scripts/work-ledger/collect.py` (standard library only, Python 3.9+). `collect.py install` copies it to `~/.work-ledger/collect.py` and registers the hourly Windows task `WorkLedgerCollector`, which runs it with `pythonw` so no window appears.
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

The event stores in `~/.work-ledger` are the only copy of agent-session history older than about a week. Do not delete them.
