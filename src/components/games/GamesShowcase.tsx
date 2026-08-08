"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
	ArrowRight,
	Bot,
	Box,
	Crosshair,
	Gamepad2,
	Layers,
	MonitorCheck,
	Pickaxe,
	Rocket,
	Shield,
	Users
} from "lucide-react";
import { FaSteam } from "react-icons/fa";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CountUp } from "@/components/ui/count-up";
import { GUNMETAL_ORBIT, STUDIO } from "@/lib/stats";

const WishlistButton: React.FC<{ className?: string }> = ({ className = "" }) => (
	<a
		href={GUNMETAL_ORBIT.steamUrl}
		target="_blank"
		rel="noopener noreferrer"
		className={`inline-flex min-h-[48px] items-center gap-2 rounded-full bg-primary px-7 py-3 text-base font-semibold text-background transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25 ${className}`}
	>
		<FaSteam className="h-5 w-5" />
		Wishlist on Steam
	</a>
);

const gameNumbers = [
	{ value: GUNMETAL_ORBIT.weapons, label: "Weapons in the arsenal" },
	{ value: GUNMETAL_ORBIT.weaponSlots, label: "Auto-firing slots" },
	{ value: GUNMETAL_ORBIT.waves, label: "Campaign waves" }
];

const staticNumbers = [
	{ value: GUNMETAL_ORBIT.hazardLevels, label: "Hazard levels" },
	{ value: String(GUNMETAL_ORBIT.characters.length), label: "Playable pilots" }
];

const rosterTitles = [
	{
		icon: <Pickaxe className="h-5 w-5" />,
		title: "Space Miner",
		description:
			"The predecessor - the Steam Deck-first survival miner where the studio's mining DNA started."
	},
	{
		icon: <Crosshair className="h-5 w-5" />,
		title: "RockHunter",
		description: "Playable mining-action spinoff with its own combat rhythm."
	},
	{
		icon: <Rocket className="h-5 w-5" />,
		title: "MERIDIAN",
		description: "Story-first 3D space adventure in active development."
	},
	{
		icon: <Shield className="h-5 w-5" />,
		title: "Last Crew",
		description: "Arcade siege defense with painted-art enemy rosters."
	},
	{
		icon: <Users className="h-5 w-5" />,
		title: "Web Party Games",
		description:
			"Ringer, PartyPack, and more - browser multiplayer built on the LineCrush platform."
	}
];

const pipelineHighlights = [
	{
		icon: <Bot className="h-5 w-5" />,
		title: "Agent-controlled Godot",
		description: "Agents operate the editor: scenes, scripts, captures, playtests."
	},
	{
		icon: <Box className="h-5 w-5" />,
		title: "AI asset pipeline",
		description: "Generated concepts, rigged 3D models, UI art, and authored audio."
	},
	{
		icon: <MonitorCheck className="h-5 w-5" />,
		title: "Headless QA",
		description: "Automated tests, captures, and repeatable native exports."
	},
	{
		icon: <Layers className="h-5 w-5" />,
		title: "Human product taste",
		description: "Every gameplay, feel, and art-direction call stays human."
	}
];

