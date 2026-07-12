"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
	ExternalLink,
	Layers,
	Brain,
	Zap,
	Globe,
	Code2,
	Github,
	Star,
	Heart,
	BookOpen,
	GraduationCap,
	Building2,
	Gamepad2,
	Bot,
	Box,
	MonitorCheck
} from "lucide-react";
import { FaYoutube, FaEye, FaUsers, FaVideo } from "react-icons/fa";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const lineCrushFeatures = [
	{
		icon: <Bot className="w-5 h-5" />,
		title: "Autonomous Delivery",
		description: "Agents take issues through proof"
	},
	{
		icon: <Brain className="w-5 h-5" />,
		title: "Multi-model AI",
		description: "Research, picks, reports, vision"
	},
	{
		icon: <Layers className="w-5 h-5" />,
		title: "4 Product Clients",
		description: "Web, iOS, Android, extensions"
	},
	{
		icon: <Zap className="w-5 h-5" />,
		title: "Realtime Platform",
		description: "Signals, alerts, live data"
	}
];

const lineCrushTechStack = [
	"Next.js 15",
	"TypeScript",
	"Python",
	"PostgreSQL",
	"Redis",
	"Codex + Claude",
	"OpenAI + Gemini",
	"AWS",
	"Vercel"
];

const lineCrushGamesHighlights = [
	{
		icon: <Gamepad2 className="w-5 h-5" />,
		title: "Space Miner",
		description: "Steam Deck-first 2.5D survival miner"
	},
	{
		icon: <Box className="w-5 h-5" />,
		title: "AI Asset Pipeline",
		description: "Concepts, rigged models, audio, UI art"
	},
	{
		icon: <Bot className="w-5 h-5" />,
		title: "Agent-controlled Godot",
		description: "Scenes, scripts, captures, playtests"
	},
	{
		icon: <MonitorCheck className="w-5 h-5" />,
		title: "Native Builds",
		description: "Windows and Linux / Steam Deck proven"
	}
];

// Featured projects with more detail
const featuredProjects = [
	{
		title: "SaveALife CPR",
		description:
			"Business automation tool that streamlines CPR/First Aid course registration from Bookeo to Canadian Red Cross MyRC portal. Saves hours of manual data entry for training organizations.",
		link: "https://github.com/spragginsdesigns/savealife-cpr",
		icon: <Heart className="w-6 h-6" />,
		gradient: "from-red-500 to-pink-500",
		tags: ["Automation", "Python", "API Integration", "Business Tool"],
		highlight: "Real Business Impact"
	},
	{
		title: "Constrong",
		description:
			"Modern, responsive single-page website for a professional concrete contractor in Ontario, Canada. Features dark theme, smooth animations, image gallery, and contact forms.",
		link: "https://github.com/spragginsdesigns/constrong",
		icon: <Building2 className="w-6 h-6" />,
		gradient: "from-amber-500 to-yellow-500",
		tags: ["Next.js 16", "TypeScript", "Tailwind", "Business Site"],
		highlight: "Client Project"
	},
	{
		title: "Bible AI Explorer",
		description:
			"Cutting-edge Biblical web application using AI Agents to provide scripture-based answers. Features chat interface, verse lookup, and contextual Bible study tools.",
		link: "https://bible-ai-explorer.vercel.app/",
		github: "https://github.com/spragginsdesigns/bible-ai-explorer",
		icon: <BookOpen className="w-6 h-6" />,
		gradient: "from-purple-500 to-indigo-500",
		tags: ["AI Agents", "Next.js", "OpenAI", "Vercel"],
		highlight: "8 Stars",
		stars: 8
	},
	{
		title: "AI Tutor WebApp",
		description:
			"An intelligent AI tutor designed for children that guides them to learn without giving direct answers. Encourages critical thinking and self-discovery through Socratic questioning.",
		link: "https://github.com/spragginsdesigns/ai-tutor-webapp",
		icon: <GraduationCap className="w-6 h-6" />,
		gradient: "from-green-500 to-emerald-500",
		tags: ["AI", "Education", "React", "OpenAI"],
		highlight: "5 Stars",
		stars: 5
	}
];

