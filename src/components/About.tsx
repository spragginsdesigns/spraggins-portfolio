"use client";

import React from "react";
import { motion } from "framer-motion";
import {
	FaCode,
	FaGraduationCap,
	FaTruck,
	FaLaptopCode,
	FaUsers
} from "react-icons/fa";

const LifeStage = ({
	icon,
	title,
	description
}: {
	icon: React.ReactNode;
	title: string;
	description: string;
}) => (
	<motion.div
		className="flex items-start mb-8"
		initial={{ opacity: 0, x: -50 }}
		animate={{ opacity: 1, x: 0 }}
		transition={{ duration: 0.5 }}
	>
		<div className="mr-4 mt-1">{icon}</div>
		<div>
			<h3 className="text-xl font-bold mb-2">{title}</h3>
			<p className="text-text-secondary">{description}</p>
		</div>
	</motion.div>
);

const About: React.FC = () => {
	return (
		<section id="about" className="bg-surface text-text py-20">
			<div className="container mx-auto px-4">
				<motion.h2
					className="text-4xl font-heading font-bold mb-12 text-center"
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					My Journey
				</motion.h2>

				<div className="max-w-3xl mx-auto">
					<LifeStage
						icon={<FaCode className="text-3xl text-primary" />}
						title="The Early Days"
						description="Born and raised in the mountains of O'Neals, California, I developed a fascination with technology from a young age. The serene environment sparked my curiosity about how things work in the digital world."
					/>

					<LifeStage
						icon={<FaTruck className="text-3xl text-primary" />}
						title="Hitting the Road"
						description="My first career was as a truck driver, which taught me valuable lessons about responsibility, time management, and the importance of staying focused on long-term goals."
					/>

					<LifeStage
						icon={<FaLaptopCode className="text-3xl text-primary" />}
						title="Discovering My Passion"
						description="I transitioned into tech, following my lifelong passion. I began teaching Web Development at Bitwise Industries and Geekwise Academy, igniting a love for sharing knowledge and inspiring others in the field."
					/>

					<LifeStage
						icon={<FaUsers className="text-3xl text-primary" />}
						title="A Period of Reflection"
						description="Life took an unexpected turn, leading to a period of profound personal growth and self-discovery. During this time, I gained invaluable insights about myself and the world around me, strengthening my resolve to make a positive impact through technology."
					/>

					<LifeStage
						icon={<FaGraduationCap className="text-3xl text-primary" />}
						title="Continuous Learning"
						description="Currently pursuing a Bachelor's Degree in Computer Science while working as a Full-Stack Web Developer. I'm excited to apply my skills in Python, Express.js, NextJS 14, and Tailwind CSS to create innovative solutions."
					/>
				</div>

				<motion.div
					className="text-center mt-12"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5, duration: 0.5 }}
				>
					<p className="text-lg mb-4 font-sans">
						Today, at 33, I&apos;m a proud father of two wonderful children,
						Lilly (7) and Julian (11). Based in Fresno, California, I&apos;m
						living my dream as a Full-Stack Web Developer, constantly learning
						and growing in this ever-evolving field. My journey has shaped me
						into who I am today - a confident programmer, problem-solver, and
						innovator, excited to make a positive impact through code.
					</p>
					<p className="text-xl font-dancing-script text-primary italic leading-relaxed">
						Austin Dillon Spraggins
					</p>
				</motion.div>
			</div>
		</section>
	);
};

export default About;
