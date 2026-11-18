"use client";

import dynamic from "next/dynamic";
import { ArrowDown, ArrowUpRight, Check, ChevronDown, CornerDownLeft, Loader2, MessageSquare, RotateCcw, Square, Terminal, X } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

const PortfolioShell = dynamic(() => import("./PortfolioShell"), {
	loading: () => <p className="p-5 text-sm text-slate-400" role="status">Opening the shell...</p>,
});

const SUGGESTED_QUESTIONS = [
	{ label: "The engineering", question: "What did Austin personally build?" },
	{ label: "Mobile apps", question: "Which iOS and Android apps did Austin build?" },
	{ label: "The delivery system", question: "How does C2 help LineCrush ship?" },
	{ label: "The journey", question: "How did Austin go from trucking to CTO?" },
	{ label: "The Bible companion", question: "How does SureWord keep its answers grounded?" },
	{ label: "The Steam release", question: "What did Austin ship on Steam?" },
];

type AnswerStatus = "waiting" | "writing" | "complete" | "stopped" | "error";
interface Source { label: string; href: string; }
interface Answer {
	id: number;
	question: string;
	previousQuestion?: string;
	text: string;
	sources: Source[];
	status: AnswerStatus;
	error?: string;
}

// Citations come from the public knowledge endpoint. Never render model-supplied HTML.
function readSources(value: unknown): Source[] {
	if (!Array.isArray(value)) return [];
	return value.filter((source): source is Source => {
		if (!source || typeof source.label !== "string" || typeof source.href !== "string") return false;
		return /^\/(?!\/)/.test(source.href) || /^https:\/\//i.test(source.href);
	});
}

function InlineText({ text }: { text: string }) {
	return <>{text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => part.startsWith("**") && part.endsWith("**")
		? <strong key={index} className="font-semibold text-slate-100">{part.slice(2, -2)}</strong>
		: part)}</>;
}

