"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const Hero: React.FC = () => {
	const roles = useMemo(
		() => [
			"Web Developer",
			"Content Creator",
			"Designer",
			"Security Expert",
			"Problem Solver",
			"Tech Enthusiast"
		],
		[]
	);
	const [roleIndex, setRoleIndex] = useState(0);
	const [displayedRole, setDisplayedRole] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);

	React.useEffect(() => {
		let timeout: NodeJS.Timeout;

		const animateRole = () => {
			const currentRole = roles[roleIndex];
			const typingSpeed = 100; // Base typing speed
			const deletingSpeed = 50; // Base deleting speed
			const pauseDuration = 2000; // Pause duration at the end of typing and before starting new role

			if (!isDeleting && displayedRole !== currentRole) {
				setDisplayedRole(currentRole.substring(0, displayedRole.length + 1));
				const nextTypingDelay = typingSpeed + Math.random() * 50; // Add some randomness to typing speed
				clearTimeout(timeout);
				timeout = setTimeout(animateRole, nextTypingDelay);
			} else if (isDeleting && displayedRole !== "") {
				setDisplayedRole(currentRole.substring(0, displayedRole.length - 1));
				const nextDeletingDelay = deletingSpeed + Math.random() * 30; // Add some randomness to deleting speed
				clearTimeout(timeout);
				timeout = setTimeout(animateRole, nextDeletingDelay);
			} else if (displayedRole === currentRole) {
				clearTimeout(timeout);
				timeout = setTimeout(() => {
					setIsDeleting(true);
					animateRole();
				}, pauseDuration);
			} else if (displayedRole === "") {
				clearTimeout(timeout);
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
		<section className="bg-background text-text pt-24 pb-12 md:py-32">
			<div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
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
					<p className="text-lg mb-8 text-text-secondary max-w-lg">
						Crafting secure and efficient web solutions at the intersection of
						development and cybersecurity.
					</p>
					<Link
						href="#projects"
						className="bg-primary text-background px-8 py-4 rounded-full
                           hover:bg-opacity-80 transition-colors inline-block
                           text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
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
