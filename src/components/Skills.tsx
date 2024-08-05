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
	FaLock,
	FaGitAlt,
	FaNpm,
	FaYarn,
	FaFigma,
	FaChrome,
	FaAccessibleIcon,
	FaDocker,
	FaAws,
	FaUserFriends,
	FaClock,
	FaLightbulb,
	FaBook,
	FaLinux,
	FaTerminal,
	FaWindows,
	FaAndroid,
	FaRobot,
	FaBrain
} from "react-icons/fa";
import {
	SiTypescript,
	SiNextdotjs,
	SiJquery,
	SiSass,
	SiGraphql,
	SiWebpack,
	SiGulp,
	SiJest,
	SiPlaywright,
	SiSelenium,
	SiTailwindcss,
	SiVercel,
	SiPostgresql,
	SiKubernetes,
	SiTravisci,
	SiJsonwebtokens,
	SiPnpm,
	SiKalilinux,
	SiPowershell,
	SiBootstrap,
	SiOpenai,
	SiGooglecloud
} from "react-icons/si";
import Link from "next/link";

const SkillIcon: React.FC<{ Icon: React.ElementType; name: string }> = ({
	Icon,
	name
}) => (
	<motion.div
		className="flex flex-col items-center m-4"
		whileHover={{ scale: 1.1, rotate: 5 }}
		whileTap={{ scale: 0.9 }}
	>
		<Icon className="text-5xl mb-2 text-primary" />
		<span className="text-sm font-medium text-text text-center">{name}</span>
	</motion.div>
);

const SkillSection: React.FC<{
	title: string;
	skills: Array<{ Icon: React.ElementType; name: string }>;
}> = ({ title, skills }) => (
	<motion.div
		className="mb-8"
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
	>
		<h3 className="text-2xl font-bold mb-4">{title}</h3>
		<div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
			{skills.map((skill, index) => (
				<SkillIcon key={index} Icon={skill.Icon} name={skill.name} />
			))}
		</div>
	</motion.div>
);

const Skills: React.FC = () => {
	const skillsData = {
		"Programming Languages": [
			{ Icon: FaHtml5, name: "HTML5" },
			{ Icon: FaCss3Alt, name: "CSS3" },
			{ Icon: FaJs, name: "JavaScript" },
			{ Icon: SiTypescript, name: "TypeScript" },
			{ Icon: FaPython, name: "Python" }
		],
		"Frameworks & Libraries": [
			{ Icon: FaReact, name: "React" },
			{ Icon: SiNextdotjs, name: "Next.js" },
			{ Icon: SiJquery, name: "jQuery" },
			{ Icon: SiSass, name: "SASS/LESS" },
			{ Icon: SiBootstrap, name: "Bootstrap" }
		],
		"Web Technologies": [
			{ Icon: SiGraphql, name: "GraphQL" },
			{ Icon: FaDatabase, name: "RESTful API" }
		],
		"Development Tools": [
			{ Icon: FaGitAlt, name: "Git" },
			{ Icon: SiWebpack, name: "Webpack" },
			{ Icon: SiGulp, name: "Gulp" },
			{ Icon: FaNpm, name: "NPM" },
			{ Icon: SiPnpm, name: "PNPM" },
			{ Icon: FaYarn, name: "Yarn" }
		],
		"Design & Testing": [
			{ Icon: FaFigma, name: "Figma" },
			{ Icon: FaChrome, name: "DevTools" },
			{ Icon: SiJest, name: "Jest" },
			{ Icon: SiPlaywright, name: "Playwright" },
			{ Icon: SiSelenium, name: "Selenium" }
		],
		"CSS Frameworks": [{ Icon: SiTailwindcss, name: "Tailwind CSS" }],
		"DevOps & Deployment": [
			{ Icon: FaDocker, name: "Docker" },
			{ Icon: SiKubernetes, name: "Kubernetes" },
			{ Icon: SiTravisci, name: "Travis CI" },
			{ Icon: SiVercel, name: "Vercel" }
		],
		"Database & Security": [
			{ Icon: SiPostgresql, name: "PostgreSQL" },
			{ Icon: FaLock, name: "OAuth" },
			{ Icon: SiJsonwebtokens, name: "JWT" }
		],
		"Operating Systems & Environments": [
			{ Icon: SiKalilinux, name: "Kali Linux" },
			{ Icon: FaLinux, name: "Linux" },
			{ Icon: FaTerminal, name: "Terminal" },
			{ Icon: SiPowershell, name: "PowerShell" },
			{ Icon: FaWindows, name: "Windows 11" },
			{ Icon: FaAndroid, name: "Android Development" }
		],
		"AI & Machine Learning": [
			{ Icon: SiOpenai, name: "OpenAI" },
			{ Icon: FaRobot, name: "LLMs" },
			{ Icon: FaBrain, name: "Machine Learning" },
			{ Icon: SiGooglecloud, name: "AI Cloud Services" },
			{ Icon: FaLightbulb, name: "Prompt Engineering" }
		],
		"Soft Skills": [
			{ Icon: FaUserFriends, name: "Teamwork" },
			{ Icon: FaClock, name: "Time Management" },
			{ Icon: FaLightbulb, name: "Creativity" },
			{ Icon: FaBook, name: "Continuous Learning" }
		]
	};

	return (
		<section id="skills" className="bg-surface text-text py-20">
			<div className="container mx-auto px-4">
				<motion.h2
					className="text-4xl font-heading font-bold mb-12 text-center"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					My Skills
				</motion.h2>
				<div className="max-w-6xl mx-auto bg-background p-8 rounded-lg shadow-xl">
					{Object.entries(skillsData).map(([title, skills], index) => (
						<SkillSection key={index} title={title} skills={skills} />
					))}
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
							View Full Resume
						</Link>
					</motion.div>
				</div>
			</div>
		</section>
	);
};

export default Skills;
