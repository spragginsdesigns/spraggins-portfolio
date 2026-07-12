"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
	Bot,
	BookOpen,
	Briefcase,
	FileDown,
	Github,
	Home,
	Linkedin,
	Mail,
	Search,
	SquareTerminal,
	Sparkles,
	Twitter,
	User,
	Wrench,
} from "lucide-react";

interface PaletteItem {
	id: string;
	label: string;
	hint: string;
	icon: React.ReactNode;
	keywords: string;
	href: string;
	external?: boolean;
}

const PALETTE_ITEMS: PaletteItem[] = [
	{
		id: "home",
		label: "Home",
		hint: "Back to the top",
		icon: <Home className="h-4 w-4" />,
		keywords: "home top hero start",
		href: "/#",
	},
	{
		id: "terminal",
		label: "Interactive Terminal",
		hint: "Try 'agent run'",
		icon: <SquareTerminal className="h-4 w-4" />,
		keywords: "terminal shell console cli agent run ask ai",
		href: "/#terminal",
	},
	{
		id: "ai-systems",
		label: "AI Systems",
		hint: "Agents, models, delivery loop",
		icon: <Bot className="h-4 w-4" />,
		keywords: "ai systems agents autonomous llm mcp delivery",
		href: "/#ai-systems",
	},
	{
		id: "projects",
		label: "Projects",
		hint: "LineCrush, games, and more",
		icon: <Briefcase className="h-4 w-4" />,
		keywords: "projects work linecrush games portfolio space miner",
		href: "/#projects",
	},
	{
		id: "expertise",
		label: "Expertise",
		hint: "Skills and stats",
		icon: <Wrench className="h-4 w-4" />,
		keywords: "expertise skills stack stats tech",
		href: "/#expertise",
	},
	{
		id: "about",
		label: "About",
		hint: "Truck driver → CTO",
		icon: <User className="h-4 w-4" />,
		keywords: "about journey story timeline bio",
		href: "/#about",
	},
	{
		id: "blog",
		label: "Blog",
		hint: "Writing on AI and startups",
		icon: <BookOpen className="h-4 w-4" />,
		keywords: "blog posts writing articles",
		href: "/blog",
	},
	{
		id: "contact",
		label: "Contact",
		hint: "Open to contracts & consulting",
		icon: <Mail className="h-4 w-4" />,
		keywords: "contact hire email message consulting contract",
		href: "/#contact",
	},
	{
		id: "resume",
		label: "Download Resume",
		hint: "PDF",
		icon: <FileDown className="h-4 w-4" />,
		keywords: "resume cv download pdf hire",
		href: "https://spraggins-designs.s3.us-east-1.amazonaws.com/resume/AustinSpraggins_Resume.pdf",
		external: true,
	},
	{
		id: "github",
		label: "GitHub",
		hint: "@spragginsdesigns",
		icon: <Github className="h-4 w-4" />,
		keywords: "github code repos open source",
		href: "https://github.com/spragginsdesigns",
		external: true,
	},
	{
		id: "linkedin",
		label: "LinkedIn",
		hint: "Professional profile",
		icon: <Linkedin className="h-4 w-4" />,
		keywords: "linkedin professional network",
		href: "https://www.linkedin.com/in/spragginsdesigns/",
		external: true,
	},
	{
		id: "twitter",
		label: "Twitter / X",
		hint: "@spragginsdesign",
		icon: <Twitter className="h-4 w-4" />,
		keywords: "twitter x social",
		href: "https://twitter.com/spragginsdesign",
		external: true,
	},
	{
		id: "linecrush",
		label: "LineCrush",
		hint: "The flagship product",
		icon: <Sparkles className="h-4 w-4" />,
		keywords: "linecrush sports analytics company startup",
		href: "https://www.linecrush.com",
		external: true,
	},
];

