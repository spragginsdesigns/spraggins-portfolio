import Hero from "@/components/Hero";
import InteractiveTerminal from "@/components/InteractiveTerminal";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Expertise from "@/components/Expertise";
import BlogPreview from "@/components/BlogPreview";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import GitHubShowcase from "@/components/GitHubShowcase";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { getAllPosts } from "@/lib/blog";

// Metadata is defined in layout.tsx to avoid duplication

export default function Home() {
	const posts = getAllPosts();

	return (
		<main className="bg-background min-h-screen relative">
			<div className="relative z-10">
				<Hero />
				<InteractiveTerminal />
				<About />
				<Projects />
				<Expertise />
				<BlogPreview posts={posts} />
				<ErrorBoundary>
					<GitHubShowcase />
				</ErrorBoundary>
				<Contact />
				<Footer />
			</div>
		</main>
	);
}
