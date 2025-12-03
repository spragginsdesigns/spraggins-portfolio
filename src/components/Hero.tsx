"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const Hero: React.FC = () => {
	const roles = useMemo(
		() => [
			"Co-Founder & CTO",
			"Senior Software Engineer",
			"Full Stack Developer",
			"AI/ML Engineer",
			"DevOps Engineer",
			"Tech Entrepreneur"
		],
		[]
	);
	const [roleIndex, setRoleIndex] = useState(0);
	const [displayedRole, setDisplayedRole] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		let timeout: NodeJS.Timeout;

		const animateRole = () => {
			const currentRole = roles[roleIndex];
			const typingSpeed = 100;
			const deletingSpeed = 50;
			const pauseDuration = 2000;

			if (!isDeleting && displayedRole !== currentRole) {
				setDisplayedRole(currentRole.substring(0, displayedRole.length + 1));
				const nextTypingDelay = typingSpeed + Math.random() * 50;
				timeout = setTimeout(animateRole, nextTypingDelay);
			} else if (isDeleting && displayedRole !== "") {
				setDisplayedRole(currentRole.substring(0, displayedRole.length - 1));
				const nextDeletingDelay = deletingSpeed + Math.random() * 30;
				timeout = setTimeout(animateRole, nextDeletingDelay);
			} else if (displayedRole === currentRole) {
				timeout = setTimeout(() => {
					setIsDeleting(true);
					animateRole();
				}, pauseDuration);
			} else if (displayedRole === "") {
				timeout = setTimeout(() => {
					setIsDeleting(false);
					setRoleIndex((prevIndex) => (prevIndex + 1) % roles.length);
					animateRole();
				}, pauseDuration);
			}
		};

		animateRole();
		return () => clearTimeout(timeout);
	}, [displayedRole, isDeleting, roleIndex, roles]);

	return (
		<section className="bg-background text-text pt-24 pb-12 md:py-32 relative overflow-hidden">
			<div className="absolute inset-0 z-0">
				<svg
					className="w-full h-full"
					viewBox="0 0 100 100"
					preserveAspectRatio="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<defs>
						<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
							<stop offset="0%" stopColor="#00ffff" stopOpacity="0.1" />
							<stop offset="100%" stopColor="#ff00ff" stopOpacity="0.1" />
						</linearGradient>
					</defs>
					<rect width="100%" height="100%" fill="url(#grad1)" />
					<g className="lines">
						{[...Array(10)].map((_, i) => (
							<path
								key={i}
								d={`M0,${10 + i * 10} Q50,${5 + i * 10} 100,${15 + i * 10}`}
								className="cyberpunk-line"
							/>
						))}
					</g>
				</svg>
			</div>
			<div className="container mx-auto px-4 flex flex-col md:flex-row items-center relative z-10">
				<motion.div
					className="md:w-1/2 mb-8 md:mb-0"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 leading-tight">
						Austin Spraggins
					</h1>
					<h2 className="text-xl md:text-3xl text-primary mb-6 transition-all duration-200 ease-in-out">
						<span>{displayedRole}</span>
						<span className="animate-blink">|</span>
					</h2>
					<p className="text-xl mb-8 text-text-secondary max-w-xl leading-relaxed font-light">
						Passionate about crafting innovative and secure digital solutions.
						Transforming complex challenges into elegant, user-centric
						experiences.
					</p>
					<Link
						href="#projects"
						className="
    bg-primary text-background px-8 py-4 rounded-full
    text-lg font-semibold
    shadow-lg
    inline-block
    transition-all duration-300 ease-in-out
    hover:bg-opacity-90
    hover:shadow-xl
    hover:-translate-y-1
    hover:scale-105
    active:translate-y-0
    active:scale-100
  "
					>
						Explore My Work
					</Link>
				</motion.div>
				<motion.div
					className="md:w-1/2 flex justify-center"
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<Image
						src="/images/AustinSpraggins-FavoriteProfilePic1.jpg"
						alt="Austin Spraggins"
						width={400}
						height={400}
						className="rounded-full shadow-2xl border-4 border-primary"
					/>
				</motion.div>
			</div>
		</section>
	);
};

export default Hero;
