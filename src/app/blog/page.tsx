import { getAllPosts, formatDate } from "@/lib/blog";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag, ArrowRight, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Dev Blog | Austin Spraggins",
	description:
		"Thoughts on building AI-powered sports analytics, full-stack development, and startup life at LineCrush.",
	openGraph: {
		title: "Dev Blog | Austin Spraggins",
		description:
			"Thoughts on building AI-powered sports analytics, full-stack development, and startup life at LineCrush."
	}
};

export default function BlogPage() {
	const posts = getAllPosts();

	return (
		<main className="min-h-screen bg-background relative overflow-hidden">
			{/* Subtle background gradient orbs */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
				<div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-3xl" />
			</div>

			{/* Header */}
			<header className="border-b border-border/20 bg-background/80 backdrop-blur-md sticky top-0 z-10">
				<div className="max-w-4xl mx-auto px-6 sm:px-8 py-4">
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
					>
						<ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
						Back to Portfolio
					</Link>
				</div>
			</header>

			{/* Hero */}
			<div className="relative">
				<div className="max-w-4xl mx-auto px-6 sm:px-8 pt-16 sm:pt-24 pb-12 sm:pb-16">
					<div className="flex items-center gap-3 mb-6">
						<div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
							<BookOpen className="w-5 h-5 text-primary" />
						</div>
						<span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
							Engineering Notes
						</span>
					</div>
					<h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-cyan-400 to-primary">
							Dev Blog
						</span>
					</h1>
					<p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
						Thoughts on full-stack development, AI integration, and building at scale.
					</p>
				</div>
			</div>

			{/* Divider */}
			<div className="max-w-4xl mx-auto px-6 sm:px-8">
				<div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
			</div>

			{/* Posts */}
			<div className="relative max-w-4xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
				{posts.length === 0 ? (
					<div className="text-center py-20">
						<div className="w-16 h-16 mx-auto mb-6 rounded-full bg-card/50 border border-border/30 flex items-center justify-center">
							<BookOpen className="w-8 h-8 text-muted-foreground/50" />
						</div>
						<p className="text-muted-foreground text-lg">
							No posts yet. Check back soon.
						</p>
					</div>
				) : (
					<div className="space-y-10">
						{posts.map((post) => (
							<Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
								<article className="relative p-8 sm:p-10 rounded-2xl border border-border/30 bg-card/20 backdrop-blur-sm hover:border-primary/40 hover:bg-card/40 transition-all duration-500 hover:shadow-lg hover:shadow-primary/5">
									{/* Featured indicator - subtle top border glow */}
									{post.featured && (
										<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
									)}

									{/* Meta row */}
									<div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6">
										<span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
											<Calendar className="w-4 h-4 text-primary/70" />
											{formatDate(post.date)}
										</span>
										<span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
											<Clock className="w-4 h-4 text-primary/70" />
											{post.readTime}
										</span>
										{post.featured && (
											<span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
												Featured
											</span>
										)}
									</div>

									{/* Title */}
									<h2 className="text-2xl sm:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-4">
										{post.title}
									</h2>

									{/* Description */}
									<p className="text-muted-foreground leading-relaxed text-base sm:text-lg mb-8">
										{post.description}
									</p>

									{/* Tags & Read indicator row */}
									<div className="flex flex-wrap items-center justify-between gap-4">
										<div className="flex flex-wrap gap-2">
											{post.tags.map((tag) => (
												<span
													key={tag}
													className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-background/80 border border-border/40 text-muted-foreground hover:border-primary/30 transition-colors"
												>
													<Tag className="w-3 h-3" />
													{tag}
												</span>
											))}
										</div>

										{/* Read more */}
										<div className="flex items-center gap-2 text-primary font-medium text-sm opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:gap-3">
											<span>Read article</span>
											<ArrowRight className="w-4 h-4" />
										</div>
									</div>
								</article>
							</Link>
						))}
					</div>
				)}
			</div>

			{/* Footer */}
			<footer className="relative border-t border-border/20">
				<div className="max-w-4xl mx-auto px-6 sm:px-8 py-12 sm:py-16 text-center">
					<p className="text-muted-foreground">
						More posts coming as I ship. Stay tuned.
					</p>
				</div>
			</footer>
		</main>
	);
}
