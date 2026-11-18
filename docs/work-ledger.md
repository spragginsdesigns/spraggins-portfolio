# Work ledger (Daily Work Log section)

The homepage "Daily Work Log" section (`src/components/WorkLedger.tsx`, `#work-log`) shows daily totals measured on Austin's PC and MacBook.

| Field | Meaning | Source |
|-------|---------|--------|
| `span` | Elapsed time from first to last prompt, including breaks. Shown as "First to last prompt" | Prompt timestamps |
| `start`, `end` | Pacific wall-clock time (`HH:MM`) of the day's first and last prompt. Absent on days without prompts | Prompt timestamps |
| `hours` | Active prompting: gaps of up to 30 minutes between prompts on the same ledger day. Shown as "Active prompting" | Prompt timestamps |
| `active` | Sampled minutes with keyboard or mouse input in the prior 3 minutes on either machine, excluding configured games. Shown as "At the computer" | Presence sampler |
| `byBucket` | Active prompting time split across the public buckets | Working directory of the prompt ending each gap |
| `prompts` | Prompts sent by the user to coding agents | Claude Code history and transcripts, Codex databases and CLI history |
| `agentHours` | Measured parent and spawned agent runtime, summed across parallel sessions | Claude Code transcripts and Codex databases |
| `sessions` | Interactive parent sessions with measured runtime, once per day | Same |
| `peakAgents` | Most measured agent session intervals overlapping on that day | Same |
| `toolCalls` | Recorded tool actions, including commands, edits and searches | Same |
| `contributions` | GitHub contributions, public and private, including fleet commits | GitHub GraphQL via `gh` |

A ledger day runs from 4 AM to 4 AM Pacific, including clock-change days. Active prompting gaps stay within the ledger day. Agent intervals that cross 4 AM are split at the boundary. Long agent runs, reviewing, testing, calls and meetings fall outside active prompting, so it reads low. Short gaps can include other activity.

## How the page presents the three time measures

`span` and `hours` answer different questions, and drawing one inside the other reads as "worked 2.8 of 14.2 hours". On November 4, 2026 the 56 prompts came in eight bursts between 8:06 AM and 10:20 PM: 2.8 hours counted, 11.5 hours of gaps over 30 minutes dropped. The page therefore keeps them apart (changed November 17, 2026):

- **First to last prompt** (`span`) is clock time. Tooltips and the 30-day table show it as a time range ("8:06 AM to 10:20 PM") with the hours next to it. The 14-day chart no longer draws it as a bar.
- **Active prompting** (`hours`) is what the 14-day chart, the project breakdown and the "Prompting" heatmap show. The words "workday" and "hands-on" are not used on the page.
- **At the computer** (`active`) is the closest measure of real working time. It appears on a day once that day is after `presenceSince`: a row in the tooltips, a column in the table and a thin marker above the day's bar. After `PRESENCE_LEAD_MIN_DAYS` (7) measured full days in the last 30, its average replaces the first-to-last average as the first hero tile. Days before presence tracking keep the prompt-based numbers and show "n/a" for this measure.

The C2 and LineCrush fleet panel uses the dated fleet job-ledger totals in `src/lib/stats.ts`. GitHub's contribution calendar includes fleet commits. Its counts and the fleet's job counts describe different events.

## Coverage and deduplication

Prompt history goes back to August 2025. The earliest agent history is Codex only. The Claude Code archive starts September 21, 2026 (`claudeAgentTrackingSince`); it estimates runtime from gaps of up to five minutes between session messages. Older pruned transcripts are represented by their existing cached measurements.

- Codex reads `thread_history_*.sqlite` and `state_*.sqlite` read-only. Only interactive user messages count as prompts. CLI history supplements them, with one-to-one matching by session, content and time. Client and turn-item IDs preserve prompts in the same minute and deduplicate copies in forked chats. Minute-only keys were rebuilt from surviving raw records.
- Codex runtime uses terminal turns with a valid start, finish and recorded duration. Each interval ends at completion and uses the shorter of recorded duration and wall-clock elapsed time. Overlapping intervals within a thread merge, and duplicate thread IDs across machines count once. Explicitly spawned agents contribute runtime and actions. Scripted runs, scheduled automation and guardian reviews are excluded.
- DB-backed threads replace their matching cached rollout records. Unmatched historical session records are retained. Claude Code and Codex prune source logs, so surviving event stores are necessary to reproduce older totals.
- Claude Code history can miss queued prompts. Transcripts supply explicitly human typed or queued messages, including human-origin Claude Desktop messages routed through the SDK. A history entry can match only one transcript prompt, by session, content and time. A matching queue enqueue supplies the send timestamp, with delivery time as the fallback. Older pruned transcripts limit how far the correction can reach.
- Phone prompts count when remote control sends them into a recorded session on the PC or MacBook. Phone-only activity outside those host logs is outside the ledger's coverage. Presence measures keyboard and mouse input on the two computers.

## Presence

`collect.py sample` runs every minute through Windows task `WorkLedgerPresence` and macOS launchd job `xyz.spragginsdesigns.work-ledger-presence`. With recent input and a known foreground app, it checks the app path against the private `presence.exclude` list. `presence.include` takes precedence. New monthly `presence-<machine>-YYYY-MM.log` files store just the minute and exclusion flag. Historical logs are retained. The PC pulls qualifying MacBook minutes each hour and unions them with its own, so simultaneous minutes count once.

Presence starts on November 17, 2026. That first day is partial and the site shows this metric starting with the next day. Reading and meetings with no input for over three minutes are missed.

## Privacy

The collector maps private working directories to the five public bucket names. Only daily totals and each day's first and last prompt time are published. Content matching happens in memory. Prompt text, code, paths, repository names and app names are excluded from the public payload. The private patterns live only in `~/.work-ledger/config.json`. `scripts/work-ledger/config.example.json` contains placeholders.

## Operation and recovery

1. `collect.py install` copies the collector to `~/.work-ledger/collect.py` and registers the hourly `WorkLedgerCollector` job and the per-minute presence task on Windows. The MacBook uses `python3 ~/.work-ledger/collect.py install --machine mac` for its presence job. The collector runs on Python 3.9+ with IANA timezone data available to `zoneinfo`. Windows Python may need `tzdata`.
2. The hourly `run` validates and updates `events-pc.json`, syncs the script and private config to the MacBook over SSH, and pulls its validated store and presence minutes. If the MacBook is unavailable or its DB is unreadable, the PC keeps its last good copy. If either required store is unavailable locally, or the local DB cannot be read, the run stops before uploading. A contribution query failure retains previously available counts.
3. The collector writes `~/.work-ledger/work-ledger.json` after GitHub acknowledges the gist update. Upload failures keep the last successful export and retry on the next run. A browser only accepts a newer, valid gist.
4. After editing the collector, run `python scripts/work-ledger/collect.py install`, then `python ~/.work-ledger/collect.py run --force`. Refresh the bundled fallback from that upload with `python scripts/work-ledger/collect.py publish --out src/data/work-ledger.json`.

`~/.work-ledger/run.log` records pull and upload results. To pause publishing, disable the Windows `WorkLedgerCollector` task. Back up stores before rewriting them. Keep all event stores and presence logs under `~/.work-ledger/`.
