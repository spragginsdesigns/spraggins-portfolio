import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export interface LegalSection {
	id?: string;
	heading: string;
	body: ReactNode;
}

interface LegalPageProps {
	eyebrow: string;
	title: string;
	updated: string;
	intro: ReactNode;
	sections: LegalSection[];
}

export default function LegalPage({ eyebrow, title, updated, intro, sections }: LegalPageProps) {
	return (
		<main className="min-h-screen bg-background text-foreground">
			<Header />
			<section className="mx-auto max-w-3xl px-5 pb-20 pt-28 md:px-8 md:pt-36">
				<a
					href="/"
					className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
				>
					<ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to portfolio
				</a>

				<div className="mt-10 rounded-3xl border border-border/60 bg-card/70 p-7 shadow-xl shadow-black/10 md:p-12">
					<p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
					<h1 className="mt-4 font-poppins text-4xl font-bold tracking-tight md:text-5xl">{title}</h1>
					<p className="mt-3 text-sm text-muted-foreground">Last updated {updated}</p>
					<div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">{intro}</div>

					{sections.map((section) => (
						<section key={section.heading} id={section.id} className="mt-10 scroll-mt-28">
							<h2 className="font-poppins text-2xl font-semibold tracking-tight">{section.heading}</h2>
							<div className="mt-3 space-y-3 leading-relaxed text-muted-foreground">{section.body}</div>
						</section>
					))}
				</div>
			</section>
			<Footer />
		</main>
	);
}
