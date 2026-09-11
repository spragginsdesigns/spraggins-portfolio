"use client";

import React from "react";
import { motion } from "framer-motion";
import {
	Camera,
	ExternalLink,
	FileCheck,
	Globe,
	Mail,
	Search,
	Smartphone
} from "lucide-react";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CredibilityStrip from "@/components/local-websites/CredibilityStrip";
import CallTextButtons from "@/components/local-websites/CallTextButtons";
import IntakeForm from "@/components/local-websites/IntakeForm";
import {
	FAQ_ITEMS,
	HOW_IT_LANDS,
	LOCAL_SITES,
	SAMPLE_SITES,
	WHAT_YOU_GET
} from "@/lib/local-websites";

const icons = [
	<Camera key="camera" className="h-5 w-5" />,
	<Smartphone key="phone" className="h-5 w-5" />,
	<Search key="search" className="h-5 w-5" />,
	<Mail key="mail" className="h-5 w-5" />,
	<Globe key="globe" className="h-5 w-5" />,
	<FileCheck key="check" className="h-5 w-5" />
];

const SectionHeading: React.FC<{
	title: React.ReactNode;
	subtitle?: string;
}> = ({ title, subtitle }) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		whileInView={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5 }}
		viewport={{ once: true }}
		className="mb-10 text-center"
	>
		<h2 className="mb-3 font-heading text-3xl font-bold md:text-4xl">{title}</h2>
		{subtitle && (
			<p className="mx-auto max-w-2xl text-muted-foreground md:text-lg">
				{subtitle}
			</p>
		)}
	</motion.div>
);

/**
 * Full /local-websites page body. Same offer as the homepage section, in
 * more depth, with samples and FAQ.
 */
