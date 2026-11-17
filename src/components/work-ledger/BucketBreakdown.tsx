"use client";

import React, { useMemo } from "react";
import { addDays, bucketTotals, formatHours, type LedgerIndex } from "@/lib/work-ledger";
import { IN_FILL_INK, bucketColor } from "./colors";
import { ChartTooltip, TooltipRow, useMarkTooltip } from "./ChartTooltip";

// A part narrower than this cannot hold "12%" with padding at phone width, so
// its share lives in the legend and tooltip instead of being clipped.
const MIN_LABEL_SHARE = 0.12;

function formatShare(share: number): string {
	if (share > 0 && share < 0.005) return "<1%";
	return `${Math.round(share * 100)}%`;
}

interface BucketBreakdownProps {
	index: LedgerIndex;
	end: string;
	buckets: string[];
}

const BucketBreakdown: React.FC<BucketBreakdownProps> = ({ index, end, buckets }) => {
	const totals = useMemo(() => bucketTotals(index, addDays(end, -29), end), [index, end]);
	const total = totals.reduce((sum, v) => sum + v, 0);
	const { wrapRef, anchor, showIndex, onPointerMove, hide } = useMarkTooltip();
	const parts = buckets.map((bucket, i) => ({
		bucket,
		hours: totals[i] ?? 0,
		share: total > 0 ? (totals[i] ?? 0) / total : 0
	}));
	const tip = anchor ? parts[anchor.index] : undefined;

	return (
		<div>
			<h3 className="font-heading text-xl font-bold">Where the hands-on time went</h3>
			<p className="mb-4 text-sm text-muted-foreground">
				{formatHours(total)} hands-on hours over the last 30 days
			</p>

			{total > 0 ? (
				<div
					ref={wrapRef}
					className="relative"
					onPointerMove={onPointerMove}
					onPointerDown={onPointerMove}
					onPointerLeave={(event) => {
						if (event.pointerType === "mouse") hide();
					}}
				>
					<div className="flex h-7 w-full gap-[2px]" role="list" aria-label="Share of hours by project, last 30 days">
						{parts.map((part, i) =>
							part.hours > 0 ? (
								<div
									key={part.bucket}
									role="listitem"
									tabIndex={0}
									data-mark={i}
									aria-label={`${part.bucket}: ${formatHours(part.hours)} hours, ${formatShare(part.share)}`}
									onFocus={() => showIndex(i)}
									onBlur={hide}
									className="flex h-full min-w-[2px] items-center rounded-[4px] pl-2 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
									style={{ flexBasis: `${part.share * 100}%`, backgroundColor: bucketColor(part.bucket), color: IN_FILL_INK }}
								>
									{part.share >= MIN_LABEL_SHARE ? formatShare(part.share) : null}
								</div>
							) : null
						)}
					</div>
					{anchor && tip ? (
						<ChartTooltip anchor={anchor}>
							<TooltipRow
								color={bucketColor(tip.bucket)}
								value={`${formatHours(tip.hours)}h, ${formatShare(tip.share)}`}
								label={tip.bucket}
							/>
						</ChartTooltip>
					) : null}
				</div>
			) : (
				<p className="rounded-lg border border-border/50 px-4 py-3 text-sm text-muted-foreground">
					No hours logged in the last 30 days yet.
				</p>
			)}

			<ul className="mt-5 space-y-2 text-sm">
				{parts.map((part) => (
					<li key={part.bucket} className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-x-3">
						<span
							aria-hidden="true"
							className="inline-block h-2.5 w-2.5 rounded-[2px]"
							style={{ backgroundColor: bucketColor(part.bucket) }}
						/>
						<span className="truncate text-foreground">{part.bucket}</span>
						<span className="text-right tabular-nums text-muted-foreground">{formatHours(part.hours)}h</span>
						<span className="w-10 text-right tabular-nums text-muted-foreground">{formatShare(part.share)}</span>
					</li>
				))}
			</ul>
		</div>
	);
};

export default BucketBreakdown;
