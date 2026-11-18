"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
	LONG_DAY_HOURS,
	formatHours,
	formatInt,
	formatShortDate,
	isWorked,
	recentDays,
	type LedgerIndex,
	type WorkLedgerSummary
} from "@/lib/work-ledger";

const reveal = (i: number) => ({
	initial: { opacity: 0, y: 12 },
	whileInView: { opacity: 1, y: 0 },
	transition: { duration: 0.45, delay: i * 0.06 },
	viewport: { once: true }
});

function dateWithYear(date: string, referenceDate: string): string {
	const short = formatShortDate(date);
	return date.slice(0, 4) === referenceDate.slice(0, 4) ? short : `${short}, ${date.slice(0, 4)}`;
}

// ---------------------------------------------------------------------------
// Hero tiles: how long the days run leads
// ---------------------------------------------------------------------------

const HeroTile: React.FC<{
	index: number;
	label: string;
	value: string;
	unit: string;
	sub: string;
	children: React.ReactNode;
}> = ({ index, label, value, unit, sub, children }) => (
	<motion.div
		{...reveal(index)}
		className="relative flex flex-col overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-b from-primary/[0.08] via-card/40 to-card/30 p-6 md:p-7"
	>
		<div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
		<div className="mt-3 flex items-baseline gap-2">
			<span className="font-heading text-5xl font-bold leading-none text-foreground md:text-6xl">{value}</span>
			<span className="text-lg font-semibold text-primary md:text-xl">{unit}</span>
		</div>
		<p className="mt-2 text-sm leading-snug text-muted-foreground">{sub}</p>
		<div className="mt-auto pt-6" aria-hidden="true">
			{children}
		</div>
	</motion.div>
);

const PromptingMeter: React.FC<{ total: number; handsOn: number; rest: string }> = ({ total, handsOn, rest }) => {
	const share = total > 0 ? Math.min(1, handsOn / total) : 0;
	return (
		<div>
			<div className="h-2.5 w-full rounded-full bg-primary/15">
				<div className="h-full rounded-full bg-primary" style={{ width: `${share * 100}%` }} />
			</div>
			<div className="mt-2.5 flex flex-wrap justify-between gap-x-3 gap-y-1 text-xs text-muted-foreground">
				<span className="inline-flex items-center gap-1.5">
					<span className="h-2 w-2 rounded-full bg-primary" />
					{formatHours(handsOn)}h actively prompting
				</span>
				<span className="inline-flex items-center gap-1.5">
					<span className="h-2 w-2 rounded-full bg-primary/25" />
					{rest}
				</span>
			</div>
		</div>
	);
};

const SpanSparkline: React.FC<{ spans: number[] }> = ({ spans }) => {
	const max = Math.max(14, ...spans);
	const linePct = (LONG_DAY_HOURS / max) * 100;
	return (
		<div>
			<div className="relative h-14">
				<div className="absolute inset-x-0 h-px bg-foreground/25" style={{ bottom: `${linePct}%` }} />
				<span
					className="absolute right-0 -translate-y-full pb-0.5 text-[10px] text-muted-foreground"
					style={{ bottom: `${linePct}%` }}
				>
					{LONG_DAY_HOURS}h
				</span>
				<div className="absolute inset-0 flex items-end gap-px">
					{spans.map((span, i) => (
						<div
							key={i}
							className={`flex-1 rounded-t-[1px] ${span >= LONG_DAY_HOURS ? "bg-primary" : "bg-primary/25"}`}
							style={{ height: `${(span / max) * 100}%` }}
						/>
					))}
				</div>
			</div>
			<div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
				<span>{spans.length} days ago</span>
				<span>today</span>
			</div>
		</div>
	);
};

const WorkedGrid: React.FC<{ worked: boolean[] }> = ({ worked }) => (
	<div>
		<div className="grid gap-[3px]" style={{ gridTemplateColumns: "repeat(30, minmax(0, 1fr))" }}>
			{worked.map((on, i) => (
				<div key={i} className={`aspect-square rounded-[2px] ${on ? "bg-primary/85" : "bg-foreground/[0.07]"}`} />
			))}
		</div>
		<div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
			<span>oldest</span>
			<span>today</span>
		</div>
	</div>
);

