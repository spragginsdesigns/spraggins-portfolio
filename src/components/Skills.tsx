"use client";

import React from "react";
import { motion } from "framer-motion";
import {
	FaHtml5,
	FaCss3Alt,
	FaJs,
	FaReact,
	FaNode,
	FaPython,
	FaDatabase,
	FaLock
} from "react-icons/fa";
import Link from "next/link";

const SkillIcon: React.FC<{ Icon: React.ElementType; name: string }> = ({
	Icon,
	name
}) => (
	<motion.div
		className="flex flex-col items-center m-4"
		whileHover={{ scale: 1.1 }}
		whileTap={{ scale: 0.9 }}
	>
		<Icon className="text-5xl mb-2 text-primary" />
		<span className="text-sm font-medium text-text">{name}</span>
	</motion.div>
);

const Skills: React.FC = () => {
	const skillsData = [
		{ Icon: FaHtml5, name: "HTML5" },
		{ Icon: FaCss3Alt, name: "CSS3" },
		{ Icon: FaJs, name: "JavaScript" },
		{ Icon: FaReact, name: "React" },
		{ Icon: FaNode, name: "Node.js" },
		{ Icon: FaPython, name: "Python" },
		{ Icon: FaDatabase, name: "SQL/PostgreSQL" },
		{ Icon: FaLock, name: "Cybersecurity" }
	];

	return (
		<section id="skills" className="bg-surface text-text py-20">
			<div className="container mx-auto px-4">
				<h2 className="text-4xl font-heading font-bold mb-12 text-center">
					My Skills
				</h2>
				<div className="max-w-4xl mx-auto bg-background p-8 rounded-lg shadow-xl">
					<motion.div
						className="grid grid-cols-2 sm:grid-cols-4 gap-4"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						{skillsData.map((skill, index) => (
							<SkillIcon key={index} Icon={skill.Icon} name={skill.name} />
						))}
					</motion.div>
					<motion.div
						className="mt-12 text-center"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5, duration: 0.5 }}
					>
						<Link
							href="https://drive.google.com/file/d/1G1Czfeqoa8priSxrlsYElJnBILulZ30x/view?usp=drive_link"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center bg-primary text-background px-6 py-3 rounded-full hover:bg-opacity-80 transition-all transform hover:scale-105"
						>
							View Resume
						</Link>
					</motion.div>
				</div>
			</div>
		</section>
	);
};

export default Skills;
