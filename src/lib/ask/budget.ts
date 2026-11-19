import { createHash } from "crypto";
import { getCache } from "@vercel/functions";

// Daily answer budget for the portfolio agent, counted in Vercel's Runtime
// Cache so it is shared by every function instance and survives deploys.
// The in-memory limiter in rate-limit.ts still handles per-minute bursts.
//
// Known limits, accepted for a personal site: the cache is per region, the
// read-then-write is not atomic (a burst can overshoot by a few answers), and
// an entry can be evicted early. Each of those errs towards answering, and
// the per-answer round, tool and token caps still bound the cost of one.

const TTL_SECONDS = 26 * 60 * 60;
const CACHE_TIMEOUT_MS = 800;
const DEFAULT_SITE_CEILING = 300;

export type BudgetVerdict = "ok" | "client-limit" | "site-ceiling";

function pacificDay(): string {
	return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Los_Angeles" }).format(new Date());
}

function siteCeiling(): number {
	const configured = Number(process.env.ASK_DAILY_ANSWER_CEILING);
	return Number.isFinite(configured) && configured > 0 ? Math.floor(configured) : DEFAULT_SITE_CEILING;
}

function count(value: unknown): number {
	return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function withTimeout<T>(work: Promise<T>): Promise<T> {
	return Promise.race([
		work,
		new Promise<never>((_, reject) => { setTimeout(() => reject(new Error("Runtime cache timed out")), CACHE_TIMEOUT_MS); })
	]);
}

/**
 * Counts one model answer against the visitor's daily allowance and the
 * site-wide daily ceiling. When the cache is unreachable the answer is
 * allowed, and the cause is logged.
 */
export async function spendAnswerBudget(client: string, perClientPerDay: number): Promise<BudgetVerdict> {
	const day = pacificDay();
	// The address is hashed with the day, so no raw IP is stored and keys cannot be joined across days.
	const clientKey = `ask:client:${day}:${createHash("sha256").update(`${day}:${client}`).digest("hex").slice(0, 24)}`;
	const siteKey = `ask:site:${day}`;
	try {
		const cache = getCache({ namespace: "portfolio-agent" });
		const [clientCount, siteCount] = await withTimeout(Promise.all([cache.get(clientKey), cache.get(siteKey)]));
		if (count(clientCount) >= perClientPerDay) return "client-limit";
		if (count(siteCount) >= siteCeiling()) return "site-ceiling";
		await withTimeout(Promise.all([
			cache.set(clientKey, count(clientCount) + 1, { ttl: TTL_SECONDS, name: "ask-client-daily" }),
			cache.set(siteKey, count(siteCount) + 1, { ttl: TTL_SECONDS, name: "ask-site-daily" })
		]));
		return "ok";
	} catch (error) {
		console.error("ask-ai: answer budget unavailable:", error instanceof Error ? error.message : error);
		return "ok";
	}
}
