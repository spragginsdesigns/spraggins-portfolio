import { Metadata } from "next";
import Hero from "@/components/Hero";
import InteractiveTerminal from "@/components/InteractiveTerminal";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Expertise from "@/components/Expertise";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import GitHubShowcase from "@/components/GitHubShowcase";

export const metadata: Metadata = {
	title: "Austin Spraggins - Full Stack Developer Portfolio",
	description:
		"Explore the portfolio of Austin Spraggins, a Full Stack Developer specializing in React, Next.js, and modern web technologies. Based in Fresno, CA.",
	openGraph: {
		title: "Austin Spraggins - Full Stack Developer Portfolio",
		description:
			"Explore the portfolio of Austin Spraggins, a Full Stack Developer specializing in React, Next.js, and modern web technologies. Based in Fresno, CA.",
		url: "https://www.spragginsdesigns.xyz/",
		siteName: "Austin Spraggins Portfolio",
		images: [
			{
				url: "https://opengraph.b-cdn.net/production/images/57d437b6-00af-4dc3-a9eb-7e29e51c5f04.png?token=9VdePgxCJ40PR3vQtoZBslC8r3smw8O8YOX0UfWivzg&height=372&width=1200&expires=33258886154",
				width: 1200,
				height: 630
			}
		],
		locale: "en_US",
		type: "website"
	},
	twitter: {
		card: "summary_large_image",
		title: "Austin Spraggins - Full Stack Developer Portfolio",
		description:
			"Explore the portfolio of Austin Spraggins, a Full Stack Developer specializing in React, Next.js, and modern web technologies. Based in Fresno, CA.",
		images: [
			"https://opengraph.b-cdn.net/production/images/57d437b6-00af-4dc3-a9eb-7e29e51c5f04.png?token=9VdePgxCJ40PR3vQtoZBslC8r3smw8O8YOX0UfWivzg&height=372&width=1200&expires=33258886154"
		]
	}
};

export default function Home() {
	return (
		<main className="bg-background min-h-screen relative">
			<div className="relative z-10">
				<Hero />
				<InteractiveTerminal />
				<About />
				<Projects />
				<Expertise />
				<GitHubShowcase />
				<Contact />
				<Footer />
			</div>
		</main>
	);
}
