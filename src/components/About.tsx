"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
	FaCode,
	FaRocket,
	FaTruck,
	FaLaptopCode,
	FaUsers,
	FaChild
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
		<div className="mr-4 mt-1 text-primary">{icon}</div>
		<div>
			<h3 className="text-xl font-bold mb-2 text-primary">{title}</h3>
			<p className="text-text-secondary">{description}</p>
		</div>
	</motion.div>
);

const About: React.FC = () => {
	const calculateAge = (birthDate: Date) => {
		const today = new Date();
		let age = today.getFullYear() - birthDate.getFullYear();
		const m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;
	};

	const lillyBirthday = new Date("2017-01-09");
	const julianBirthday = new Date("2012-11-17");

	const lillyAge = calculateAge(lillyBirthday);
	const julianAge = calculateAge(julianBirthday);

	return (
		<section id="about" className="bg-surface text-text py-20">
			<div className="container mx-auto px-4">
				<motion.h2
					className="text-4xl font-heading font-bold mb-12 text-center text-primary"
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					My Journey
				</motion.h2>

				<div className="flex flex-col md:flex-row gap-8">
					<div className="md:w-1/2">
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.5 }}
							className="bg-background rounded-lg shadow-lg p-6 mb-8"
						>
							<Image
								src="/images/sd-logo-banner.png" // Replace with your actual image path
								alt="Austin Dillon Spraggins"
								width={800}
								height={600}
								className="rounded-full mx-auto mb-6"
							/>
							<p className="text-lg mb-4 font-sans text-center">
								At {calculateAge(new Date("1990-11-26"))}, I&rsquo;m a proud
								father of two wonderful children, Lilly ({lillyAge}) and Julian
								({julianAge}) Spraggins. Based in Fresno, California, I&rsquo;m a
								Co-Founder & CTO at LineCrush Inc, leading all technical
								operations for our sports analytics platform.
							</p>
							<p className="text-xl font-dancing-script text-primary italic leading-relaxed text-center">
								Austin Dillon Spraggins
							</p>
						</motion.div>
					</div>

					<div className="md:w-1/2">
						<LifeStage
							icon={<FaCode className="text-3xl" />}
							title="The Early Days"
							description="Born and raised in the mountains of O'Neals, California, I developed a fascination with technology from a young age. The serene environment sparked my curiosity about how things work in the digital world."
						/>
						<LifeStage
							icon={<FaTruck className="text-3xl" />}
							title="Hitting the Road"
							description="My first career was as a truck driver, which taught me valuable lessons about responsibility, time management, and the importance of staying focused on long-term goals."
						/>
						<LifeStage
							icon={<FaLaptopCode className="text-3xl" />}
							title="Discovering My Passion"
							description="I transitioned into tech, following my lifelong passion. I began teaching Web Development at Bitwise Industries and Geekwise Academy, igniting a love for sharing knowledge and inspiring others in the field."
						/>
						<LifeStage
							icon={<FaUsers className="text-3xl" />}
							title="A Period of Reflection"
							description="Life took an unexpected turn, leading to a period of profound personal growth and self-discovery. During this time, I gained invaluable insights about myself and the world around me, strengthening my resolve to make a positive impact through technology."
						/>
						<LifeStage
							icon={<FaRocket className="text-3xl" />}
							title="Leading at LineCrush"
							description="As Co-Founder & CTO at LineCrush Inc, I own every layer of our stack. From Next.js frontend to Python backend, AI/ML and NLP systems, web scraping pipelines, PostgreSQL and Redis databases, AWS infrastructure, to Ubuntu VPS DevOps - 2+ years of 12+ hour days building production systems."
						/>
						<LifeStage
							icon={<FaChild className="text-3xl" />}
							title="Family and Future"
							description="As a father and developer, I'm combining my passion for technology with the joys of parenthood. I'm excited to create a future where my children can see the positive impact of technology and innovation."
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default About;