export const HeroStats: React.FC<{ summary: WorkLedgerSummary; index: LedgerIndex }> = ({ summary, index }) => {
	const days90 = useMemo(
		() => recentDays(index, summary.latestDate, summary.window90),
		[index, summary.latestDate, summary.window90]
	);
	const { workday, presence, window90 } = summary;
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
			{presence ? (
				<HeroTile
					index={0}
					label="Average day at the computer"
					value={formatHours(presence.avgActive)}
					unit="hours"
					sub={`Time with keyboard or mouse input, games excluded, averaged over ${presence.days} measured days since ${formatShortDate(presence.since)}.`}
				>
					<PromptingMeter
						total={presence.avgActive}
						handsOn={presence.avgHandsOn}
						rest="reviewing, testing and other work"
					/>
				</HeroTile>
			) : (
				<HeroTile
					index={0}
					label="Average day, first to last prompt"
					value={formatHours(workday.avgSpan)}
					unit="hours"
					sub={`Clock time from the first prompt to the last, breaks included, averaged over ${workday.days} full days in the last 30.`}
				>
					<PromptingMeter
						total={workday.avgSpan}
						handsOn={workday.avgHandsOn}
						rest="agent runs, reviews, calls and breaks"
					/>
				</HeroTile>
			)}
			<HeroTile
				index={1}
				label={`${LONG_DAY_HOURS}+ hour days`}
				value={formatInt(summary.tenHourDays)}
				unit={`of the last ${window90}`}
				sub={`Days with ${LONG_DAY_HOURS} hours or more between the first prompt and the last, breaks included.`}
			>
				<SpanSparkline spans={days90.map((d) => d.span)} />
			</HeroTile>
			<HeroTile
				index={2}
				label="Days worked"
				value={formatInt(summary.daysWorked)}
				unit={`of the last ${window90}`}
				sub={`Days I sent prompts to my coding agents. Current streak: ${summary.streak} ${
					summary.streak === 1 ? "day" : "days"
				}.`}
			>
				<WorkedGrid worked={days90.map(isWorked)} />
			</HeroTile>
		</div>
	);
};

// ---------------------------------------------------------------------------
// Secondary tiles
// ---------------------------------------------------------------------------

interface Tile {
	label: string;
	value: string;
	sub: string;
}

export function buildSecondaryTiles(s: WorkLedgerSummary, agentTrackingSince: string): Tile[] {
	const agentScope = s.agentWindowClipped ? `since ${formatShortDate(s.agentWindowStart)}` : "30 days";
	const agentTiles: Tile[] = s.agentTracked
		? [
				{
					label: `Agent hours, ${agentScope}`,
					value: `${formatHours(s.agentHours)}h`,
					sub: `${formatInt(s.agentSessions)} parent sessions tallied by day`
				},
				{
					label: "Peak agents at once",
					value: s.peakAgents ? formatInt(s.peakAgents.count) : "0",
					sub: s.peakAgents ? `on ${dateWithYear(s.peakAgents.date, s.latestDate)}` : `since ${formatShortDate(agentTrackingSince)}`
				},
				{
					label: `Agent actions, ${agentScope}`,
					value: formatInt(s.toolCalls),
					sub: "file edits, commands, searches"
				}
			]
		: [
				{
					label: "Agent tracking",
					value: "Soon",
					sub: `starts ${formatShortDate(agentTrackingSince)}`
				}
			];

	const day = formatShortDate(s.latestDate);
	const handsOn = `${formatHours(s.latestHours)}h actively prompting`;
	// The streak is already in the hero row, so measured time at the computer replaces it once it exists.
	const thirdTile: Tile =
		s.latestActive !== null
			? {
					label: s.latestIsCurrent ? "At the computer today" : "At the computer, latest day",
					value: `${formatHours(s.latestActive)}h`,
					sub: "recent keyboard or mouse input, games excluded"
				}
			: {
					label: "Current streak",
					value: formatInt(s.streak),
					sub: s.streak === 1 ? "day worked" : "consecutive days worked"
				};

	return [
		{
			label: s.latestIsCurrent ? "Today, first to last prompt so far" : "Latest day, first to last prompt",
			value: `${formatHours(s.latestSpan)}h`,
			sub: `${handsOn}, ${day}`
		},
		{
			label: "Active prompting, 7-day average",
			value: `${formatHours(s.avg7)}h`,
			sub: "per day, last 7 full days"
		},
		thirdTile,
		{ label: "Prompts sent", value: formatInt(s.prompts30), sub: "last 30 days" },
		...agentTiles,
		{ label: "GitHub contributions", value: formatInt(s.contributions365), sub: "last 365 days, includes fleet work" }
	];
}

export const SecondaryStats: React.FC<{ tiles: Tile[] }> = ({ tiles }) => (
	<dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/50 bg-border/40 md:grid-cols-4">
		{tiles.map((tile, i) => (
			<motion.div
				key={tile.label}
				{...reveal(i * 0.5)}
				className={`flex flex-col bg-card/90 px-4 py-4 md:px-6 md:py-5${
					tiles.length % 2 === 1 && i === tiles.length - 1 ? " col-span-2 md:col-span-1" : ""
				}`}
			>
				<dt className="text-xs leading-tight text-muted-foreground">{tile.label}</dt>
				<dd className="mt-1.5 text-2xl font-semibold text-foreground md:text-[1.7rem]">{tile.value}</dd>
				<dd className="mt-0.5 text-xs leading-tight text-muted-foreground">{tile.sub}</dd>
			</motion.div>
		))}
	</dl>
);
