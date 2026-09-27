import type { Metadata } from "next";
import { ArrowLeft, Download, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { RESUME_URL } from "@/lib/resume";

const pageUrl = "https://www.spragginsdesigns.xyz/resume";
const title = "Austin Spraggins | CTO, Software Architect & Applied AI Engineer";
const description =
	"Resume and selected work of Austin Spraggins, a hands-on CTO and software architect building full-stack products, applied AI systems, mobile clients, and developer tooling.";

export const metadata: Metadata = {
	title,
	description,
	alternates: { canonical: pageUrl },
	openGraph: {
		title,
		description,
		url: pageUrl,
		type: "profile",
		images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }]
	},
	twitter: {
		card: "summary_large_image",
		title,
		description,
		images: ["/og-image.png"]
	}
};

const capabilities = [
	{
		title: "Product engineering",
		copy: "Next.js, React, TypeScript, Python, PostgreSQL, Redis, APIs, and production operations."
	},
	{
		title: "Applied AI",
		copy: "Multi-provider features, retrieval, vision/OCR, model routing, agent workflows, and failure handling."
	},
	{
		title: "Cross-platform delivery",
		copy: "Web products, SwiftUI and Android client work, browser extensions, and a commercial Godot game."
	}
];

export default function ResumePage() {
	return (
		<main className="min-h-screen bg-background text-foreground">
			<Header />
			<section className="mx-auto max-w-6xl px-5 pb-20 pt-28 md:px-8 md:pt-36">
				<a
					href="/"
					className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
				>
					<ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to portfolio
				</a>

				<div className="mt-10 rounded-3xl border border-border/60 bg-card/70 p-7 shadow-xl shadow-black/10 md:p-12">
					<p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Engineering resume</p>
					<h1 className="mt-4 font-poppins text-4xl font-bold tracking-tight md:text-6xl">Austin Spraggins</h1>
					<p className="mt-4 max-w-3xl text-xl font-medium text-foreground/90 md:text-2xl">
						Co-Founder &amp; CTO at LineCrush. Software architect and applied AI engineer.
					</p>
					<p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
						I build products from interface and data model through AI behavior, infrastructure, and release. My work spans the live LineCrush platform, an independent AI study product across web and mobile, client automation, and a commercial Steam game.
					</p>
					<div className="mt-8 flex flex-wrap gap-3">
						<a
							href={RESUME_URL}
							download
							className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
						>
							<Download className="h-5 w-5" aria-hidden="true" /> Download resume PDF
						</a>
						<a
							href="mailto:spragginsdesigns@gmail.com"
							className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 font-semibold transition-colors hover:border-primary/60 hover:text-primary"
						>
							<Mail className="h-5 w-5" aria-hidden="true" /> Get in touch
						</a>
					</div>
					<p className="mt-5 text-sm text-muted-foreground">Fresno, California · Remote US · Available immediately for contract or full-time engineering work</p>
				</div>

				<div className="mt-8 grid gap-4 md:grid-cols-3">
					{capabilities.map((capability) => (
						<div key={capability.title} className="rounded-2xl border border-border/50 bg-card/40 p-6">
							<h2 className="font-poppins text-lg font-semibold">{capability.title}</h2>
							<p className="mt-2 text-sm leading-relaxed text-muted-foreground">{capability.copy}</p>
						</div>
					))}
				</div>

				<div className="mt-12 overflow-hidden rounded-2xl border border-border/60 bg-white">
					<object
						data={RESUME_URL}
						type="application/pdf"
						aria-label="Austin Spraggins engineering resume PDF preview"
						className="h-[70vh] min-h-[520px] w-full md:h-[900px]"
					>
						<p className="p-6 text-slate-900">
							Your browser cannot preview the PDF. <a href={RESUME_URL} className="underline">Download the resume</a> instead.
						</p>
					</object>
				</div>
			</section>
			<Footer />
		</main>
	);
}