// Additional projects in a more compact format
const otherProjects = [
	{
		title: "Win11 PWDump",
		description: "Security tool for Windows credential retrieval with GUI",
		link: "https://github.com/spragginsdesigns/Win11-PWDump",
		tags: ["PowerShell", "Security", "Windows"],
		stars: 4
	},
	{
		title: "Perplexity MCP Server",
		description: "Model Context Protocol server for Perplexity AI integration",
		link: "https://github.com/spragginsdesigns/perplexity-mcp-server",
		tags: ["MCP", "AI", "TypeScript"],
		stars: 3
	},
	{
		title: "Bible Chat Mobile",
		description: "Expo mobile app for AI-powered Bible conversations",
		link: "https://github.com/spragginsdesigns/bible-chat",
		tags: ["React Native", "Expo", "AI"],
		stars: 2
	},
	{
		title: "Perplexity CLI Tool",
		description: "Command-line interface for Perplexity AI queries",
		link: "https://github.com/spragginsdesigns/perplexity-cli-tool",
		tags: ["CLI", "Python", "AI"],
		stars: 2
	},
	{
		title: "SmartShell",
		description: "AI-powered command-line tool with intelligent suggestions",
		link: "https://github.com/spragginsdesigns/SmartShell",
		tags: ["AI", "CLI", "Windows"],
		stars: 1
	},
	{
		title: "Doc Magic",
		description: "Tool for creating large context documentation in markdown",
		link: "https://github.com/spragginsdesigns/doc-magic",
		tags: ["Documentation", "Markdown", "Developer Tools"]
	},
	{
		title: "Web Scraper Assistant",
		description: "Firecrawl API powered web scraping tool",
		link: "https://github.com/spragginsdesigns/web-scraper-assistant",
		tags: ["Web Scraping", "API", "Automation"],
		stars: 1
	},
	{
		title: "Quest Mates",
		description: "Gaming social platform for finding your Player 2",
		link: "https://github.com/spragginsdesigns/quest_mates",
		tags: ["Social", "Gaming", "Next.js"]
	}
];

interface YouTubeStats {
	viewCount: string;
	subscriberCount: string;
	videoCount: string;
}

const fetchYouTubeStats = async (): Promise<YouTubeStats | null> => {
	try {
		const response = await fetch("/api/youtube-stats");
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data: YouTubeStats = await response.json();
		// Treat an all-zero payload (missing API key, quota errors) as no data
		if (!parseInt(data.subscriberCount || "0")) {
			return null;
		}
		return data;
	} catch {
		return null;
	}
};

const FeaturedProject: React.FC = () => {
	const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 30 }}
			animate={inView ? { opacity: 1, y: 0 } : {}}
			transition={{ duration: 0.6 }}
			className="mb-12"
		>
			<Card className="bg-gradient-to-br from-card via-card to-card/80 border-primary/20 overflow-hidden">
				<div className="grid md:grid-cols-2 gap-8 p-8">
					{/* Left side - Info */}
					<div className="flex flex-col justify-center">
						<div className="flex items-center gap-3 mb-4">
							<Badge className="bg-primary/20 text-primary border-primary/30">
								Flagship Project
							</Badge>
							<Badge variant="outline" className="border-green-500/50 text-green-400">
								Co-Founder & CTO
							</Badge>
						</div>
						<h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
							LineCrush
						</h3>
						<p className="text-muted-foreground mb-6 text-lg leading-relaxed">
							The production sports intelligence platform I architect as Co-Founder and CTO.
							It combines AI picks, realtime signal search, vision-powered betslip analysis,
							autonomous engineering agents, and one shared data platform across web, native
							mobile, and browser extensions.
						</p>

						{/* Feature Grid */}
						<div className="grid grid-cols-2 gap-4 mb-6">
							{lineCrushFeatures.map((feature, i) => (
								<div
									key={i}
									className="flex items-center gap-3 p-3 rounded-lg bg-background/50"
								>
									<div className="p-2 rounded-md bg-primary/10 text-primary">
										{feature.icon}
									</div>
									<div>
										<div className="font-semibold text-sm">{feature.title}</div>
										<div className="text-xs text-muted-foreground">
											{feature.description}
										</div>
									</div>
								</div>
							))}
						</div>

						{/* Tech Stack */}
						<div className="flex flex-wrap gap-2 mb-6">
							{lineCrushTechStack.map((tech, i) => (
								<Badge key={i} variant="secondary" className="text-xs">
									{tech}
								</Badge>
							))}
						</div>

						<Button asChild className="w-fit">
							<a
								href="https://www.linecrush.com/"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2"
							>
								Visit LineCrush
								<ExternalLink className="w-4 h-4" />
							</a>
						</Button>
					</div>

					{/* Right side - Visual */}
					<div className="flex items-center justify-center">
						<div className="relative">
							<div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-cyan-500/20 blur-3xl rounded-full" />
							<div className="relative bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8">
								<div className="grid grid-cols-2 gap-4 text-center">
									<div className="p-4">
										<Zap className="w-8 h-8 text-primary mx-auto mb-2" />
										<div className="text-2xl font-bold">Real-time</div>
										<div className="text-sm text-muted-foreground">Data Processing</div>
									</div>
									<div className="p-4">
										<Brain className="w-8 h-8 text-primary mx-auto mb-2" />
										<div className="text-2xl font-bold">AI-Powered</div>
										<div className="text-sm text-muted-foreground">Analytics</div>
									</div>
									<div className="p-4">
										<Globe className="w-8 h-8 text-primary mx-auto mb-2" />
										<div className="text-2xl font-bold">12 Sports</div>
										<div className="text-sm text-muted-foreground">Coverage</div>
									</div>
									<div className="p-4">
										<Code2 className="w-8 h-8 text-primary mx-auto mb-2" />
										<div className="text-2xl font-bold">Full Stack</div>
										<div className="text-sm text-muted-foreground">Architecture</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Card>
		</motion.div>
	);
};

