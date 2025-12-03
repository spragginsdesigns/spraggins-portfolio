"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
	ExternalLink,
	Layers,
	Database,
	Brain,
	Server,
	Zap,
	Globe,
	Code2
} from "lucide-react";
import { FaYoutube, FaEye, FaUsers, FaVideo } from "react-icons/fa";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const lineCrushFeatures = [
	{
		icon: <Layers className="w-5 h-5" />,
		title: "353+ Components",
		description: "React/Next.js frontend"
	},
	{
		icon: <Server className="w-5 h-5" />,
		title: "45+ Services",
		description: "Python microservices"
	},
	{
		icon: <Brain className="w-5 h-5" />,
		title: "4+ LLMs",
		description: "AI integrations"
	},
	{
		icon: <Database className="w-5 h-5" />,
		title: "30+ Tables",
		description: "PostgreSQL schema"
	}
];

const lineCrushTechStack = [
	"Next.js 15",
	"TypeScript",
	"Python",
	"PostgreSQL",
	"Redis",
	"OpenAI",
	"Anthropic",
	"AWS",
	"Vercel"
];

const otherProjects = [
	{
		title: "AI Favicon Generator",
		description: "DALL-E 3 powered favicon generation tool",
		link: "https://spragginsdesigns.github.io/AI-Favicon-Creator/",
		tags: ["OpenAI", "React", "DALL-E 3"]
	},
	{
		title: "Prompt Perfector",
		description: "AI prompt optimization tool for better results",
		link: "https://spragginsdesigns.github.io/AI-Prompt-Perfector/",
		tags: ["AI", "React", "UX"]
	},
	{
		title: "Bible AI Explorer",
		description: "AI-powered tool for in-depth Bible study",
		link: "https://bible-ai-explorer.vercel.app/",
		tags: ["AI", "Next.js", "Vercel"]
	},
	{
		title: "Gelateria Del Centro",
		description: "Modern website for a local ice cream shop",
		link: "https://www.eatgelateria.com/",
		tags: ["React", "Business", "Design"]
	}
];

interface YouTubeStats {
	viewCount: string;
	subscriberCount: string;
	videoCount: string;
}

const fetchYouTubeStats = async (): Promise<YouTubeStats> => {
	try {
		const response = await fetch("/api/youtube-stats");
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error("Error fetching YouTube stats:", error);
		return { viewCount: "0", subscriberCount: "0", videoCount: "0" };
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
			className="mb-16"
		>
			<Card className="bg-gradient-to-br from-card via-card to-card/80 border-primary/20 overflow-hidden">
				<div className="grid md:grid-cols-2 gap-8 p-8">
					{/* Left side - Info */}
					<div className="flex flex-col justify-center">
						<div className="flex items-center gap-3 mb-4">
							<Badge className="bg-primary/20 text-primary border-primary/30">
								Featured Project
							</Badge>
							<Badge variant="outline" className="border-green-500/50 text-green-400">
								Co-Founder & CTO
							</Badge>
						</div>
						<h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
							LineCrush
						</h3>
						<p className="text-muted-foreground mb-6 text-lg leading-relaxed">
							Enterprise-grade sports analytics platform I built almost entirely solo over 2+ years.
							Real-time AI-powered insights, automated data pipelines, and production infrastructure
							serving users 24/7.
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
										<div className="text-2xl font-bold">13 Sports</div>
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

const ProjectCard: React.FC<{
	title: string;
	description: string;
	link: string;
	tags: string[];
	index: number;
}> = ({ title, description, link, tags, index }) => {
	const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, y: 20 }}
			animate={inView ? { opacity: 1, y: 0 } : {}}
			transition={{ duration: 0.5, delay: index * 0.1 }}
		>
			<Card className="h-full bg-card/50 border-border/50 hover:border-primary/30 transition-all duration-300 group">
				<div className="p-6">
					<h4 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
						{title}
					</h4>
					<p className="text-sm text-muted-foreground mb-4">{description}</p>
					<div className="flex flex-wrap gap-2 mb-4">
						{tags.map((tag, i) => (
							<Badge key={i} variant="outline" className="text-xs">
								{tag}
							</Badge>
						))}
					</div>
					<a
						href={link}
						target="_blank"
						rel="noopener noreferrer"
						className="text-sm text-primary hover:underline flex items-center gap-1"
					>
						View Project <ExternalLink className="w-3 h-3" />
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
						Projects
					</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						From enterprise SaaS platforms to AI-powered tools
					</p>
				</motion.div>

				<FeaturedProject />

				<h3 className="text-2xl font-bold mb-6">Other Projects</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{otherProjects.map((project, index) => (
						<ProjectCard key={index} {...project} index={index} />
					))}
				</div>

				<YouTubeSection />
			</div>
		</section>
	);
};

export default Projects;
