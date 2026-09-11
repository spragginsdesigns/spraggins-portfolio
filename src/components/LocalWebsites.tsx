"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
	ArrowRight,
	Camera,
	ExternalLink,
	FileCheck,
	Globe,
	Mail,
	Search,
	Smartphone
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CredibilityStrip from "@/components/local-websites/CredibilityStrip";
import CallTextButtons from "@/components/local-websites/CallTextButtons";
import IntakeForm from "@/components/local-websites/IntakeForm";
import { HOW_IT_LANDS, LOCAL_SITES, WHAT_YOU_GET } from "@/lib/local-websites";

const icons = [
	<Camera key="camera" className="h-5 w-5" />,
	<Smartphone key="phone" className="h-5 w-5" />,
	<Search key="search" className="h-5 w-5" />,
	<Mail key="mail" className="h-5 w-5" />,
	<Globe key="globe" className="h-5 w-5" />,
	<FileCheck key="check" className="h-5 w-5" />
];

/**
 * Homepage section for the local-business website offer. Written for an
 * owner who looked Austin up after a pitch, not for a developer.
 */
const LocalWebsites: React.FC = () => {
	return (
		<section
			id="local-websites"
			className="relative overflow-hidden bg-background px-4 py-20 text-foreground"
		>
			<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
			<div className="container mx-auto max-w-6xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					viewport={{ once: true }}
					className="mb-10 text-center"
				>
					<Badge className="mb-5 border-primary/30 bg-primary/15 px-4 py-1.5 text-sm text-primary">
						{LOCAL_SITES.businessName}
					</Badge>
					<h2 className="mb-4 font-heading text-4xl font-bold md:text-5xl">
						Websites for{" "}
						<span className="text-primary">{LOCAL_SITES.city} businesses</span>
					</h2>
					<p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
						I build a full website for your auto shop, dental office, landscaping
						crew, or law office from the listings and photos you already have.
						It&apos;s live in a day, and there&apos;s no contract.
					</p>
					<CredibilityStrip />
				</motion.div>

				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{WHAT_YOU_GET.map((item, index) => (
						<motion.div
							key={item.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: index * 0.06 }}
							viewport={{ once: true }}
						>
							<Card className="h-full border-border/50 bg-card/40 p-5 transition-colors hover:border-primary/40">
								<div className="mb-3 w-fit rounded-lg bg-primary/10 p-2 text-primary">
									{icons[index]}
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
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					viewport={{ once: true }}
					className="relative mt-10"
				>
					<div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/15 via-cyan-500/10 to-green-500/15 blur-xl opacity-60" />
					<Card className="relative overflow-hidden border-primary/25 bg-gradient-to-br from-card via-card to-cyan-950/20">
						<div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1.1fr_1fr]">
							<div className="flex flex-col justify-center">
								<p className="mb-2 text-sm font-medium uppercase tracking-[0.14em] text-primary/80">
									One price, no surprises
								</p>
								<div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
									<span className="font-heading text-5xl font-bold text-foreground">
										{LOCAL_SITES.buildPrice}
									</span>
									<span className="text-muted-foreground">to build</span>
								</div>
								<p className="mb-5 text-base text-muted-foreground">
									Then <span className="font-semibold text-green-400">{LOCAL_SITES.hostingPrice}</span> for
									hosting, which covers your domain, hosting, SSL, and the
									contact form. No contract, cancel any time.
								</p>

								<ol className="mb-6 space-y-3">
									{HOW_IT_LANDS.map((step, index) => (
										<li key={step.title} className="flex gap-3">
											<span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
												{index + 1}
											</span>
											<div>
												<div className="text-sm font-semibold">{step.title}</div>
												<div className="text-sm text-muted-foreground">
													{step.description}
												</div>
											</div>
										</li>
									))}
								</ol>

								<CallTextButtons />

								<div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
									<a
										href={LOCAL_SITES.sampleUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1.5 text-primary hover:underline"
									>
										See a sample site
										<ExternalLink className="h-3.5 w-3.5" />
									</a>
									<Link
										href="/local-websites"
										className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary"
									>
										Full details and FAQ
										<ArrowRight className="h-3.5 w-3.5" />
									</Link>
								</div>
							</div>

							<div className="rounded-xl border border-border/50 bg-background/60 p-5 sm:p-6">
								<h3 className="mb-1 font-heading text-xl font-bold">
									Or send me the basics
								</h3>
								<p className="mb-4 text-sm text-muted-foreground">
									Three quick fields. I&apos;ll text you back.
								</p>
								<IntakeForm idPrefix="home-intake" />
							</div>
						</div>
					</Card>
				</motion.div>
			</div>
		</section>
	);
};

export default LocalWebsites;
