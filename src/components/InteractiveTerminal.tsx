"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface CommandOutput {
	type: "input" | "output" | "error" | "ascii" | "system";
	content: string | React.ReactNode;
}

// Type for commands that reference other commands
type CommandHandler = () => string | React.ReactNode;

const COMMANDS: Record<string, () => string | React.ReactNode> = {
	help: () => `
╭─────────────────────────────────────────────────────────────╮
│                    AVAILABLE COMMANDS                       │
╰─────────────────────────────────────────────────────────────╯

  PORTFOLIO
  ─────────────────────────────────────────────────────────────
  about       →  Who is Austin Spraggins?
  skills      →  Technical skills & expertise
  experience  →  Work history & roles
  projects    →  Featured projects
  education   →  Educational background
  contact     →  Get in touch
  resume      →  View full resume
  socials     →  Social media links

  AI ASSISTANT
  ─────────────────────────────────────────────────────────────
  ask <question>  →  Ask AI anything about Austin!

  UNIX COMMANDS
  ─────────────────────────────────────────────────────────────
  ls          →  List files and directories
  pwd         →  Print working directory
  whoami      →  Display current user
  cat <file>  →  View file contents
  cd <dir>    →  Change directory
  date        →  Show current date/time
  uptime      →  System uptime
  neofetch    →  Display system info
  man         →  Manual pages
  clear       →  Clear terminal

  TIP: Try 'ask Is Austin available for hire?'
`,

	about: () => `
╭─────────────────────────────────────────────────────────────╮
│                    ABOUT AUSTIN SPRAGGINS                   │
╰─────────────────────────────────────────────────────────────╯

  👤 Austin Spraggins
  📍 Fresno, California
  💼 Co-Founder & CTO at LineCrush Inc.

  ─────────────────────────────────────────────────────────────

  I'm a passionate software engineer who went from truck driver
  to CTO. My journey taught me discipline, problem-solving, and
  the value of hard work.

  Today, I architect production systems at scale:
  • 353+ React components built
  • 45+ Python microservices deployed
  • 100+ PostgreSQL tables designed
  • 4+ LLM integrations in production

  I believe technology should extend human gifts, not replace
  them. My mission is to build tools that make the world more
  intelligent, loving, and just.

  Family man. Christian. Builder.
`,

	skills: () => `
╭─────────────────────────────────────────────────────────────╮
│                    TECHNICAL SKILLS                         │
╰─────────────────────────────────────────────────────────────╯

  FRONTEND                        BACKEND
  ─────────────────────────────   ─────────────────────────────
  ■■■■■■■■■■ React/Next.js        ■■■■■■■■■■ Python
  ■■■■■■■■■■ TypeScript           ■■■■■■■■■■ Node.js
  ■■■■■■■■■■ Tailwind CSS         ■■■■■■■■■░ FastAPI
  ■■■■■■■■■░ Framer Motion        ■■■■■■■■■■ REST APIs

  DATABASE                        AI/ML
  ─────────────────────────────   ─────────────────────────────
  ■■■■■■■■■■ PostgreSQL           ■■■■■■■■■■ OpenAI GPT
  ■■■■■■■■■░ Redis                ■■■■■■■■■░ Anthropic Claude
  ■■■■■■■■■░ MongoDB              ■■■■■■■■■░ Google Vision
  ■■■■■■■■■░ Neon                 ■■■■■■■■■░ Perplexity

  DEVOPS & TOOLS
  ─────────────────────────────────────────────────────────────
  ■■■■■■■■■■ Git/GitHub           ■■■■■■■■■░ Docker
  ■■■■■■■■■░ AWS (S3, SES, CF)    ■■■■■■■■■■ Vercel
  ■■■■■■■■■░ Linux/Ubuntu         ■■■■■■■■■░ CI/CD
`,

	experience: () => `
╭─────────────────────────────────────────────────────────────╮
│                    WORK EXPERIENCE                          │
╰─────────────────────────────────────────────────────────────╯

  ┌─────────────────────────────────────────────────────────┐
  │  CO-FOUNDER & CTO                                       │
  │  LineCrush Inc. | 2023 - Present                        │
  └─────────────────────────────────────────────────────────┘

  Leading technical strategy and development for a sports
  analytics platform serving thousands of users.

  Key Achievements:
  • Architected full-stack platform from ground up
  • Built 353+ React components, 45+ Python microservices
  • Designed 100+ PostgreSQL tables with Redis caching
  • Integrated 4+ LLMs for intelligent analytics
  • Deployed on AWS with 99.9% uptime

  ─────────────────────────────────────────────────────────────

  ┌─────────────────────────────────────────────────────────┐
  │  WEB DEVELOPMENT INSTRUCTOR                             │
  │  Bitwise Industries / Geekwise Academy | 2021 - 2023    │
  └─────────────────────────────────────────────────────────┘

  Taught web development fundamentals to aspiring developers.
  • HTML, CSS, JavaScript, React
  • Mentored 50+ students into tech careers
  • Developed curriculum and hands-on projects
`,

	projects: () => `
╭─────────────────────────────────────────────────────────────╮
│                    FEATURED PROJECTS                        │
╰─────────────────────────────────────────────────────────────╯

  ★ LINECRUSH (Flagship)
  ──────────────────────────────────────────────────────────
  Sports analytics platform with AI-powered insights
  Tech: Next.js, Python, PostgreSQL, Redis, AWS
  Stats: 353+ components | 45+ services | 100+ tables
  URL: https://linecrush.com

  ◆ BIBLE AI EXPLORER
  ──────────────────────────────────────────────────────────
  AI-powered Bible study application
  Tech: Next.js, OpenAI, TypeScript
  Features: Contextual search, AI explanations

  ◆ SAVELIFE CPR
  ──────────────────────────────────────────────────────────
  Emergency CPR guidance application
  Tech: React, Node.js

  ◆ AI TUTOR WEBAPP
  ──────────────────────────────────────────────────────────
  Educational AI assistant for students
  Tech: Next.js, OpenAI, Tailwind

  Type 'socials' to view GitHub for more projects →
`,

	education: () => `
╭─────────────────────────────────────────────────────────────╮
│                    EDUCATION                                │
╰─────────────────────────────────────────────────────────────╯

  🎓 ASSOCIATE OF ARTS - WEB DEVELOPMENT
     Community College | 5+ Years of Study

     Consistently achieved high grades while working
     and supporting family. Focused on:
     • Web Development Fundamentals
     • Programming Languages
     • Database Design
     • Software Engineering Principles

  ─────────────────────────────────────────────────────────────

  📚 CONTINUOUS LEARNING

     • Self-taught Python & AI/ML
     • AWS Certifications (in progress)
     • Regular contributor to open source
     • Teaching web development reinforced expertise
`,

	contact: () => `
╭─────────────────────────────────────────────────────────────╮
│                    GET IN TOUCH                             │
╰─────────────────────────────────────────────────────────────╯

  💼 OPEN TO CONTRACTS & CONSULTING

  ─────────────────────────────────────────────────────────────

  📧 Email:    spragginsdesigns@gmail.com
  🐙 GitHub:   github.com/spragginsdesigns
  💼 LinkedIn: linkedin.com/in/spragginsdesigns
  🐦 Twitter:  @spragginsdesign

  ─────────────────────────────────────────────────────────────

  SERVICES OFFERED:

  • Full-stack application development
  • AI/ML integration & prompt engineering
  • System architecture & scalability consulting
  • Technical leadership & mentoring
  • Code review & optimization

  Scroll down to use the contact form, or reach out directly!
`,

	resume: () => `
╭─────────────────────────────────────────────────────────────╮
│                    RESUME                                   │
╰─────────────────────────────────────────────────────────────╯

  AUSTIN SPRAGGINS
  Co-Founder & CTO | Senior Software Engineer
  Fresno, California

  ═══════════════════════════════════════════════════════════

  SUMMARY
  ───────────────────────────────────────────────────────────
  Full-stack engineer with 2+ years building production
  systems at scale. Expertise in React, Python, PostgreSQL,
  and AI/ML integration. Former educator, current CTO.

  TECHNICAL EXPERTISE
  ───────────────────────────────────────────────────────────
  Frontend:  React, Next.js, TypeScript, Tailwind CSS
  Backend:   Python, Node.js, FastAPI, REST APIs
  Database:  PostgreSQL, Redis, MongoDB
  AI/ML:     OpenAI, Anthropic, Google Vision, Perplexity
  DevOps:    AWS, Docker, Vercel, GitHub Actions

  KEY METRICS
  ───────────────────────────────────────────────────────────
  • 353+ React components built
  • 45+ Python microservices deployed
  • 100+ PostgreSQL tables designed
  • 4+ LLM integrations in production
  • 50+ students mentored into tech careers

  📄 View full PDF: Scroll down to Skills section
`,

	socials: () => `
╭─────────────────────────────────────────────────────────────╮
│                    SOCIAL LINKS                             │
╰─────────────────────────────────────────────────────────────╯

  🐙 GitHub
     https://github.com/spragginsdesigns
     Check out my open source projects and contributions

  💼 LinkedIn
     https://linkedin.com/in/spragginsdesigns
     Professional network and recommendations

  🐦 Twitter/X
     https://twitter.com/spragginsdesign
     Tech thoughts and updates

  🌐 Portfolio
     https://spragginsdesigns.xyz
     You're already here! 👋
`,

	"sudo hire austin": () => `
╭─────────────────────────────────────────────────────────────╮
│  🎉 CONGRATULATIONS! YOU'VE UNLOCKED A SECRET!              │
╰─────────────────────────────────────────────────────────────╯

  [sudo] password for visitor: ************

  ✓ Authentication successful
  ✓ Loading Austin's availability...
  ✓ Checking calendar...

  ═══════════════════════════════════════════════════════════

        🚀 AUSTIN IS AVAILABLE FOR HIRE! 🚀

  ═══════════════════════════════════════════════════════════

  You've discovered that Austin is actively seeking:

  • Contract work
  • Consulting engagements
  • Technical partnerships
  • Interesting projects

  Ready to build something amazing together?

  📧 Email him: spragginsdesigns@gmail.com
  💬 Or scroll down to the contact form!

  ═══════════════════════════════════════════════════════════
`,

	// Unix-like commands
	ls: () => `
  about.txt     education/    projects/     socials.txt
  skills.txt    experience/   contact.txt   resume.pdf

  Type any filename or folder name to view contents.
`,

	pwd: () => `/home/visitor/austin-portfolio`,

	whoami: () => `visitor (guest user)

  Want to know who Austin is? Type 'about'`,

	cat: () => `
  Usage: cat <filename>

  Try: 'cat about.txt' or just type 'about'
`,

	"cat about.txt": () => COMMANDS.about(),
	"cat skills.txt": () => COMMANDS.skills(),
	"cat contact.txt": () => COMMANDS.contact(),
	"cat socials.txt": () => COMMANDS.socials(),
	"cat resume.pdf": () => COMMANDS.resume(),

	cd: () => `
  This is a single-page portfolio terminal.
  All content is accessible from the root directory.

  Try: 'ls' to see available files, or type a command like 'about'
`,

	"cd projects": () => COMMANDS.projects(),
	"cd education": () => COMMANDS.education(),
	"cd experience": () => COMMANDS.experience(),

	echo: () => `
  Usage: echo <message>

  Try: 'echo Hello World'
`,

	date: () => {
		const now = new Date();
		return now.toString();
	},

	uptime: () => `
  System uptime: 2+ years in production
  Portfolio uptime: since 2024
  Coffee consumed: ∞ cups
`,

	neofetch: () => `
  ███████╗██████╗ ██████╗  █████╗  ██████╗  ██████╗ ██╗███╗   ██╗███████╗
  ██╔════╝██╔══██╗██╔══██╗██╔══██╗██╔════╝ ██╔════╝ ██║████╗  ██║██╔════╝
  ███████╗██████╔╝██████╔╝███████║██║  ███╗██║  ███╗██║██╔██╗ ██║███████╗
  ╚════██║██╔═══╝ ██╔══██╗██╔══██║██║   ██║██║   ██║██║██║╚██╗██║╚════██║
  ███████║██║     ██║  ██║██║  ██║╚██████╔╝╚██████╔╝██║██║ ╚████║███████║
  ╚══════╝╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝╚═╝  ╚═══╝╚══════╝
                              ██████╗ ███████╗
                             ██╔═══██╗██╔════╝
                             ██║   ██║███████╗
                             ██║   ██║╚════██║
                             ╚██████╔╝███████║
                              ╚═════╝ ╚══════╝
  ─────────────────────────────────────────────────────────────────────
  OS:        SpragginsOS v2.0 (Portfolio Edition)
  Host:      Austin Spraggins
  Role:      Co-Founder & CTO @ LineCrush
  Uptime:    2+ years in production
  Shell:     bash 5.1.16
  Terminal:  visitor@austin-portfolio
  ─────────────────────────────────────────────────────────────────────
  CPU:       353+ React Components
  Memory:    100+ PostgreSQL Tables
  Services:  45+ Python Microservices
  AI:        4+ LLM Integrations
  ─────────────────────────────────────────────────────────────────────
`,

	man: () => `
  Manual pages available for:

  about       - Display information about Austin
  skills      - Show technical skills
  experience  - View work history
  projects    - List featured projects
  education   - Educational background
  contact     - Contact information
  resume      - Full resume
  socials     - Social media links

  Unix commands: ls, pwd, whoami, cat, cd, date, uptime, neofetch
`,

	"--help": () => COMMANDS.help(),
	"-h": () => COMMANDS.help(),
	"?": () => COMMANDS.help(),

	"": () => "",
};