export const CommandPalette: React.FC = () => {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [activeIndex, setActiveIndex] = useState(0);
	const inputRef = useRef<HTMLInputElement>(null);
	const listRef = useRef<HTMLDivElement>(null);

	const results = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return PALETTE_ITEMS;
		return PALETTE_ITEMS.filter(
			(item) =>
				item.label.toLowerCase().includes(q) || item.keywords.includes(q)
		);
	}, [query]);

	const close = useCallback(() => {
		setOpen(false);
		setQuery("");
		setActiveIndex(0);
	}, []);

	const runItem = useCallback(
		(item: PaletteItem) => {
			close();
			if (item.external) {
				window.open(item.href, "_blank", "noopener,noreferrer");
			} else {
				window.location.href = item.href;
			}
		},
		[close]
	);

	// Global shortcut: Cmd/Ctrl+K toggles, Escape closes
	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setOpen((prev) => !prev);
			} else if (e.key === "Escape" && open) {
				close();
			}
		};
		const onOpenEvent = () => setOpen(true);
		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("open-command-palette", onOpenEvent);
		return () => {
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("open-command-palette", onOpenEvent);
		};
	}, [open, close]);

	// Focus input + lock body scroll while open
	useEffect(() => {
		if (open) {
			inputRef.current?.focus();
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	// Keep the active item in view
	useEffect(() => {
		listRef.current
			?.querySelector(`[data-index="${activeIndex}"]`)
			?.scrollIntoView({ block: "nearest" });
	}, [activeIndex]);

	const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setActiveIndex((prev) => Math.max(prev - 1, 0));
		} else if (e.key === "Enter" && results[activeIndex]) {
			e.preventDefault();
			runItem(results[activeIndex]);
		}
	};

	return (
		<AnimatePresence>
			{open && (
				<motion.div
					className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[15vh]"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.15 }}
				>
					{/* Backdrop */}
					<div
						className="absolute inset-0 bg-background/70 backdrop-blur-sm"
						onClick={close}
					/>

					{/* Dialog */}
					<motion.div
						role="dialog"
						aria-modal="true"
						aria-label="Command palette"
						className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xl shadow-primary/5"
						initial={{ opacity: 0, scale: 0.97, y: -8 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.97, y: -8 }}
						transition={{ duration: 0.15 }}
					>
						<div className="flex items-center gap-3 border-b border-border/50 px-4">
							<Search className="h-4 w-4 shrink-0 text-muted-foreground" />
							<input
								ref={inputRef}
								type="text"
								value={query}
								onChange={(e) => {
									setQuery(e.target.value);
									setActiveIndex(0);
								}}
								onKeyDown={onInputKeyDown}
								placeholder="Jump to a section or link..."
								className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-muted-foreground/60"
								spellCheck={false}
								autoComplete="off"
							/>
							<kbd className="hidden shrink-0 rounded border border-border/60 bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">
								ESC
							</kbd>
						</div>

						<div ref={listRef} className="max-h-[320px] overflow-y-auto p-2">
							{results.length === 0 ? (
								<p className="px-3 py-8 text-center text-sm text-muted-foreground">
									No matches. Try &quot;projects&quot; or &quot;contact&quot;.
								</p>
							) : (
								results.map((item, index) => (
									<button
										key={item.id}
										data-index={index}
										onClick={() => runItem(item)}
										onMouseEnter={() => setActiveIndex(index)}
										className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
											index === activeIndex
												? "bg-primary/10 text-primary"
												: "text-foreground"
										}`}
									>
										<span
											className={
												index === activeIndex
													? "text-primary"
													: "text-muted-foreground"
											}
										>
											{item.icon}
										</span>
										<span className="flex-1 font-medium">{item.label}</span>
										<span className="text-xs text-muted-foreground">
											{item.hint}
										</span>
									</button>
								))
							)}
						</div>

						<div className="flex items-center justify-between border-t border-border/50 px-4 py-2 text-[10px] text-muted-foreground">
							<span>↑↓ navigate · Enter select</span>
							<span>⌘K / Ctrl+K to toggle</span>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default CommandPalette;
