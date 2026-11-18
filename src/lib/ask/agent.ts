// The portfolio agent loop: one streamed model turn, then its tool calls,
// repeated until the model writes an answer. Server-only.

import type { PortfolioSource } from "@/lib/portfolio-answers";
import { ASK_MODEL, ASK_REASONING_EFFORT, buildInstructions } from "./prompt";
import { PORTFOLIO_TOOLS, findTool, runTool } from "./tools";

const RESPONSES_URL = "https://api.openai.com/v1/responses";
/** Model turns per answer. The last one runs with tools switched off. */
const MAX_ROUNDS = 5;
const MAX_TOOL_CALLS = 10;
/** Covers reasoning and the visible answer for one turn. */
const MAX_OUTPUT_TOKENS = 3200;
const MAX_TOOL_RESULT_CHARS = 14_000;

export interface AskTurn {
	question: string;
	answer: string;
}

export type AgentEvent =
	| { type: "tool_start"; id: string; name: string; label: string; detail: string }
	| { type: "tool_end"; id: string; ok: boolean; summary: string; ms: number }
	| { type: "delta"; text: string }
	| { type: "sources"; sources: PortfolioSource[] }
	| { type: "usage"; rounds: number; tools: number; ms: number; model: string };

type InputItem = Record<string, unknown>;

interface FunctionCall {
	call_id: string;
	name: string;
	arguments: string;
}

interface StreamedTurn {
	/** Output items to replay on the next turn so the model keeps its reasoning. */
	items: InputItem[];
	calls: FunctionCall[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** The one argument worth showing next to a tool's name. */
function toolDetail(args: unknown): string {
	if (!isRecord(args)) return "";
	if (typeof args.days === "number") return `last ${args.days} days`;
	for (const key of ["query", "slug", "name", "sort"]) {
		if (typeof args[key] === "string") return args[key].slice(0, 80);
	}
	return "";
}

function parseArgs(raw: string): unknown {
	try {
		return JSON.parse(raw || "{}");
	} catch {
		return {};
	}
}

async function* streamTurn(
	apiKey: string,
	body: Record<string, unknown>,
	signal: AbortSignal
): AsyncGenerator<{ type: "delta"; text: string }, StreamedTurn> {
	const response = await fetch(RESPONSES_URL, {
		method: "POST",
		signal,
		headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
		body: JSON.stringify(body)
	});
	if (!response.ok || !response.body) {
		const detail = await response.text().catch(() => "");
		throw new Error(`Portfolio model returned status ${response.status}: ${detail.slice(0, 300)}`);
	}

	const reader = response.body.getReader();
	const decoder = new TextDecoder();
	const turn: StreamedTurn = { items: [], calls: [] };
	let buffer = "";
	let finished = false;
	try {
		while (!finished) {
			const { done, value } = await reader.read();
			if (done) break;
			buffer += decoder.decode(value, { stream: true });
			const lines = buffer.split("\n");
			buffer = lines.pop() ?? "";
			for (const line of lines) {
				if (!line.startsWith("data:")) continue;
				const data = line.slice(5).trim();
				if (!data || data === "[DONE]") continue;
				const event: unknown = JSON.parse(data);
				if (!isRecord(event)) continue;
				if (event.type === "response.output_text.delta" && typeof event.delta === "string") {
					yield { type: "delta", text: event.delta };
				} else if (event.type === "response.output_item.done" && isRecord(event.item)) {
					const item = event.item;
					if (item.type === "function_call" && typeof item.call_id === "string" && typeof item.name === "string") {
						turn.calls.push({ call_id: item.call_id, name: item.name, arguments: typeof item.arguments === "string" ? item.arguments : "{}" });
						turn.items.push(item);
					} else if (item.type === "reasoning" || item.type === "message") {
						turn.items.push(item);
					}
				} else if (event.type === "response.completed") {
					finished = true;
				} else if (event.type === "response.failed" || event.type === "response.incomplete" || event.type === "error") {
					throw new Error(`Portfolio model stream ended with ${event.type}`);
				}
			}
		}
		if (!finished) throw new Error("Portfolio model stream ended before completion.");
		return turn;
	} finally {
		await reader.cancel().catch(() => {});
		reader.releaseLock();
	}
}

function collectSources(into: Map<string, PortfolioSource>, sources: readonly PortfolioSource[]) {
	for (const source of sources) {
		if (!into.has(source.href)) into.set(source.href, source);
	}
}

export async function* runPortfolioAgent(options: {
	apiKey: string;
	question: string;
	history: readonly AskTurn[];
	plainText: boolean;
	signal: AbortSignal;
}): AsyncGenerator<AgentEvent> {
	const started = Date.now();
	const input: InputItem[] = [
		...options.history.flatMap((turn) => [
			{ role: "user", content: turn.question },
			{ role: "assistant", content: turn.answer }
		]),
		{ role: "user", content: options.question }
	];
	const instructions = buildInstructions({
		plainText: options.plainText,
		today: new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "America/Los_Angeles" }).format(new Date())
	});
	const tools = PORTFOLIO_TOOLS.map(({ name, description, parameters }) => ({ type: "function", name, description, parameters, strict: true }));
	const sources = new Map<string, PortfolioSource>();
	let toolCount = 0;

	for (let round = 1; round <= MAX_ROUNDS; round++) {
		const toolsExhausted = round === MAX_ROUNDS || toolCount >= MAX_TOOL_CALLS;
		const stream = streamTurn(options.apiKey, {
			model: ASK_MODEL,
			instructions,
			input,
			tools,
			tool_choice: toolsExhausted ? "none" : "auto",
			parallel_tool_calls: true,
			reasoning: { effort: ASK_REASONING_EFFORT },
			// Nothing is stored upstream, so reasoning travels back encrypted between turns.
			include: ["reasoning.encrypted_content"],
			max_output_tokens: MAX_OUTPUT_TOKENS,
			store: false,
			stream: true
		}, options.signal);

		let step = await stream.next();
		while (!step.done) {
			yield step.value;
			step = await stream.next();
		}
		const turn = step.value;

		if (!turn.calls.length) {
			yield { type: "sources", sources: Array.from(sources.values()).slice(0, 5) };
			yield { type: "usage", rounds: round, tools: toolCount, ms: Date.now() - started, model: ASK_MODEL };
			return;
		}

		input.push(...turn.items);
		const calls = turn.calls.map((call) => ({ call, args: parseArgs(call.arguments), startedAt: Date.now() }));
		for (const { call, args } of calls) {
			yield { type: "tool_start", id: call.call_id, name: call.name, label: findTool(call.name)?.label ?? call.name, detail: toolDetail(args) };
		}
		toolCount += calls.length;
		// Run the turn's lookups together, then report them in the order they were asked.
		const outcomes = await Promise.all(calls.map(async ({ call, args, startedAt }) => {
			const outcome = await runTool(call.name, args, options.signal);
			return { call, outcome, ms: Date.now() - startedAt };
		}));
		options.signal.throwIfAborted();
		for (const { call, outcome, ms } of outcomes) {
			collectSources(sources, outcome.sources);
			yield { type: "tool_end", id: call.call_id, ok: outcome.ok, summary: outcome.summary, ms };
			input.push({ type: "function_call_output", call_id: call.call_id, output: JSON.stringify(outcome.data).slice(0, MAX_TOOL_RESULT_CHARS) });
		}
	}
}
