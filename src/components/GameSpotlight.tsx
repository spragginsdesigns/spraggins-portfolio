"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Gamepad2 } from "lucide-react";
import { FaSteam } from "react-icons/fa";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GUNMETAL_ORBIT, STUDIO } from "@/lib/stats";

const GameSpotlight: React.FC = () => {
	return (
		<section id="game-spotlight" className="relative px-4 py-10 md:py-14">
			<div className="container mx-auto max-w-5xl">
				<motion.div
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					viewport={{ once: true }}
					className="relative"
				>
					<div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-violet-500/20 via-primary/20 to-cyan-500/20 blur-xl opacity-60" />
					<Card className="relative overflow-hidden border-violet-500/25 bg-gradient-to-br from-card via-card to-violet-950/25">
						<div className="grid items-center gap-6 p-5 sm:p-8 md:grid-cols-[1.1fr_1fr]">
							<Link
								href="/games"
								className="group relative block overflow-hidden rounded-xl border border-border/50"
								aria-label={`Explore ${GUNMETAL_ORBIT.name} and ${STUDIO.name}`}
							>
								<Image
									src="/images/games/gunmetal-orbit/capsule.jpg"
									alt={`${GUNMETAL_ORBIT.name} - an armored exosuit with multiple weapon mounts in deep space`}
									width={616}
									height={353}
									className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
							</Link>

							<div className="flex flex-col items-start">
								<div className="mb-3 flex flex-wrap items-center gap-2">
									<Badge className="border-violet-400/30 bg-violet-500/15 text-violet-300">
										New from {STUDIO.name}
									</Badge>
									<Badge
										variant="outline"
										className="border-cyan-500/40 text-cyan-300"
									>
										Steam · {GUNMETAL_ORBIT.releaseDateDisplay}
									</Badge>
								</div>
								<h2 className="mb-2 bg-gradient-to-r from-violet-300 via-primary to-cyan-300 bg-clip-text font-heading text-3xl font-bold text-transparent md:text-4xl">
									{GUNMETAL_ORBIT.name}
								</h2>
								<p className="mb-1 text-sm font-medium uppercase tracking-[0.14em] text-primary/80">
									{GUNMETAL_ORBIT.genre}
								</p>
								<p className="mb-5 text-sm leading-relaxed text-muted-foreground md:text-base">
									&ldquo;{GUNMETAL_ORBIT.tagline}&rdquo; - mine ore between enemy
									waves, bank it at the dock, and snowball a six-weapon exosuit
									build. {GUNMETAL_ORBIT.price} on Steam and Steam Deck.
								</p>
								<div className="flex flex-wrap gap-3">
									<a
										href={GUNMETAL_ORBIT.steamUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-primary px-6 py-2.5 font-semibold text-background transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25"
									>
										<FaSteam className="h-4 w-4" />
										Wishlist on Steam
									</a>
									<Link
										href="/games"
										className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-violet-400/40 bg-card/60 px-6 py-2.5 font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-violet-300/60"
									>
										<Gamepad2 className="h-4 w-4" />
										Explore the studio
										<ArrowRight className="h-4 w-4" />
									</Link>
								</div>
							</div>
						</div>
					</Card>
				</motion.div>
			</div>
		</section>
	);
};

export default GameSpotlight;