const LocalWebsitesShowcase: React.FC = () => {
	return (
		<div className="bg-background text-foreground">
			{/* Hero */}
			<BackgroundLines
				className="relative flex min-h-[60vh] w-full items-center justify-center overflow-hidden pt-14"
				svgOptions={{ duration: 12 }}
			>
				<div className="container relative z-20 mx-auto px-4 py-16 text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<Badge className="mb-6 border-primary/30 bg-primary/15 px-4 py-1.5 text-sm text-primary">
							{LOCAL_SITES.businessName}
						</Badge>
						<h1 className="mx-auto mb-5 max-w-3xl font-heading text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
							A real website for your{" "}
							<span className="bg-gradient-to-r from-primary via-cyan-300 to-green-300 bg-clip-text text-transparent">
								{LOCAL_SITES.city} business
							</span>
							, live in a day
						</h1>
						<p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
							I&apos;m Austin. I build websites for auto shops, dental offices,
							landscapers, law offices, and other local businesses here in{" "}
							{LOCAL_SITES.city}. I start from the listings and photos you
							already have, so you don&apos;t have to write a thing.
						</p>
						<CredibilityStrip className="mb-8" />
						<CallTextButtons className="justify-center" />
					</motion.div>
				</div>
			</BackgroundLines>

			{/* What you get */}
			<section className="px-4 py-16 md:py-20">
				<div className="container mx-auto max-w-6xl">
					<SectionHeading
						title={
							<>
								What you <span className="text-primary">get</span>
							</>
						}
						subtitle="Everything a customer expects when they look you up on their phone, without you having to learn any of it."
					/>
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
				</div>
			</section>

			{/* Price + how it lands */}
			<section className="px-4 py-12 md:py-16">
				<div className="container mx-auto max-w-6xl">
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						viewport={{ once: true }}
						className="relative"
					>
						<div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/15 via-cyan-500/10 to-green-500/15 blur-xl opacity-60" />
						<Card className="relative overflow-hidden border-primary/25 bg-gradient-to-br from-card via-card to-cyan-950/20">
							<div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-2">
								<div className="flex flex-col justify-center">
									<p className="mb-2 text-sm font-medium uppercase tracking-[0.14em] text-primary/80">
										One price, no surprises
									</p>
									<div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
										<span className="font-heading text-5xl font-bold md:text-6xl">
											{LOCAL_SITES.buildPrice}
										</span>
										<span className="text-muted-foreground">to build</span>
									</div>
									<p className="mb-4 text-base text-muted-foreground md:text-lg">
										Then{" "}
										<span className="font-semibold text-green-400">
											{LOCAL_SITES.hostingPrice}
										</span>{" "}
										for hosting.
									</p>
									<ul className="mb-6 space-y-2 text-sm text-muted-foreground md:text-base">
										{[
											"Your domain name",
											"Hosting and SSL (the padlock)",
											"Contact form that emails you",
											"No contract, cancel any time"
										].map((line) => (
											<li key={line} className="flex items-start gap-2">
												<FileCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
												{line}
											</li>
										))}
									</ul>
									<CallTextButtons />
								</div>

								<div className="flex flex-col justify-center">
									<h3 className="mb-4 font-heading text-2xl font-bold">
										How fast it lands
									</h3>
									<ol className="space-y-4">
										{HOW_IT_LANDS.map((step, index) => (
											<li key={step.title} className="flex gap-3">
												<span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
													{index + 1}
												</span>
												<div>
													<div className="font-semibold">{step.title}</div>
													<div className="text-sm leading-relaxed text-muted-foreground">
														{step.description}
													</div>
												</div>
											</li>
										))}
									</ol>
								</div>
							</div>
						</Card>
					</motion.div>
				</div>
			</section>

			{/* Samples */}
			<section className="px-4 py-12 md:py-16">
				<div className="container mx-auto max-w-6xl">
					<SectionHeading
						title={
							<>
								See a <span className="text-primary">sample</span>
							</>
						}
						subtitle="Every demo I send out starts from the same base. Open these on your phone to see how yours would feel."
					/>
					<div className="grid gap-4 md:grid-cols-3">
						{SAMPLE_SITES.map((site, index) => (
							<motion.a
								key={site.url}
								href={site.url}
								target="_blank"
								rel="noopener noreferrer"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.4, delay: index * 0.08 }}
								viewport={{ once: true }}
								className="group block"
							>
								<Card className="h-full border-border/50 bg-card/40 p-5 transition-all group-hover:-translate-y-0.5 group-hover:border-primary/50">
									<div className="mb-2 flex items-center justify-between gap-2">
										<div className="font-semibold">{site.name}</div>
										<ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
									</div>
									<div className="mb-2 break-all text-sm text-primary">
										{site.label}
									</div>
									<div className="text-sm text-muted-foreground">{site.note}</div>
								</Card>
							</motion.a>
						))}
					</div>
				</div>
			</section>

			{/* FAQ */}
			<section className="px-4 py-12 md:py-16">
				<div className="container mx-auto max-w-3xl">
					<SectionHeading
						title={
							<>
								Common <span className="text-primary">questions</span>
							</>
						}
					/>
					<div className="space-y-4">
						{FAQ_ITEMS.map((item, index) => (
							<motion.div
								key={item.title}
								initial={{ opacity: 0, y: 16 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.4, delay: index * 0.06 }}
								viewport={{ once: true }}
							>
								<Card className="border-border/50 bg-card/40 p-5">
									<h3 className="mb-2 font-heading text-lg font-bold">
										{item.title}
									</h3>
									<p className="text-sm leading-relaxed text-muted-foreground md:text-base">
										{item.description}
									</p>
								</Card>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Final CTA + intake */}
			<section id="get-started" className="px-4 py-16 md:py-20">
				<div className="container mx-auto max-w-6xl">
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						viewport={{ once: true }}
					>
						<Card className="overflow-hidden border-primary/25 bg-gradient-to-br from-card via-card to-cyan-950/20">
							<div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-2">
								<div className="flex flex-col justify-center">
									<h2 className="mb-3 font-heading text-3xl font-bold md:text-4xl">
										Ready when you are
									</h2>
									<p className="mb-6 text-muted-foreground md:text-lg">
										Call or text me and I&apos;ll get started on your site
										today. If you&apos;d rather type, the form works too and
										I&apos;ll text you back.
									</p>
									<CallTextButtons />
									<p className="mt-5 text-sm text-muted-foreground">
										Or email{" "}
										<a
											href={`mailto:${LOCAL_SITES.email}`}
											className="text-primary hover:underline"
										>
											{LOCAL_SITES.email}
										</a>
									</p>
								</div>
								<div className="rounded-xl border border-border/50 bg-background/60 p-5 sm:p-6">
									<h3 className="mb-1 font-heading text-xl font-bold">
										Send me the basics
									</h3>
									<p className="mb-4 text-sm text-muted-foreground">
										Three quick fields. I&apos;ll text you back.
									</p>
									<IntakeForm idPrefix="page-intake" />
								</div>
							</div>
						</Card>
					</motion.div>
				</div>
			</section>
		</div>
	);
};

export default LocalWebsitesShowcase;
