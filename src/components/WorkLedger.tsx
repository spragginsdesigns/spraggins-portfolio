"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import snapshotJson from "@/data/work-ledger.json";
import {
	WORK_LEDGER_URL,
	addDays,
	formatHours,
	formatInt,
	formatLongDate,
	formatRelative,
	formatShortDate,
	formatUpdatedAt,
	indexLedger,
	isNewerLedger,
	isWorkLedger,
	recentDays,
	summarize,
	type LedgerIndex,
	type WorkLedger as WorkLedgerData
} from "@/lib/work-ledger";
import { HeroStats, SecondaryStats, buildSecondaryTiles } from "@/components/work-ledger/StatTiles";
import YearHeatmap from "@/components/work-ledger/YearHeatmap";
import RecentDaysChart from "@/components/work-ledger/RecentDaysChart";
import BucketBreakdown from "@/components/work-ledger/BucketBreakdown";
import WorkScale from "@/components/work-ledger/WorkScale";

const EMPTY_LEDGER: WorkLedgerData = {
	version: 1,
	generatedAt: "1970-01-01T00:00:00Z",
	timezone: "America/Los_Angeles",
	dayStartHour: 4,
	idleGapMinutes: 30,
	agentTrackingSince: "1970-01-01",
	buckets: ["LineCrush", "LineCrush Games", "SureWord", "Client sites", "Personal & tooling"],
	days: []
};

// The bundled snapshot is what the static HTML renders; a malformed file must
// never take the homepage down, so it degrades to the empty state.
const SNAPSHOT: WorkLedgerData = isWorkLedger(snapshotJson) ? snapshotJson : EMPTY_LEDGER;

const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];

function hourLabel(hour: number): string {
	if (hour === 0) return "midnight";
	if (hour === 12) return "noon";
	return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
}

function zoneLabel(timeZone: string): string {
	return timeZone === "America/Los_Angeles" ? "Pacific" : timeZone;
}

function machinesPhrase(machines: number | undefined): string {
	if (machines === undefined || machines < 2 || !Number.isInteger(machines)) return "my machines";
	return `my ${NUMBER_WORDS[machines] ?? formatInt(machines)} machines`;
}

const panel = "bg-card/30 backdrop-blur-sm border-border/50";

const rise = (delay: number) => ({
	initial: { opacity: 0, y: 20 },
	whileInView: { opacity: 1, y: 0 },
	transition: { duration: 0.5, delay },
	viewport: { once: true }
});

const MethodNote: React.FC<{ ledger: WorkLedgerData }> = ({ ledger }) => {
	const start = hourLabel(ledger.dayStartHour);
	const tracksAgentsLate = ledger.days.some((d) => d.date < ledger.agentTrackingSince);
	const claudeSince = ledger.claudeAgentTrackingSince ?? "2026-09-21";
	return (
		<div className="mx-auto mt-10 max-w-3xl space-y-2 text-center text-xs leading-relaxed text-muted-foreground">
			<p>
				<span className="font-semibold text-foreground/80">Workday</span> is the time from my first prompt to my
				last prompt of the day, breaks included, so it is not continuous work.{" "}
				<span className="font-semibold text-foreground/80">Hands-on</span> is the time I spend actively directing
				my coding agents, estimated from gaps of up to {ledger.idleGapMinutes} minutes between prompts on the
				same workday. Reviewing, testing, calls and meetings can fall outside that estimate.
				{" "}Phone prompts count when they reach a recorded session on my PC or MacBook.
			</p>
			<p>
				A day runs {start} to {start} {zoneLabel(ledger.timezone)} so late nights count for the day they started.
				{tracksAgentsLate
					? ` Agent hours, peak agents and agent actions have been tracked since ${formatLongDate(ledger.agentTrackingSince)}.`
					: ""}
				{ledger.agentTrackingSince < claudeSince
					? ` Agent metrics before ${formatLongDate(claudeSince)} cover Codex only.`
					: ""}
				{ledger.presenceSince
					? ` Time at the computer counts minutes with keyboard or mouse input and has been tracked since ${formatLongDate(ledger.presenceSince)}.`
					: ""}{" "}
				Contributions include commits shipped by my agent fleet. No repo names, code or prompt text ever leave my
				machines.
			</p>
		</div>
	);
};