function AnswerText({ text }: { text: string }) {
	return <div className="space-y-4 text-[15px] leading-7 text-slate-300">
		{text.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => {
			const lines = paragraph.split("\n");
			if (lines.every((line) => /^\s*([-*]|\d+\.)\s/.test(line))) {
				return <ul key={index} className="list-disc space-y-2 pl-5 marker:text-[#72f3df]/70">{lines.map((line, lineIndex) => <li key={lineIndex}><InlineText text={line.replace(/^\s*([-*]|\d+\.)\s+/, "")} /></li>)}</ul>;
			}
			return <p key={index} className="whitespace-pre-line break-words"><InlineText text={paragraph.replace(/^#{1,4}\s/gm, "")} /></p>;
		})}
	</div>;
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
	const previousQuestionRef = useRef<string>();
	const outputRef = useRef<HTMLDivElement>(null);
	const followOutputRef = useRef(true);
	const inputRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => () => {
		requestIdRef.current += 1;
		controllerRef.current?.abort();
	}, []);

	// Scroll only the answer pane, and only while the reader is following the end.
	useEffect(() => {
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
		const previousQuestion = retry ? retry.previousQuestion : previousQuestionRef.current;
		const answer: Answer = {
			id: requestId,
			question: nextQuestion,
			previousQuestion,
			text: "",
			sources: [],
			status: "waiting",
		};
		controllerRef.current = controller;
		followOutputRef.current = true;
		setIsBusy(true);
		setAnnouncement("Looking up Austin's public work.");
		setAnswers((current) => retry ? current.map((item) => item.id === retry.id ? answer : item) : [...current.slice(-9), answer]);
		if (!retry) setQuestion("");

		const update = (patch: Partial<Answer>) => {
			if (requestIdRef.current !== requestId) return;
			setAnswers((current) => current.map((item) => item.id === answer.id ? { ...item, ...patch } : item));
		};
		let text = "";
		let completed = false;
		let groundedQuestion: string | undefined;
		let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
		try {
			const response = await fetch("/api/ask-ai", {
				method: "POST",
				headers: { "Content-Type": "application/json", Accept: "application/x-ndjson" },
				body: JSON.stringify({ question: nextQuestion, previousQuestion, format: "ndjson" }),
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
				if (record.type === "sources") {
					update({ sources: readSources(record.sources) });
					if (typeof record.contextQuestion === "string") groundedQuestion = record.contextQuestion;
				}
				if (record.type === "delta" && typeof record.text === "string") {
					if (!text) setAnnouncement("Writing the answer.");
					text += record.text;
					update({ text, status: "writing" });
				}
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
			update({ status: "complete" });
			if (requestIdRef.current === requestId) {
				if (groundedQuestion) previousQuestionRef.current = groundedQuestion;
				setAnnouncement("Answer complete. Source links follow the answer.");
			}
		} catch (error) {
			if (requestIdRef.current !== requestId) return;
			if (controller.signal.aborted) {
				update({ status: "stopped" });
				setAnnouncement("Answer stopped. You can retry or ask another question.");
			} else {
				update({ status: "error", error: error instanceof Error ? error.message : "Couldn't connect. Please try again." });
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
		previousQuestionRef.current = undefined;
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

	return (
		<section id="terminal" aria-labelledby="terminal-heading" className="relative scroll-mt-24 px-4 py-14 md:py-20">
			<div className="mx-auto max-w-5xl">
				<div className="mb-8 max-w-2xl">
					<p className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-[#72f3df]"><Terminal size={15} aria-hidden="true" /> Interactive terminal</p>
					<h2 id="terminal-heading" className="text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl md:text-5xl">Ask about my work</h2>
					<p className="mt-4 text-base leading-7 text-slate-400 sm:text-lg">Ask about what I build, how I work, or the road that got me here. Answers draw on my public portfolio and link back to the work.</p>
				</div>

				<div className="overflow-hidden rounded-2xl border border-[#72f3df]/20 bg-[#0a1015] shadow-2xl shadow-black/20">
					<div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-6">
						<div className="flex items-center gap-2.5"><span aria-hidden="true" className={`h-2 w-2 rounded-full ${isBusy ? "bg-amber-300" : "bg-[#72f3df]"}`} /><span className="font-mono text-xs text-slate-300">Ask about Austin</span></div>
						<span className="text-[11px] text-slate-500 sm:text-xs">Public work, sourced answers</span>
					</div>

					<form onSubmit={submit} className="border-b border-white/10 p-5 sm:p-6">
						<label htmlFor="portfolio-question" className="mb-2 block text-sm font-medium text-slate-200">What would you like to know?</label>
						<div className="rounded-xl border border-white/15 bg-white/[0.025] p-2 transition-colors focus-within:border-[#72f3df]/70 focus-within:ring-1 focus-within:ring-[#72f3df]/40">
							<textarea id="portfolio-question" ref={inputRef} rows={2} maxLength={500} value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); if (!isBusy) void ask(question); } }} aria-describedby="portfolio-question-hint" placeholder={answers.length ? "Ask a follow-up, or explore something new..." : "What did Austin personally build?"} className="block w-full resize-none bg-transparent px-2 py-1 text-base leading-7 text-slate-100 placeholder:text-slate-500 focus:outline-none" />
							<div className="flex items-center justify-between gap-3 px-1 pb-1">
								<span id="portfolio-question-hint" className="text-xs text-slate-500"><span className="hidden sm:inline">Enter to ask · Shift+Enter for a new line</span><span className="sm:hidden">Ask in your own words</span></span>
								{isBusy ? <button type="button" onClick={() => controllerRef.current?.abort()} className="flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-white/20 px-4 text-sm font-medium text-slate-100 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#72f3df]"><Square size={13} aria-hidden="true" /> Stop</button> : <button type="submit" disabled={!question.trim()} className="flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-[#72f3df] px-4 text-sm font-semibold text-[#0a1015] transition-colors hover:bg-[#a4f9ec] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#72f3df]">Ask <CornerDownLeft size={15} aria-hidden="true" /></button>}
							</div>
						</div>
					</form>

					<div className="grid md:grid-cols-[280px_minmax(0,1fr)]">
						<aside aria-label="Suggested questions" className="border-b border-white/10 bg-white/[0.015] p-5 md:border-b-0 md:border-r sm:p-6">
							<p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">Suggested questions</p>
							<div className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0">
								{SUGGESTED_QUESTIONS.map((suggestion) => <button key={suggestion.question} type="button" disabled={isBusy} onClick={() => { void ask(suggestion.question); }} className="group flex min-h-11 w-[220px] shrink-0 items-start gap-3 rounded-lg border border-white/10 p-3 text-left transition-colors hover:border-[#72f3df]/40 hover:bg-[#72f3df]/5 disabled:cursor-wait disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#72f3df] md:w-full md:border-transparent">
									<span><span className="mb-1 block text-[10px] uppercase tracking-wider text-slate-500">{suggestion.label}</span><span className="block text-sm leading-5 text-slate-300 group-hover:text-slate-100">{suggestion.question}</span></span>
								</button>)}
							</div>
						</aside>

						<div className="relative min-w-0">
							<div ref={outputRef} tabIndex={0} role="region" aria-label="Portfolio answers" onScroll={(event) => { const element = event.currentTarget; const nearEnd = element.scrollHeight - element.scrollTop - element.clientHeight < 40; followOutputRef.current = nearEnd; setHasMoreBelow(!nearEnd); }} className={`${answers.length ? "h-[380px]" : "min-h-32"} overflow-y-auto p-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#72f3df] sm:p-6 md:h-[440px]`}>
								{answers.length === 0 ? <div className="flex h-full flex-col justify-center py-4">
									<div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-[#72f3df]/20 bg-[#72f3df]/5 text-[#72f3df]"><MessageSquare size={21} strokeWidth={1.5} aria-hidden="true" /></div>
									<p className="max-w-md text-sm leading-6 text-slate-400">Answers appear here with links to the relevant work.</p>
								</div> : <div className="space-y-8 pb-3">{answers.map((answer) => <article key={answer.id} aria-label={answer.question} className="border-b border-white/10 pb-7 last:border-b-0 last:pb-0">
									<p className="mb-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#72f3df]/80">You asked</p>
									<h3 className="mb-5 text-base font-medium leading-7 text-slate-100">{answer.question}</h3>
									{answer.status === "waiting" ? <p className="flex items-center gap-2 text-sm text-slate-400"><Loader2 size={15} aria-hidden="true" className="animate-spin motion-reduce:animate-none" /> Looking up the public work...</p> : null}
									{answer.text ? <AnswerText text={answer.text} /> : null}
									{answer.status === "writing" ? <p className="mt-4 flex items-center gap-2 font-mono text-xs text-[#72f3df]"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" /> Writing...</p> : null}
									{answer.status === "error" ? <p className="mt-4 rounded-lg border border-rose-300/20 bg-rose-300/5 p-3 text-sm leading-6 text-rose-200">{answer.error}{answer.text ? " This answer is incomplete." : ""}</p> : null}
									{answer.status === "stopped" ? <p className="mt-4 text-sm text-amber-200">{answer.text ? "Stopped. This is a partial answer." : "Stopped before the answer arrived."}</p> : null}
									{answer.sources.length && answer.text ? <div className="mt-5 border-t border-white/10 pt-4"><p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-slate-500">Explore the sources</p><div className="flex flex-wrap gap-2">{answer.sources.map((source) => <a key={source.href} href={source.href} {...(source.href.startsWith("https://") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-[#72f3df]/20 bg-[#72f3df]/[0.035] px-3 text-xs text-[#9deee0] hover:border-[#72f3df]/60 hover:bg-[#72f3df]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#72f3df]">{source.label}<ArrowUpRight size={12} aria-hidden="true" />{source.href.startsWith("https://") ? <span className="sr-only"> (opens in new tab)</span> : null}</a>)}</div></div> : null}
									{answer.status === "error" || answer.status === "stopped" ? <button type="button" disabled={isBusy} onClick={() => { void ask(answer.question, answer); }} className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-sm text-[#72f3df] hover:bg-white/5 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#72f3df]"><RotateCcw size={14} aria-hidden="true" /> Retry this question</button> : null}
								</article>)}</div>}
							</div>
							{hasMoreBelow ? <button type="button" onClick={() => { const output = outputRef.current; if (output) output.scrollTop = output.scrollHeight; followOutputRef.current = true; setHasMoreBelow(false); }} className="absolute bottom-3 right-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#72f3df]/40 bg-[#101c22] px-4 text-xs text-[#72f3df] shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#72f3df]">Latest <ArrowDown size={13} aria-hidden="true" /></button> : null}
						</div>
					</div>

					<div className="flex min-h-14 items-center justify-between gap-3 border-t border-white/10 px-5 py-2 sm:px-6">
						<p className="max-w-md text-[11px] leading-5 text-slate-500">AI can make mistakes. Check the linked work.{answers.some((answer) => answer.status === "complete") ? " Follow-ups use your last completed question." : ""}</p>
						{answers.length ? <button type="button" onClick={clearConversation} className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-md px-2 text-xs text-slate-400 hover:text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#72f3df]"><X size={14} aria-hidden="true" /> Clear</button> : <span aria-hidden="true" className="text-[#72f3df]/50"><Check size={14} /></span>}
					</div>
				</div>
				<p role="status" aria-live="polite" aria-atomic="true" className="sr-only">{announcement}</p>

				<details onToggle={(event) => setShellOpen(event.currentTarget.open)} className="group mt-5 rounded-xl border border-white/10 bg-[#0a1015]/70">
					<summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-5 py-4 text-sm text-slate-400 transition-colors hover:text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#72f3df] [&::-webkit-details-marker]:hidden">
						<span className="flex items-center gap-3"><Terminal size={17} aria-hidden="true" /><span>Prefer a command line?<span className="ml-2 hidden text-xs text-slate-500 sm:inline">help · agent run · ask</span></span></span>
						<ChevronDown size={16} aria-hidden="true" className="shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none" />
					</summary>
					{shellOpen ? <div className="px-3 pb-3 sm:px-4 sm:pb-4"><PortfolioShell /></div> : null}
				</details>
			</div>
		</section>
	);
}
