"use client";

import React from "react";
import { motion } from "framer-motion";
import {
	Bot,
	BrainCircuit,
	CheckCircle2,
	Code2,
	Gamepad2,
	GitPullRequestArrow,
	Network,
	PackageCheck,
	SearchCheck,
	ShieldCheck,
	Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const systems = [
	{
		icon: <Bot className="h-6 w-6" />,
		title: "Autonomous engineering agents",
		description:
			"A provider-neutral delivery system turns Linear issues into investigated, implemented, reviewed, and proven changes. Durable Codex and Claude sessions recover work instead of starting over.",
		evidence: "Issue intake → real product proof → safe release",
		tags: ["Codex", "Claude", "Linear", "Durable Sessions"]
	},
	{
		icon: <BrainCircuit className="h-6 w-6" />,
		title: "Multi-model product intelligence",
		description:
			"OpenAI, Gemini, Claude, Perplexity, and vision/OCR workflows power sports research, signal search, AI picks, betslip analysis, reports, and quality checks inside one production platform.",
		evidence: "Models are routed by job, with fallbacks and validation",
		tags: ["LLM Orchestration", "Vision", "NLP", "Realtime Data"]
	},
	{
		icon: <Network className="h-6 w-6" />,
		title: "An operating system for agents",
		description:
			"Shared skills, commands, MCP tooling, repo maps, and evidence gates give every agent the same engineering standards across Next.js, Python, SwiftUI, Kotlin, and infrastructure work.",
		evidence: "64 tracked agent skills across the LineCrush monorepo",
		tags: ["MCP", "Agent Skills", "Code Review", "Cross-platform"]
	},
	{
		icon: <Gamepad2 className="h-6 w-6" />,
		title: "AI-native game production",
		description:
			"LineCrush Games combines human art direction with agent-controlled Godot workflows, generated and rigged 3D assets, authored AI audio, predictive enemy behavior, headless capture, and repeatable native exports.",
		evidence: "Space Miner builds proven on Windows and Linux / Steam Deck",
		tags: ["Godot 4.7", "GDScript", "3D Pipelines", "Automated QA"]
	}
];

const deliveryLoop = [
	{ icon: <SearchCheck className="h-4 w-4" />, label: "Investigate" },
	{ icon: <Code2 className="h-4 w-4" />, label: "Build" },
	{ icon: <CheckCircle2 className="h-4 w-4" />, label: "Prove" },
	{ icon: <GitPullRequestArrow className="h-4 w-4" />, label: "Review" },
	{ icon: <ShieldCheck className="h-4 w-4" />, label: "Gate" },
	{ icon: <PackageCheck className="h-4 w-4" />, label: "Ship" }
];

const AISystems: React.FC = () => {
	return (
		<section id="ai-systems" className="relative overflow-hidden bg-background py-20 text-foreground">
			<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
			<div className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

			<div className="container relative mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 18 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					viewport={{ once: true }}
					className="mx-auto mb-12 max-w-3xl text-center"
				>
					<Badge className="mb-4 border-primary/30 bg-primary/10 text-primary">
						<Sparkles className="mr-2 h-3.5 w-3.5" />
						Production AI, end to end
					</Badge>
					<h2 className="mb-5 font-heading text-4xl font-bold md:text-5xl">
						I build the agents—and the systems they ship.
					</h2>
					<p className="text-lg leading-relaxed text-muted-foreground">
						My work at LineCrush goes beyond model calls. I design the product intelligence,
						the delivery agents, the proof gates, and the infrastructure that turns AI into
						reliable software.
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					viewport={{ once: true }}
					className="mb-6 grid grid-cols-2 gap-2 md:grid-cols-6"
					aria-label="Autonomous software delivery loop"
				>
					{deliveryLoop.map((step, index) => (
						<div
							key={step.label}
							className="relative flex items-center gap-2 rounded-lg border border-border/50 bg-card/40 px-3 py-3 text-sm"
						>
							<span className="font-mono text-xs text-primary/70">0{index + 1}</span>
							<span className="text-primary">{step.icon}</span>
							<span className="font-medium">{step.label}</span>
						</div>
					))}
				</motion.div>

				<div className="grid gap-4 md:grid-cols-2">
					{systems.map((system, index) => (
						<motion.div
							key={system.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.45, delay: index * 0.08 }}
							viewport={{ once: true }}
						>
							<Card className="group h-full border-border/50 bg-card/40 p-6 transition-colors hover:border-primary/40">
								<div className="mb-4 flex items-start gap-4">
									<div className="rounded-xl bg-primary/10 p-3 text-primary transition-transform group-hover:-translate-y-0.5">
										{system.icon}
									</div>
									<div>
										<h3 className="text-xl font-bold">{system.title}</h3>
										<p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-primary/80">
											{system.evidence}
										</p>
									</div>
								</div>
								<p className="mb-5 text-sm leading-relaxed text-muted-foreground">
									{system.description}
								</p>
								<div className="flex flex-wrap gap-2">
									{system.tags.map((tag) => (
										<Badge key={tag} variant="secondary" className="text-xs">
											{tag}
										</Badge>
									))}
								</div>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default AISystems;