const WELCOME_MESSAGE_DESKTOP = `
  ███████╗██████╗ ██████╗  █████╗  ██████╗  ██████╗ ██╗███╗   ██╗███████╗
  ██╔════╝██╔══██╗██╔══██╗██╔══██╗██╔════╝ ██╔════╝ ██║████╗  ██║██╔════╝
  ███████╗██████╔╝██████╔╝███████║██║  ███╗██║  ███╗██║██╔██╗ ██║███████╗
  ╚════██║██╔═══╝ ██╔══██╗██╔══██║██║   ██║██║   ██║██║██║╚██╗██║╚════██║
  ███████║██║     ██║  ██║██║  ██║╚██████╔╝╚██████╔╝██║██║ ╚████║███████║
  ╚══════╝╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝╚═╝  ╚═══╝╚══════╝
                              ██████╗ ███████╗
                             ██╔═══██╗██╔════╝
                             ██║   ██║███████╗
                             ██║   ██║╚════██║
                             ╚██████╔╝███████║
                              ╚═════╝ ╚══════╝
  ─────────────────────────────────────────────────────────────────────
  OS:        SpragginsOS v2.0 (Portfolio Edition)
  Host:      Austin Spraggins
  Role:      Co-Founder & CTO @ LineCrush
  Uptime:    2+ years in production
  Shell:     bash 5.1.16
  Terminal:  visitor@austin-portfolio
  ─────────────────────────────────────────────────────────────────────
  CPU:       353+ React Components
  Memory:    100+ PostgreSQL Tables
  Services:  45+ Python Microservices
  AI:        4+ LLM Integrations
  ─────────────────────────────────────────────────────────────────────

  Type 'help' for available commands.

`;

