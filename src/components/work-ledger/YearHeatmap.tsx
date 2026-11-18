"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import {
	HOURS_THRESHOLDS,
	SPAN_THRESHOLDS,
	buildHeatmap,
	contributionThresholds,
	formatHours,
	formatInt,
	formatLongDate,
	heatLevel,
	type HeatCell,
	type HeatLevel,
	type HeatMetric,
	type LedgerIndex
} from "@/lib/work-ledger";
import { HEAT_RAMP } from "./colors";
import { ChartTooltip, DayTimeRows, TooltipRow, dayTimeText, useMarkTooltip } from "./ChartTooltip";

const CELL = 11;
const STEP = 14;
const LEFT = 30;
const TOP = 18;
const DAY_LABELS: [number, string][] = [
	[1, "Mon"],
	[3, "Wed"],
	[5, "Fri"]
];

const METRICS: { id: HeatMetric; label: string; legend: string }[] = [
	{ id: "span", label: "First to last", legend: "Hours from first to last prompt" },
	{ id: "hours", label: "Prompting", legend: "Hours of active prompting" },
	{ id: "contributions", label: "Contributions", legend: "Contributions" }
];

function legendLabels(metric: HeatMetric, t: readonly [number, number, number]): string[] {
	if (metric !== "contributions") {
		return ["0", `under ${t[0]}h`, `${t[0]} to ${t[1]}h`, `${t[1]} to ${t[2]}h`, `${t[2]}h+`];
	}
	const span = (lo: number, hi: number) => (lo >= hi ? `${lo}` : `${lo} to ${hi}`);
	return ["0", span(1, t[0] - 1), span(t[0], t[1] - 1), span(t[1], t[2] - 1), `${t[2]}+`];
}

function cellLabel(cell: HeatCell, agentTrackingSince: string, presenceSince: string | null): string {
	const { day } = cell;
	const parts = [dayTimeText(day, presenceSince), `${formatInt(day.prompts)} prompts`];
	if (cell.date >= agentTrackingSince) {
		parts.push(
			`${formatHours(day.agentHours)} agent hours`,
			`${formatInt(day.peakAgents)} agents at peak`,
			`${formatInt(day.toolCalls)} agent actions`
		);
	}
	parts.push(`${formatInt(day.contributions)} contributions`);
	return `${formatLongDate(cell.date)}: ${parts.join(", ")}`;
}

function headline(metric: HeatMetric, total: number): string {
	if (metric === "span") return `${formatInt(total)} hours between first and last prompts`;
	if (metric === "hours") return `${formatInt(total)} hours of active prompting`;
	return `${formatInt(total)} contributions`;
}

interface YearHeatmapProps {
	index: LedgerIndex;
	end: string;
	agentTrackingSince: string;
	presenceSince: string | null;
}

