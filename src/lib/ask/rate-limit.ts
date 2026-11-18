import type { NextApiRequest } from "next";

// In-memory limiter shared by the ask agent and the public tool endpoint.
// It resets when a function instance is recycled, so it bounds bursts and
// casual abuse; the hard spend cap is the per-answer token and round limit.

interface Entry {
	count: number;
	resetTime: number;
	dailyCount: number;
	dailyResetTime: number;
}

export interface RateLimit {
	perMinute: number;
	perDay: number;
}

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;
const stores = new Map<string, Map<string, Entry>>();
let checks = 0;

export function clientKey(req: NextApiRequest): string {
	const forwarded = req.headers["x-forwarded-for"];
	return typeof forwarded === "string"
		? forwarded.split(",")[0].trim()
		: req.socket.remoteAddress || "unknown";
}

function sweep(now: number) {
	stores.forEach((store) => {
		const expired: string[] = [];
		store.forEach((entry, key) => {
			if (now > entry.dailyResetTime) expired.push(key);
		});
		expired.forEach((key) => store.delete(key));
	});
}

/** Each scope ("ask", "tools") keeps its own counters for the same client. */
export function checkRateLimit(scope: string, key: string, limit: RateLimit): { allowed: boolean; message?: string } {
	const now = Date.now();
	if (++checks % 100 === 0) sweep(now);

	let store = stores.get(scope);
	if (!store) {
		store = new Map();
		stores.set(scope, store);
	}

	const entry = store.get(key);
	if (!entry) {
		store.set(key, { count: 1, resetTime: now + MINUTE, dailyCount: 1, dailyResetTime: now + DAY });
		return { allowed: true };
	}
	if (now > entry.resetTime) {
		entry.count = 0;
		entry.resetTime = now + MINUTE;
	}
	if (now > entry.dailyResetTime) {
		entry.dailyCount = 0;
		entry.dailyResetTime = now + DAY;
	}
	if (entry.dailyCount >= limit.perDay) {
		return { allowed: false, message: "Daily limit reached. Please try again tomorrow." };
	}
	if (entry.count >= limit.perMinute) {
		return { allowed: false, message: "Too many requests. Please wait a minute before asking again." };
	}
	entry.count++;
	entry.dailyCount++;
	return { allowed: true };
}
