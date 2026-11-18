import type { NextApiRequest, NextApiResponse } from "next";
import { runPortfolioAgent, type AgentEvent, type AskTurn } from "@/lib/ask/agent";
import { checkRateLimit, clientKey } from "@/lib/ask/rate-limit";
import { selectPortfolioEvidence, type PortfolioSource } from "@/lib/portfolio-answers";

// ============================================
// COST PROTECTION
// ============================================
// - 8 questions per minute and 40 per day per IP
// - Questions limited to 500 characters, history to 6 turns
// - Each answer is capped by the agent's round, tool and token limits
// - 55 second ceiling per answer
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
	| { type: "error"; error: string }
	| { type: "done" };

const ABOUT_SCOPE = "I can answer questions about Austin's public work, skills, and career. Try asking about LineCrush, SureWord, C2, or his path from truck driving to engineering.";
const INCOMPLETE_ANSWER = "The response stopped early. Try the question again, or open the sources below.";

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
		sources: Array.from(sources.values()).slice(0, 5)
	};
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

	const rateCheck = checkRateLimit("ask", clientKey(req), LIMITS.rate);
	if (!rateCheck.allowed) {
		return res.status(429).json({ error: rateCheck.message });
	}

	const history = readHistory(body?.history);
	// The command-line shell sends no format and prints the stream as plain text.
	const structured = body?.format === "ndjson";
	res.writeHead(200, {
		"Content-Type": structured ? "application/x-ndjson; charset=utf-8" : "text/plain; charset=utf-8",
		"Cache-Control": "no-store, no-transform",
		"X-Accel-Buffering": "no"
	});

	let sources: PortfolioSource[] = [];
	const write = (event: AnswerEvent) => {
		if (res.destroyed) return;
		if (event.type === "sources") sources = event.sources;
		if (structured) res.write(`${JSON.stringify(event)}\n`);
		else if (event.type === "delta") res.write(event.text);
	};

	const apiKey = process.env.OPENAI_API_KEY;
	const disconnected = new AbortController();
	const onClose = () => disconnected.abort();
	res.once("close", onClose);
	let sentAnswer = false;
	let failed = false;

	try {
		if (apiKey) {
			const signal = AbortSignal.any([disconnected.signal, AbortSignal.timeout(LIMITS.answerTimeoutMs)]);
			for await (const event of runPortfolioAgent({ apiKey, question, history, plainText: !structured, signal })) {
				write(event);
				if (event.type === "delta") sentAnswer = sentAnswer || Boolean(event.text.trim());
			}
		}
	} catch (error) {
		failed = !disconnected.signal.aborted;
		// Visitors get the curated fallback; the cause belongs in the function log.
		if (failed) console.error("ask-ai: agent failed:", error instanceof Error ? error.message : error);
	} finally {
		res.off("close", onClose);
	}

	if (res.destroyed) return;
	if (failed && sentAnswer) {
		if (structured) {
			write({ type: "error", error: INCOMPLETE_ANSWER });
			return res.end();
		}
		write({ type: "delta", text: `\n\n${INCOMPLETE_ANSWER}` });
	}
	if (!sentAnswer) {
		// No key, or the model failed before writing: answer from the curated facts.
		const fallback = fallbackSources(question, history[history.length - 1]?.question ?? "");
		write({ type: "delta", text: fallback.text });
		write({ type: "sources", sources: fallback.sources });
	}
	if (!structured && sources.length) {
		write({ type: "delta", text: `\n\n${sources.map(({ label, href }) => `${label}: ${href}`).join("\n")}` });
	}
	write({ type: "done" });
	res.end();
}
