import Hero from "@/components/Hero";
import InteractiveTerminal from "@/components/InteractiveTerminal";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Expertise from "@/components/Expertise";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import GitHubShowcase from "@/components/GitHubShowcase";

// Metadata is defined in layout.tsx to avoid duplication

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
