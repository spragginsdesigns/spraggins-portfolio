"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface CommandOutput {
	type: "input" | "output" | "error" | "ascii" | "system";
	content: string | React.ReactNode;
}

const STATIC_COMMANDS: Record<string, () => string> = {
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
  agents      →  Autonomous AI delivery system
  games       →  LineCrush Games studio
  education   →  Educational background
  contact     →  Get in touch
  resume      →  View full resume
  socials     →  Social media links

  LIVE DEMOS
  ─────────────────────────────────────────────────────────────
  agent run       →  Watch an autonomous agent ship an issue
  ask <question>  →  Ask AI anything about Austin (streams!)

  UNIX COMMANDS
  ─────────────────────────────────────────────────────────────
  ls          →  List files and directories
  pwd         →  Print working directory
  whoami      →  Display current user
  cat <file>  →  View file contents
  cd <dir>    →  Change directory
  echo <msg>  →  Print a message
  man <cmd>   →  Manual pages
  history     →  Command history
  date        →  Show current date/time
  uptime      →  System uptime
  neofetch    →  Display system info
  clear       →  Clear terminal (or Ctrl+L)

  Ctrl+C interrupts a running command.
  There are secrets in here. Explore.
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

  Today, I architect AI-native production systems at scale:
  • 27,000+ monorepo commits
  • Nearly 1,000 tracked TSX modules and 366 API handlers
  • 64 agent skills shared across autonomous workflows
  • Web, iOS, Android, and browser-extension clients
  • Native Godot builds proven for Windows and Steam Deck

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
  │  LineCrush Inc. | 2024 - Present                        │
  └─────────────────────────────────────────────────────────┘

  Technical co-founder of an AI-powered sports intelligence
  platform serving users across web, mobile, and extensions.

  Key Achievements:
  • Architected full-stack platform from ground up
  • Built nearly 1,000 TSX modules and 366 API handlers
  • Ships AI picks, signal search, vision analysis, and reports
  • Created a 64-skill agent operating system for delivery
  • 27,000+ commits across web, data, native, and games

  ─────────────────────────────────────────────────────────────

  ┌─────────────────────────────────────────────────────────┐
  │  WEB DEVELOPMENT INSTRUCTOR                             │
  │  Bitwise Industries / Geekwise Academy | 2021 - 2023    │
  └─────────────────────────────────────────────────────────┘

  Taught web development fundamentals to aspiring developers.
  • HTML, CSS, JavaScript, React
  • Trained 200+ students, many into tech careers
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
  Systems: product AI | autonomous agents | 4 clients
  URL: https://linecrush.com

  ★ LINECRUSH GAMES (Private R&D)
  ──────────────────────────────────────────────────────────
  AI-native Godot studio: Space Miner, RockHunter, MERIDIAN
  Tech: Godot 4.7, GDScript, MCP, 3D asset pipelines
  Builds: Windows + Linux / Steam Deck smoke-proven

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

	agents: () => `
╭─────────────────────────────────────────────────────────────╮
│                 AUTONOMOUS DELIVERY SYSTEM                  │
╰─────────────────────────────────────────────────────────────╯

  Linear Issue
      ↓
  Investigate → Build → Prove → Review → Gate → Ship

  • Durable Codex and Claude sessions
  • Provider-neutral recovery and model routing
  • 64 shared agent skills and custom MCP tooling
  • Real product-path evidence before closeout
  • Web, Python, SwiftUI, Kotlin, and infrastructure lanes

  The goal isn't code generation. It's trustworthy delivery.

  ▶ Watch it in action: type 'agent run'
`,

	games: () => `
╭─────────────────────────────────────────────────────────────╮
│                    LINECRUSH GAMES                          │
╰─────────────────────────────────────────────────────────────╯

  SPACE MINER   → Steam Deck-first 2.5D survival miner
  ROCKHUNTER    → Playable mining-action spinoff
  MERIDIAN      → Story-first 3D space adventure

  Studio pipeline:
  • Agent-controlled Godot scenes, scripts, and playtests
  • Generated concepts, rigged 3D models, UI art, and audio
  • Predictive enemy behavior and gameplay automation
  • Headless tests, captures, and repeatable native exports

  Windows and Linux / Steam Deck builds are smoke-proven.
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
  • 800+ React components built
  • 115+ Python backend services deployed
  • 120+ PostgreSQL tables designed
  • 5 LLM providers orchestrated in production
  • 25,000+ commits shipped in 2+ years
  • 200+ students trained in web development

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

	ls: () => `
  about.txt     education/    projects/     socials.txt
  skills.txt    experience/   contact.txt   resume.pdf

  Type any filename or folder name to view contents.
`,

	pwd: () => `/home/visitor/austin-portfolio`,

	whoami: () => `visitor (guest user)

  Want to know who Austin is? Type 'about'`,

	date: () => new Date().toString(),

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
  Commits:   27K+ across the monorepo
  APIs:      366 tracked handlers
  Agents:    64 shared skills
  Clients:   Web + iOS + Android + extensions
  ─────────────────────────────────────────────────────────────────────
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
};

// One-line summaries for `man <command>`
const MAN_PAGES: Record<string, string> = {
	help: "Display the list of available commands.",
	about: "Display information about Austin Spraggins.",
	skills: "Show Austin's technical skills and proficiency.",
	experience: "View Austin's work history and roles.",
	projects: "List featured projects, including LineCrush.",
	agents: "Describe the autonomous AI delivery system.",
	games: "Describe the LineCrush Games studio.",
	education: "Show Austin's educational background.",
	contact: "Display contact information and services offered.",
	resume: "Print a condensed resume.",
	socials: "List social media and profile links.",
	ask: "ask <question> - Ask the AI assistant about Austin. Responses stream live.",
	agent: "agent run [issue] - Simulate the autonomous delivery loop. agent status - Show agent fleet status.",
	ls: "List files in the current directory.",
	pwd: "Print the current working directory.",
	whoami: "Print the current user.",
	cat: "cat <file> - Print file contents. Try 'ls' to see files.",
	cd: "cd <dir> - Change directory. Try 'ls' to see directories.",
	echo: "echo <message> - Print a message to the terminal.",
	history: "Show your command history for this session.",
	date: "Print the current date and time.",
	uptime: "Show system uptime.",
	neofetch: "Display system information with style.",
	clear: "Clear the terminal screen (shortcut: Ctrl+L).",
	man: "man <command> - Show the manual page for a command.",
	cowsay: "cowsay <message> - A cow says your message.",
};

// Virtual filesystem mappings for cat/cd
const CAT_FILES: Record<string, string> = {
	"about.txt": "about",
	"skills.txt": "skills",
	"contact.txt": "contact",
	"socials.txt": "socials",
	"resume.pdf": "resume",
};

const CD_DIRS: Record<string, string> = {
	projects: "projects",
	"projects/": "projects",
	education: "education",
	"education/": "education",
	experience: "experience",
	"experience/": "experience",
};

// Candidates for tab completion and typo suggestions
const COMPLETION_CANDIDATES = [
	"help",
	"about",
	"skills",
	"experience",
	"projects",
	"agents",
	"agent run",
	"agent status",
	"games",
	"education",
	"contact",
	"resume",
	"socials",
	"ask ",
	"ls",
	"pwd",
	"whoami",
	"cat ",
	"cd ",
	"echo ",
	"man ",
	"history",
	"date",
	"uptime",
	"neofetch",
	"clear",
	"cowsay ",
];

const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

interface AgentStep {
	phase: string;
	lines: { text: string; spinMs?: number }[];
}

interface AgentScenario {
	issue: string;
	title: string;
	lane: string;
	steps: AgentStep[];
	elapsed: string;
}

const AGENT_SCENARIOS: AgentScenario[] = [
	{
		issue: "LIN-1042",
		title: "Signal search returns stale results for live games",
		lane: "web",
		elapsed: "14m 32s",
		steps: [
			{
				phase: "INVESTIGATE",
				lines: [
					{ text: "Loading repo map + 64 agent skills", spinMs: 1200 },
					{ text: "Tracing signal-search data path", spinMs: 1600 },
					{ text: "Root cause: cache key ignores live-game state" },
				],
			},
			{
				phase: "BUILD",
				lines: [
					{ text: "Creating isolated workspace", spinMs: 900 },
					{ text: "Applying changes: 3 files, +42 −11", spinMs: 1400 },
					{ text: "Cache key now includes game state" },
				],
			},
			{
				phase: "PROVE",
				lines: [
					{ text: "Running build + type checks", spinMs: 1800 },
					{ text: "Product-path proof: live results refresh correctly" },
					{ text: "Evidence captured and attached" },
				],
			},
			{
				phase: "REVIEW",
				lines: [
					{ text: "Code-review gate", spinMs: 1500 },
					{ text: "2 style notes, 0 blockers → fixes applied" },
				],
			},
			{
				phase: "GATE",
				lines: [
					{ text: "Safety checks + evidence bundle verified", spinMs: 1000 },
				],
			},
			{
				phase: "SHIP",
				lines: [
					{ text: "PR merged · LIN-1042 closed with proof" },
				],
			},
		],
	},
	{
		issue: "LIN-2317",
		title: "iOS client: report view crashes on empty dataset",
		lane: "swiftui",
		elapsed: "11m 08s",
		steps: [
			{
				phase: "INVESTIGATE",
				lines: [
					{ text: "Loading repo map + SwiftUI lane skills", spinMs: 1100 },
					{ text: "Reproducing crash from issue evidence", spinMs: 1700 },
					{ text: "Root cause: force-unwrap on empty report payload" },
				],
			},
			{
				phase: "BUILD",
				lines: [
					{ text: "Creating isolated workspace", spinMs: 800 },
					{ text: "Applying changes: 2 files, +18 −6", spinMs: 1200 },
					{ text: "Added empty-state view + guarded optional" },
				],
			},
			{
				phase: "PROVE",
				lines: [
					{ text: "Building iOS target", spinMs: 2000 },
					{ text: "Simulator proof: empty dataset renders gracefully" },
				],
			},
			{
				phase: "REVIEW",
				lines: [
					{ text: "Code-review gate", spinMs: 1300 },
					{ text: "0 blockers → approved" },
				],
			},
			{
				phase: "GATE",
				lines: [
					{ text: "Safety checks + evidence bundle verified", spinMs: 900 },
				],
			},
			{
				phase: "SHIP",
				lines: [
					{ text: "PR merged · LIN-2317 closed with proof" },
				],
			},
		],
	},
	{
		issue: "LIN-3105",
		title: "Space Miner: drill audio desyncs on Steam Deck",
		lane: "godot",
		elapsed: "18m 47s",
		steps: [
			{
				phase: "INVESTIGATE",
				lines: [
					{ text: "Loading repo map + Godot lane skills", spinMs: 1200 },
					{ text: "Running headless playtest capture", spinMs: 2000 },
					{ text: "Root cause: audio stream not tied to physics tick" },
				],
			},
			{
				phase: "BUILD",
				lines: [
					{ text: "Creating isolated workspace", spinMs: 800 },
					{ text: "Applying changes: 1 scene, 2 scripts", spinMs: 1500 },
					{ text: "Drill audio now syncs with drill state machine" },
				],
			},
			{
				phase: "PROVE",
				lines: [
					{ text: "Headless test suite", spinMs: 1600 },
					{ text: "Native export: Windows + Linux builds", spinMs: 2200 },
					{ text: "Capture proof: audio locked to drill animation" },
				],
			},
			{
				phase: "REVIEW",
				lines: [
					{ text: "Code-review gate", spinMs: 1200 },
					{ text: "1 naming note → fixed" },
				],
			},
			{
				phase: "GATE",
				lines: [
					{ text: "Safety checks + evidence bundle verified", spinMs: 900 },
				],
			},
			{
				phase: "SHIP",
				lines: [
					{ text: "PR merged · LIN-3105 closed with proof" },
				],
			},
		],
	},
];

const VIM_SCREEN = `
  ~
  ~
  ~                VIM - Vi IMproved
  ~
  ~              version 9.1.portfolio
  ~
  ~         You are now trapped in vim.
  ~         Type ':q!' to escape.
  ~         (It's okay. Everyone googles it.)
  ~
  ~
`;

function buildCowsay(message: string): string {
	const words = message.split(/\s+/);
	const lines: string[] = [];
	let current = "";
	for (const word of words) {
		if ((current + " " + word).trim().length > 38) {
			lines.push(current.trim());
			current = word;
		} else {
			current = (current + " " + word).trim();
		}
	}
	if (current) lines.push(current);

	const width = Math.max(...lines.map((l) => l.length));
	const border = "─".repeat(width + 2);
	const bubble =
		lines.length === 1
			? `  < ${lines[0]} >`
			: lines
					.map((l, i) => {
						const padded = l.padEnd(width);
						if (i === 0) return `  / ${padded} \\`;
						if (i === lines.length - 1) return `  \\ ${padded} /`;
						return `  | ${padded} |`;
					})
					.join("\n");

	return `
   ${border}
${bubble}
   ${border}
          \\   ^__^
           \\  (oo)\\_______
              (__)\\       )\\/\\
                  ||----w |
                  ||     ||
`;
}

function levenshtein(a: string, b: string): number {
	const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
	for (let j = 0; j <= b.length; j++) dp[0][j] = j;
	for (let i = 1; i <= a.length; i++) {
		for (let j = 1; j <= b.length; j++) {
			dp[i][j] = Math.min(
				dp[i - 1][j] + 1,
				dp[i][j - 1] + 1,
				dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
			);
		}
	}
	return dp[a.length][b.length];
}

function suggestCommand(input: string): string | null {
	const names = COMPLETION_CANDIDATES.map((c) => c.trim());
	let best: string | null = null;
	let bestDist = 3; // only suggest when reasonably close
	for (const name of names) {
		const dist = levenshtein(input, name);
		if (dist < bestDist) {
			bestDist = dist;
			best = name;
		}
	}
	return best;
}

const KONAMI_SEQUENCE = [
	"ArrowUp",
	"ArrowUp",
	"ArrowDown",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"ArrowLeft",
	"ArrowRight",
	"b",
	"a",
];

// Keep this short enough to fit the terminal viewport without scrolling,
// otherwise the terminal captures the mouse wheel before the page does.
const WELCOME_MESSAGE_DESKTOP = `
  ╭─────────────────────────────────────────────────────────────╮
  │   SpragginsOS v2.0 - Portfolio Edition                      │
  ╰─────────────────────────────────────────────────────────────╯

  Host:      Austin Spraggins
  Role:      Co-Founder & CTO @ LineCrush
  Uptime:    2+ years in production
  ───────────────────────────────────────────────────────────────
  Commits:   27,000+ across the monorepo
  APIs:      366 tracked handlers
  Agents:    64 shared skills
  Clients:   Web + iOS + Android + extensions
  Games:     Native Windows + Steam Deck builds
  ───────────────────────────────────────────────────────────────

  Type 'help' for commands - or try 'agent run'.
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

  Commits:     27K+
  APIs:        366
  Agent skills: 64
  Clients:     4
  Game builds: 2

  ────────────────────────────

  Type 'help' for commands.
  Try 'agent run'.

`;

const ASK_USAGE = `Usage: ask <question>

  Ask the AI anything about Austin Spraggins!

  Examples:
    ask What are Austin's main skills?
    ask Is Austin available for hire?
    ask Tell me about LineCrush
    ask What's Austin's tech stack?`;

const HISTORY_STORAGE_KEY = "spraggins-terminal-history";

const InteractiveTerminal: React.FC = () => {
	const [isMobile, setIsMobile] = useState(false);
	const [history, setHistory] = useState<CommandOutput[]>([]);
	const [currentInput, setCurrentInput] = useState("");
	const [commandHistory, setCommandHistory] = useState<string[]>([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const [isTyping, setIsTyping] = useState(false);
	const [isInitialized, setIsInitialized] = useState(false);
	const [vimMode, setVimMode] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const terminalRef = useRef<HTMLDivElement>(null);
	const cancelRef = useRef(false);
	const abortRef = useRef<AbortController | null>(null);
	const konamiRef = useRef<string[]>([]);
	const agentScenarioRef = useRef(0);
	const { ref: inViewRef, inView } = useInView({
		threshold: 0.2,
		triggerOnce: true,
	});

	// Detect mobile, set initial welcome message, restore command history
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
			try {
				const saved = sessionStorage.getItem(HISTORY_STORAGE_KEY);
				if (saved) setCommandHistory(JSON.parse(saved));
			} catch {
				// sessionStorage unavailable (private mode) - start fresh
			}
			setIsInitialized(true);
		}

		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, [isInitialized]);

	// Persist command history for the session
	useEffect(() => {
		if (!isInitialized || commandHistory.length === 0) return;
		try {
			sessionStorage.setItem(
				HISTORY_STORAGE_KEY,
				JSON.stringify(commandHistory.slice(-50))
			);
		} catch {
			// Ignore storage failures
		}
	}, [commandHistory, isInitialized]);

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

	const appendLine = useCallback(
		(type: CommandOutput["type"], content: string | React.ReactNode) => {
			setHistory((prev) => [...prev, { type, content }]);
		},
		[]
	);

	const replaceLastLine = useCallback((content: string) => {
		setHistory((prev) => {
			if (prev.length === 0) return prev;
			const next = [...prev];
			next[next.length - 1] = { ...next[next.length - 1], content };
			return next;
		});
	}, []);

	const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

	// Type output line by line
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
				if (cancelRef.current) break;
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

	// Animated spinner line that resolves to a checkmark
	const spinLine = useCallback(
		async (text: string, ms: number): Promise<boolean> => {
			appendLine("output", `  ⠋ ${text}`);
			const started = Date.now();
			let frame = 0;
			while (Date.now() - started < ms) {
				if (cancelRef.current) return false;
				await sleep(70);
				// Re-check after waking: Ctrl+C may have appended a ^C line that
				// replaceLastLine would otherwise overwrite
				if (cancelRef.current) return false;
				frame++;
				replaceLastLine(`  ${SPINNER_FRAMES[frame % SPINNER_FRAMES.length]} ${text}`);
			}
			replaceLastLine(`  ✓ ${text}`);
			return true;
		},
		[appendLine, replaceLastLine]
	);

	// Simulated autonomous agent delivery run
	const runAgentSimulation = useCallback(
		async (issueArg?: string) => {
			setIsTyping(true);
			cancelRef.current = false;

			const scenario =
				AGENT_SCENARIOS[agentScenarioRef.current % AGENT_SCENARIOS.length];
			agentScenarioRef.current++;
			const issue = issueArg?.toUpperCase() || scenario.issue;

			try {
				appendLine("system", `▸ Issue: ${issue} - "${scenario.title}"`);
				await sleep(300);
				if (cancelRef.current) return;
				appendLine(
					"system",
					`▸ Lane: ${scenario.lane} · Skills loaded: 64 · Session: durable`
				);
				await sleep(500);

				for (let s = 0; s < scenario.steps.length; s++) {
					if (cancelRef.current) return;
					const step = scenario.steps[s];
					appendLine("ascii", `\n[${s + 1}/${scenario.steps.length}] ${step.phase}`);
					await sleep(250);

					for (const line of step.lines) {
						if (cancelRef.current) return;
						if (line.spinMs) {
							const finished = await spinLine(line.text, line.spinMs);
							if (!finished) return;
						} else {
							appendLine("output", `  ✓ ${line.text}`);
							await sleep(350);
						}
					}
				}

				if (cancelRef.current) return;
				await sleep(400);
				appendLine(
					"ascii",
					`\n── Delivery complete in ${scenario.elapsed} (simulated) ──────────`
				);
				appendLine(
					"output",
					`  This is a dramatization of the real autonomous delivery\n  loop running at LineCrush. Type 'agents' for how it works,\n  or 'agent run' again for a different issue.`
				);
			} finally {
				setIsTyping(false);
			}
		},
		[appendLine, spinLine]
	);

	// Matrix rain easter egg
	const runMatrix = useCallback(async () => {
		setIsTyping(true);
		cancelRef.current = false;
		const glyphs = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈ0123456789";
		try {
			for (let i = 0; i < 9; i++) {
				if (cancelRef.current) return;
				let line = "  ";
				for (let j = 0; j < 48; j++) {
					line += Math.random() > 0.3 ? glyphs[Math.floor(Math.random() * glyphs.length)] : " ";
				}
				appendLine("ascii", line);
				await sleep(120);
			}
			if (cancelRef.current) return;
			await sleep(500);
			appendLine("system", "\n  Wake up, visitor...");
			await sleep(900);
			if (cancelRef.current) return;
			appendLine("system", "  The portfolio has you.");
			await sleep(900);
			if (cancelRef.current) return;
			appendLine("system", "  Follow the white rabbit. 🐇  (try 'sudo hire austin')");
		} finally {
			setIsTyping(false);
		}
	}, [appendLine]);

	// Streaming AI ask command
	const handleAskCommand = useCallback(
		async (question: string) => {
			setIsTyping(true);
			cancelRef.current = false;
			abortRef.current = new AbortController();
			appendLine("system", "🤖 Thinking...");

			try {
				const response = await fetch("/api/ask-ai", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ question }),
					signal: abortRef.current.signal,
				});

				const contentType = response.headers.get("content-type") || "";

				if (!response.ok || contentType.includes("application/json")) {
					const data = await response.json().catch(() => null);
					setHistory((prev) => prev.slice(0, -1));
					appendLine(
						"error",
						`Error: ${data?.error || "Failed to get response"}`
					);
					return;
				}

				// Remove the "Thinking..." message and stream into one entry
				setHistory((prev) => prev.slice(0, -1));
				appendLine("output", "🤖 ");
				let text = "🤖 ";

				const reader = response.body?.getReader();
				if (!reader) {
					appendLine("error", "Error: Empty response from AI.");
					return;
				}

				const decoder = new TextDecoder();
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;
					text += decoder.decode(value, { stream: true });
					replaceLastLine(text);
				}
			} catch (err) {
				setHistory((prev) =>
					prev[prev.length - 1]?.type === "system" ? prev.slice(0, -1) : prev
				);
				if (!(err instanceof DOMException && err.name === "AbortError")) {
					appendLine("error", "Error: Failed to connect to AI. Please try again.");
				}
			} finally {
				setIsTyping(false);
				abortRef.current = null;
			}
		},
		[appendLine, replaceLastLine]
	);

	// Handle command execution
	const executeCommand = useCallback(
		async (cmd: string) => {
			const trimmed = cmd.trim();
			const lower = trimmed.toLowerCase();
			cancelRef.current = false;

			// Echo the input line
			setHistory((prev) => [
				...prev,
				{ type: "input", content: `visitor@austin-portfolio:~$ ${cmd}` },
			]);

			if (trimmed) {
				setCommandHistory((prev) => [...prev, trimmed]);
			}
			if (!trimmed) return;

			// Vim trap intercepts everything until you escape
			if (vimMode) {
				if ([":q", ":q!", ":wq", ":x", "zz"].includes(lower)) {
					setVimMode(false);
					appendLine("output", "\n  You escaped vim. Not everyone makes it out. 🏆");
				} else if (lower === ":w") {
					appendLine("output", `  "portfolio.txt" written. Still trapped though.`);
				} else {
					appendLine("error", `  E492: Not an editor command: ${trimmed}`);
					appendLine("output", "  (hint: ':q!' gets you out)");
				}
				return;
			}

			// Full-string matches first (multi-word secrets & legacy combos)
			if (lower === "sudo hire austin") {
				await typeOutput(STATIC_COMMANDS["sudo hire austin"]());
				return;
			}
			if (lower === "sudo rm -rf /" || lower === "rm -rf /") {
				appendLine("error", "  rm: it would be a shame if something happened to this portfolio...");
				await sleep(600);
				appendLine("output", "  ✗ Permission denied: protected by 27,000+ commits of backups");
				appendLine("output", "  Nice try though. Austin appreciates the chaos energy. 😄");
				return;
			}

			const [name, ...args] = lower.split(/\s+/);
			const rawArgs = trimmed.slice(name.length).trim();

			switch (name) {
				case "clear":
					setHistory([
						{
							type: "ascii",
							content: isMobile ? WELCOME_MESSAGE_MOBILE : WELCOME_MESSAGE_DESKTOP,
						},
					]);
					return;

				case "ask":
					if (rawArgs) {
						await handleAskCommand(rawArgs);
					} else {
						appendLine("output", ASK_USAGE);
					}
					return;

				case "agent":
					if (args[0] === "run") {
						await runAgentSimulation(args[1]);
					} else if (args[0] === "status") {
						await typeOutput(`
  AGENT FLEET STATUS
  ─────────────────────────────────────────────
  Skills loaded:     64
  Lanes:             web · python · swiftui · kotlin · godot · infra
  Sessions:          durable (provider-neutral)
  Review gate:       armed
  Evidence policy:   product-path proof required

  All quiet. Type 'agent run' to watch a delivery.`);
					} else {
						appendLine(
							"output",
							"Usage: agent run [issue-id] | agent status\n\n  Try: 'agent run' to watch an autonomous delivery."
						);
					}
					return;

				case "echo":
					appendLine("output", rawArgs || "");
					return;

				case "man": {
					if (!args[0]) {
						await typeOutput(STATIC_COMMANDS.help());
						return;
					}
					const page = MAN_PAGES[args[0]];
					if (page) {
						appendLine("output", `\n  ${args[0].toUpperCase()}(1)\n\n  ${page}\n`);
					} else {
						appendLine("error", `No manual entry for ${args[0]}`);
					}
					return;
				}

				case "cat": {
					if (!args[0]) {
						appendLine("output", "Usage: cat <filename>\n\n  Try: 'cat about.txt' or 'ls' to see files");
						return;
					}
					const target = CAT_FILES[args[0]];
					if (target) {
						await typeOutput(STATIC_COMMANDS[target]());
					} else {
						appendLine("error", `cat: ${args[0]}: No such file or directory`);
					}
					return;
				}

				case "cd": {
					if (!args[0]) {
						appendLine(
							"output",
							"\n  This is a single-page portfolio terminal.\n  All content is accessible from the root directory.\n\n  Try: 'ls' to see what's here."
						);
						return;
					}
					const dir = CD_DIRS[args[0]];
					if (dir) {
						await typeOutput(STATIC_COMMANDS[dir]());
					} else {
						appendLine("error", `cd: ${args[0]}: No such directory`);
					}
					return;
				}

				case "history": {
					const entries = commandHistory
						.slice(-20)
						.map((c, i) => `  ${String(i + 1).padStart(3)}  ${c}`)
						.join("\n");
					appendLine("output", entries || "  No commands yet this session.");
					return;
				}

				case "cowsay":
					appendLine(
						"output",
						buildCowsay(rawArgs || "Moo. Hire Austin. He builds agent systems.")
					);
					return;

				case "sudo":
					appendLine(
						"error",
						"visitor is not in the sudoers file. This incident will be reported."
					);
					appendLine("output", "  (well, except for one specific command... 🤫)");
					return;

				case "rm":
					appendLine("error", "rm: permission denied (this portfolio is load-bearing)");
					return;

				case "vim":
				case "vi":
				case "nano":
				case "emacs":
					setVimMode(true);
					appendLine("ascii", VIM_SCREEN);
					return;

				case "exit":
				case "logout":
				case "quit":
					appendLine("output", "\n  There is no exit. Only scroll. 👇\n  (or type 'contact' - that's the real exit)");
					return;

				case "matrix":
					await runMatrix();
					return;

				case "--help":
				case "-h":
				case "?":
					await typeOutput(STATIC_COMMANDS.help());
					return;
			}

			// Single-word static commands
			const handler = STATIC_COMMANDS[lower];
			if (handler) {
				await typeOutput(handler());
				return;
			}

			const suggestion = suggestCommand(lower);
			appendLine(
				"error",
				`Command not found: ${trimmed}.${
					suggestion ? ` Did you mean '${suggestion}'?` : ""
				} Type 'help' for available commands.`
			);
		},
		[
			appendLine,
			commandHistory,
			handleAskCommand,
			isMobile,
			runAgentSimulation,
			runMatrix,
			typeOutput,
			vimMode,
		]
	);

	// Interrupt whatever is running (Ctrl+C)
	const interrupt = useCallback(() => {
		if (isTyping) {
			cancelRef.current = true;
			abortRef.current?.abort();
			appendLine("error", "^C");
			setIsTyping(false);
		} else {
			appendLine("input", `visitor@austin-portfolio:~$ ${currentInput}^C`);
			setCurrentInput("");
		}
	}, [appendLine, currentInput, isTyping]);

	// Handle key events
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			// Konami code tracker
			konamiRef.current = [...konamiRef.current, e.key].slice(
				-KONAMI_SEQUENCE.length
			);
			if (
				konamiRef.current.length === KONAMI_SEQUENCE.length &&
				konamiRef.current.every(
					(k, i) => k.toLowerCase() === KONAMI_SEQUENCE[i].toLowerCase()
				)
			) {
				konamiRef.current = [];
				setCurrentInput("");
				appendLine("system", "\n  🎮 KONAMI CODE ACCEPTED - cheat mode enabled\n");
				typeOutput(STATIC_COMMANDS["sudo hire austin"]());
				return;
			}

			if (e.ctrlKey && (e.key === "c" || e.key === "C")) {
				e.preventDefault();
				interrupt();
				return;
			}

			if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
				e.preventDefault();
				if (!isTyping) {
					setHistory([
						{
							type: "ascii",
							content: isMobile ? WELCOME_MESSAGE_MOBILE : WELCOME_MESSAGE_DESKTOP,
						},
					]);
				}
				return;
			}

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
				const query = currentInput.toLowerCase();
				if (!query) return;
				const matches = COMPLETION_CANDIDATES.filter((c) =>
					c.startsWith(query)
				);
				if (matches.length === 1) {
					setCurrentInput(matches[0]);
				} else if (matches.length > 1) {
					// Complete to the shared prefix, then list candidates
					let prefix = matches[0];
					for (const m of matches) {
						while (!m.startsWith(prefix)) prefix = prefix.slice(0, -1);
					}
					if (prefix.length > query.length) {
						setCurrentInput(prefix);
					} else {
						appendLine(
							"output",
							matches.map((m) => m.trim()).join("    ")
						);
					}
				}
			}
		},
		[
			appendLine,
			commandHistory,
			currentInput,
			executeCommand,
			historyIndex,
			interrupt,
			isMobile,
			isTyping,
			typeOutput,
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
						to get started, or{" "}
						<code className="bg-card px-2 py-0.5 rounded text-primary">
							agent run
						</code>{" "}
						to watch an AI agent ship.
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
									{vimMode
										? "visitor@austin-portfolio - vim 😈"
										: "visitor@austin-portfolio - bash"}
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
														? "text-yellow-400"
														: "text-gray-300"
									}`}
								>
									{item.content}
								</motion.div>
							))}

							{/* Input line */}
							<div className="flex items-center text-green-400 mt-2">
								<span className="mr-2 hidden sm:inline">
									{vimMode ? "--INSERT--" : "visitor@austin-portfolio:~$"}
								</span>
								<span className="mr-2 sm:hidden">
									{vimMode ? "-- vim --" : "visitor:~$"}
								</span>
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
										aria-label="Terminal command input"
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
									Ctrl+C
								</kbd>
								<span className="hidden sm:inline">Interrupt</span>
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
					{["help", "agent run", "about", "skills", "projects", "ask", "contact"].map(
						(cmd) => (
							<button
								key={cmd}
								onClick={() => {
									inputRef.current?.focus();
									if (!isTyping) {
										executeCommand(cmd);
									}
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