const YearHeatmap: React.FC<YearHeatmapProps> = ({ index, end, agentTrackingSince, presenceSince }) => {
	const [metric, setMetric] = useState<HeatMetric>("span");
	const [active, setActive] = useState<number | null>(null);
	const scrollRef = useRef<HTMLDivElement>(null);
	const { wrapRef, anchor, showIndex, onPointerMove, hide } = useMarkTooltip();
	const hintId = useId();

	const grid = useMemo(() => buildHeatmap(index, end), [index, end]);
	const cells = useMemo(() => grid.weeks.flat(), [grid]);
	const thresholds = useMemo<readonly [number, number, number]>(() => {
		if (metric === "span") return SPAN_THRESHOLDS;
		if (metric === "hours") return HOURS_THRESHOLDS;
		return contributionThresholds(cells.filter((c) => !c.future).map((c) => c.day.contributions));
	}, [metric, cells]);
	const total = useMemo(
		() => cells.reduce((sum, c) => (c.future ? sum : sum + c.day[metric]), 0),
		[cells, metric]
	);
	const labels = legendLabels(metric, thresholds);
	const metricInfo = METRICS.find((m) => m.id === metric) ?? METRICS[0];
	const weekCount = grid.weeks.length;
	const width = LEFT + weekCount * STEP;
	const height = TOP + 7 * STEP;
	const lastIndex = cells.reduce((last, c, i) => (c.future ? last : i), 0);

	// Phones show the most recent weeks first; older weeks are a swipe left.
	useEffect(() => {
		const el = scrollRef.current;
		if (el) el.scrollLeft = el.scrollWidth;
	}, [weekCount]);

	const focusCell = (i: number) => {
		setActive(i);
		const el = scrollRef.current?.querySelector(`[data-mark="${i}"]`);
		if (el instanceof SVGElement) el.scrollIntoView({ block: "nearest", inline: "nearest" });
		showIndex(i);
	};

	const onKeyDown = (event: React.KeyboardEvent) => {
		const current = active ?? lastIndex;
		const moves: Record<string, number> = {
			ArrowLeft: -7,
			ArrowRight: 7,
			ArrowUp: -1,
			ArrowDown: 1
		};
		let next: number | null = null;
		if (event.key in moves) next = current + moves[event.key];
		else if (event.key === "Home") next = 0;
		else if (event.key === "End") next = lastIndex;
		if (next === null) return;
		event.preventDefault();
		focusCell(Math.min(Math.max(next, 0), lastIndex));
	};

	const activeCell = active !== null ? cells[active] : undefined;
	const tipCell = anchor ? cells[anchor.index] : undefined;
	const highlight = anchor?.index ?? active;

	return (
		<div>
			<div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<h3 className="font-heading text-2xl font-bold">The last year, day by day</h3>
					<p className="mt-1 text-sm text-muted-foreground">
						{headline(metric, total)} since {formatLongDate(grid.start)}
					</p>
				</div>
				<div
					role="group"
					aria-label="Heatmap metric"
					className="inline-flex self-start rounded-full border border-border/60 bg-background/60 p-1 sm:self-auto"
				>
					{METRICS.map((m) => (
						<button
							key={m.id}
							type="button"
							aria-pressed={metric === m.id}
							onClick={() => setMetric(m.id)}
							className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
								metric === m.id
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							{m.label}
						</button>
					))}
				</div>
			</div>

			<div
				ref={wrapRef}
				className="relative"
				onPointerMove={onPointerMove}
				onPointerDown={onPointerMove}
				onPointerLeave={(event) => {
					// A touch tap fires leave right after it lands; keep its tooltip up.
					if (event.pointerType !== "mouse") return;
					if (active === null) hide();
					else showIndex(active);
				}}
			>
				<div
					ref={scrollRef}
					tabIndex={0}
					role="group"
					aria-label={`${metricInfo.legend}, per day for the last year`}
					aria-describedby={hintId}
					onKeyDown={onKeyDown}
					onFocus={(event) => {
						// Only keyboard focus jumps to a day; a click or tap already picked one.
						if (event.currentTarget.matches(":focus-visible")) focusCell(active ?? lastIndex);
					}}
					onBlur={() => {
						setActive(null);
						hide();
					}}
					className="overflow-x-auto rounded-md pb-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
				>
					{/* Fills wide cards; below its natural width it stops shrinking and the wrapper scrolls instead. */}
					<svg
						viewBox={`0 0 ${width} ${height}`}
						aria-hidden="true"
						className="mx-auto block h-auto w-full max-w-[1040px]"
						style={{ minWidth: width }}
					>
						{grid.months.map((m) => (
							<text
								key={`${m.week}-${m.label}`}
								x={LEFT + m.week * STEP}
								y={11}
								className="fill-muted-foreground"
								fontSize={10}
							>
								{m.label}
							</text>
						))}
						{DAY_LABELS.map(([d, label]) => (
							<text
								key={label}
								x={0}
								y={TOP + d * STEP + CELL - 2}
								className="fill-muted-foreground"
								fontSize={10}
							>
								{label}
							</text>
						))}
						{grid.weeks.map((week, w) =>
							week.map((cell, d) => {
								if (cell.future) return null;
								const i = w * 7 + d;
								const level: HeatLevel = heatLevel(cell.day[metric], thresholds);
								const lit = highlight === i;
								return (
									<rect
										key={cell.date}
										data-mark={i}
										x={LEFT + w * STEP}
										y={TOP + d * STEP}
										width={CELL}
										height={CELL}
										rx={2}
										fill={HEAT_RAMP[level]}
										stroke={lit ? "#ffffff" : "none"}
										strokeWidth={lit ? 1.5 : 0}
									/>
								);
							})
						)}
					</svg>
				</div>

				{anchor && tipCell ? (
					<ChartTooltip anchor={anchor}>
						<div className="mb-1 font-semibold text-foreground">{formatLongDate(tipCell.date)}</div>
						<DayTimeRows day={tipCell.day} presenceSince={presenceSince} />
						<TooltipRow value={formatInt(tipCell.day.prompts)} label="prompts" />
						{tipCell.date >= agentTrackingSince ? (
							<>
								<TooltipRow
									value={`${formatHours(tipCell.day.agentHours)}h`}
									label={`agent time, ${formatInt(tipCell.day.sessions)} sessions`}
								/>
								<TooltipRow value={formatInt(tipCell.day.peakAgents)} label="agents at peak" />
								<TooltipRow value={formatInt(tipCell.day.toolCalls)} label="agent actions" />
							</>
						) : null}
						<TooltipRow value={formatInt(tipCell.day.contributions)} label="contributions" />
					</ChartTooltip>
				) : null}
			</div>

			<p id={hintId} className="sr-only">
				Use the arrow keys to move between days. Left and right move a week, up and down move a day.
			</p>
			<p className="sr-only" aria-live="polite">
				{activeCell ? cellLabel(activeCell, agentTrackingSince, presenceSince) : ""}
			</p>

			<div className="mt-4 flex flex-wrap items-center justify-end gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
				<span className="w-full text-right sm:w-auto">{metricInfo.legend}, per day</span>
				{labels.map((label, level) => (
					<span key={label + level} className="inline-flex items-center gap-1.5">
						<span
							className="inline-block h-[11px] w-[11px] rounded-[2px]"
							style={{ backgroundColor: HEAT_RAMP[level as HeatLevel] }}
						/>
						{label}
					</span>
				))}
			</div>
		</div>
	);
};

export default YearHeatmap;
