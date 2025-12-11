import { getPostBySlug, getAllPosts, formatDate } from "@/lib/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";

interface Props {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	const posts = getAllPosts();
	return posts.map((post) => ({
		slug: post.slug
	}));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const post = getPostBySlug(slug);

	if (!post) {
		return {
			title: "Post Not Found"
		};
	}

	return {
		title: `${post.title} | Austin Spraggins`,
		description: post.description,
		openGraph: {
			title: post.title,
			description: post.description,
			type: "article",
			publishedTime: post.date
		}
	};
}

const mdxOptions = {
	rehypePlugins: [
		[
			rehypePrettyCode,
			{
				theme: "github-dark",
				keepBackground: true
			}
		]
	]
};

export default async function BlogPostPage({ params }: Props) {
	const { slug } = await params;
	const post = getPostBySlug(slug);

	if (!post) {
		notFound();
	}

	return (
		<main className="min-h-screen bg-background">
			{/* Header */}
			<header className="border-b border-border/30 bg-card/20 backdrop-blur-sm sticky top-0 z-10">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
					<Link
						href="/blog"
						className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Blog
					</Link>
				</div>
			</header>

			{/* Hero */}
			<div className="bg-gradient-to-b from-card/50 to-transparent">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
					{/* Meta */}
					<div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
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

					<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4 sm:mb-6">
						{post.title}
					</h1>

					<p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed mb-6 sm:mb-8 max-w-4xl">
						{post.description}
					</p>

					{/* Tags */}
					<div className="flex flex-wrap gap-2">
						{post.tags.map((tag) => (
							<span
								key={tag}
								className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-card border border-border/50 text-muted-foreground hover:border-primary/50 transition-colors"
							>
								<Tag className="w-3.5 h-3.5" />
								{tag}
							</span>
						))}
					</div>
				</div>
			</div>

			{/* Content */}
			<article className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
				<div className="prose prose-sm sm:prose-base md:prose-lg prose-invert max-w-none prose-headings:font-bold prose-headings:text-foreground prose-h2:text-xl sm:prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg sm:prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-6 prose-h3:mb-3 prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-strong:font-semibold prose-ul:text-muted-foreground prose-li:marker:text-primary prose-code:text-primary prose-code:bg-card prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.8em] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-border/50 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:text-xs sm:prose-pre:text-sm prose-hr:border-border/50 prose-blockquote:border-primary prose-blockquote:text-muted-foreground prose-blockquote:italic [&_pre]:max-w-[calc(100vw-2rem)] sm:[&_pre]:max-w-full">
					{/* @ts-expect-error - MDXRemote types are complex */}
					<MDXRemote source={post.content} options={{ mdxOptions }} />
				</div>
			</article>

			{/* Footer */}
			<footer className="border-t border-border/30 bg-card/20">
				<div className="max-w-5xl mx-auto px-6 py-16">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
						<div>
							<p className="text-foreground font-medium mb-2">
								Thanks for reading
							</p>
							<p className="text-muted-foreground">
								More engineering lessons coming as I ship.
							</p>
						</div>
						<Link
							href="/blog"
							className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border/50 text-foreground hover:border-primary/50 transition-colors"
						>
							<ArrowLeft className="w-4 h-4" />
							All posts
						</Link>
					</div>
				</div>
			</footer>
		</main>
	);
}