const LineCrushGamesProject: React.FC = () => {
	const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 30 }}
			animate={inView ? { opacity: 1, y: 0 } : {}}
			transition={{ duration: 0.6 }}
			className="mb-12"
		>
			<Card className="overflow-hidden border-violet-500/20 bg-gradient-to-br from-card via-card to-violet-950/20">
				<div className="grid gap-8 p-8 md:grid-cols-2">
					<div className="flex flex-col justify-center">
						<div className="mb-4 flex flex-wrap items-center gap-3">
							<Badge className="border-violet-400/30 bg-violet-500/15 text-violet-300">
								LineCrush R&amp;D
							</Badge>
							<Badge variant="outline" className="border-cyan-500/40 text-cyan-300">
								AI-native game studio
							</Badge>
						</div>
						<h3 className="mb-4 bg-gradient-to-r from-violet-300 to-cyan-300 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
							LineCrush Games
						</h3>
						<p className="mb-6 text-lg leading-relaxed text-muted-foreground">
							I&apos;m building original Godot titles with an AI-accelerated studio workflow:
							agents can operate the editor, generate and rig production assets, run headless
							tests and captures, and create repeatable installable builds. Human product taste
							still owns every gameplay, feel, and art-direction call.
						</p>
						<div className="mb-6 flex flex-wrap gap-2">
							{["Godot 4.7", "GDScript", "Godot MCP", "3D Asset Pipelines", "Headless QA", "Steam Deck"].map((tech) => (
								<Badge key={tech} variant="secondary" className="text-xs">
									{tech}
								</Badge>
							))}
						</div>
						<p className="text-sm font-medium text-violet-200/90">
							Space Miner, RockHunter, and MERIDIAN are active original game projects.
						</p>
					</div>

					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						{lineCrushGamesHighlights.map((feature) => (
							<div
								key={feature.title}
								className="rounded-xl border border-border/50 bg-background/60 p-4"
							>
								<div className="mb-3 w-fit rounded-lg bg-violet-500/10 p-2 text-violet-300">
									{feature.icon}
								</div>
								<div className="font-semibold">{feature.title}</div>
								<div className="mt-1 text-sm leading-relaxed text-muted-foreground">
									{feature.description}
								</div>
							</div>
						))}
					</div>
				</div>
			</Card>
		</motion.div>
	);
};

const FeaturedProjectCard: React.FC<{
	project: typeof featuredProjects[0];
	index: number;
}> = ({ project, index }) => {
	const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 20 }}
			animate={inView ? { opacity: 1, y: 0 } : {}}
			transition={{ duration: 0.5, delay: index * 0.1 }}
		>
			<Card className="h-full bg-card/50 border-border/50 hover:border-primary/30 transition-all duration-300 group overflow-hidden">
				<div className="p-6">
					<div className="flex items-start justify-between mb-4">
						<div className={`p-3 rounded-xl bg-gradient-to-br ${project.gradient} text-white`}>
							{project.icon}
						</div>
						{project.highlight && (
							<Badge variant="outline" className="text-xs">
								{project.stars && <Star className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" />}
								{project.highlight}
							</Badge>
						)}
					</div>
					<h4 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
						{project.title}
					</h4>
					<p className="text-sm text-muted-foreground mb-4 leading-relaxed">
						{project.description}
					</p>
					<div className="flex flex-wrap gap-2 mb-4">
						{project.tags.map((tag, i) => (
							<Badge key={i} variant="secondary" className="text-xs">
								{tag}
							</Badge>
						))}
					</div>
					<div className="flex gap-3">
						<a
							href={project.link}
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm text-primary hover:underline flex items-center gap-1"
						>
							{project.link.includes("github") ? (
								<>
									<Github className="w-4 h-4" /> View Code
								</>
							) : (
								<>
									<ExternalLink className="w-4 h-4" /> Live Demo
								</>
							)}
						</a>
						{project.github && (
							<a
								href={project.github}
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
							>
								<Github className="w-4 h-4" /> Code
							</a>
						)}
					</div>
				</div>
			</Card>
		</motion.div>
	);
};

