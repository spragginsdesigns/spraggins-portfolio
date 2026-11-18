"use client";

import React, { useId, useMemo, useState } from "react";
import {
	formatHours,
	formatInt,
	formatLongDate,
	formatWeekdayInitial,
	hasPresence,
	niceScale,
	recentDays,
	type LedgerIndex
} from "@/lib/work-ledger";
import { bucketColor } from "./colors";
import { ChartTooltip, DayTimeRows, TooltipRow, dayTimeText, useMarkTooltip } from "./ChartTooltip";
import BucketLegend from "./BucketLegend";

const PLOT_HEIGHT = 176;
const DAYS = 14;

interface RecentDaysChartProps {
	index: LedgerIndex;
	end: string;
	buckets: string[];
	agentTrackingSince: string;
	presenceSince: string | null;
	idleGapMinutes: number;
}

const RecentDaysChart: React.FC<RecentDaysChartProps> = ({
	index,
	end,
	buckets,
	agentTrackingSince,
	presenceSince,
	idleGapMinutes
}) => {
	const days = useMemo(() => recentDays(index, end, DAYS), [index, end]);
	const [active, setActive] = useState<number | null>(null);
	const { wrapRef, anchor, showIndex, onPointerMove, hide } = useMarkTooltip();
	const hintId = useId();

	// The first-to-last span is clock time, not a duration of work, so it stays off this
	// axis and lives in the tooltip as a time range. At-the-computer hours share the axis.
	const presenceOf = (d: (typeof days)[number]) => (hasPresence(d.date, presenceSince) ? d.active : 0);
	const showPresence = days.some((d) => presenceOf(d) > 0);
	const maxValue = days.reduce((m, d) => Math.max(m, d.hours, presenceOf(d)), 0);
	const scale = niceScale(maxValue);
	const ticks: number[] = [];
	for (let t = 0; t <= scale.max + 1e-9; t += scale.step) ticks.push(Number(t.toFixed(4)));
	const maxHours = days.reduce((m, d) => Math.max(m, d.hours), 0);
	// Label sparingly: only the tallest bar in view. With presence markers drawn above the
	// bars the label would sit on a marker and read as its value, so it is dropped then.
	const peakIndex = maxHours > 0 && !showPresence ? days.findIndex((d) => d.hours === maxHours) : -1;
	const lastIndex = days.length - 1;
	const px = (hours: number) => (hours / scale.max) * PLOT_HEIGHT;

	const focusBar = (i: number) => {
		setActive(i);
		showIndex(i);
	};

	const onKeyDown = (event: React.KeyboardEvent) => {
		const current = active ?? lastIndex;
		let next: number | null = null;
		if (event.key === "ArrowLeft") next = current - 1;
		else if (event.key === "ArrowRight") next = current + 1;
		else if (event.key === "Home") next = 0;
		else if (event.key === "End") next = lastIndex;
		if (next === null) return;
		event.preventDefault();
		focusBar(Math.min(Math.max(next, 0), lastIndex));
	};

	const tipDay = anchor ? days[anchor.index] : undefined;
	const activeDay = active !== null ? days[active] : undefined;
	const highlight = anchor?.index ?? active;

	return (
		<div>
			<h3 className="font-heading text-xl font-bold">Last 14 days</h3>
			<p className="mb-4 text-sm text-muted-foreground">
				Hours of active prompting by project. Gaps of more than {idleGapMinutes} minutes between prompts
				are left out, so long agent runs, reviews and calls don&apos;t show here.
			</p>

			<div
				ref={wrapRef}
				className="relative pt-4"
				onPointerMove={onPointerMove}
				onPointerDown={onPointerMove}
				onPointerLeave={(event) => {
					if (event.pointerType !== "mouse") return;
					if (active === null) hide();
					else showIndex(active);
				}}
			>
				<div className="flex">
					<div className="relative w-8 shrink-0" style={{ height: PLOT_HEIGHT }} aria-hidden="true">
						{ticks.map((t) => (
							<span
								key={t}
								className="absolute right-2 translate-y-1/2 text-[10px] tabular-nums text-muted-foreground"
								style={{ bottom: px(t) }}
							>
								{t}h
							</span>
						))}
					</div>
					<div className="relative flex-1" style={{ height: PLOT_HEIGHT }}>
						{ticks.map((t) => (
							<div
								key={t}
								aria-hidden="true"
								className={`absolute inset-x-0 h-px ${t === 0 ? "bg-border" : "bg-border/40"}`}
								style={{ bottom: px(t) }}
							/>
						))}
						<div
							tabIndex={0}
							role="group"
							aria-label="Hours of active prompting per day for the last 14 days"
							aria-describedby={hintId}
							onKeyDown={onKeyDown}
							onFocus={(event) => {
								if (event.currentTarget.matches(":focus-visible")) focusBar(active ?? lastIndex);
							}}
							onBlur={() => {
								setActive(null);
								hide();
							}}
							className="absolute inset-0 flex items-end rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						>
							{days.map((day, i) => {
								const top = day.byBucket.reduce((last, v, b) => (v > 0 ? b : last), -1);
								const bottom = day.byBucket.findIndex((v) => v > 0);
								const present = presenceOf(day);
								return (
									<div
										key={day.date}
										data-mark={i}
										className={`flex h-full flex-1 flex-col items-center justify-end px-[3px] ${
											highlight === i ? "bg-foreground/5" : ""
										}`}
									>
										{i === peakIndex ? (
											<span className="mb-1 text-[10px] font-semibold text-foreground">
												{formatHours(day.hours)}h
											</span>
										) : null}
										<div
											className="relative flex w-full max-w-[26px] items-end justify-center"
											style={{ height: px(Math.max(present, day.hours)) }}
										>
											{present > 0 ? (
												<div
													className="absolute inset-x-0 h-[2px] rounded-full bg-foreground/70"
													style={{ bottom: px(present) - 1 }}
												/>
											) : null}
											<div className="relative flex w-full max-w-[18px] flex-col-reverse gap-[2px]">
												{day.byBucket.map((hours, b) =>
													hours > 0 ? (
														<div
															key={buckets[b] ?? b}
															className={b === top ? "rounded-t-[4px]" : ""}
															style={{
																// The 2px gap above each segment comes out of its own height so the stack total stays true to the axis.
																height: Math.max(1, px(hours) - (b === bottom ? 0 : 2)),
																backgroundColor: bucketColor(buckets[b] ?? "")
															}}
														/>
													) : null
												)}
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>

				<div className="ml-8 mt-1.5 flex" aria-hidden="true">
					{days.map((day) => (
						<div key={day.date} className="flex-1 text-center text-[10px] leading-tight text-muted-foreground">
							<div className="tabular-nums">{Number(day.date.slice(8))}</div>
							<div>{formatWeekdayInitial(day.date)}</div>
						</div>
					))}
				</div>

				{anchor && tipDay ? (
					<ChartTooltip anchor={anchor}>
						<div className="mb-1 font-semibold text-foreground">{formatLongDate(tipDay.date)}</div>
						<DayTimeRows day={tipDay} presenceSince={presenceSince} promptingLabel="active prompting, by project:" />
						{tipDay.byBucket.map((hours, b) =>
							hours > 0 ? (
								<TooltipRow
									key={buckets[b] ?? b}
									color={bucketColor(buckets[b] ?? "")}
									value={`${formatHours(hours)}h`}
									label={buckets[b] ?? ""}
								/>
							) : null
						)}
						<div className="mt-1 border-t border-border/50 pt-1">
							<TooltipRow value={formatInt(tipDay.prompts)} label="prompts" />
							{tipDay.date >= agentTrackingSince ? (
								<>
									<TooltipRow
										value={`${formatHours(tipDay.agentHours)}h`}
										label={`agent time, ${formatInt(tipDay.sessions)} sessions`}
									/>
									<TooltipRow value={formatInt(tipDay.peakAgents)} label="agents at peak" />
									<TooltipRow value={formatInt(tipDay.toolCalls)} label="agent actions" />
								</>
							) : null}
							<TooltipRow value={formatInt(tipDay.contributions)} label="contributions" />
						</div>
					</ChartTooltip>
				) : null}
			</div>

			<p id={hintId} className="sr-only">
				Use the left and right arrow keys to move between days.
			</p>
			<p className="sr-only" aria-live="polite">
				{activeDay
					? `${formatLongDate(activeDay.date)}: ${dayTimeText(activeDay, presenceSince)}. ${activeDay.byBucket
							.map((h, b) => (h > 0 ? `${buckets[b]} ${formatHours(h)}` : ""))
							.filter(Boolean)
							.join(", ")}`
					: ""}
			</p>

			<BucketLegend buckets={buckets} className="mt-4">
				{showPresence ? (
					<li className="inline-flex items-center gap-1.5">
						<span aria-hidden="true" className="inline-block h-[2px] w-3 rounded-full bg-foreground/70" />
						At the computer
					</li>
				) : null}
			</BucketLegend>
		</div>
	);
};

export default RecentDaysChart;
