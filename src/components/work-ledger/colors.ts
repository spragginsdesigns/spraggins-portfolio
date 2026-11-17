import type { HeatLevel } from "@/lib/work-ledger";

// Bucket colors, validated with the dataviz palette checker against the
// section's card surface (#161616, dark): every check passes for adjacent
// pairs in this order (worst adjacent CVD dE 13.2, normal-vision dE 19.3).
// Five hues cannot clear every non-adjacent pair, which matters when a zero
// bucket puts orange next to amber, so the 2px gaps, legend and tooltips
// always carry identity alongside color. LineCrush takes the cyan family to
// echo the site's primary.
const BUCKET_COLORS: Record<string, string> = {
	LineCrush: "#1aa7b3",
	"LineCrush Games": "#d95926",
	SureWord: "#9085e9",
	"Client sites": "#c98500",
	"Personal & tooling": "#d55181"
};

// Color follows the bucket name, never its position, so a renamed or extra
// bucket gets a neutral gray instead of borrowing someone else's hue.
const UNKNOWN_BUCKET_COLOR = "#6b6b6b";

export function bucketColor(bucket: string): string {
	return BUCKET_COLORS[bucket] ?? UNKNOWN_BUCKET_COLOR;
}

/** Near-black out-contrasts white on every bucket fill (4.99:1 or better). */
export const IN_FILL_INK = "#0b0b0b";

// Single-hue cyan ramp ending at the site's primary. Validated as an ordinal
// ramp on the dark surface: monotone lightness, the dimmest step clears 2:1.
export const HEAT_RAMP: Record<HeatLevel, string> = {
	0: "rgba(255, 255, 255, 0.06)",
	1: "#11535a",
	2: "#16838c",
	3: "#25b3be",
	4: "#5ce1e6"
};
