import { Metadata } from "next";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
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
				url: "https://www.spragginsdesigns.xyz/og-image.png",
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
		images: ["https://www.spragginsdesigns.xyz/twitter-image.png"]
	}
};

export default function Home() {
	return (
		<main className="bg-background min-h-screen relative">
			<div className="relative z-10">
				<Hero />
				<About />
				<Projects />
				<Skills />
				<GitHubShowcase />
				<Contact />
				<Footer />
			</div>
		</main>
	);
}
