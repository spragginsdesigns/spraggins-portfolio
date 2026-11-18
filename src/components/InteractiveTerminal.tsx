"use client";

import dynamic from "next/dynamic";
import {
	Activity,
	ArrowDown,
	ArrowUpRight,
	BarChart3,
	BookOpen,
	ChevronDown,
	CornerDownLeft,
	FileText,
	Gamepad2,
	FolderGit2,
	Loader2,
	Newspaper,
	RotateCcw,
	Search,
	Square,
	Terminal,
	TriangleAlert,
	Wrench,
	X,
	type LucideIcon
} from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import AnswerMarkdown, { CopyButton } from "./ask/AnswerMarkdown";
import { usePortfolioWebMcp } from "./ask/usePortfolioWebMcp";

const PortfolioShell = dynamic(() => import("./PortfolioShell"), {
	loading: () => <p className="p-5 text-sm text-slate-400" role="status">Opening the shell...</p>,
});

const MODEL_LABEL = "gpt-6.2-sol";
const MAX_QUESTION_LENGTH = 500;
/** Completed turns sent back so follow-ups keep their context. */
const HISTORY_TURNS = 6;

const SUGGESTED_QUESTIONS = [
	{ label: "The engineering", question: "What did Austin personally build?" },
	{ label: "Live work log", question: "What has Austin been working on over the last two weeks?" },
	{ label: "The delivery system", question: "How does C2 help LineCrush ship?" },
	{ label: "Public code", question: "What's in his public GitHub right now?" },
	{ label: "The journey", question: "How did Austin go from trucking to CTO?" },
	{ label: "The Bible companion", question: "How does SureWord keep its answers grounded?" },
	{ label: "The Steam release", question: "What did Austin ship on Steam, and what does it cost today?" },
	{ label: "Honest fit", question: "Where is Austin strongest, and what are the limits of his experience?" },
];

const CAPABILITIES: { icon: LucideIcon; label: string }[] = [
	{ icon: Search, label: "Portfolio & case studies" },
	{ icon: Activity, label: "Live work ledger" },
	{ icon: FolderGit2, label: "Public GitHub" },
	{ icon: BarChart3, label: "Verified stats" },
	{ icon: Newspaper, label: "Blog posts" },
	{ icon: Gamepad2, label: "Steam listing" },
];

const TOOL_ICONS: Record<string, LucideIcon> = {
	search_portfolio: Search,
	get_case_study: FileText,
	get_engineering_stats: BarChart3,
	get_work_log: Activity,
	list_blog_posts: Newspaper,
	read_blog_post: BookOpen,
	list_github_repos: FolderGit2,
	get_github_repo: FolderGit2,
	get_steam_listing: Gamepad2,
};

type AnswerStatus = "waiting" | "writing" | "complete" | "stopped" | "error";
interface Source { label: string; href: string; }
interface ToolCall {
	id: string;
	name: string;
	label: string;
	detail: string;
	status: "running" | "done" | "failed";
	summary?: string;
	ms?: number;
}
interface Answer {
	id: number;
	question: string;
	text: string;
	tools: ToolCall[];
	sources: Source[];
	status: AnswerStatus;
	startedAt: number;
	elapsedMs?: number;
	error?: string;
}

// Citations come from the server's tool results. Never render model-supplied HTML.
function readSources(value: unknown): Source[] {
	if (!Array.isArray(value)) return [];
	return value.filter((source): source is Source => {
		if (!source || typeof source.label !== "string" || typeof source.href !== "string") return false;
		return /^\/(?!\/)/.test(source.href) || /^https:\/\//i.test(source.href);
	});
}

function formatDuration(ms: number): string {
	if (ms < 1000) return `${Math.max(1, Math.round(ms))}ms`;
	return `${(ms / 1000).toFixed(ms < 10_000 ? 1 : 0)}s`;
}

function WorkingLine({ startedAt, label }: { startedAt: number; label: string }) {
	const [seconds, setSeconds] = useState(0);
	useEffect(() => {
		const tick = () => setSeconds(Math.floor((Date.now() - startedAt) / 1000));
		tick();
		const interval = setInterval(tick, 1000);
		return () => clearInterval(interval);
	}, [startedAt]);
	return (
		<p className="flex items-center gap-2.5 pl-1 text-[13px] text-[#9deee0]">
			<span aria-hidden="true" className="animate-pulse font-mono text-[#72f3df] motion-reduce:animate-none">✻</span>
			{label}
			<span className="font-mono text-[11px] tabular-nums text-slate-500">{seconds}s</span>
		</p>
	);
}