const GamesShowcase: React.FC = () => {
	return (
		<div className="bg-background text-foreground">
			{/* Studio hero */}
			<BackgroundLines
				className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden pt-14"
				svgOptions={{ duration: 12 }}
			>
				<div className="container relative z-20 mx-auto px-4 py-16 text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<Badge className="mb-6 border-violet-400/30 bg-violet-500/15 px-4 py-1.5 text-sm text-violet-300">
							<Gamepad2 className="mr-2 h-4 w-4" />
							{STUDIO.name} - {STUDIO.location}
						</Badge>
						<h1 className="mx-auto mb-5 max-w-3xl font-heading text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
							<span className="bg-gradient-to-r from-violet-300 via-primary to-cyan-300 bg-clip-text text-transparent">
								{STUDIO.motto}
							</span>
						</h1>
						<p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
							An AI-native game studio run by two people - Austin (CTO, engineering
							and art pipelines) and Jay (product and QA). Original Godot titles,
							built on Steam Deck first, shipped to Steam.
						</p>
						<div className="flex flex-wrap items-center justify-center gap-4">
							<WishlistButton />
							<a
								href={STUDIO.url}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-border/60 bg-card/60 px-7 py-3 text-base font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/50"
							>
								games.linecrush.com
								<ArrowRight className="h-4 w-4" />
							</a>
						</div>
					</motion.div>
				</div>
			</BackgroundLines>

			{/* Gunmetal Orbit flagship */}
			<section className="px-4 py-16 md:py-20">
				<div className="container mx-auto max-w-6xl">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
					>
						<Card className="overflow-hidden border-violet-500/25 bg-gradient-to-br from-card via-card to-violet-950/25">
							<div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-2">
								<div className="flex flex-col justify-center">
									<div className="mb-4 flex flex-wrap items-center gap-2">
										<Badge className="border-primary/30 bg-primary/15 text-primary">
											Flagship
										</Badge>
										<Badge
											variant="outline"
											className="border-cyan-500/40 text-cyan-300"
										>
											Steam · {GUNMETAL_ORBIT.releaseDateDisplay}
										</Badge>
										<Badge
											variant="outline"
											className="border-green-500/40 text-green-400"
										>
											{GUNMETAL_ORBIT.price}
										</Badge>
									</div>
									<h2 className="mb-3 bg-gradient-to-r from-violet-300 via-primary to-cyan-300 bg-clip-text font-heading text-4xl font-bold text-transparent md:text-5xl">
										{GUNMETAL_ORBIT.name}
									</h2>
									<p className="mb-4 text-sm font-medium uppercase tracking-[0.16em] text-primary/80">
										{GUNMETAL_ORBIT.genre}
									</p>
									<p className="mb-5 text-base leading-relaxed text-muted-foreground md:text-lg">
										Pilot an exosuit with {GUNMETAL_ORBIT.weaponSlots} auto-firing
										weapon mounts drawn from a {GUNMETAL_ORBIT.weapons}-weapon
										arsenal. Mine ore between enemy waves, bank it at the dock,
										snowball your build, and push higher hazards through
										procedurally shifting sectors - with outpost base-building
										between runs and two pilots,{" "}
										{GUNMETAL_ORBIT.characters.join(" and ")}, to master.
									</p>
									<blockquote className="mb-6 border-l-2 border-primary/50 pl-4 text-lg font-medium italic text-foreground/90">
										&ldquo;{GUNMETAL_ORBIT.tagline}&rdquo;
									</blockquote>
									<div className="flex flex-wrap gap-3">
										<WishlistButton />
									</div>
								</div>

								<div className="flex flex-col justify-center gap-4">
									<div className="relative">
										<div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/20 to-cyan-500/20 blur-3xl" />
										<Image
											src="/images/games/gunmetal-orbit/capsule.jpg"
											alt={`${GUNMETAL_ORBIT.name} key art - an armored exosuit with multiple weapon mounts against an asteroid field`}
											width={616}
											height={353}
											className="relative h-auto w-full rounded-xl border border-border/50 shadow-2xl"
											priority
										/>
									</div>
									<div className="grid grid-cols-3 gap-3">
										{[1, 2, 3].map((n) => (
											<Image
												key={n}
												src={`/images/games/gunmetal-orbit/screenshot-${n}.jpg`}
												alt={`${GUNMETAL_ORBIT.name} gameplay screenshot ${n}`}
												width={600}
												height={338}
												className="h-auto w-full rounded-lg border border-border/40"
											/>
										))}
									</div>
								</div>
							</div>
						</Card>
					</motion.div>

					{/* By the numbers */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						viewport={{ once: true }}
						className="mt-8"
					>
						<Card className="border-border/50 bg-card/30 backdrop-blur-sm">
							<div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 px-6 py-8">
								{gameNumbers.map((stat) => (
									<div key={stat.label} className="text-center">
										<div className="text-3xl font-bold text-primary md:text-4xl">
											<CountUp end={stat.value} />
										</div>
										<div className="text-xs text-muted-foreground sm:text-sm">
											{stat.label}
										</div>
									</div>
								))}
								{staticNumbers.map((stat) => (
									<div key={stat.label} className="text-center">
										<div className="text-3xl font-bold text-primary md:text-4xl">
											{stat.value}
										</div>
										<div className="text-xs text-muted-foreground sm:text-sm">
											{stat.label}
										</div>
									</div>
								))}
							</div>
						</Card>
					</motion.div>
				</div>
			</section>

			{/* Built on Deck */}
			<section className="px-4 py-12 md:py-16">
				<div className="container mx-auto max-w-6xl">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						viewport={{ once: true }}
						className="mb-10 text-center"
					>
						<h2 className="mb-4 font-heading text-3xl font-bold md:text-4xl">
							Built on Deck. <span className="text-primary">Literally.</span>
						</h2>
						<p className="mx-auto max-w-2xl text-muted-foreground md:text-lg">
							Steam Deck is the lead platform, not a port target.{" "}
							{GUNMETAL_ORBIT.name} runs natively at{" "}
							{GUNMETAL_ORBIT.deckResolution} in {GUNMETAL_ORBIT.engine},
							gamepad-first, then scales up to desktop PCs.
						</p>
					</motion.div>

					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{pipelineHighlights.map((item, index) => (
							<motion.div
								key={item.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.4, delay: index * 0.08 }}
								viewport={{ once: true }}
							>
								<Card className="h-full border-border/50 bg-card/40 p-5">
									<div className="mb-3 w-fit rounded-lg bg-violet-500/10 p-2 text-violet-300">
										{item.icon}
									</div>
									<div className="font-semibold">{item.title}</div>
									<div className="mt-1 text-sm leading-relaxed text-muted-foreground">
										{item.description}
									</div>
								</Card>
							</motion.div>
						))}
					</div>

					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						viewport={{ once: true }}
						className="mt-8 text-center"
					>
						<Link
							href="/blog/2026-07-12-from-godot-project-to-steam-deck-in-one-day"
							className="inline-flex items-center gap-2 text-primary hover:underline"
						>
							Read: From Godot Project to Steam Deck in One Day
							<ArrowRight className="h-4 w-4" />
						</Link>
					</motion.div>
				</div>
			</section>

			{/* Roster */}
			<section className="px-4 py-12 md:py-16">
				<div className="container mx-auto max-w-6xl">
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						viewport={{ once: true }}
						className="mb-8 text-center font-heading text-3xl font-bold md:text-4xl"
					>
						Also in the Hangar
					</motion.h2>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{rosterTitles.map((title, index) => (
							<motion.div
								key={title.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.4, delay: index * 0.06 }}
								viewport={{ once: true }}
							>
								<Card className="group h-full border-border/40 bg-card/30 p-5 transition-colors hover:border-primary/30">
									<div className="mb-3 flex items-center gap-3">
										<div className="rounded-lg bg-primary/10 p-2 text-primary">
											{title.icon}
										</div>
										<h3 className="font-semibold group-hover:text-primary">
											{title.title}
										</h3>
									</div>
									<p className="text-sm leading-relaxed text-muted-foreground">
										{title.description}
									</p>
								</Card>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Closing CTA */}
			<section className="px-4 py-16 md:py-20">
				<div className="container mx-auto max-w-4xl">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						viewport={{ once: true }}
						className="relative"
					>
						<div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-violet-500/20 via-primary/20 to-cyan-500/20 blur-xl opacity-60" />
						<Card className="relative border-primary/20 bg-card/60 p-8 text-center md:p-12">
							<h2 className="mb-3 font-heading text-3xl font-bold md:text-4xl">
								{GUNMETAL_ORBIT.name} lands{" "}
								<span className="text-primary">
									{GUNMETAL_ORBIT.releaseDateDisplay}
								</span>
							</h2>
							<p className="mx-auto mb-8 max-w-xl text-muted-foreground md:text-lg">
								Wishlists are the single biggest thing that helps an indie launch
								on Steam. If this looks like your kind of chaos, add it now.
							</p>
							<div className="flex flex-wrap items-center justify-center gap-4">
								<WishlistButton />
								<Link
									href="/#projects"
									className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-border/60 bg-card/60 px-7 py-3 text-base font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/50"
								>
									See the rest of my work
									<ArrowRight className="h-4 w-4" />
								</Link>
							</div>
						</Card>
					</motion.div>
				</div>
			</section>
		</div>
	);
};

export default GamesShowcase;
