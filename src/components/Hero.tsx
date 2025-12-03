"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { BackgroundLines } from "@/components/ui/background-lines";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Github, Linkedin, Mail, Twitter } from "lucide-react";

const Hero: React.FC = () => {
	const tagline =
		"I build production systems at scale. 350+ React components, 45+ microservices, 100+ database tables, and AI systems processing millions of data points.";

	const highlights = [
		"Co-Founder & CTO",
		"Full Stack",
		"AI/ML",
		"DevOps",
	];

	return (
		<BackgroundLines
			className="flex items-center justify-center w-full min-h-screen relative overflow-hidden"
			svgOptions={{ duration: 12 }}
		>
			<div className="container mx-auto px-4 py-8 md:py-0">
				<div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8 lg:gap-12 relative z-20">
					{/* Left Content */}
					<motion.div
						className="flex-1 text-center lg:text-left max-w-2xl"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						{/* Status Badge */}
						<motion.div
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.2 }}
							className="mb-4 md:mb-6"
						>
							<Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 px-3 md:px-4 py-1 md:py-1.5 text-xs md:text-sm">
								<span className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse inline-block" />
								Open to Contracts & Consulting
							</Badge>
						</motion.div>

						{/* Name */}
						<h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-bold mb-3 md:mb-4 leading-tight">
							<span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-cyan-400 to-primary">
								Austin Spraggins
							</span>
						</h1>

						{/* Role Badges */}
						<motion.div
							className="flex flex-wrap gap-2 justify-center lg:justify-start mb-4 md:mb-6"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.3 }}
						>
							{highlights.map((role) => (
								<Badge
									key={role}
									variant="secondary"
									className="bg-card/80 border-primary/30 text-foreground px-2 md:px-3 py-0.5 md:py-1 text-xs md:text-sm"
								>
									{role}
								</Badge>
							))}
						</motion.div>

						{/* Animated Tagline */}
						<div className="mb-6 md:mb-8">
							<TextGenerateEffect
								words={tagline}
								className="text-muted-foreground text-sm md:text-base"
								duration={0.3}
							/>
						</div>

						{/* CTA Buttons */}
						<motion.div
							className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start mb-6 md:mb-8"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.8 }}
						>
							<Link
								href="#projects"
								className="group bg-primary text-background px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold shadow-lg inline-flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-1"
							>
								View My Work
								<ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
							</Link>
							<Link
								href="#contact"
								className="bg-card/80 backdrop-blur-sm border border-border/50 text-foreground px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold inline-flex items-center justify-center gap-2 transition-all duration-300 hover:border-primary/50 hover:-translate-y-1"
							>
								<Mail className="w-4 h-4 md:w-5 md:h-5" />
								Contact Me
							</Link>
						</motion.div>

						{/* Social Links */}
						<motion.div
							className="flex gap-3 md:gap-4 justify-center lg:justify-start"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5, delay: 1 }}
						>
							<a
								href="https://github.com/spragginsdesigns"
								target="_blank"
								rel="noopener noreferrer"
								className="p-2.5 md:p-3 rounded-full bg-card/50 border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
								aria-label="GitHub"
							>
								<Github className="w-4 h-4 md:w-5 md:h-5" />
							</a>
							<a
								href="https://linkedin.com/in/austin-spraggins"
								target="_blank"
								rel="noopener noreferrer"
								className="p-2.5 md:p-3 rounded-full bg-card/50 border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
								aria-label="LinkedIn"
							>
								<Linkedin className="w-4 h-4 md:w-5 md:h-5" />
							</a>
							<a
								href="https://twitter.com/spragginsdesign"
								target="_blank"
								rel="noopener noreferrer"
								className="p-2.5 md:p-3 rounded-full bg-card/50 border border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
								aria-label="Twitter"
							>
								<Twitter className="w-4 h-4 md:w-5 md:h-5" />
							</a>
						</motion.div>
					</motion.div>

					{/* Right Content - Profile Image */}
					<motion.div
						className="flex-shrink-0"
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.6, delay: 0.3 }}
					>
						<div className="relative">
							{/* Glow Effect */}
							<div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-cyan-500/20 to-primary/20 rounded-full blur-2xl animate-pulse" />

							{/* Profile Image */}
							<div className="relative">
								<Image
									src="/images/profile_pic_main2_lessthan1MB.png"
									alt="Austin Spraggins - Co-Founder & CTO"
									width={400}
									height={400}
									className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px] rounded-full shadow-2xl border-4 border-primary/50 relative z-10 object-cover"
									priority
								/>

								{/* Stats Floating Cards - Hidden on mobile */}
								<motion.div
									className="hidden md:block absolute -right-4 top-1/4 bg-card/90 backdrop-blur-sm border border-border/50 rounded-xl p-3 shadow-lg"
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.5, delay: 1.2 }}
								>
									<div className="text-2xl font-bold text-primary">2+</div>
									<div className="text-xs text-muted-foreground">Years Production</div>
								</motion.div>

								<motion.div
									className="hidden md:block absolute -left-4 bottom-1/4 bg-card/90 backdrop-blur-sm border border-border/50 rounded-xl p-3 shadow-lg"
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.5, delay: 1.4 }}
								>
									<div className="text-2xl font-bold text-primary">4+</div>
									<div className="text-xs text-muted-foreground">LLM Integrations</div>
								</motion.div>
							</div>
						</div>
					</motion.div>
				</div>

				{/* Mobile Stats Row - Only visible on mobile */}
				<motion.div
					className="flex md:hidden justify-center gap-6 mt-6"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 1 }}
				>
					<div className="text-center">
						<div className="text-2xl font-bold text-primary">2+</div>
						<div className="text-xs text-muted-foreground">Years Production</div>
					</div>
					<div className="w-px bg-border/50" />
					<div className="text-center">
						<div className="text-2xl font-bold text-primary">4+</div>
						<div className="text-xs text-muted-foreground">LLM Integrations</div>
					</div>
					<div className="w-px bg-border/50" />
					<div className="text-center">
						<div className="text-2xl font-bold text-primary">100+</div>
						<div className="text-xs text-muted-foreground">DB Tables</div>
					</div>
				</motion.div>
			</div>
		</BackgroundLines>
	);
};

export default Hero;