const WELCOME_MESSAGE_MOBILE = `
╭──────────────────────────────╮
│      SPRAGGINS OS v2.0       │
│      Portfolio Edition       │
╰──────────────────────────────╯

  Host:     Austin Spraggins
  Role:     Co-Founder & CTO
  Company:  LineCrush Inc.
  Uptime:   2+ years production

  ────────────────────────────

  Components:  353+
  Services:    45+
  DB Tables:   100+
  LLMs:        4+

  ────────────────────────────

  Type 'help' for commands.

`;

const InteractiveTerminal: React.FC = () => {
	const [isMobile, setIsMobile] = useState(false);
	const [history, setHistory] = useState<CommandOutput[]>([]);
	const [currentInput, setCurrentInput] = useState("");
	const [commandHistory, setCommandHistory] = useState<string[]>([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const [isTyping, setIsTyping] = useState(false);
	const [isInitialized, setIsInitialized] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const terminalRef = useRef<HTMLDivElement>(null);
	const { ref: inViewRef, inView } = useInView({
		threshold: 0.2,
		triggerOnce: true,
	});

	// Detect mobile and set initial welcome message
	useEffect(() => {
		const checkMobile = () => {
			const mobile = window.innerWidth < 768;
			setIsMobile(mobile);
			return mobile;
		};

		const mobile = checkMobile();
		if (!isInitialized) {
			setHistory([
				{ type: "ascii", content: mobile ? WELCOME_MESSAGE_MOBILE : WELCOME_MESSAGE_DESKTOP }
			]);
			setIsInitialized(true);
		}

		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, [isInitialized]);

	// Auto-scroll to bottom
	useEffect(() => {
		if (terminalRef.current) {
			terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
		}
	}, [history]);

	// Focus input when clicking terminal
	const focusInput = useCallback(() => {
		inputRef.current?.focus();
	}, []);

	// Type output character by character
	const typeOutput = useCallback(
		async (output: string | React.ReactNode): Promise<void> => {
			if (typeof output !== "string") {
				setHistory((prev) => [...prev, { type: "output", content: output }]);
				return;
			}

			setIsTyping(true);
			const lines = output.split("\n");
			let fullContent = "";

			for (let i = 0; i < lines.length; i++) {
				fullContent += (i > 0 ? "\n" : "") + lines[i];
				setHistory((prev) => {
					const newHistory = [...prev];
					if (newHistory[newHistory.length - 1]?.type === "output") {
						newHistory[newHistory.length - 1] = {
							type: "output",
							content: fullContent,
						};
					} else {
						newHistory.push({ type: "output", content: fullContent });
					}
					return newHistory;
				});
				// Small delay between lines for effect
				await new Promise((resolve) => setTimeout(resolve, 15));
			}

			setIsTyping(false);
		},
		[]
	);

	// Handle AI ask command
	const handleAskCommand = useCallback(
		async (question: string) => {
			setIsTyping(true);
			setHistory((prev) => [
				...prev,
				{ type: "system", content: "🤖 Thinking..." },
			]);

			try {
				const response = await fetch("/api/ask-ai", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ question }),
				});

				const data = await response.json();

				// Remove the "Thinking..." message
				setHistory((prev) => prev.slice(0, -1));

				if (response.ok) {
					await typeOutput(`🤖 ${data.response}`);
				} else {
					setHistory((prev) => [
						...prev,
						{
							type: "error",
							content: `Error: ${data.error || "Failed to get response"}`,
						},
					]);
					setIsTyping(false);
				}
			} catch {
				// Remove the "Thinking..." message
				setHistory((prev) => prev.slice(0, -1));
				setHistory((prev) => [
					...prev,
					{
						type: "error",
						content: "Error: Failed to connect to AI. Please try again.",
					},
				]);
				setIsTyping(false);
			}
		},
		[typeOutput]
	);

	// Handle command execution
	const executeCommand = useCallback(
		async (cmd: string) => {
			const trimmedCmd = cmd.trim().toLowerCase();
			const originalCmd = cmd.trim();

			// Add input to history
			setHistory((prev) => [
				...prev,
				{ type: "input", content: `visitor@austin-portfolio:~$ ${cmd}` },
			]);

			// Add to command history
			if (trimmedCmd) {
				setCommandHistory((prev) => [...prev, trimmedCmd]);
			}

			// Handle clear command
			if (trimmedCmd === "clear") {
				setHistory([{ type: "ascii", content: isMobile ? WELCOME_MESSAGE_MOBILE : WELCOME_MESSAGE_DESKTOP }]);
				return;
			}

			// Handle ask command (AI chat)
			if (trimmedCmd.startsWith("ask ")) {
				const question = originalCmd.slice(4).trim();
				if (question) {
					await handleAskCommand(question);
				} else {
					setHistory((prev) => [
						...prev,
						{
							type: "output",
							content: `Usage: ask <question>

  Ask the AI anything about Austin Spraggins!

  Examples:
    ask What are Austin's main skills?
    ask Is Austin available for hire?
    ask Tell me about LineCrush
    ask What's Austin's tech stack?`,
						},
					]);
				}
				return;
			}

			// Handle just "ask" without a question
			if (trimmedCmd === "ask") {
				setHistory((prev) => [
					...prev,
					{
						type: "output",
						content: `Usage: ask <question>

  Ask the AI anything about Austin Spraggins!

  Examples:
    ask What are Austin's main skills?
    ask Is Austin available for hire?
    ask Tell me about LineCrush
    ask What's Austin's tech stack?`,
					},
				]);
				return;
			}

			// Get command handler
			const handler = COMMANDS[trimmedCmd];

			if (handler) {
				await typeOutput(handler());
			} else if (trimmedCmd) {
				setHistory((prev) => [
					...prev,
					{
						type: "error",
						content: `Command not found: ${trimmedCmd}. Type 'help' for available commands.`,
					},
				]);
			}
		},
		[typeOutput, isMobile, handleAskCommand]
	);

	// Handle key events
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter" && !isTyping) {
				executeCommand(currentInput);
				setCurrentInput("");
				setHistoryIndex(-1);
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				if (commandHistory.length > 0) {
					const newIndex =
						historyIndex < commandHistory.length - 1
							? historyIndex + 1
							: historyIndex;
					setHistoryIndex(newIndex);
					setCurrentInput(
						commandHistory[commandHistory.length - 1 - newIndex] || ""
					);
				}
			} else if (e.key === "ArrowDown") {
				e.preventDefault();
				if (historyIndex > 0) {
					const newIndex = historyIndex - 1;
					setHistoryIndex(newIndex);
					setCurrentInput(
						commandHistory[commandHistory.length - 1 - newIndex] || ""
					);
				} else {
					setHistoryIndex(-1);
					setCurrentInput("");
				}
			} else if (e.key === "Tab") {
				e.preventDefault();
				// Simple tab completion
				const commands = Object.keys(COMMANDS).filter(
					(c) => c && c.startsWith(currentInput.toLowerCase())
				);
				if (commands.length === 1) {
					setCurrentInput(commands[0]);
				}
			}
		},
		[
			currentInput,
			isTyping,
			executeCommand,
			commandHistory,
			historyIndex,
		]
	);

	return (
		<section
			ref={inViewRef}
			className="py-16 md:py-24 px-4 relative overflow-hidden"
			id="terminal"
		>
			{/* Background gradient */}
			<div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background pointer-events-none" />

			<div className="container mx-auto max-w-4xl relative z-10">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.5 }}
					className="text-center mb-8"
				>
					<h2 className="text-3xl md:text-4xl font-bold mb-3">
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-400">
							Interactive Terminal
						</span>
					</h2>
					<p className="text-muted-foreground">
						Explore my portfolio the developer way. Type{" "}
						<code className="bg-card px-2 py-0.5 rounded text-primary">
							help
						</code>{" "}
						to get started.
					</p>
				</motion.div>

				{/* Terminal Window */}
				<motion.div
					initial={{ opacity: 0, y: 30, scale: 0.95 }}
					animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="relative"
				>
					{/* Glow effect */}
					<div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-cyan-500/20 to-primary/20 rounded-xl blur-xl opacity-50" />

					{/* Terminal container */}
					<div
						className="relative bg-[#0a0a0a] rounded-xl border border-border/50 overflow-hidden shadow-2xl cursor-text"
						onClick={focusInput}
					>
						{/* macOS-style title bar */}
						<div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-border/30">
							{/* Traffic lights */}
							<div className="flex gap-2">
								<div className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff5f57]/80 transition-colors" />
								<div className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#febc2e]/80 transition-colors" />
								<div className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#28c840]/80 transition-colors" />
							</div>
							{/* Title */}
							<div className="flex-1 text-center">
								<span className="text-xs text-muted-foreground font-mono">
									visitor@austin-portfolio — bash
								</span>
							</div>
							{/* Spacer for symmetry */}
							<div className="w-14" />
						</div>

						{/* Terminal content */}
						<div
							ref={terminalRef}
							className="p-3 md:p-6 h-[350px] md:h-[500px] overflow-y-auto font-mono text-[11px] sm:text-sm md:text-base scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
						>
							<AnimatePresence>
								{history.map((item, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0, y: 5 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.1 }}
										className={`whitespace-pre-wrap break-words mb-1 ${
											item.type === "input"
												? "text-green-400"
												: item.type === "error"
													? "text-red-400"
													: item.type === "ascii"
														? "text-primary"
														: item.type === "system"
															? "text-yellow-400 animate-pulse"
															: "text-gray-300"
										}`}
									>
										{item.content}
									</motion.div>
								))}
							</AnimatePresence>

							{/* Input line */}
							<div className="flex items-center text-green-400 mt-2">
								<span className="mr-2 hidden sm:inline">visitor@austin-portfolio:~$</span>
								<span className="mr-2 sm:hidden">visitor:~$</span>
								<div className="flex-1 relative">
									<input
										ref={inputRef}
										type="text"
										value={currentInput}
										onChange={(e) => setCurrentInput(e.target.value)}
										onKeyDown={handleKeyDown}
										className="w-full bg-transparent outline-none text-white caret-primary"
										spellCheck={false}
										autoComplete="off"
										disabled={isTyping}
									/>
									{/* Blinking cursor when input is empty */}
									{!currentInput && !isTyping && (
										<span className="absolute left-0 top-0 w-2 h-5 bg-primary animate-blink" />
									)}
								</div>
							</div>
						</div>

						{/* Bottom bar with hints */}
						<div className="px-2 sm:px-4 py-2 bg-[#1a1a1a] border-t border-border/30 flex justify-between text-[10px] sm:text-xs text-muted-foreground">
							<span className="flex items-center gap-1">
								<kbd className="px-1 sm:px-1.5 py-0.5 bg-card rounded text-[9px] sm:text-[10px]">
									↑↓
								</kbd>
								<span className="hidden sm:inline">History</span>
							</span>
							<span className="flex items-center gap-1">
								<kbd className="px-1 sm:px-1.5 py-0.5 bg-card rounded text-[9px] sm:text-[10px]">
									Tab
								</kbd>
								<span className="hidden sm:inline">Autocomplete</span>
							</span>
							<span className="flex items-center gap-1">
								<kbd className="px-1 sm:px-1.5 py-0.5 bg-card rounded text-[9px] sm:text-[10px]">
									Enter
								</kbd>
								<span className="hidden sm:inline">Execute</span>
							</span>
						</div>
					</div>
				</motion.div>

				{/* Quick command buttons */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.5, delay: 0.4 }}
					className="flex flex-wrap justify-center gap-2 mt-6"
				>
					{["help", "about", "skills", "projects", "contact", "ask"].map(
						(cmd) => (
							<button
								key={cmd}
								onClick={() => {
									setCurrentInput(cmd);
									inputRef.current?.focus();
									executeCommand(cmd);
									setCurrentInput("");
								}}
								className="px-3 py-1.5 text-sm bg-card/50 border border-border/50 rounded-full text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
							>
								{cmd}
							</button>
						)
					)}
				</motion.div>
			</div>
		</section>
	);
};

export default InteractiveTerminal;
