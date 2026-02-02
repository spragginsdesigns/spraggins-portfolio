"use client";

import React from "react";
import { motion } from "framer-motion";
import {
	Brain,
	Server,
	Layers,
	Cloud,
	Users,
	Database,
	Code2,
	Cpu,
	GitBranch,
	Zap
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ExpertiseCardProps {
	icon: React.ReactNode;
	title: string;
	description: string;
	skills: string[];
	gradient: string;
	index: number;
	className?: string;
}

const ExpertiseCard: React.FC<ExpertiseCardProps> = ({
	icon,
	title,
	description,
	skills,
	gradient,
	index,
	className = ""
}) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: index * 0.1 }}
			viewport={{ once: true }}
			className={className}
		>
			<Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 group overflow-hidden">
				<div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${gradient}`} />
				<div className="p-6 relative z-10">
					<div className="flex items-center gap-3 mb-4">
						<div className={`p-2.5 rounded-lg ${gradient} text-white`}>
							{icon}
						</div>
						<h3 className="text-xl font-bold text-foreground">{title}</h3>
					</div>
					<p className="text-muted-foreground mb-4 text-sm leading-relaxed">
						{description}
					</p>
					<div className="flex flex-wrap gap-2">
						{skills.map((skill, i) => (
							<Badge
								key={i}
								variant="secondary"
								className="text-xs bg-secondary/50 hover:bg-secondary/80 transition-colors"
							>
								{skill}
							</Badge>
						))}
					</div>
				</div>
			</Card>
		</motion.div>
	);
};

const StatCard: React.FC<{
	value: string;
	label: string;
	index: number;
}> = ({ value, label, index }) => (
	<motion.div
		initial={{ opacity: 0, scale: 0.9 }}
		whileInView={{ opacity: 1, scale: 1 }}
		transition={{ duration: 0.4, delay: index * 0.1 }}
		viewport={{ once: true }}
		className="text-center p-4"
	>
		<div className="text-3xl md:text-4xl font-bold text-primary mb-1">{value}</div>
		<div className="text-sm text-muted-foreground">{label}</div>
	</motion.div>
);

const Expertise: React.FC = () => {
	const expertiseAreas = [
		{
			icon: <Brain className="w-5 h-5" />,
			title: "AI/ML Engineering",
			description:
				"Built production AI systems with 4+ LLM providers. Prompt engineering, streaming responses, sentiment analysis, and NLP pipelines processing millions of data points.",
			skills: ["OpenAI", "Anthropic", "Perplexity", "Google Vision", "NLP", "Prompt Engineering"],
			gradient: "bg-gradient-to-br from-purple-500 to-pink-500"
		},
		{
			icon: <Layers className="w-5 h-5" />,
			title: "Full-Stack Architecture",
			description:
				"Designed and built a 353-component React frontend with 45+ Python microservices. End-to-end ownership from database schema to user interface.",
			skills: ["Next.js 15", "React", "TypeScript", "Python", "Node.js", "PostgreSQL"],
			gradient: "bg-gradient-to-br from-cyan-500 to-blue-500"
		},
		{
			icon: <Cpu className="w-5 h-5" />,
			title: "System Design",
			description:
				"Architected real-time data pipelines, distributed cron jobs, Redis caching layers, and 100+ PostgreSQL tables with complex relationships.",
			skills: ["Redis", "PostgreSQL", "Real-time Systems", "Caching", "Data Pipelines"],
			gradient: "bg-gradient-to-br from-green-500 to-emerald-500"
		},
		{
			icon: <Cloud className="w-5 h-5" />,
			title: "DevOps & Infrastructure",
			description:
				"Managing Ubuntu VPS with automated deployments, Vercel edge functions, AWS services, and production monitoring for 24/7 operations.",
			skills: ["AWS S3/SES/CloudFront", "Ubuntu VPS", "Vercel", "Docker", "CI/CD"],
			gradient: "bg-gradient-to-br from-orange-500 to-red-500"
		},
		{
			icon: <Users className="w-5 h-5" />,
			title: "Technical Leadership",
			description:
				"As Co-Founder & CTO, I make all architectural decisions, manage technical strategy, and built LineCrush almost entirely solo over 2+ years.",
			skills: ["CTO", "Architecture", "Strategy", "Code Review", "System Design"],
			gradient: "bg-gradient-to-br from-yellow-500 to-amber-500"
		},
		{
			icon: <Database className="w-5 h-5" />,
			title: "Data Engineering",
			description:
				"Built web scrapers for YouTube, podcasts, news, and social media. Real-time NLP analysis and automated data processing pipelines.",
			skills: ["Web Scraping", "ETL", "NLP", "Automation", "Cron Jobs"],
			gradient: "bg-gradient-to-br from-indigo-500 to-violet-500"
		}
	];

	const stats = [
		{ value: "353+", label: "React Components" },
		{ value: "45+", label: "Backend Services" },
		{ value: "45+", label: "API Endpoints" },
		{ value: "100+", label: "Database Tables" },
		{ value: "4+", label: "LLM Integrations" },
		{ value: "2+", label: "Years Production" }
	];

	return (
		<section id="expertise" className="bg-background text-foreground py-20">
			<div className="container mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
						Expertise & Impact
					</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto text-lg">
						Building production systems at scale. From AI-powered analytics to real-time data pipelines.
					</p>
				</motion.div>

				{/* Stats Row */}
				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					transition={{ duration: 0.5 }}
					viewport={{ once: true }}
					className="mb-16"
				>
					<Card className="bg-card/30 backdrop-blur-sm border-border/50">
						<div className="grid grid-cols-3 md:grid-cols-6 divide-x divide-border/50">
							{stats.map((stat, index) => (
								<StatCard key={index} {...stat} index={index} />
							))}
						</div>
					</Card>
				</motion.div>

				{/* Bento Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{expertiseAreas.map((area, index) => (
						<ExpertiseCard key={index} {...area} index={index} />
					))}
				</div>

				{/* Coding Activity Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					viewport={{ once: true }}
					className="mt-16"
				>
					<Card className="bg-card/30 backdrop-blur-sm border-border/50 p-8">
						<h3 className="text-2xl font-bold text-center mb-2">Coding Activity</h3>
						<p className="text-muted-foreground text-center text-sm mb-6">
							Live coding stats tracked by WakaTime
						</p>
						<div className="flex flex-col items-center gap-6">
							<div className="w-full max-w-3xl overflow-hidden rounded-lg">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src="https://wakatime.com/share/@spragginsdesigns/a74426a6-3db3-4e39-8a39-4bc017b18ed8.svg"
									alt="WakaTime coding activity bar chart"
									className="w-full h-auto"
									loading="lazy"
								/>
							</div>
							<div className="w-full max-w-3xl overflow-hidden rounded-lg">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src="https://wakatime.com/share/@spragginsdesigns/81a9f812-1214-4bca-a52b-9e69e891c8c7.svg"
									alt="WakaTime coding activity heatmap"
									className="w-full h-auto"
									loading="lazy"
								/>
							</div>
							<a
								href="https://wakatime.com/badge/github/spragginsdesigns/Context-Pro-AI"
								target="_blank"
								rel="noopener noreferrer"
							>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src="https://wakatime.com/badge/github/spragginsdesigns/Context-Pro-AI.svg"
									alt="WakaTime badge for Context-Pro-AI"
									loading="lazy"
								/>
							</a>
						</div>
					</Card>
				</motion.div>

				{/* Tech Stack Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					viewport={{ once: true }}
					className="mt-16"
				>
					<Card className="bg-card/30 backdrop-blur-sm border-border/50 p-8">
						<h3 className="text-2xl font-bold text-center mb-8">Core Tech Stack</h3>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
							<div className="text-center">
								<div className="flex justify-center mb-3">
									<Code2 className="w-8 h-8 text-primary" />
								</div>
								<h4 className="font-semibold mb-2">Frontend</h4>
								<p className="text-sm text-muted-foreground">
									Next.js, React, TypeScript, Tailwind, shadcn/ui
								</p>
							</div>
							<div className="text-center">
								<div className="flex justify-center mb-3">
									<Server className="w-8 h-8 text-primary" />
								</div>
								<h4 className="font-semibold mb-2">Backend</h4>
								<p className="text-sm text-muted-foreground">
									Python, Node.js, PostgreSQL, Redis
								</p>
							</div>
							<div className="text-center">
								<div className="flex justify-center mb-3">
									<Zap className="w-8 h-8 text-primary" />
								</div>
								<h4 className="font-semibold mb-2">AI/ML</h4>
								<p className="text-sm text-muted-foreground">
									OpenAI, Anthropic, Perplexity, Google Vision
								</p>
							</div>
							<div className="text-center">
								<div className="flex justify-center mb-3">
									<GitBranch className="w-8 h-8 text-primary" />
								</div>
								<h4 className="font-semibold mb-2">Infrastructure</h4>
								<p className="text-sm text-muted-foreground">
									AWS, Vercel, Ubuntu VPS, Docker
								</p>
							</div>
						</div>
					</Card>
				</motion.div>
			</div>
		</section>
	);
};

export default Expertise;
