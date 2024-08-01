import ClientWrapper from "./ClientWrapper";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import GitHubShowcase from "@/components/GitHubShowcase";

export default function Home() {
	return (
		<main className="bg-background min-h-screen relative">
			<ClientWrapper>
				<div className="relative z-10">
					<Hero />
					<About />
					<Projects />
					<Skills />
					<GitHubShowcase />
					<Contact />
					<Footer />
				</div>
			</ClientWrapper>
		</main>
	);
}