const DataTable: React.FC<{ index: LedgerIndex; end: string; agentTrackingSince: string }> = ({
	index,
	end,
	agentTrackingSince
}) => {
	const rows = useMemo(() => recentDays(index, end, 30).reverse(), [index, end]);
	const heads = ["Workday", "Hands-on", "Prompts", "Agent hours", "Peak agents", "Agent actions", "Contributions"];
	return (
		<details className="rounded-xl border border-border/50 bg-card/20 text-sm">
			<summary className="cursor-pointer select-none rounded-xl px-5 py-3.5 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
				Show the last 30 days as a table
			</summary>
			<div className="overflow-x-auto px-5 pb-5">
				<table className="w-full min-w-[720px] text-left tabular-nums">
					<caption className="sr-only">Daily work log, last 30 days, newest first</caption>
					<thead className="text-xs text-muted-foreground">
						<tr className="border-b border-border/50">
							<th scope="col" className="py-2 pr-4 font-medium">
								Date
							</th>
							{heads.map((h) => (
								<th key={h} scope="col" className="py-2 pl-4 text-right font-medium">
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{rows.map((day) => {
							const tracked = day.date >= agentTrackingSince;
							const cells = [
								formatHours(day.span),
								formatHours(day.hours),
								formatInt(day.prompts),
								tracked ? formatHours(day.agentHours) : "n/a",
								tracked ? formatInt(day.peakAgents) : "n/a",
								tracked ? formatInt(day.toolCalls) : "n/a",
								formatInt(day.contributions)
							];
							return (
								<tr key={day.date} className="border-b border-border/20 last:border-0">
									<th scope="row" className="py-1.5 pr-4 font-normal text-foreground">
										{formatLongDate(day.date)}
									</th>
									{cells.map((value, i) => (
										<td key={heads[i]} className="py-1.5 pl-4 text-right">
											{value}
										</td>
									))}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</details>
	);
};

const WorkLedger: React.FC = () => {
	const [ledger, setLedger] = useState<WorkLedgerData>(SNAPSHOT);
	const [now, setNow] = useState<number | null>(null);

	useEffect(() => {
		const controller = new AbortController();
		fetch(WORK_LEDGER_URL, { signal: controller.signal })
			.then((res): Promise<unknown> | null => (res.ok ? res.json() : null))
			.then((data) => {
				if (isWorkLedger(data)) {
					setLedger((current) => (isNewerLedger(data, current) ? data : current));
				}
			})
			// The bundled snapshot is a complete fallback, so a failed refresh is silent.
			.catch(() => undefined);
		return () => controller.abort();
	}, []);

	// The relative "updated" text reads the clock, so it only appears after
	// hydration; the server and first client render share the absolute time.
	useEffect(() => {
		setNow(Date.now());
		const timer = window.setInterval(() => setNow(Date.now()), 60_000);
		return () => window.clearInterval(timer);
	}, []);

	const index = useMemo(() => indexLedger(ledger), [ledger]);
	const summary = useMemo(() => summarize(ledger, index, now), [ledger, index, now]);
	const updatedAbsolute = formatUpdatedAt(ledger.generatedAt, ledger.timezone);

	return (
		<section id="work-log" className="relative overflow-hidden bg-background py-24 text-foreground">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[min(900px,100%)] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-3xl"
			/>
			<div className="container relative mx-auto px-4">
				<motion.div {...rise(0)} className="mb-12 text-center md:mb-14">
					{summary !== null && updatedAbsolute ? (
						<p className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/[0.06] px-3.5 py-1.5 text-xs text-muted-foreground">
							<span className="relative flex h-2 w-2" aria-hidden="true">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
								<span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
							</span>
							<span>
								Measured hourly, updated{" "}
								{/* ICU builds differ in the space before AM/PM, so server and browser text may not match byte for byte. */}
								<time dateTime={ledger.generatedAt} title={updatedAbsolute} suppressHydrationWarning>
									{now !== null ? formatRelative(ledger.generatedAt, now) : updatedAbsolute}
								</time>
							</span>
						</p>
					) : null}
					<h2 className="mb-4 font-heading text-4xl font-bold md:text-5xl">Daily Work Log</h2>
					<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
						Measured from real activity across {machinesPhrase(ledger.machines)} and updated through the day:
						how long each workday runs, how much of it is hands-on with my coding agents, and what ships.
					</p>
				</motion.div>

				{summary === null ? (
					<Card className={`${panel} mx-auto max-w-xl p-8 text-center`}>
						<Activity className="mx-auto mb-3 h-8 w-8 text-primary" aria-hidden="true" />
						<h3 className="mb-2 text-xl font-bold">Collecting data</h3>
						<p className="text-sm text-muted-foreground">
							The log is warming up. Daily hours, prompts and contributions will show up here as soon as the
							first day is recorded.
						</p>
					</Card>
				) : (
					<div className="space-y-6">
						<HeroStats summary={summary} index={index} />

						<SecondaryStats tiles={buildSecondaryTiles(summary, ledger.agentTrackingSince)} />

						<motion.div {...rise(0.1)}>
							<Card className="rounded-2xl border-primary/15 bg-card/40 p-5 shadow-[0_0_80px_-30px_hsl(var(--primary)/0.35)] backdrop-blur-sm md:p-8">
								<YearHeatmap
									index={index}
									end={summary.latestDate}
									agentTrackingSince={ledger.agentTrackingSince}
								/>
							</Card>
						</motion.div>

						<div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
							<motion.div {...rise(0.1)} className="lg:col-span-3">
								<Card className={`${panel} h-full rounded-2xl p-5 md:p-7`}>
									<RecentDaysChart
										index={index}
										end={summary.latestDate}
										buckets={ledger.buckets}
										agentTrackingSince={ledger.agentTrackingSince}
									/>
								</Card>
							</motion.div>
							<motion.div {...rise(0.15)} className="lg:col-span-2">
								<Card className={`${panel} h-full rounded-2xl p-5 md:p-7`}>
									<BucketBreakdown index={index} end={summary.latestDate} buckets={ledger.buckets} />
									<p className="mt-4 text-xs text-muted-foreground">
										{formatShortDate(addDays(summary.latestDate, -29))} to {formatShortDate(summary.latestDate)}
									</p>
								</Card>
							</motion.div>
						</div>

						<DataTable index={index} end={summary.latestDate} agentTrackingSince={ledger.agentTrackingSince} />
					</div>
				)}

				<MethodNote ledger={ledger} />
				<WorkScale />
			</div>
		</section>
	);
};

export default WorkLedger;