function ToolRow({ tool }: { tool: ToolCall }) {
	const Icon = TOOL_ICONS[tool.name] ?? Wrench;
	const failed = tool.status === "failed";
	return (
		<li className="flex min-h-10 min-w-0 items-center gap-2.5 px-2.5 py-1.5">
			<span aria-hidden="true" className={`flex size-7 shrink-0 items-center justify-center rounded-md border ${failed ? "border-rose-400/30 bg-rose-400/10 text-rose-300" : "border-white/[0.07] bg-white/[0.04] text-slate-400"}`}>
				<Icon size={14} strokeWidth={1.75} />
			</span>
			<span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-0.5">
				<span className="shrink-0 text-[13px] font-medium text-slate-200">{tool.label}</span>
				{tool.detail ? <span className="min-w-0 max-w-full truncate rounded bg-white/[0.05] px-1.5 py-px font-mono text-[12px] text-slate-400">{tool.detail}</span> : null}
			</span>
			<span className="flex shrink-0 items-center gap-2 font-mono text-[11px] tabular-nums text-slate-500">
				{tool.status === "running" ? <><span className="sr-only">Running</span><Loader2 size={13} aria-hidden="true" className="animate-spin text-[#72f3df] motion-reduce:animate-none" /></> : null}
				{tool.status === "done" ? <><span className="hidden text-slate-400 sm:inline">{tool.summary}</span>{typeof tool.ms === "number" ? <span>{formatDuration(tool.ms)}</span> : null}<span aria-hidden="true" className="text-[#72f3df]">✓</span></> : null}
				{failed ? <span className="rounded-full bg-rose-400/10 px-1.5 py-0.5 font-sans font-medium text-rose-300">{tool.summary ?? "Failed"}</span> : null}
			</span>
		</li>
	);
}

