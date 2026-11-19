import { track } from "@vercel/analytics/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { runPortfolioAgent, type AgentEvent, type AskTurn } from "@/lib/ask/agent";
import { spendAnswerBudget } from "@/lib/ask/budget";
import { OutputGuard, WITHHELD_ANSWER } from "@/lib/ask/output-guard";
import { checkRateLimit, clientKey } from "@/lib/ask/rate-limit";
import { selectPortfolioEvidence, type PortfolioSource } from "@/lib/portfolio-answers";

// ============================================
// COST AND PRIVACY PROTECTION
// ============================================
// - 8 questions per minute per IP (in memory, bounds bursts)
// - 40 model answers per day per IP and a site-wide daily ceiling
//   (Runtime Cache, shared by every instance; see src/lib/ask/budget.ts).
//   Past the ceiling, visitors get the curated answers with no model call.
// - Questions limited to 500 characters, history to 6 turns
// - Each answer is capped by the agent's round, tool and token limits
// - 55 second ceiling per answer
// - Every streamed answer passes the output guard before it is sent
// ============================================

export const config = { maxDuration: 60 };

const LIMITS = {
	rate: { perMinute: 8, perDay: 40 },
	questionLength: 500,
	historyTurns: 6,
	historyAnswerLength: 1800,
	answerTimeoutMs: 55_000
};

type AnswerEvent =
	| AgentEvent
	| { type: "replace"; text: string }
	| { type: "error"; error: string }
	| { type: "done" };

type Outcome = "answered" | "curated" | "site-ceiling" | "withheld" | "incomplete" | "abandoned";

const ABOUT_SCOPE = "I can answer questions about Austin's public work, skills, and career. Try asking about LineCrush, SureWord, C2, or his path from truck driving to engineering.";
const INCOMPLETE_ANSWER = "The response stopped early. Try the question again, or open the sources below.";
/** Plain-terminal sources are a footer, not a list of everything looked up. */
const PLAIN_TEXT_SOURCES = 2;
const WITHHELD_PLAIN = WITHHELD_ANSWER.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 at $2");

// Local evaluation runs (scripts/ask-evals.mjs) ask more than a visitor may. Never honoured in production.
const evalMode = process.env.NODE_ENV !== "production" && process.env.ASK_EVAL === "1";

function readHistory(value: unknown): AskTurn[] {
	if (!Array.isArray(value)) return [];
	return value.flatMap((turn): AskTurn[] => {
		if (!turn || typeof turn.question !== "string" || typeof turn.answer !== "string") return [];
		const question = turn.question.trim().slice(0, LIMITS.questionLength);
		const answer = turn.answer.trim().slice(0, LIMITS.historyAnswerLength);
		return question && answer ? [{ question, answer }] : [];
	}).slice(-LIMITS.historyTurns);
}

function fallbackSources(question: string, previousQuestion: string): { text: string; sources: PortfolioSource[] } {
	const evidence = selectPortfolioEvidence(question, previousQuestion || undefined);
	const sources = new Map<string, PortfolioSource>();
	evidence.forEach((item) => item.sources.forEach((source) => { if (!sources.has(source.href)) sources.set(source.href, source); }));
	return {
		text: evidence.map((item) => item.answer).join("\n\n") || ABOUT_SCOPE,
		sources: Array.from(sources.values()).slice(0, 3)
	};
}

/**
 * One line per question in the function log, and one Web Analytics event, so
 * weak answers can be found. No IP address or history is recorded.
 */
