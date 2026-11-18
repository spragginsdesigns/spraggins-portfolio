// Types, validation and pure summary math for the Daily Work Log section.
// Client-safe: no fs/path imports. Every date is a "YYYY-MM-DD" ledger day
// handled as a UTC day number, so the server render and the browser hydrate
// to the same output no matter where the viewer is.

export const WORK_LEDGER_URL =
	"https://gist.githubusercontent.com/spragginsdesigns/e4709d289528944751ea9d4b29c3fcd9/raw/work-ledger.json";

/**
 * One ledger day as published. span, peakAgents and toolCalls arrived after
 * the first snapshots, so they are optional and read as 0 when absent.
 */
export interface WorkLedgerDay {
	date: string;
	/** Hands-on hours: time between prompts, idle gaps over idleGapMinutes dropped. */
	hours: number;
	/** First prompt to last prompt, breaks included. */
	span?: number;
	/** Hours with keyboard or mouse input on any machine, games left out. */
	active?: number;
	byBucket: number[];
	prompts: number;
	agentHours: number;
	sessions: number;
	/** Most agent sessions running at the same moment. */
	peakAgents?: number;
	/** Tool actions (edits, commands, searches) the agents executed. */
	toolCalls?: number;
	contributions: number;
}

export interface WorkLedger {
	version: 1;
	generatedAt: string;
	timezone: string;
	dayStartHour: number;
	idleGapMinutes: number;
	agentTrackingSince: string;
	claudeAgentTrackingSince?: string;
	/** First day the at-the-computer tracker ran. That day is partial, so it is never shown. */
	presenceSince?: string | null;
	machines?: number;
	buckets: string[];
	days: WorkLedgerDay[];
}

/** A day with every optional field filled in, which is what the helpers work on. */
export type LedgerDay = Required<WorkLedgerDay>;

export function normalizeDay(day: WorkLedgerDay): LedgerDay {
	return {
		...day,
		span: day.span ?? 0,
		active: day.active ?? 0,
		peakAgents: day.peakAgents ?? 0,
		toolCalls: day.toolCalls ?? 0
	};
}

// ---------------------------------------------------------------------------
// Date math on ledger day strings
// ---------------------------------------------------------------------------

const MS_PER_DAY = 86_400_000;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function toDayNumber(date: string): number {
	const [y, m, d] = date.split("-").map(Number);
	return Math.round(Date.UTC(y, m - 1, d) / MS_PER_DAY);
}

export function fromDayNumber(dayNumber: number): string {
	return new Date(dayNumber * MS_PER_DAY).toISOString().slice(0, 10);
}

export function addDays(date: string, days: number): string {
	return fromDayNumber(toDayNumber(date) + days);
}

/** 0 = Sunday through 6 = Saturday. Day 0 (1970-01-01) was a Thursday. */
export function weekday(date: string): number {
	return (((toDayNumber(date) + 4) % 7) + 7) % 7;
}

/** True only for real calendar dates, so "2026-02-30" is rejected. */
export function isIsoDate(value: unknown): value is string {
	return (
		typeof value === "string" &&
		DATE_RE.test(value) &&
		fromDayNumber(toDayNumber(value)) === value
	);
}

/**
 * The ledger day an instant belongs to. A ledger day starts at dayStartHour
 * local time. Read the local clock before applying the cutoff so daylight
 * saving transitions still use the same wall-clock hour.
 */
export function ledgerDayOf(
	isoTimestamp: string,
	timeZone: string,
	dayStartHour: number
): string | null {
	const ms = Date.parse(isoTimestamp);
	if (Number.isNaN(ms)) return null;
	try {
		const parts = new Intl.DateTimeFormat("en-CA", {
			timeZone,
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			hourCycle: "h23"
		}).formatToParts(new Date(ms));
		const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
		const date = `${get("year")}-${get("month")}-${get("day")}`;
		if (!isIsoDate(date)) return null;
		return Number(get("hour")) < dayStartHour ? addDays(date, -1) : date;
	} catch {
		return null;
	}
}