const OtherProjectCard: React.FC<{
	project: typeof otherProjects[0];
	index: number;
}> = ({ project, index }) => {
	const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 20 }}
			animate={inView ? { opacity: 1, y: 0 } : {}}
			transition={{ duration: 0.4, delay: index * 0.05 }}
		>
			<Card className="h-full bg-card/30 border-border/30 hover:border-primary/20 hover:bg-card/50 transition-all duration-300 group">
				<div className="p-4">
					<div className="flex items-start justify-between mb-2">
						<h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
							{project.title}
						</h4>
						{project.stars && (
							<span className="flex items-center text-xs text-muted-foreground">
								<Star className="w-3 h-3 mr-1 fill-yellow-500 text-yellow-500" />
								{project.stars}
							</span>
						)}
					</div>
					<p className="text-xs text-muted-foreground mb-3">{project.description}</p>
					<div className="flex flex-wrap gap-1 mb-3">
						{project.tags.slice(0, 3).map((tag, i) => (
							<Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0">
								{tag}
							</Badge>
						))}
					</div>
					<a
						href={project.link}
						target="_blank"
						rel="noopener noreferrer"
						className="text-xs text-primary hover:underline flex items-center gap-1"
					>
						<Github className="w-3 h-3" /> View Project
					</a>
				</div>
			</Card>
		</motion.div>
	);
};

const YouTubeSection: React.FC = () => {
	const [stats, setStats] = useState<YouTubeStats | null>(null);
	const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

	useEffect(() => {
		fetchYouTubeStats().then(setStats);
	}, []);

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 20 }}
			animate={inView ? { opacity: 1, y: 0 } : {}}
			transition={{ duration: 0.5 }}
			className="mt-12"
		>
			<Card className="bg-gradient-to-r from-red-950/30 to-card border-red-500/20">
				<div className="p-6 flex flex-col md:flex-row items-center gap-6">
					<div className="flex items-center gap-4">
						<div className="p-3 bg-red-500/20 rounded-full">
							<FaYoutube className="w-8 h-8 text-red-500" />
						</div>
						<div>
							<h4 className="text-xl font-bold">Shadow Gaming</h4>
							<p className="text-sm text-muted-foreground">
								Gaming content with 10K+ subscribers
							</p>
						</div>
					</div>
					{stats && (
						<div className="flex gap-8 md:ml-auto">
							<div className="text-center">
								<FaEye className="w-5 h-5 text-red-400 mx-auto mb-1" />
								<div className="font-bold">
									{parseInt(stats.viewCount || "0").toLocaleString()}
								</div>
								<div className="text-xs text-muted-foreground">Views</div>
							</div>
							<div className="text-center">
								<FaUsers className="w-5 h-5 text-red-400 mx-auto mb-1" />
								<div className="font-bold">
									{parseInt(stats.subscriberCount || "0").toLocaleString()}
								</div>
								<div className="text-xs text-muted-foreground">Subscribers</div>
							</div>
							<div className="text-center">
								<FaVideo className="w-5 h-5 text-red-400 mx-auto mb-1" />
								<div className="font-bold">
									{parseInt(stats.videoCount || "0").toLocaleString()}
								</div>
								<div className="text-xs text-muted-foreground">Videos</div>
							</div>
						</div>
					)}
					<Button
						variant="outline"
						asChild
						className="border-red-500/50 hover:bg-red-500/10"
					>
						<a
							href="https://youtube.com/c/shadowgaming99"
							target="_blank"
							rel="noopener noreferrer"
						>
							Visit Channel
						</a>
					</Button>
				</div>
			</Card>
		</motion.div>
	);
};

const Projects: React.FC = () => {
	return (
		<section id="projects" className="bg-background text-foreground py-20">
			<div className="container mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					viewport={{ once: true }}
					className="text-center mb-12"
				>
					<h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
						Selected Products
					</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						Production AI platforms, autonomous delivery systems, original games, and focused independent work.
					</p>
				</motion.div>

				{/* LineCrush - Main Featured */}
				<FeaturedProject />
				<LineCrushGamesProject />

				{/* Featured Projects Grid */}
				<h3 className="text-2xl font-bold mb-6">Independent &amp; Client Work</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
					{featuredProjects.map((project, index) => (
						<FeaturedProjectCard key={index} project={project} index={index} />
					))}
				</div>

				{/* Other Projects */}
				<h3 className="text-xl font-bold mb-4 text-muted-foreground">More Projects</h3>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
					{otherProjects.map((project, index) => (
						<OtherProjectCard key={index} project={project} index={index} />
					))}
				</div>

				{/* GitHub Link */}
				<div className="text-center mb-8">
					<Button variant="outline" asChild>
						<a
							href="https://github.com/spragginsdesigns"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2"
						>
							<Github className="w-4 h-4" />
							View All 90+ Repositories
						</a>
					</Button>
				</div>

				<YouTubeSection />
			</div>
		</section>
	);
};

export default Projects;
