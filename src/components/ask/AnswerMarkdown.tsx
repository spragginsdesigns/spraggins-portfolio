"use client";

import { Check, Copy } from "lucide-react";
import { memo, useEffect, useRef, useState, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

/** Only site-relative paths, https, mailto and tel links are ever rendered as links. */
function safeHref(href: string | undefined): string | null {
	if (!href) return null;
	if (/^\/(?!\/)/.test(href) || /^#/.test(href)) return href;
	if (/^https:\/\//i.test(href) || /^mailto:[^\s]+$/i.test(href) || /^tel:\+?[\d-]+$/i.test(href)) return href;
	return null;
}

export function CopyButton({ text, label, className = "" }: { text: string; label: string; className?: string }) {
	const [copied, setCopied] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout>>();
	useEffect(() => () => clearTimeout(timer.current), []);
	return (
		<button
			type="button"
			aria-label={copied ? "Copied" : label}
			onClick={() => {
				void navigator.clipboard?.writeText(text).then(() => {
					setCopied(true);
					clearTimeout(timer.current);
					timer.current = setTimeout(() => setCopied(false), 1500);
				}).catch(() => undefined);
			}}
			className={`inline-flex h-7 w-7 items-center justify-center rounded text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#72f3df] ${className}`}
		>
			{copied ? <Check size={13} aria-hidden="true" className="text-[#72f3df]" /> : <Copy size={13} aria-hidden="true" />}
		</button>
	);
}

function plainText(node: ReactNode): string {
	if (typeof node === "string" || typeof node === "number") return String(node);
	if (Array.isArray(node)) return node.map(plainText).join("");
	if (node && typeof node === "object" && "props" in node) return plainText((node.props as { children?: ReactNode }).children);
	return "";
}

const components: Components = {
	p: ({ children }) => <p className="my-3 first:mt-0 last:mb-0">{children}</p>,
	h1: ({ children }) => <h4 className="mb-2 mt-6 text-[17px] font-semibold tracking-tight text-slate-50 first:mt-0">{children}</h4>,
	h2: ({ children }) => <h4 className="mb-2 mt-6 text-base font-semibold tracking-tight text-slate-50 first:mt-0">{children}</h4>,
	h3: ({ children }) => <h5 className="mb-2 mt-5 text-[15px] font-semibold text-slate-50 first:mt-0">{children}</h5>,
	h4: ({ children }) => <h5 className="mb-2 mt-5 text-[15px] font-semibold text-slate-100 first:mt-0">{children}</h5>,
	strong: ({ children }) => <strong className="font-semibold text-slate-50">{children}</strong>,
	em: ({ children }) => <em className="text-slate-200">{children}</em>,
	ul: ({ children }) => <ul className="my-3 list-disc space-y-1.5 pl-5 marker:text-[#72f3df]/60">{children}</ul>,
	ol: ({ children }) => <ol className="my-3 list-decimal space-y-1.5 pl-5 marker:font-mono marker:text-[13px] marker:text-[#72f3df]/70">{children}</ol>,
	li: ({ children }) => <li className="pl-1 [&>p]:my-0">{children}</li>,
	hr: () => <hr className="my-5 border-white/10" />,
	blockquote: ({ children }) => <blockquote className="my-4 border-l-2 border-[#72f3df]/40 pl-4 text-slate-400">{children}</blockquote>,
	a: ({ href, children }) => {
		const safe = safeHref(href);
		if (!safe) return <>{children}</>;
		const external = safe.startsWith("https://");
		return (
			<a href={safe} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="rounded-sm text-[#8ff5e4] underline decoration-[#72f3df]/35 underline-offset-[3px] transition-colors hover:decoration-[#72f3df] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#72f3df]">
				{children}{external ? <span className="sr-only"> (opens in new tab)</span> : null}
			</a>
		);
	},
	code: ({ className, children }) => /language-/.test(className ?? "")
		? <code className={className}>{children}</code>
		: <code className="rounded bg-white/[0.08] px-1.5 py-0.5 font-mono text-[0.85em] text-[#c9fbf3]">{children}</code>,
	pre: ({ children }) => {
		const child = Array.isArray(children) ? children[0] : children;
		const language = child && typeof child === "object" && "props" in child
			? /language-([\w+#-]+)/.exec((child.props as { className?: string }).className ?? "")?.[1]
			: undefined;
		return (
			<div className="my-4 overflow-hidden rounded-lg border border-white/[0.08] bg-black/40">
				<div className="flex min-h-8 items-center justify-between border-b border-white/[0.06] bg-white/[0.02] pl-3 pr-1">
					<span className="font-mono text-[10px] uppercase tracking-wider text-slate-500">{language ?? "text"}</span>
					<CopyButton text={plainText(children).replace(/\n$/, "")} label="Copy code" />
				</div>
				<pre className="overflow-x-auto p-3 font-mono text-[12.5px] leading-relaxed text-slate-200 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit">{children}</pre>
			</div>
		);
	},
	table: ({ children }) => (
		<div className="my-4 overflow-x-auto rounded-lg border border-white/[0.08] [scrollbar-color:rgba(255,255,255,0.16)_transparent] [scrollbar-width:thin]">
			<table className="min-w-full border-collapse text-left text-[13.5px] leading-snug">{children}</table>
		</div>
	),
	thead: ({ children }) => <thead className="bg-white/[0.05]">{children}</thead>,
	th: ({ children, style }) => <th style={style} className="whitespace-nowrap px-3 py-2 font-mono text-[11px] font-medium uppercase tracking-wider text-slate-300">{children}</th>,
	td: ({ children, style }) => <td style={style} className="border-t border-white/[0.06] px-3 py-2 align-top tabular-nums text-slate-300">{children}</td>
};

/**
 * Renders the agent's Markdown. Raw HTML in the model output is dropped, and
 * links are limited to this site, https and mailto.
 */
function AnswerMarkdown({ text, streaming }: { text: string; streaming: boolean }) {
	return (
		<div className={`break-words text-[15px] leading-7 text-slate-300 ${streaming ? "[&>*:last-child]:after:ml-0.5 [&>*:last-child]:after:animate-pulse [&>*:last-child]:after:text-[#72f3df] [&>*:last-child]:after:content-['▍'] motion-reduce:[&>*:last-child]:after:animate-none" : ""}`}>
			<ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml components={components}>{text}</ReactMarkdown>
		</div>
	);
}

export default memo(AnswerMarkdown);