async function recordAsk(req: NextApiRequest, entry: { question: string; outcome: Outcome; tools: string[]; rounds: number; ms: number; words: number; structured: boolean }) {
	const record = { ...entry, question: entry.question.slice(0, 250), tools: entry.tools.join(",") };
	console.log(`ask-ai: ${JSON.stringify(record)}`);
	if (evalMode) return;
	await track("ask_question", record, { request: req }).catch(() => undefined);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") {
		res.setHeader("Allow", "POST");
		return res.status(405).json({ error: "Method not allowed." });
	}

	const body = req.body;
	const question = typeof body?.question === "string" ? body.question.trim() : "";
	if (!question) {
		return res.status(400).json({ error: "Enter a question about Austin." });
	}
	if (question.length > LIMITS.questionLength) {
		return res.status(400).json({ error: `Keep questions under ${LIMITS.questionLength} characters.` });
	}

	const client = clientKey(req);
	if (!evalMode) {
		const rateCheck = checkRateLimit("ask", client, LIMITS.rate);
		if (!rateCheck.allowed) {
			return res.status(429).json({ error: rateCheck.message });
		}
	}

	const apiKey = process.env.OPENAI_API_KEY;
	const budget = apiKey && !evalMode ? await spendAnswerBudget(client, LIMITS.rate.perDay) : "ok";
	if (budget === "client-limit") {
		return res.status(429).json({ error: "Daily limit reached. Please try again tomorrow." });
	}

	const history = readHistory(body?.history);
	// The command-line shell sends no format and prints the stream as plain text.
	const structured = body?.format === "ndjson";
	res.writeHead(200, {
		"Content-Type": structured ? "application/x-ndjson; charset=utf-8" : "text/plain; charset=utf-8",
		"Cache-Control": "no-store, no-transform",
		"X-Accel-Buffering": "no"
	});

	const started = Date.now();
	let sources: PortfolioSource[] = [];
	let sentText = "";
	let rounds = 0;
	const toolNames: string[] = [];
	const write = (event: AnswerEvent) => {
		if (res.destroyed) return;
		if (event.type === "sources") sources = event.sources;
		if (event.type === "delta") sentText += event.text;
		if (structured) res.write(`${JSON.stringify(event)}\n`);
		else if (event.type === "delta") res.write(event.text);
	};
	// Terms the visitor typed, here or in the turns their browser sent back, are theirs to see repeated.
	const guard = new OutputGuard([question, ...history.flatMap((turn) => [turn.question, turn.answer])].join("\n"));
	const release = (text: string) => { if (text) write({ type: "delta", text }); };

	const disconnected = new AbortController();
	const onClose = () => disconnected.abort();
	res.once("close", onClose);
	let failed = false;

	try {
		if (apiKey && budget === "ok") {
			const signal = AbortSignal.any([disconnected.signal, AbortSignal.timeout(LIMITS.answerTimeoutMs)]);
			for await (const event of runPortfolioAgent({ apiKey, question, history, plainText: !structured, signal })) {
				if (event.type === "delta") {
					release(guard.push(event.text));
					// Leaving the loop closes the agent and its upstream request.
					if (guard.tripped) break;
					continue;
				}
				if (event.type === "tool_start") toolNames.push(event.name);
				if (event.type === "usage") rounds = event.rounds;
				// The answer is complete once its sources arrive: send the held-back tail first.
				if (event.type === "sources") release(guard.flush());
				write(event);
			}
		}
	} catch (error) {
		failed = !disconnected.signal.aborted;
		// Visitors get the curated fallback; the cause belongs in the function log.
		if (failed) console.error("ask-ai: agent failed:", error instanceof Error ? error.message : error);
	} finally {
		res.off("close", onClose);
	}

	const finish = (outcome: Outcome) => recordAsk(req, {
		question,
		outcome,
		tools: toolNames,
		rounds,
		ms: Date.now() - started,
		words: sentText.trim() ? sentText.trim().split(/\s+/).length : 0,
		structured
	});

	if (res.destroyed) return finish("abandoned");
	if (guard.tripped) {
		console.error(`ask-ai: answer withheld, the output guard matched "${guard.tripped}"`);
		if (structured) {
			write({ type: "replace", text: WITHHELD_ANSWER });
			write({ type: "sources", sources: [] });
		} else {
			write({ type: "delta", text: `${sentText ? "\n\n" : ""}${WITHHELD_PLAIN}` });
		}
		write({ type: "done" });
		res.end();
		return finish("withheld");
	}

	release(guard.flush());
	const sentAnswer = Boolean(sentText.trim());
	let outcome: Outcome = "answered";
	if (failed && sentAnswer) {
		outcome = "incomplete";
		if (structured) {
			write({ type: "error", error: INCOMPLETE_ANSWER });
			res.end();
			return finish(outcome);
		}
		write({ type: "delta", text: `\n\n${INCOMPLETE_ANSWER}` });
	}
	if (!sentAnswer) {
		// No key, the daily ceiling, or the model failed before writing: answer from the curated facts.
		outcome = budget === "site-ceiling" ? "site-ceiling" : "curated";
		const fallback = fallbackSources(question, history[history.length - 1]?.question ?? "");
		write({ type: "delta", text: fallback.text });
		write({ type: "sources", sources: fallback.sources });
	}
	if (!structured && sources.length) {
		write({ type: "delta", text: `\n\n${sources.slice(0, PLAIN_TEXT_SOURCES).map(({ label, href }) => `${label}: ${href}`).join("\n")}` });
	}
	write({ type: "done" });
	res.end();
	return finish(outcome);
}
