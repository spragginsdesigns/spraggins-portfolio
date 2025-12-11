import { getAllPosts, formatDate } from "@/lib/blog";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag, ArrowRight } from "lucide-react";
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
		<main className="min-h-screen bg-background">
			{/* Header */}
			<header className="border-b border-border/30 bg-card/20 backdrop-blur-sm sticky top-0 z-10">
				<div className="max-w-5xl mx-auto px-6 py-4">
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Portfolio
					</Link>
				</div>
			</header>

			{/* Hero */}
			<div className="bg-gradient-to-b from-card/50 to-transparent">
				<div className="max-w-5xl mx-auto px-6 py-16">
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-400">
							Dev Blog
						</span>
					</h1>
					<p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
						Building AI-powered sports analytics at LineCrush. Notes on
						full-stack development, AI integration, and startup life.
					</p>
				</div>
			</div>

			{/* Posts */}
			<div className="max-w-5xl mx-auto px-6 py-12">
				{posts.length === 0 ? (
					<div className="text-center py-16">
						<p className="text-muted-foreground text-lg">
							No posts yet. Check back soon.
						</p>
					</div>
				) : (
					<div className="space-y-6">
						{posts.map((post, index) => (
							<Link key={post.slug} href={`/blog/${post.slug}`}>
								<article
									className={`group p-8 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/50 hover:bg-card/50 transition-all duration-300 ${
										post.featured ? "ring-1 ring-primary/20" : ""
									}`}
								>
									<div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
										<div className="flex-1">
											{/* Meta */}
											<div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
												<span className="inline-flex items-center gap-1.5">
													<Calendar className="w-4 h-4 text-primary" />
													{formatDate(post.date)}
												</span>
												<span className="inline-flex items-center gap-1.5">
													<Clock className="w-4 h-4 text-primary" />
													{post.readTime}
												</span>
												{post.featured && (
													<span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/20 text-primary border border-primary/30">
														Featured
													</span>
												)}
											</div>

											{/* Title & Description */}
											<h2 className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors mb-3">
												{post.title}
											</h2>
											<p className="text-muted-foreground leading-relaxed mb-6 max-w-3xl">
												{post.description}
											</p>

											{/* Tags */}
											<div className="flex flex-wrap gap-2">
												{post.tags.map((tag) => (
													<span
														key={tag}
														className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-background border border-border/50 text-muted-foreground"
													>
														<Tag className="w-3 h-3" />
														{tag}
													</span>
												))}
											</div>
										</div>

										{/* Read more indicator */}
										<div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity lg:pt-4">
											<span className="text-sm font-medium">Read</span>
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
			<footer className="border-t border-border/30 bg-card/20">
				<div className="max-w-5xl mx-auto px-6 py-12 text-center">
					<p className="text-muted-foreground">
						More posts coming as I ship. Stay tuned.
					</p>
				</div>
			</footer>
		</main>
	);
}