// ---------------------------------------------------------------------------
// Runtime validation
// ---------------------------------------------------------------------------

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonNegative(value: unknown): value is number {
	return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isOptionalNonNegative(value: unknown): value is number | undefined {
	return value === undefined || isNonNegative(value);
}

function isCount(value: unknown): value is number {
	return isNonNegative(value) && Number.isSafeInteger(value);
}

function isWorkLedgerDay(value: unknown, bucketCount: number): value is WorkLedgerDay {
	if (!isRecord(value)) return false;
	const { byBucket } = value;
	return (
		isIsoDate(value.date) &&
		isNonNegative(value.hours) &&
		value.hours <= 25 &&
		isOptionalNonNegative(value.span) &&
		(value.span ?? 0) <= 25 &&
		isOptionalNonNegative(value.active) &&
		(value.active ?? 0) <= 25 &&
		(value.peakAgents === undefined || isCount(value.peakAgents)) &&
		(value.toolCalls === undefined || isCount(value.toolCalls)) &&
		Array.isArray(byBucket) &&
		byBucket.length === bucketCount &&
		byBucket.every((hours) => isNonNegative(hours) && hours <= 25) &&
		isCount(value.prompts) &&
		isNonNegative(value.agentHours) &&
		isCount(value.sessions) &&
		isCount(value.contributions)
	);
}

export function isWorkLedger(value: unknown): value is WorkLedger {
	if (!isRecord(value)) return false;
	const { buckets, days, dayStartHour } = value;
	if (value.version !== 1) return false;
	if (typeof value.generatedAt !== "string" || Number.isNaN(Date.parse(value.generatedAt))) {
		return false;
	}
	if (value.timezone !== "America/Los_Angeles") return false;
	if (
		typeof dayStartHour !== "number" ||
		!Number.isInteger(dayStartHour) ||
		dayStartHour < 0 ||
		dayStartHour > 23
	) {
		return false;
	}
	if (!isNonNegative(value.idleGapMinutes)) return false;
	if (!isIsoDate(value.agentTrackingSince) || value.agentTrackingSince < "2024-01-01") return false;
	if (value.claudeAgentTrackingSince !== undefined && !isIsoDate(value.claudeAgentTrackingSince)) return false;
	if (value.presenceSince !== undefined && value.presenceSince !== null && !isIsoDate(value.presenceSince)) {
		return false;
	}
	if (!isOptionalNonNegative(value.machines)) return false;
	if (
		!Array.isArray(buckets) ||
		buckets.length === 0 ||
		!buckets.every((b): b is string => typeof b === "string")
	) {
		return false;
	}
	if (!Array.isArray(days) || days.length === 0 || days.length > 401) return false;
	const currentDay = ledgerDayOf(value.generatedAt, value.timezone, dayStartHour);
	if (!currentDay) return false;
	const firstAllowed = addDays(currentDay, -400);
	const lastAllowed = addDays(currentDay, 1);
	if (value.agentTrackingSince > lastAllowed) return false;
	const dates = new Set<string>();
	for (const day of days) {
		if (!isWorkLedgerDay(day, buckets.length) || day.date < firstAllowed || day.date > lastAllowed || dates.has(day.date)) {
			return false;
		}
		dates.add(day.date);
	}
	return true;
}

/** Newer wins; an unparsable candidate never replaces what we have. */
export function isNewerLedger(candidate: WorkLedger, current: WorkLedger): boolean {
	const latest = (ledger: WorkLedger) => ledger.days.reduce((date, day) => day.date > date ? day.date : date, "");
	return Date.parse(candidate.generatedAt) > Date.parse(current.generatedAt) && latest(candidate) >= latest(current);
}

// ---------------------------------------------------------------------------
// Indexing and windows
// ---------------------------------------------------------------------------

export interface LedgerIndex {
	byDate: Map<string, LedgerDay>;
	bucketCount: number;
	/** The last date present in the data; it stands in for "today". */
	latest: string | null;
	/** The earliest date present in the data. */
	earliest: string | null;
	/** The earliest date with a prompt; prompt history starts later than contributions. */
	earliestWorked: string | null;
}

export function indexLedger(ledger: WorkLedger): LedgerIndex {
	const byDate = new Map<string, LedgerDay>();
	let latest: string | null = null;
	let earliest: string | null = null;
	let earliestWorked: string | null = null;
	for (const raw of ledger.days) {
		const day = normalizeDay(raw);
		byDate.set(day.date, day);
		if (latest === null || day.date > latest) latest = day.date;
		if (earliest === null || day.date < earliest) earliest = day.date;
		if (day.prompts > 0 && (earliestWorked === null || day.date < earliestWorked)) {
			earliestWorked = day.date;
		}
	}
	return { byDate, bucketCount: ledger.buckets.length, latest, earliest, earliestWorked };
}

/** A missing date in the ledger means a zero day, per the data contract. */
export function dayOrZero(index: LedgerIndex, date: string): LedgerDay {
	return (
		index.byDate.get(date) ?? {
			date,
			hours: 0,
			span: 0,
			active: 0,
			byBucket: new Array<number>(index.bucketCount).fill(0),
			prompts: 0,
			agentHours: 0,
			sessions: 0,
			peakAgents: 0,
			toolCalls: 0,
			contributions: 0
		}
	);
}

/** Every date from start to end inclusive, oldest first. Empty when start > end. */
export function dateRange(start: string, end: string): string[] {
	const out: string[] = [];
	const last = toDayNumber(end);
	for (let n = toDayNumber(start); n <= last; n++) out.push(fromDayNumber(n));
	return out;
}

/** The `length` days ending on `end` inclusive, zero-filled, oldest first. */
export function recentDays(index: LedgerIndex, end: string, length: number): LedgerDay[] {
	return dateRange(addDays(end, -(length - 1)), end).map((date) => dayOrZero(index, date));
}

export type DayMetric =
	| "hours"
	| "span"
	| "active"
	| "prompts"
	| "agentHours"
	| "sessions"
	| "peakAgents"
	| "toolCalls"
	| "contributions";

/** Days in start..end inclusive that satisfy the predicate; missing dates count as zero days. */
export function countDays(
	index: LedgerIndex,
	start: string,
	end: string,
	predicate: (day: LedgerDay) => boolean
): number {
	return dateRange(start, end).filter((date) => predicate(dayOrZero(index, date))).length;
}

export function sumMetric(
	index: LedgerIndex,
	start: string,
	end: string,
	metric: DayMetric
): number {
	let total = 0;
	for (const date of dateRange(start, end)) {
		const day = index.byDate.get(date);
		if (day) total += day[metric];
	}
	return total;
}

/** Per-bucket hours over start..end inclusive, index-aligned with ledger.buckets. */
export function bucketTotals(index: LedgerIndex, start: string, end: string): number[] {
	const totals = new Array<number>(index.bucketCount).fill(0);
	for (const date of dateRange(start, end)) {
		const day = index.byDate.get(date);
		if (!day) continue;
		day.byBucket.forEach((hours, i) => {
			totals[i] += hours;
		});
	}
	return totals;
}

// ---------------------------------------------------------------------------
// Headline summary
// ---------------------------------------------------------------------------

/** A day counts as worked when at least one prompt was sent. */
export const isWorked = (day: LedgerDay): boolean => day.prompts > 0;

/** The bar the "10+ hour days" tile counts against, on the workday span. */
export const LONG_DAY_HOURS = 10;

export interface WorkLedgerSummary {
	latestDate: string;
	/** True when the latest date is the ledger day still in progress at generatedAt. */
	latestIsCurrent: boolean;
	latestHours: number;
	/** Workday length of the latest day: first prompt to last prompt so far. */
	latestSpan: number;
	/** At-the-computer hours of the latest day, or null until the tracker has a full day behind it. */
	latestActive: number | null;
	/** Last day of the full-day windows: the day before today when today is still in progress. */
	fullDayEnd: string;
	avg7: number;
	/** Mean workday span and hands-on hours over the days worked in the last 30 full days. */
	workday: { avgSpan: number; avgHandsOn: number; days: number };
	/** Length of the 90-day window the prompt history actually covers (90 once history is long enough). */
	window90: number;
	tenHourDays: number;
	daysWorked: number;
	total30: number;
	longest: { date: string; hours: number } | null;
	/** Consecutive days worked, ending today (or yesterday when today has no prompts yet). */
	streak: number;
	prompts30: number;
	agentHours: number;
	agentSessions: number;
	toolCalls: number;
	peakAgents: { count: number; date: string } | null;
	agentWindowStart: string;
	/** True when the agent window was clipped to agentTrackingSince. */
	agentWindowClipped: boolean;
	/** False when tracking starts after the latest day in the data. */
	agentTracked: boolean;
	contributions365: number;
}

export function summarize(ledger: WorkLedger, index: LedgerIndex = indexLedger(ledger), now: number | null = null): WorkLedgerSummary | null {
	const latest = index.latest;
	if (latest === null) return null;

	const currentDay = ledgerDayOf(now === null ? ledger.generatedAt : new Date(now).toISOString(), ledger.timezone, ledger.dayStartHour);
	const latestIsCurrent = currentDay === latest;
	const today = dayOrZero(index, latest);
	const latestHours = today.hours;
	const presenceSince = ledger.presenceSince ?? null;
	const latestActive = presenceSince !== null && latest > presenceSince ? today.active : null;

	// A day still in progress would drag averages down, so averages use full days only.
	const fullDayEnd = latestIsCurrent ? addDays(latest, -1) : latest;
	const avg7 = sumMetric(index, addDays(fullDayEnd, -6), fullDayEnd, "hours") / 7;

	// Average workday is over days actually worked; days off are not short workdays.
	let spanTotal = 0;
	let handsOnTotal = 0;
	let workdays = 0;
	for (const date of dateRange(addDays(fullDayEnd, -29), fullDayEnd)) {
		const day = dayOrZero(index, date);
		if (!isWorked(day) || day.span <= 0) continue;
		spanTotal += day.span;
		handsOnTotal += day.hours;
		workdays++;
	}
	const workday = {
		avgSpan: workdays > 0 ? spanTotal / workdays : 0,
		avgHandsOn: workdays > 0 ? handsOnTotal / workdays : 0,
		days: workdays
	};

	// "N of 90" must not count days before prompt history began as days off.
	const start90 = addDays(latest, -89);
	const windowStart90 =
		index.earliestWorked !== null && index.earliestWorked > start90 ? index.earliestWorked : start90;
	const window90 = toDayNumber(latest) - toDayNumber(windowStart90) + 1;
	const tenHourDays = countDays(index, windowStart90, latest, (d) => d.span >= LONG_DAY_HOURS);
	const daysWorked = countDays(index, windowStart90, latest, isWorked);

	const start30 = addDays(latest, -29);
	const total30 = sumMetric(index, start30, latest, "hours");
	const prompts30 = sumMetric(index, start30, latest, "prompts");

	let longest: WorkLedgerSummary["longest"] = null;
	for (const day of Array.from(index.byDate.values())) {
		if (day.hours <= 0) continue;
		if (
			longest === null ||
			day.hours > longest.hours ||
			(day.hours === longest.hours && day.date > longest.date)
		) {
			longest = { date: day.date, hours: day.hours };
		}
	}

	// Today with no prompts yet has not broken the streak; it just has not started.
	let cursor = latestIsCurrent && !isWorked(today) ? addDays(latest, -1) : latest;
	let streak = 0;
	while (isWorked(dayOrZero(index, cursor))) {
		streak++;
		cursor = addDays(cursor, -1);
	}

	// Agent data before agentTrackingSince was never recorded, so it is not zero, it is unknown.
	const agentWindowClipped = ledger.agentTrackingSince > start30;
	const agentWindowStart = agentWindowClipped ? ledger.agentTrackingSince : start30;
	const agentTracked = ledger.agentTrackingSince <= latest;
	const agentHours = agentTracked ? sumMetric(index, agentWindowStart, latest, "agentHours") : 0;
	const agentSessions = agentTracked ? sumMetric(index, agentWindowStart, latest, "sessions") : 0;
	const toolCalls = agentTracked ? sumMetric(index, agentWindowStart, latest, "toolCalls") : 0;

	let peakAgents: WorkLedgerSummary["peakAgents"] = null;
	if (agentTracked) {
		for (const date of dateRange(ledger.agentTrackingSince, latest)) {
			const count = dayOrZero(index, date).peakAgents;
			if (count > 0 && (peakAgents === null || count >= peakAgents.count)) peakAgents = { count, date };
		}
	}

	const contributions365 = sumMetric(index, addDays(latest, -364), latest, "contributions");

	return {
		latestDate: latest,
		latestIsCurrent,
		latestHours,
		latestSpan: today.span,
		latestActive,
		fullDayEnd,
		avg7,
		workday,
		window90,
		tenHourDays,
		daysWorked,
		total30,
		longest,
		streak,
		prompts30,
		agentHours,
		agentSessions,
		toolCalls,
		peakAgents,
		agentWindowStart,
		agentWindowClipped,
		agentTracked,
		contributions365
	};
}

// ---------------------------------------------------------------------------
// Year heatmap
// ---------------------------------------------------------------------------

export type HeatMetric = "span" | "hours" | "contributions";

export interface HeatCell {
	date: string;
	/** Days after the latest ledger day; drawn as nothing. */
	future: boolean;
	day: LedgerDay;
}

export interface HeatmapGrid {
	/** Columns of 7 cells, Sunday first, oldest week first. */
	weeks: HeatCell[][];
	/** Month labels anchored to the week column holding that month's 1st. */
	months: { week: number; label: string }[];
	start: string;
	end: string;
}

export function buildHeatmap(index: LedgerIndex, end: string, weekCount = 53): HeatmapGrid {
	const lastWeekStart = addDays(end, -weekday(end));
	const start = addDays(lastWeekStart, -7 * (weekCount - 1));
	const endNumber = toDayNumber(end);
	const weeks: HeatCell[][] = [];
	const months: HeatmapGrid["months"] = [];

	for (let w = 0; w < weekCount; w++) {
		const column: HeatCell[] = [];
		for (let d = 0; d < 7; d++) {
			const date = addDays(start, w * 7 + d);
			column.push({ date, future: toDayNumber(date) > endNumber, day: dayOrZero(index, date) });
			if (date.endsWith("-01") && toDayNumber(date) <= endNumber) {
				months.push({ week: w, label: formatMonth(date) });
			}
		}
		weeks.push(column);
	}

	// The first column is usually mid-month; label it only if the next label is far enough away not to collide.
	const firstMonthWeek = months[0]?.week ?? weekCount;
	if (firstMonthWeek >= 3) months.unshift({ week: 0, label: formatMonth(start) });

	return { weeks, months, start, end };
}

// Hour bins are fixed so a given shade always means the same amount of time.
// The workday bins put the 10-hour line at a shade boundary, matching the
// "10+ hour days" tile; hands-on bins sit lower because hands-on runs ~3h/day.
export const SPAN_THRESHOLDS: readonly [number, number, number] = [4, 8, 12];
export const HOURS_THRESHOLDS: readonly [number, number, number] = [2, 4, 6];

/**
 * Contribution bins follow the quartiles of the non-zero days in view, like
 * GitHub's own graph, because volume swings too much for fixed bins.
 */
export function contributionThresholds(values: number[]): [number, number, number] {
	const nonZero = values.filter((v) => v > 0).sort((a, b) => a - b);
	if (nonZero.length === 0) return [5, 15, 30];
	const q = (p: number) => nonZero[Math.min(nonZero.length - 1, Math.floor(p * nonZero.length))];
	const t1 = Math.max(2, Math.ceil(q(0.25)));
	const t2 = Math.max(t1 + 1, Math.ceil(q(0.5)));
	const t3 = Math.max(t2 + 1, Math.ceil(q(0.75)));
	return [t1, t2, t3];
}

export type HeatLevel = 0 | 1 | 2 | 3 | 4;

export function heatLevel(value: number, thresholds: readonly [number, number, number]): HeatLevel {
	if (value <= 0) return 0;
	if (value < thresholds[0]) return 1;
	if (value < thresholds[1]) return 2;
	if (value < thresholds[2]) return 3;
	return 4;
}

// ---------------------------------------------------------------------------
// Formatting (fixed locale and UTC so server and client agree)
// ---------------------------------------------------------------------------

const intFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const oneDecimal = new Intl.NumberFormat("en-US", {
	minimumFractionDigits: 1,
	maximumFractionDigits: 1
});

export function formatInt(value: number): string {
	return intFormat.format(Math.round(value));
}

/** One decimal under 100 hours, whole hours above, where a decimal is noise. */
export function formatHours(value: number): string {
	if (value === 0) return "0";
	return value >= 100 ? intFormat.format(Math.round(value)) : oneDecimal.format(value);
}

function formatUtc(date: string, options: Intl.DateTimeFormatOptions): string {
	return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", { ...options, timeZone: "UTC" });
}

export function formatMonth(date: string): string {
	return formatUtc(date, { month: "short" });
}

export function formatShortDate(date: string): string {
	return formatUtc(date, { month: "short", day: "numeric" });
}

export function formatLongDate(date: string): string {
	return formatUtc(date, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

export function formatWeekdayInitial(date: string): string {
	return formatUtc(date, { weekday: "narrow" });
}

/** Absolute "Nov 17, 11:20 AM PST" in the ledger's own time zone. */
export function formatUpdatedAt(isoTimestamp: string, timeZone: string): string {
	const ms = Date.parse(isoTimestamp);
	if (Number.isNaN(ms)) return "";
	const options: Intl.DateTimeFormatOptions = {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
		timeZoneName: "short"
	};
	try {
		return new Date(ms).toLocaleString("en-US", { ...options, timeZone });
	} catch {
		return new Date(ms).toLocaleString("en-US", { ...options, timeZone: "UTC" });
	}
}

/** "5 minutes ago" style text. Only call after mount, since it reads the clock. */
export function formatRelative(isoTimestamp: string, nowMs: number): string {
	const ms = Date.parse(isoTimestamp);
	if (Number.isNaN(ms)) return "";
	const minutes = Math.max(0, Math.round((nowMs - ms) / 60_000));
	if (minutes < 1) return "just now";
	if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
	const hours = Math.round(minutes / 60);
	if (hours < 48) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
	const days = Math.round(hours / 24);
	return `${days} days ago`;
}

/**
 * A clean axis maximum and step for the given data maximum. Steps of 4 are
 * allowed because hour axes read naturally as 0, 4, 8, 12.
 */
export function niceScale(max: number, targetTicks = 4): { max: number; step: number } {
	if (max <= 0) return { max: 4, step: 1 };
	const rough = max / targetTicks;
	const magnitude = Math.pow(10, Math.floor(Math.log10(rough)));
	const step =
		[1, 2, 4, 5, 10].map((m) => m * magnitude).find((s) => s >= rough) ?? 10 * magnitude;
	return { max: Math.ceil(max / step) * step, step };
}
