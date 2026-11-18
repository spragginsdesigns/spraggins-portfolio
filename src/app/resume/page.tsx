import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { RESUME_URL } from "@/lib/resume";

const pageUrl = "https://www.spragginsdesigns.xyz/resume";
const title = "Austin Spraggins Résumé | Senior Product Engineer";
const description =
	"Download Austin Spraggins's engineering résumé. Co-founder and CTO at LineCrush with full-stack, native mobile, applied AI, and developer tooling experience.";

export const metadata: Metadata = {
	title,
	description,
	alternates: { canonical: pageUrl },
	openGraph: {
		title,
		description,
		url: pageUrl,
		type: "profile",
		images: [{ url: "/images/work/austin-social.jpg", width: 1200, height: 630, alt: title }]
	},
	twitter: {
		card: "summary_large_image",
		title,
		description,
		images: ["/images/work/austin-social.jpg"]
	}
};

const capabilities = [
	{
		title: "Product engineering",
		copy: "Next.js, React, TypeScript, Python, PostgreSQL, Redis, APIs, and production operations."
	},
	{
		title: "Applied AI",
		copy: "An autonomous Claude Code and Codex fleet, MCP servers, multi-provider features, retrieval, vision/OCR, model routing, and review gates."
	},
	{
		title: "Cross-platform delivery",
		copy: "Web products, native SwiftUI and Kotlin apps in both stores, a ChatGPT plugin, and a commercial Godot game on Steam."
	}
];

export default function ResumePage() {
	return (
		<>
			<Header />
			<main className="min-h-screen bg-[#0a1015] text-foreground">
			<section className="mx-auto max-w-6xl px-4 pb-20 pt-24 md:px-8 md:pt-32">
				<Link
					href="/"
					className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
				>
					<ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to portfolio
				</Link>

				<div className="mt-5 rounded-2xl border border-[#3b5156] bg-[#111e25] p-5 md:p-10">
					<h1 className="font-heading text-4xl font-bold tracking-tight md:text-6xl">Austin Spraggins</h1>
					<p className="mt-3 max-w-3xl text-xl font-semibold text-[#72f3df] md:text-2xl">
						Senior Product Engineer
					</p>
					<p className="mt-2 max-w-3xl text-sm text-[#c0cccf] md:text-base">
						Full-Stack · Native Mobile · Applied AI · Co-Founder &amp; CTO at LineCrush
					</p>
					<div className="mt-5 flex flex-wrap gap-3">
						<a
							href={RESUME_URL}
							download
							className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#72f3df] px-4 py-3 font-bold text-[#0a1515] transition-opacity hover:opacity-90"
						>
							<Download className="h-5 w-5" aria-hidden="true" /> Download résumé PDF
						</a>
						<a
							href="mailto:spragginsdesigns@gmail.com"
							className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#52696d] px-4 py-3 font-semibold transition-colors hover:border-primary/60 hover:text-primary"
						>
							<Mail className="h-5 w-5" aria-hidden="true" /> Get in touch
						</a>
					</div>
					<p className="mt-5 text-sm text-[#c0cccf]">Fresno, California · Pacific Time</p>
				</div>

				<div className="mt-8 grid gap-4 md:grid-cols-3">
					{capabilities.map((capability) => (
						<div key={capability.title} className="rounded-2xl border border-border/50 bg-card/40 p-6">
							<h2 className="font-heading text-lg font-semibold">{capability.title}</h2>
							<p className="mt-2 text-sm leading-relaxed text-muted-foreground">{capability.copy}</p>
						</div>
					))}
				</div>

				<nav aria-label="Selected work" className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-[#72f3df]">
					<Link className="underline underline-offset-4" href="/work/linecrush">LineCrush case study</Link>
					<Link className="underline underline-offset-4" href="/work/sureword">SureWord case study</Link>
				</nav>

				<div className="mt-12 overflow-hidden rounded-2xl border border-border/60 bg-white">
					<object
						data={RESUME_URL}
						type="application/pdf"
						aria-label="Austin Spraggins engineering resume PDF preview"
						className="h-[70vh] min-h-[520px] w-full md:h-[900px]"
					>
						<p className="p-6 text-slate-900">
							<a href={RESUME_URL} className="underline">Open the résumé PDF</a>
						</p>
					</object>
				</div>
			</section>
			</main>
			<Footer />
		</>
	);
}
