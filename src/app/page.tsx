import Header from "@/components/Header";
import Hero from "@/components/Hero";
import InteractiveTerminal from "@/components/InteractiveTerminal";
import About from "@/components/About";
import SelectedWork from "@/components/SelectedWork";
import Expertise from "@/components/Expertise";
import BlogPreview from "@/components/BlogPreview";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import GitHubShowcase from "@/components/GitHubShowcase";
import WorkLedger from "@/components/WorkLedger";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { getAllPosts } from "@/lib/blog";

// Metadata is defined in layout.tsx to avoid duplication

export default function Home() {
	const posts = getAllPosts();

	return (
		<>
			<Header />
			<main id="main-content" className="bg-background min-h-screen">
				<Hero />
				<SelectedWork />
				<About />
				<Expertise />
				<WorkLedger />
				<BlogPreview posts={posts} />
				<InteractiveTerminal />
				<ErrorBoundary>
					<GitHubShowcase />
				</ErrorBoundary>
				<Contact />
			</main>
			<Footer />
		</>
	);
}
