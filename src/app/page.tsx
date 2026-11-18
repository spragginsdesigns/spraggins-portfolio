import Header from "@/components/Header";
import Hero from "@/components/Hero";
import InteractiveTerminal from "@/components/InteractiveTerminal";
import About from "@/components/About";
import SelectedWork from "@/components/SelectedWork";
import Expertise from "@/components/Expertise";
import BlogPreview from "@/components/BlogPreview";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FaithHashRedirect from "@/components/FaithHashRedirect";
import GitHubShowcase from "@/components/GitHubShowcase";
import WorkLedger from "@/components/WorkLedger";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { getAllPosts } from "@/lib/blog";

// Metadata is defined in layout.tsx to avoid duplication

export default function Home() {
	const posts = getAllPosts();

	return (
		<>
			<a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-[#72f3df] focus:px-4 focus:py-3 focus:font-semibold focus:text-[#0a1015]">
				Skip to content
			</a>
			<FaithHashRedirect />
			<Header />
			<main id="main-content" tabIndex={-1} className="bg-background min-h-screen">
				<Hero />
				<SelectedWork />
				<About />
				<InteractiveTerminal />
				<BlogPreview posts={posts} />
				<Expertise />
				<WorkLedger />
				<ErrorBoundary>
					<GitHubShowcase />
				</ErrorBoundary>
				<Contact />
			</main>
			<Footer />
		</>
	);
}
