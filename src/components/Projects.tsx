"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const ProjectCard: React.FC<{
	title: string;
	description: string;
	link: string;
}> = ({ title, description, link }) => {
	const [imgSrc, setImgSrc] = useState<string | null>(null);
	const [imgError, setImgError] = useState(false);

	useEffect(() => {
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
	}, [link]);

	const handleImageError = () => {
		setImgError(true);
	};

	return (
		<div className="bg-surface rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105">
			<div className="p-6 flex flex-col items-center">
				{imgSrc && !imgError ? (
					<Image
						src={imgSrc}
						alt={`${title} favicon`}
						width={32}
						height={32}
						className="mb-4"
						onError={handleImageError}
					/>
				) : (
					<div className="w-8 h-8 mb-4 bg-primary rounded-full flex items-center justify-center">
						<span className="text-xs font-bold text-background">
							{title.charAt(0).toUpperCase()}
						</span>
					</div>
				)}
				<h3 className="text-xl font-bold mb-2 text-primary">{title}</h3>
				<p className="text-text-secondary mb-4 text-center">{description}</p>
				<a
					href={link}
					className="inline-block bg-primary text-background py-2 px-4 rounded-full hover:bg-opacity-80 transition-colors"
					target="_blank"
					rel="noopener noreferrer"
				>
					View Project
				</a>
			</div>
		</div>
	);
};

const Projects: React.FC = () => {
	const projects = [
		{
			title: "AI Favicon Generator",
			description: "Generate unique favicons using AI technology.",
			link: "https://spragginsdesigns.github.io/AI-Favicon-Creator/"
		},
		{
			title: "AI Prompt Perfector",
			description: "Optimize your AI prompts for better results.",
			link: "https://spragginsdesigns.github.io/AI-Prompt-Perfector/"
		},
		{
			title: "Bible AI Study Tool",
			description: "AI-powered tool for in-depth Bible study.",
			link: "https://bible-ai-explorer.vercel.app/"
		},
		{
			title: "Gelateria Del Centro",
			description: "A React-based website for Gelateria Del Centro.",
			link: "https://www.eatgelateria.com/"
		},
		{
			title: "ContextPro AI",
			description: "Full-stack Next.js app with Tailwind CSS and PostgreSQL.",
			link: "https://contextproai.vercel.app/"
		}
	];

	return (
		<section id="projects" className="bg-background text-text py-20">
			<div className="container mx-auto px-4">
				<h2 className="text-4xl font-heading font-bold mb-12 text-center">
					My Projects
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{projects.map((project, index) => (
						<ProjectCard key={index} {...project} />
					))}
				</div>
			</div>
		</section>
	);
};

export default Projects;
