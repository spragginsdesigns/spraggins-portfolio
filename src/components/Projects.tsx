"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaYoutube, FaEye, FaUsers, FaVideo } from "react-icons/fa";

// Replace these with your actual API key and channel ID
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = "UCG33v2g2KT3hXXWLLbCFBcA";

const specialProject = {
	title: "Shadow Gaming",
	description:
		"My YouTube gaming channel with over 10K subscribers, featuring The Division 1 & 2. I love gaming and creating content, and enjoyed this opportunity to share my passion with others greatly.",
	link: "https://youtube.com/c/shadowgaming99",
	isSpecial: true,
	logoPath: "/images/Shadow-Gaming-Logo-Bitmap.bmp"
};

const projects = [
	{
		title: "AI Favicon Generator",
		description: "Using DALL-E 3 to generate unique and high quality favicons.",
		link: "https://spragginsdesigns.github.io/AI-Favicon-Creator/"
	},
	{
		title: "Prompt Perfector",
		description: "Optimize your AI prompts for better results.",
		link: "https://spragginsdesigns.github.io/AI-Prompt-Perfector/"
	},
	{
		title: "Bible AI Study Tool",
		description:
			"AI-powered tool for in-depth Bible study. This is in very early development.",
		link: "https://bible-ai-explorer.vercel.app/"
	},
	{
		title: "Gelateria Del Centro",
		description:
			"A React-based website for Gelateria Del Centro, an awesome Ice Cream shop located in Fresno, CA.",
		link: "https://www.eatgelateria.com/"
	},
	{
		title: "ContextPro.AI",
		description:
			"Full-stack Next.js app with Tailwind CSS and PostgreSQL. My biggest project to date, and most feature-rich.",
		link: "https://contextproai.vercel.app/"
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
		const data = await response.json();
		console.log("YouTube API response:", data); // Debug log
		return data;
	} catch (error) {
		console.error("Error fetching YouTube stats:", error);
		return { viewCount: "0", subscriberCount: "0", videoCount: "0" };
	}
};

const YouTubeStats: React.FC<{ stats: YouTubeStats }> = ({ stats }) => {
	return (
		<div className="bg-red-100 rounded-lg p-4 mt-4 grid grid-cols-3 gap-4">
			<div className="flex flex-col items-center">
				<FaEye className="text-red-600 text-2xl mb-2" />
				<span className="font-bold text-red-800">
					{parseInt(stats.viewCount || "0").toLocaleString()}
				</span>
				<span className="text-sm text-red-700">Views</span>
			</div>
			<div className="flex flex-col items-center">
				<FaUsers className="text-red-600 text-2xl mb-2" />
				<span className="font-bold text-red-800">
					{parseInt(stats.subscriberCount || "0").toLocaleString()}
				</span>
				<span className="text-sm text-red-700">Subscribers</span>
			</div>
			<div className="flex flex-col items-center">
				<FaVideo className="text-red-600 text-2xl mb-2" />
				<span className="font-bold text-red-800">
					{parseInt(stats.videoCount || "0").toLocaleString()}
				</span>
				<span className="text-sm text-red-700">Videos</span>
			</div>
		</div>
	);
};

const ProjectCard: React.FC<{
	title: string;
	description: string;
	link: string;
	isSpecial?: boolean;
	logoPath?: string;
	index: number;
}> = ({ title, description, link, isSpecial, logoPath, index }) => {
	const [ref, inView] = useInView({
		triggerOnce: true,
		threshold: 0.1
	});

	const [imgSrc, setImgSrc] = useState<string | null>(null);
	const [imgError, setImgError] = useState(false);
	const [youtubeStats, setYoutubeStats] = useState<YouTubeStats | null>(null);

	useEffect(() => {
		if (isSpecial) {
			fetchYouTubeStats().then(setYoutubeStats);
		} else {
			let faviconUrl: string;

			if (link.includes("spragginsdesigns.github.io")) {
				const repoName = new URL(link).pathname.split("/")[1];
				faviconUrl = `https://raw.githubusercontent.com/spragginsdesigns/${repoName}/main/favicon.ico`;
			} else if (link.includes("bible-ai-explorer.vercel.app")) {
				faviconUrl =
					"https://raw.githubusercontent.com/spragginsdesigns/bible-ai-explorer/main/public/favicon.ico";
			} else {
				const domain = new URL(link).hostname;
				faviconUrl = `https://icons.duckduckgo.com/ip3/${domain}.ico`;
			}

			setImgSrc(faviconUrl);
		}
	}, [link, isSpecial]);

	const handleImageError = () => {
		setImgError(true);
	};

	const variants = {
		hidden: { opacity: 0, y: 50 },
		visible: { opacity: 1, y: 0 }
	};

	return (
		<motion.div
			ref={ref}
			initial="hidden"
			animate={inView ? "visible" : "hidden"}
			variants={variants}
			transition={{ duration: 0.5, delay: index * 0.1 }}
			className={`bg-surface rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 ${
				isSpecial ? "col-span-full" : ""
			}`}
		>
			<div
				className={`p-6 flex ${
					isSpecial
						? "flex-col md:flex-row items-center"
						: "flex-col items-center"
				}`}
			>
				{isSpecial && logoPath ? (
					<div className="mr-6 relative mb-4 md:mb-0">
						<Image
							src={logoPath}
							alt={`${title} logo`}
							width={128}
							height={128}
							className="rounded-lg"
						/>
						<div className="absolute -top-2 -right-2 bg-white rounded-full p-1">
							<FaYoutube size={24} color="#FF0000" />
						</div>
					</div>
				) : imgSrc && !imgError ? (
					<Image
						src={imgSrc}
						alt={`${title} favicon`}
						width={64}
						height={64}
						className="mb-4"
						onError={handleImageError}
					/>
				) : (
					<div className="w-16 h-16 mb-4 bg-primary rounded-full flex items-center justify-center">
						<span className="text-2xl font-bold text-background">
							{title.charAt(0).toUpperCase()}
						</span>
					</div>
				)}
				<div className={`${isSpecial ? "flex-grow" : ""}`}>
					<h3
						className={`text-xl font-bold mb-2 text-primary ${
							isSpecial ? "text-2xl" : ""
						}`}
					>
						{title}
					</h3>
					<p
						className={`text-text-secondary mb-4 ${
							isSpecial ? "text-left" : "text-center"
						}`}
					>
						{description}
					</p>
					<motion.a
						href={link}
						className={`inline-block py-2 px-4 rounded-full hover:opacity-80 transition-colors ${
							isSpecial ? "bg-red-600 text-white" : "bg-primary text-background"
						}`}
						target="_blank"
						rel="noopener noreferrer"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						{isSpecial ? "View Channel" : "View Project"}
					</motion.a>
					{isSpecial && youtubeStats && <YouTubeStats stats={youtubeStats} />}
				</div>
			</div>
		</motion.div>
	);
};

const Projects: React.FC = () => {
	return (
		<section id="projects" className="bg-background text-text py-20">
			<div className="container mx-auto px-4">
				<motion.h2
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-4xl font-heading font-bold mb-12 text-center"
				>
					My Projects
				</motion.h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					<ProjectCard {...specialProject} index={0} />
					{projects.map((project, index) => (
						<ProjectCard key={index} {...project} index={index + 1} />
					))}
				</div>
			</div>
		</section>
	);
};

export default Projects;
