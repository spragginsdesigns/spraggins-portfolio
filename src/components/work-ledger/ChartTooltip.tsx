"use client";

import React, { useCallback, useRef, useState } from "react";
import { formatClockRange, formatHours, hasPresence, type LedgerDay } from "@/lib/work-ledger";

// Marks opt in with a data-mark="<index>" attribute. One tooltip per chart is
// positioned against the wrapper (not the mark's scroll parent) so it is never
// clipped by a horizontally scrolling plot.

export interface TooltipAnchor {
	index: number;
	x: number;
	y: number;
	wrapWidth: number;
}

export function useMarkTooltip() {
	const wrapRef = useRef<HTMLDivElement>(null);
	const [anchor, setAnchor] = useState<TooltipAnchor | null>(null);

	const showFor = useCallback((index: number, el: Element | null) => {
		const wrap = wrapRef.current;
		if (!wrap || !el) return;
		const w = wrap.getBoundingClientRect();
		const r = el.getBoundingClientRect();
		setAnchor({ index, x: r.left + r.width / 2 - w.left, y: r.top - w.top, wrapWidth: w.width });
	}, []);

	const showIndex = useCallback(
		(index: number) => {
			showFor(index, wrapRef.current?.querySelector(`[data-mark="${index}"]`) ?? null);
		},
		[showFor]
	);

	const onPointerMove = useCallback(
		(event: React.PointerEvent) => {
			if (!(event.target instanceof Element)) return;
			const mark = event.target.closest("[data-mark]");
			if (!mark) {
				setAnchor(null);
				return;
			}
			const index = Number(mark.getAttribute("data-mark"));
			if (Number.isInteger(index)) showFor(index, mark);
		},
		[showFor]
	);

	const hide = useCallback(() => setAnchor(null), []);

	return { wrapRef, anchor, showIndex, onPointerMove, hide };
}

const TOOLTIP_WIDTH = 224;

export const ChartTooltip: React.FC<{ anchor: TooltipAnchor; children: React.ReactNode }> = ({
	anchor,
	children
}) => {
	const half = TOOLTIP_WIDTH / 2;
	const left = Math.min(Math.max(anchor.x, half), Math.max(half, anchor.wrapWidth - half));
	return (
		<div
			aria-hidden="true"
			className="pointer-events-none absolute z-20 rounded-lg border border-border/60 bg-background/95 px-3 py-2 text-xs shadow-xl backdrop-blur-sm"
			style={{
				width: TOOLTIP_WIDTH,
				left,
				top: anchor.y,
				transform: "translate(-50%, calc(-100% - 8px))"
			}}
		>
			{children}
		</div>
	);
};

/** One tooltip row: a short line key in the series color, value first, then the name. */
export const TooltipRow: React.FC<{ color?: string; value: string; label: string }> = ({
	color,
	value,
	label
}) => (
	<div className="flex items-center gap-2 leading-5">
		{color ? (
			<span className="h-0.5 w-3 shrink-0 rounded-full" style={{ backgroundColor: color }} />
		) : null}
		<span className="font-semibold text-foreground">{value}</span>
		<span className="truncate text-muted-foreground">{label}</span>
	</div>
);

/**
 * The time lines every day tooltip opens with. The first-to-last span reads as
 * a clock range so it is not mistaken for hours worked.
 */
export const DayTimeRows: React.FC<{
	day: LedgerDay;
	presenceSince: string | null;
	promptingLabel?: string;
}> = ({ day, presenceSince, promptingLabel = "active prompting" }) => {
	const range = formatClockRange(day);
	return (
		<>
			{range ? <div className="leading-5 text-foreground">{range}</div> : null}
			<TooltipRow value={`${formatHours(day.span)}h`} label="first to last prompt" />
			{hasPresence(day.date, presenceSince) ? (
				<TooltipRow value={`${formatHours(day.active)}h`} label="at the computer" />
			) : null}
			<TooltipRow value={`${formatHours(day.hours)}h`} label={promptingLabel} />
		</>
	);
};

/** The same lines as one sentence, for the screen reader announcement. */
export function dayTimeText(day: LedgerDay, presenceSince: string | null): string {
	const range = formatClockRange(day);
	const parts = [
		`${formatHours(day.span)} hours from first to last prompt${range ? `, ${range}` : ""}`,
		...(hasPresence(day.date, presenceSince) ? [`${formatHours(day.active)} hours at the computer`] : []),
		`${formatHours(day.hours)} hours of active prompting`
	];
	return parts.join(", ");
}
