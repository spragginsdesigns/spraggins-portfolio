"use client";

import React, { useId, useMemo, useState } from "react";
import {
	formatHours,
	formatInt,
	formatLongDate,
	formatWeekdayInitial,
	niceScale,
	recentDays,
	type LedgerIndex
} from "@/lib/work-ledger";
import { bucketColor } from "./colors";
import { ChartTooltip, TooltipRow, useMarkTooltip } from "./ChartTooltip";
import BucketLegend from "./BucketLegend";

const PLOT_HEIGHT = 176;
const DAYS = 14;

interface RecentDaysChartProps {
	index: LedgerIndex;
	end: string;
	buckets: string[];
	agentTrackingSince: string;
}

const RecentDaysChart: React.FC<RecentDaysChartProps> = ({ index, end, buckets, agentTrackingSince }) => {
	const days = useMemo(() => recentDays(index, end, DAYS), [index, end]);
	const [active, setActive] = useState<number | null>(null);
	const { wrapRef, anchor, showIndex, onPointerMove, hide } = useMarkTooltip();
	const hintId = useId();

	// One axis for both measures: hands-on hours always sit inside the workday span.
	const maxValue = days.reduce((m, d) => Math.max(m, d.hours, d.span), 0);
	const scale = niceScale(maxValue);
	const ticks: number[] = [];
	for (let t = 0; t <= scale.max + 1e-9; t += scale.step) ticks.push(Number(t.toFixed(4)));
	const maxSpan = days.reduce((m, d) => Math.max(m, d.span), 0);
	// Label sparingly: only the longest workday in view.
	const peakIndex = maxSpan > 0 ? days.findIndex((d) => d.span === maxSpan) : -1;
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
				Hands-on hours by project, inside each day&apos;s workday
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
							aria-label="Hours per day for the last 14 days"
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
												{formatHours(day.span)}h
											</span>
										) : null}
										<div
											className="relative flex w-full max-w-[26px] items-end justify-center"
											style={{ height: px(Math.max(day.span, day.hours)) }}
										>
											{day.span > 0 ? (
												<div
													className="absolute inset-x-0 bottom-0 rounded-t-[5px] border border-b-0 border-foreground/35 bg-foreground/[0.04]"
													style={{ height: px(day.span) }}
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
						<TooltipRow value={`${formatHours(tipDay.span)}h`} label="workday" />
						<TooltipRow value={`${formatHours(tipDay.hours)}h`} label="hands-on, by project:" />
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
					? `${formatLongDate(activeDay.date)}: ${formatHours(activeDay.span)} hour workday, ${formatHours(activeDay.hours)} hours hands-on. ${activeDay.byBucket
							.map((h, b) => (h > 0 ? `${buckets[b]} ${formatHours(h)}` : ""))
							.filter(Boolean)
							.join(", ")}`
					: ""}
			</p>

			<BucketLegend buckets={buckets} className="mt-4">
				<li className="inline-flex items-center gap-1.5">
					<span
						aria-hidden="true"
						className="inline-block h-3 w-2.5 rounded-t-[3px] border border-b-0 border-foreground/50 bg-foreground/[0.04]"
					/>
					Workday, first to last prompt
				</li>
			</BucketLegend>
		</div>
	);
};

export default RecentDaysChart;