export default function InteractiveTerminal() {
	const [question, setQuestion] = useState("");
	const [answers, setAnswers] = useState<Answer[]>([]);
	const [isBusy, setIsBusy] = useState(false);
	const [shellOpen, setShellOpen] = useState(false);
	const [hasMoreBelow, setHasMoreBelow] = useState(false);
	const [announcement, setAnnouncement] = useState("");
	const controllerRef = useRef<AbortController | null>(null);
	const requestIdRef = useRef(0);
	const answersRef = useRef<Answer[]>([]);
	const outputRef = useRef<HTMLDivElement>(null);
	const followOutputRef = useRef(true);
	const inputRef = useRef<HTMLTextAreaElement>(null);

	usePortfolioWebMcp();

	useEffect(() => () => {
		requestIdRef.current += 1;
		controllerRef.current?.abort();
	}, []);

	// Scroll only the transcript, and only while the reader is following the end.
	useEffect(() => {
		answersRef.current = answers;
		const output = outputRef.current;
		if (!output) return;
		if (followOutputRef.current) output.scrollTop = output.scrollHeight;
		setHasMoreBelow(output.scrollHeight - output.scrollTop - output.clientHeight > 40);
	}, [answers]);

	const ask = async (rawQuestion: string, retry?: Answer) => {
		const nextQuestion = rawQuestion.trim();
		if (!nextQuestion || controllerRef.current) return;
		const controller = new AbortController();
		const requestId = ++requestIdRef.current;
		const answer: Answer = {
			id: requestId,
			question: nextQuestion,
			text: "",
			tools: [],
			sources: [],
			status: "waiting",
			startedAt: Date.now(),
		};
		// A retry keeps only the turns that came before the one being retried.
		const prior = answersRef.current;
		const earlier = retry ? prior.slice(0, prior.findIndex((item) => item.id === retry.id)) : prior;
		const history = earlier
			.filter((item) => item.status === "complete" && item.text.trim())
			.slice(-HISTORY_TURNS)
			.map((item) => ({ question: item.question, answer: item.text }));

		controllerRef.current = controller;
		followOutputRef.current = true;
		setIsBusy(true);
		setAnnouncement("Looking up Austin's public work.");
		setAnswers((current) => retry ? current.map((item) => item.id === retry.id ? answer : item) : [...current.slice(-9), answer]);
		if (!retry) setQuestion("");

		let text = "";
		let tools: ToolCall[] = [];
		let completed = false;
		const update = (patch: Partial<Answer>) => {
			if (requestIdRef.current !== requestId) return;
			setAnswers((current) => current.map((item) => item.id === answer.id ? { ...item, ...patch } : item));
		};
		// Anything still spinning when the answer ends did not finish.
		const settledTools = () => tools.map((tool) => tool.status === "running" ? { ...tool, status: "failed" as const, summary: "Interrupted" } : tool);
		let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
		try {
			const response = await fetch("/api/ask-ai", {
				method: "POST",
				headers: { "Content-Type": "application/json", Accept: "application/x-ndjson" },
				body: JSON.stringify({ question: nextQuestion, history, format: "ndjson" }),
				signal: controller.signal,
			});
			if (!response.ok) {
				const data = await response.json().catch(() => null);
				throw new Error(typeof data?.error === "string" ? data.error : "The answer couldn't be loaded. Please try again.");
			}
			if (!response.headers.get("content-type")?.includes("application/x-ndjson")) {
				throw new Error("The answer service returned an unexpected response. Please try again.");
			}
			reader = response.body?.getReader();
			if (!reader) throw new Error("The answer was empty. Please try again.");
			const decoder = new TextDecoder();
			let buffer = "";
			const consume = (line: string) => {
				if (!line.trim()) return;
				const record = JSON.parse(line);
				if (record.type === "tool_start" && typeof record.id === "string" && typeof record.name === "string") {
					tools = [...tools, {
						id: record.id,
						name: record.name,
						label: typeof record.label === "string" ? record.label : record.name,
						detail: typeof record.detail === "string" ? record.detail : "",
						status: "running",
					}];
					update({ tools });
					setAnnouncement(`${typeof record.label === "string" ? record.label : "Running a lookup"}.`);
				}
				if (record.type === "tool_end" && typeof record.id === "string") {
					tools = tools.map((tool) => tool.id === record.id ? {
						...tool,
						status: record.ok === false ? "failed" as const : "done" as const,
						summary: typeof record.summary === "string" ? record.summary : undefined,
						ms: typeof record.ms === "number" ? record.ms : undefined,
					} : tool);
					update({ tools });
				}
				if (record.type === "delta" && typeof record.text === "string") {
					if (!text) setAnnouncement("Writing the answer.");
					text += record.text;
					update({ text, status: "writing" });
				}
				if (record.type === "sources") update({ sources: readSources(record.sources) });
				if (record.type === "error") throw new Error(typeof record.error === "string" ? record.error : "The connection ended early. Please try again.");
				if (record.type === "done") completed = true;
			};
			while (!completed) {
				const { done, value } = await reader.read();
				if (controller.signal.aborted) throw new DOMException("Stopped", "AbortError");
				buffer += decoder.decode(value, { stream: !done });
				const lines = buffer.split("\n");
				buffer = lines.pop() || "";
				lines.forEach(consume);
				if (done) {
					if (buffer.trim()) consume(buffer);
					break;
				}
			}
			if (!completed || !text.trim()) throw new Error("The connection ended before the answer finished. Please try again.");
			update({ status: "complete", elapsedMs: Date.now() - answer.startedAt });
			if (requestIdRef.current === requestId) setAnnouncement("Answer complete. Source links follow the answer.");
		} catch (error) {
			if (requestIdRef.current !== requestId) return;
			if (controller.signal.aborted) {
				update({ status: "stopped", tools: settledTools() });
				setAnnouncement("Answer stopped. You can retry or ask another question.");
			} else {
				update({ status: "error", tools: settledTools(), error: error instanceof Error ? error.message : "Couldn't connect. Please try again." });
				setAnnouncement("The answer couldn't finish. A retry button is available.");
			}
		} finally {
			void reader?.cancel().catch(() => undefined);
			if (requestIdRef.current === requestId) {
				controllerRef.current = null;
				setIsBusy(false);
			}
		}
	};

	const clearConversation = () => {
		requestIdRef.current += 1;
		controllerRef.current?.abort();
		controllerRef.current = null;
		setAnswers([]);
		setQuestion("");
		setIsBusy(false);
		setHasMoreBelow(false);
		setAnnouncement("Conversation cleared.");
		inputRef.current?.focus({ preventScroll: true });
	};

	const submit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		void ask(question);
	};

	const asked = new Set(answers.map((answer) => answer.question));
	const followUps = SUGGESTED_QUESTIONS.filter((suggestion) => !asked.has(suggestion.question));
	const focusRing = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#72f3df]";

	return (
		<section id="terminal" aria-labelledby="terminal-heading" className="relative scroll-mt-24 px-4 py-14 md:py-20">
			<div className="mx-auto max-w-5xl">
				<div className="mb-8 max-w-2xl">
					<p className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#72f3df]"><Terminal size={15} aria-hidden="true" /> Portfolio agent</p>
					<h2 id="terminal-heading" className="text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl md:text-5xl">Ask about my work</h2>
					<p className="mt-4 text-base leading-7 text-slate-400 sm:text-lg">An agent that looks things up before it answers. It searches this portfolio, reads my live work ledger and public GitHub, and links every answer back to the source.</p>
				</div>

				<div className="overflow-clip rounded-2xl border border-[#72f3df]/20 bg-[#080d11] shadow-2xl shadow-black/30">
					<div className="flex min-h-12 items-center justify-between gap-3 border-b border-white/[0.08] bg-white/[0.02] px-4 sm:px-5">
						<div className="flex min-w-0 items-center gap-3">
							<span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${isBusy ? "animate-pulse bg-amber-300 motion-reduce:animate-none" : "bg-[#72f3df]"}`} />
							<span className="truncate font-mono text-xs text-slate-200">portfolio-agent</span>
							<span className="hidden shrink-0 rounded-full bg-[#72f3df]/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-[#72f3df] sm:inline">{isBusy ? "Working" : "Ready"}</span>
						</div>
						<div className="flex shrink-0 items-center gap-1 sm:gap-3">
							<span className="font-mono text-[11px] text-slate-500"><span className="hidden sm:inline">{MODEL_LABEL} · </span>read-only tools</span>
							{answers.length ? <button type="button" onClick={clearConversation} className={`inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 text-xs text-slate-400 hover:text-slate-100 ${focusRing}`}><X size={14} aria-hidden="true" /> Clear</button> : null}
						</div>
					</div>

					<div className="relative">
						<div
							ref={outputRef}
							tabIndex={0}
							role="region"
							aria-label="Conversation with the portfolio agent"
							onScroll={(event) => {
								const element = event.currentTarget;
								const nearEnd = element.scrollHeight - element.scrollTop - element.clientHeight < 40;
								followOutputRef.current = nearEnd;
								setHasMoreBelow(!nearEnd);
							}}
							className={`${answers.length ? "h-[480px] md:h-[560px]" : ""} overflow-y-auto overscroll-contain px-4 py-5 [scrollbar-color:rgba(255,255,255,0.16)_transparent] [scrollbar-width:thin] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#72f3df] sm:px-6 sm:py-6`}
						>
							{answers.length === 0 ? (
								<div>
									<p className="font-mono text-[13px] leading-6 text-slate-400"><span aria-hidden="true" className="mr-2 text-[#72f3df]">✻</span>Ready. Ask anything about Austin, or start with one of these.</p>
									<ul aria-label="What the agent can look up" className="mt-4 flex flex-wrap gap-2">
										{CAPABILITIES.map(({ icon: Icon, label }) => (
											<li key={label} className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] py-1 pl-2 pr-2.5 text-[12px] text-slate-400"><Icon size={12} aria-hidden="true" className="text-[#72f3df]/80" />{label}</li>
										))}
									</ul>
									<div className="mt-6 grid gap-2 sm:grid-cols-2">
										{SUGGESTED_QUESTIONS.map((suggestion) => (
											<button key={suggestion.question} type="button" disabled={isBusy} onClick={() => { void ask(suggestion.question); }} className={`group flex min-h-11 items-start justify-between gap-3 rounded-lg border border-white/[0.08] bg-white/[0.015] p-3 text-left transition-colors hover:border-[#72f3df]/40 hover:bg-[#72f3df]/5 disabled:cursor-wait disabled:opacity-40 ${focusRing}`}>
												<span><span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-slate-500">{suggestion.label}</span><span className="block text-sm leading-5 text-slate-300 group-hover:text-slate-100">{suggestion.question}</span></span>
												<CornerDownLeft size={14} aria-hidden="true" className="mt-1 shrink-0 text-slate-600 transition-colors group-hover:text-[#72f3df]" />
											</button>
										))}
									</div>
								</div>
							) : (
								<div className="space-y-9 pb-2">
									{answers.map((answer) => {
										const live = answer.status === "waiting" || answer.status === "writing";
										const lookupsRunning = answer.tools.some((tool) => tool.status === "running");
										return (
											<article key={answer.id} aria-label={answer.question} className="space-y-4">
												<div className="flex gap-3 rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-2.5">
													<span aria-hidden="true" className="select-none font-mono text-[13px] leading-6 text-[#72f3df]">›</span>
													<h3 className="min-w-0 break-words text-[15px] font-medium leading-6 text-slate-100">{answer.question}</h3>
												</div>

												{answer.tools.length ? (
													<div className="rounded-xl border border-white/[0.06] bg-white/[0.015]">
														<p className="border-b border-white/[0.05] px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-500">{answer.tools.length} {answer.tools.length === 1 ? "lookup" : "lookups"}</p>
														<ul className="divide-y divide-white/[0.04]">{answer.tools.map((tool) => <ToolRow key={tool.id} tool={tool} />)}</ul>
													</div>
												) : null}

												{live && !answer.text ? <WorkingLine startedAt={answer.startedAt} label={lookupsRunning ? "Looking it up" : answer.tools.length ? "Reading the results" : "Thinking"} /> : null}
												{answer.text ? <AnswerMarkdown text={answer.text} streaming={answer.status === "writing"} /> : null}

												{answer.status === "error" ? <p className="flex items-start gap-2 rounded-lg border border-rose-300/20 bg-rose-300/5 p-3 text-sm leading-6 text-rose-200"><TriangleAlert size={15} aria-hidden="true" className="mt-1 shrink-0" /><span>{answer.error}{answer.text ? " This answer is incomplete." : ""}</span></p> : null}
												{answer.status === "stopped" ? <p className="text-sm text-amber-200">{answer.text ? "Stopped. This is a partial answer." : "Stopped before the answer arrived."}</p> : null}

												{answer.sources.length && answer.text && !live ? (
													<div className="flex flex-wrap items-center gap-2">
														<span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Sources</span>
														{answer.sources.map((source) => (
															<a key={source.href} href={source.href} {...(source.href.startsWith("https://") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={`inline-flex min-h-8 items-center gap-1 rounded-md border border-[#72f3df]/20 bg-[#72f3df]/[0.035] px-2.5 text-xs text-[#9deee0] hover:border-[#72f3df]/60 hover:bg-[#72f3df]/10 ${focusRing}`}>
																{source.label}<ArrowUpRight size={12} aria-hidden="true" />{source.href.startsWith("https://") ? <span className="sr-only"> (opens in new tab)</span> : null}
															</a>
														))}
													</div>
												) : null}

												{answer.status === "complete" ? (
													<div className="flex items-center justify-between gap-3 border-t border-white/[0.06] pt-2">
														<p className="font-mono text-[11px] tabular-nums text-slate-500">
															{answer.tools.length ? `${answer.tools.length} ${answer.tools.length === 1 ? "lookup" : "lookups"} · ` : ""}{typeof answer.elapsedMs === "number" ? formatDuration(answer.elapsedMs) : ""}<span className="hidden sm:inline"> · {MODEL_LABEL}</span>
														</p>
														<CopyButton text={answer.text} label="Copy answer" />
													</div>
												) : null}
												{answer.status === "error" || answer.status === "stopped" ? <button type="button" disabled={isBusy} onClick={() => { void ask(answer.question, answer); }} className={`inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-sm text-[#72f3df] hover:bg-white/5 disabled:opacity-40 ${focusRing}`}><RotateCcw size={14} aria-hidden="true" /> Retry this question</button> : null}
											</article>
										);
									})}
								</div>
							)}
						</div>
						{hasMoreBelow ? <button type="button" onClick={() => { const output = outputRef.current; if (output) output.scrollTop = output.scrollHeight; followOutputRef.current = true; setHasMoreBelow(false); }} className={`absolute bottom-3 right-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#72f3df]/40 bg-[#101c22] px-4 text-xs text-[#72f3df] shadow-lg ${focusRing}`}>Latest <ArrowDown size={13} aria-hidden="true" /></button> : null}
					</div>

					<div className="border-t border-white/[0.08] bg-white/[0.02] p-3 sm:p-4">
						{answers.length && followUps.length ? (
							<div aria-label="Suggested questions" className="mb-3 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
								{followUps.map((suggestion) => (
									<button key={suggestion.question} type="button" disabled={isBusy} onClick={() => { void ask(suggestion.question); }} className={`min-h-9 shrink-0 rounded-full border border-white/10 px-3 text-xs text-slate-400 transition-colors hover:border-[#72f3df]/40 hover:text-slate-100 disabled:cursor-wait disabled:opacity-40 ${focusRing}`}>{suggestion.question}</button>
								))}
							</div>
						) : null}
						<form onSubmit={submit}>
							<label htmlFor="portfolio-question" className="sr-only">Ask a question about Austin</label>
							<div className="flex items-end gap-2 rounded-xl border border-white/[0.14] bg-[#0c1319] p-2 transition-colors focus-within:border-[#72f3df]/70 focus-within:ring-1 focus-within:ring-[#72f3df]/40">
								<span aria-hidden="true" className="select-none pb-2.5 pl-2 font-mono text-base leading-6 text-[#72f3df]">›</span>
								<textarea
									id="portfolio-question"
									ref={inputRef}
									rows={1}
									maxLength={MAX_QUESTION_LENGTH}
									value={question}
									onChange={(event) => setQuestion(event.target.value)}
									onKeyDown={(event) => {
										if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
											event.preventDefault();
											if (!isBusy) void ask(question);
										}
									}}
									aria-describedby="portfolio-question-hint"
									placeholder={answers.length ? "Ask a follow-up..." : "Ask about Austin's work..."}
									className="block max-h-40 min-h-11 w-full resize-none bg-transparent px-1 py-2.5 text-base leading-6 text-slate-100 [field-sizing:content] placeholder:text-slate-500 focus:outline-none"
								/>
								{isBusy
									? <button type="button" onClick={() => controllerRef.current?.abort()} className={`flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-white/20 px-4 text-sm font-medium text-slate-100 hover:bg-white/5 ${focusRing}`}><Square size={13} aria-hidden="true" /> Stop</button>
									: <button type="submit" disabled={!question.trim()} className={`flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-[#72f3df] px-4 text-sm font-semibold text-[#0a1015] transition-colors hover:bg-[#a4f9ec] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-offset-2 ${focusRing}`}>Ask <CornerDownLeft size={15} aria-hidden="true" /></button>}
							</div>
							<p id="portfolio-question-hint" className="mt-2 px-1 text-[11px] leading-5 text-slate-500"><span className="hidden sm:inline">Enter to ask · Shift+Enter for a new line · </span>AI can make mistakes. Check the linked work.</p>
						</form>
					</div>
				</div>
				<p role="status" aria-live="polite" aria-atomic="true" className="sr-only">{announcement}</p>

				<details onToggle={(event) => setShellOpen(event.currentTarget.open)} className="group mt-5 rounded-xl border border-white/10 bg-[#0a1015]/70">
					<summary className={`flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-5 py-4 text-sm text-slate-400 transition-colors hover:text-slate-100 [&::-webkit-details-marker]:hidden ${focusRing}`}>
						<span className="flex items-center gap-3"><Terminal size={17} aria-hidden="true" /><span>Prefer a command line?<span className="ml-2 hidden text-xs text-slate-500 sm:inline">help · agent run · ask</span></span></span>
						<ChevronDown size={16} aria-hidden="true" className="shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none" />
					</summary>
					{shellOpen ? <div className="px-3 pb-3 sm:px-4 sm:pb-4"><PortfolioShell /></div> : null}
				</details>
			</div>
		</section>
	);
}
