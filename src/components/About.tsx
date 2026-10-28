"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Timeline } from "@/components/ui/timeline";
import { Badge } from "@/components/ui/badge";
import { FMT } from "@/lib/stats";
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
			title: "2024-Present",
			content: (
				<div>
					<div className="flex items-center gap-3 mb-4">
						<div className="p-2 rounded-lg bg-green-500/10">
							<Rocket className="w-5 h-5 text-green-500" />
						</div>
						<h4 className="text-lg font-semibold text-foreground">Leading at LineCrush</h4>
					</div>
					<p className="text-muted-foreground text-sm md:text-base mb-6 leading-relaxed">
						As Co-Founder & CTO at LineCrush Inc, I own every layer of our stack -
						{" "}{FMT.commits} monorepo commits across web, Python services, native mobile, and
						games. I built an agent operating system around that work: durable Codex
						and Claude sessions, custom MCP tooling, shared skills, proof gates, and
						autonomous issue-to-production delivery.
					</p>

					{/* Tech highlights */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
						<div className="bg-card/50 rounded-lg p-4 text-center border border-border/50">
							<Brain className="w-6 h-6 text-primary mx-auto mb-2" />
							<div className="text-sm font-medium">AI/ML</div>
							<div className="text-xs text-muted-foreground">Agents + Product AI</div>
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
						<Badge variant="secondary">Game Systems</Badge>
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
			<section
				id="faith"
				aria-labelledby="faith-heading"
				className="border-y border-amber-200/10 bg-gradient-to-br from-amber-300/[0.04] via-background to-background"
			>
				<div className="container mx-auto grid gap-10 px-5 py-16 sm:px-8 md:gap-14 md:py-24 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-20">
					<div className="max-w-2xl">
						<h2 id="faith-heading" className="mb-5 font-heading text-3xl font-bold text-amber-100 sm:text-4xl md:text-5xl">
							My faith
						</h2>
						<p className="mb-6 max-w-xl font-heading text-2xl font-medium leading-snug text-foreground sm:text-3xl text-balance">
							Jesus Christ is my Lord and Savior.
						</p>
						<div className="space-y-4 text-base leading-relaxed text-muted-foreground md:text-lg">
							<p>
								I&apos;m saved by His grace, and I believe the whole Bible, from Genesis
								to Revelation, is the Word of God. My faith shapes how I raise my
								children, treat people, and approach my work.
							</p>
							<p>
								I&apos;m still growing and learning to follow Him more closely every
								day. SureWord comes out of that part of my life, and my desire to
								keep studying His Word and help others do the same.
							</p>
						</div>
						<Link
							href="https://sureword.app"
							className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-sm font-medium text-amber-200 underline decoration-amber-200/40 underline-offset-4 transition-colors hover:text-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
						>
							Study the Bible with SureWord
						</Link>
					</div>
					<figure className="relative m-0 rounded-3xl border border-amber-200/15 bg-amber-200/[0.03] px-6 py-8 sm:px-9 sm:py-10 lg:py-12">
						<blockquote className="font-heading text-xl font-medium leading-relaxed text-amber-50 sm:text-2xl lg:text-3xl">
							<p>
								For by grace are ye saved through faith; and that not of yourselves:
								it is the gift of God:
							</p>
						</blockquote>
						<figcaption className="mt-6 text-sm font-medium text-amber-200/80">
							Ephesians 2:8 <span aria-hidden="true">&middot;</span> KJV
						</figcaption>
					</figure>
				</div>
			</section>
			<Timeline data={timelineData} />
		</section>
	);
};

export default About;
