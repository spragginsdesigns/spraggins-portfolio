import { getAllPosts, formatDate } from "@/lib/blog";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
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
			<div className="border-b border-border/50">
				<div className="container mx-auto px-4 py-8">
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Portfolio
					</Link>
					<h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-400">
						Dev Blog
					</h1>
					<p className="text-muted-foreground mt-4 max-w-2xl">
						Building AI-powered sports analytics at LineCrush. Notes on
						full-stack development, AI integration, and startup life.
					</p>
				</div>
			</div>

			{/* Posts */}
			<div className="container mx-auto px-4 py-12">
				{posts.length === 0 ? (
					<p className="text-muted-foreground text-center py-12">
						No posts yet. Check back soon.
					</p>
				) : (
					<div className="space-y-8">
						{posts.map((post) => (
							<article
								key={post.slug}
								className="group border border-border/50 rounded-lg p-6 hover:border-primary/50 transition-all duration-300 bg-card/30 backdrop-blur-sm"
							>
								<Link href={`/blog/${post.slug}`}>
									<div className="flex flex-col gap-4">
										{/* Meta */}
										<div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
											<span className="inline-flex items-center gap-1.5">
												<Calendar className="w-4 h-4" />
												{formatDate(post.date)}
											</span>
											<span className="inline-flex items-center gap-1.5">
												<Clock className="w-4 h-4" />
												{post.readTime}
											</span>
											{post.featured && (
												<span className="text-primary font-medium">
													Featured
												</span>
											)}
										</div>

										{/* Title & Description */}
										<h2 className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
											{post.title}
										</h2>
										<p className="text-muted-foreground line-clamp-2">
											{post.description}
										</p>

										{/* Tags */}
										<div className="flex flex-wrap gap-2">
											{post.tags.map((tag) => (
												<span
													key={tag}
													className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
												>
													<Tag className="w-3 h-3" />
													{tag}
												</span>
											))}
										</div>
									</div>
								</Link>
							</article>
						))}
					</div>
				)}
			</div>
		</main>
	);
}
