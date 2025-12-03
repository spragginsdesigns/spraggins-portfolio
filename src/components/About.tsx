"use client";

import React from "react";
import Image from "next/image";
import { Timeline } from "@/components/ui/timeline";
import { Badge } from "@/components/ui/badge";
import {
	Code,
	Truck,
	GraduationCap,
	Rocket,
	Heart,
	Brain,
	Server,
	Database
} from "lucide-react";

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
	const myAge = calculateAge(new Date("1990-11-26"));

	const timelineData = [
		{
			title: "Early Days",
			content: (
				<div>
					<div className="flex items-center gap-3 mb-4">
						<div className="p-2 rounded-lg bg-primary/10">
							<Code className="w-5 h-5 text-primary" />
						</div>
						<h4 className="text-lg font-semibold text-foreground">The Beginning</h4>
					</div>
					<p className="text-muted-foreground text-sm md:text-base mb-6 leading-relaxed">
						Born and raised in the mountains of O&apos;Neals, California, I developed a
						fascination with technology from a young age. The serene environment sparked
						my curiosity about how things work in the digital world.
					</p>
					<div className="flex flex-wrap gap-2">
						<Badge variant="secondary">Curiosity</Badge>
						<Badge variant="secondary">Self-taught</Badge>
						<Badge variant="secondary">Problem Solving</Badge>
					</div>
				</div>
			),
		},
		{
			title: "First Career",
			content: (
				<div>
					<div className="flex items-center gap-3 mb-4">
						<div className="p-2 rounded-lg bg-orange-500/10">
							<Truck className="w-5 h-5 text-orange-500" />
						</div>
						<h4 className="text-lg font-semibold text-foreground">Hitting the Road</h4>
					</div>
					<p className="text-muted-foreground text-sm md:text-base mb-6 leading-relaxed">
						My first career was as a truck driver, which taught me valuable lessons about
						responsibility, time management, and the importance of staying focused on
						long-term goals. These skills would prove invaluable in tech.
					</p>
					<div className="flex flex-wrap gap-2">
						<Badge variant="secondary">Discipline</Badge>
						<Badge variant="secondary">Time Management</Badge>
						<Badge variant="secondary">Long-term Thinking</Badge>
					</div>
				</div>
			),
		},
		{
			title: "Tech Transition",
			content: (
				<div>
					<div className="flex items-center gap-3 mb-4">
						<div className="p-2 rounded-lg bg-blue-500/10">
							<GraduationCap className="w-5 h-5 text-blue-500" />
						</div>
						<h4 className="text-lg font-semibold text-foreground">Discovering My Passion</h4>
					</div>
					<p className="text-muted-foreground text-sm md:text-base mb-6 leading-relaxed">
						I transitioned into tech, following my lifelong passion. I began teaching
						Web Development at Bitwise Industries and Geekwise Academy, igniting a love
						for sharing knowledge and inspiring others in the field.
					</p>
					<div className="flex flex-wrap gap-2">
						<Badge variant="secondary">Teaching</Badge>
						<Badge variant="secondary">Web Development</Badge>
						<Badge variant="secondary">Mentorship</Badge>
					</div>
				</div>
			),
		},
		{
			title: "2023-Present",
			content: (
				<div>
					<div className="flex items-center gap-3 mb-4">
						<div className="p-2 rounded-lg bg-green-500/10">
							<Rocket className="w-5 h-5 text-green-500" />
						</div>
						<h4 className="text-lg font-semibold text-foreground">Leading at LineCrush</h4>
					</div>
					<p className="text-muted-foreground text-sm md:text-base mb-6 leading-relaxed">
						As Co-Founder & CTO at LineCrush Inc, I own every layer of our stack.
						2+ years of 12+ hour days building production systems that serve users 24/7.
					</p>

					{/* Tech highlights */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
						<div className="bg-card/50 rounded-lg p-4 text-center border border-border/50">
							<Brain className="w-6 h-6 text-primary mx-auto mb-2" />
							<div className="text-sm font-medium">AI/ML</div>
							<div className="text-xs text-muted-foreground">4+ LLMs</div>
						</div>
						<div className="bg-card/50 rounded-lg p-4 text-center border border-border/50">
							<Code className="w-6 h-6 text-primary mx-auto mb-2" />
							<div className="text-sm font-medium">Frontend</div>
							<div className="text-xs text-muted-foreground">Next.js 15</div>
						</div>
						<div className="bg-card/50 rounded-lg p-4 text-center border border-border/50">
							<Server className="w-6 h-6 text-primary mx-auto mb-2" />
							<div className="text-sm font-medium">Backend</div>
							<div className="text-xs text-muted-foreground">Python</div>
						</div>
						<div className="bg-card/50 rounded-lg p-4 text-center border border-border/50">
							<Database className="w-6 h-6 text-primary mx-auto mb-2" />
							<div className="text-sm font-medium">Database</div>
							<div className="text-xs text-muted-foreground">PostgreSQL</div>
						</div>
					</div>

					<div className="flex flex-wrap gap-2">
						<Badge className="bg-primary/20 text-primary border-primary/30">Co-Founder & CTO</Badge>
						<Badge variant="secondary">Full Stack</Badge>
						<Badge variant="secondary">System Design</Badge>
						<Badge variant="secondary">DevOps</Badge>
					</div>
				</div>
			),
		},
		{
			title: "Today",
			content: (
				<div>
					<div className="flex items-center gap-3 mb-4">
						<div className="p-2 rounded-lg bg-pink-500/10">
							<Heart className="w-5 h-5 text-pink-500" />
						</div>
						<h4 className="text-lg font-semibold text-foreground">Family & Future</h4>
					</div>

					{/* Personal info card */}
					<div className="bg-card/50 rounded-xl p-6 border border-border/50 mb-6">
						<div className="flex flex-col md:flex-row items-center gap-6">
							<Image
								src="/images/sd-logo-banner.png"
								alt="Austin Dillon Spraggins"
								width={120}
								height={120}
								className="rounded-xl"
							/>
							<div className="text-center md:text-left">
								<p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-3">
									At {myAge}, I&apos;m a proud father of two wonderful children,
									Lilly ({lillyAge}) and Julian ({julianAge}) Spraggins. Based in
									Fresno, California, combining my passion for technology with the
									joys of parenthood.
								</p>
								<p className="text-lg font-dancing-script text-primary italic">
									Austin Dillon Spraggins
								</p>
							</div>
						</div>
					</div>

					<p className="text-muted-foreground text-sm md:text-base leading-relaxed">
						I&apos;m excited to create a future where my children can see the positive
						impact of technology and innovation. Every line of code is building toward
						something meaningful.
					</p>
				</div>
			),
		},
	];

	return (
		<section id="about" className="bg-background text-foreground">
			<Timeline data={timelineData} />
		</section>
	);
};

export default About;
