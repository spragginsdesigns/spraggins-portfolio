import { getPostBySlug, getAllPosts, formatDate } from "@/lib/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, Tag, Twitter, Linkedin, Github } from "lucide-react";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import ReadingProgress from "@/components/ReadingProgress";

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
		<main className="min-h-screen bg-background relative overflow-hidden">
			{/* Reading Progress Bar */}
			<ReadingProgress />

			{/* Subtle background gradient orbs */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
				<div className="absolute top-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-3xl" />
			</div>

			{/* Header */}
			<header className="border-b border-border/20 bg-background/80 backdrop-blur-md sticky top-0 z-10">
				<div className="max-w-3xl mx-auto px-6 sm:px-8 py-4">
					<Link
						href="/blog"
						className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
					>
						<ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
						Back to Blog
					</Link>
				</div>
			</header>

			{/* Hero */}
			<div className="relative">
				<div className="max-w-3xl mx-auto px-6 sm:px-8 pt-12 sm:pt-20 pb-10 sm:pb-14">
					{/* Meta row */}
					<div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground mb-6">
						<span className="inline-flex items-center gap-2">
							<Calendar className="w-4 h-4 text-primary/70" />
							{formatDate(post.date)}
						</span>
						<span className="inline-flex items-center gap-2">
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
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-[1.15] mb-6">
						{post.title}
					</h1>

					{/* Description */}
					<p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
						{post.description}
					</p>

					{/* Author & Tags row */}
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-6 border-t border-border/30">
						{/* Author */}
						<Link href="/" className="flex items-center gap-3 group">
							<div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-border/30 group-hover:ring-primary/50 transition-all">
								<Image
									src="/images/profile_pic_main2_lessthan1MB.png"
									alt="Austin Spraggins"
									fill
									className="object-cover"
								/>
							</div>
							<div>
								<p className="font-medium text-foreground group-hover:text-primary transition-colors">
									Austin Spraggins
								</p>
								<p className="text-sm text-muted-foreground">
									CTO at LineCrush
								</p>
							</div>
						</Link>

						{/* Tags */}
						<div className="flex flex-wrap gap-2">
							{post.tags.map((tag) => (
								<span
									key={tag}
									className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-background/80 border border-border/40 text-muted-foreground"
								>
									<Tag className="w-3 h-3" />
									{tag}
								</span>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Divider */}
			<div className="max-w-3xl mx-auto px-6 sm:px-8">
				<div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
			</div>

			{/* Content */}
			<article className="relative max-w-3xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
				<div className="prose prose-base md:prose-lg prose-invert max-w-none prose-headings:font-bold prose-headings:text-foreground prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-5 prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-strong:font-semibold prose-ul:text-muted-foreground prose-li:marker:text-primary prose-code:text-primary prose-code:bg-card prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.85em] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:text-sm prose-hr:border-border/50 prose-blockquote:border-primary prose-blockquote:bg-card/30 prose-blockquote:py-1 prose-blockquote:text-muted-foreground prose-blockquote:italic prose-blockquote:rounded-r-lg [&_pre]:max-w-[calc(100vw-3rem)] sm:[&_pre]:max-w-full">
					{/* @ts-expect-error - MDXRemote types are complex */}
					<MDXRemote source={post.content} options={{ mdxOptions }} />
				</div>
			</article>

			{/* Divider */}
			<div className="max-w-3xl mx-auto px-6 sm:px-8">
				<div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
			</div>

			{/* Footer */}
			<footer className="relative">
				<div className="max-w-3xl mx-auto px-6 sm:px-8 py-14 sm:py-20">
					{/* Share section */}
					<div className="text-center mb-12">
						<p className="text-sm text-muted-foreground mb-4">
							Enjoyed this post? Share it with others.
						</p>
						<div className="flex items-center justify-center gap-3">
							<a
								href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://www.spragginsdesigns.xyz/blog/${slug}`)}`}
								target="_blank"
								rel="noopener noreferrer"
								className="p-3 rounded-full bg-card/50 border border-border/30 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
								aria-label="Share on Twitter"
							>
								<Twitter className="w-5 h-5" />
							</a>
							<a
								href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://www.spragginsdesigns.xyz/blog/${slug}`)}`}
								target="_blank"
								rel="noopener noreferrer"
								className="p-3 rounded-full bg-card/50 border border-border/30 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
								aria-label="Share on LinkedIn"
							>
								<Linkedin className="w-5 h-5" />
							</a>
						</div>
					</div>

					{/* Author card */}
					<div className="p-6 sm:p-8 rounded-2xl bg-card/30 border border-border/30 backdrop-blur-sm">
						<div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
							<Link href="/" className="relative shrink-0">
								<div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-primary/20">
									<Image
										src="/images/profile_pic_main2_lessthan1MB.png"
										alt="Austin Spraggins"
										width={80}
										height={80}
										className="object-cover"
									/>
								</div>
							</Link>
							<div className="flex-1">
								<Link href="/" className="inline-block">
									<h3 className="text-lg font-semibold text-foreground hover:text-primary transition-colors mb-1">
										Austin Spraggins
									</h3>
								</Link>
								<p className="text-sm text-muted-foreground mb-4">
									Co-Founder & CTO at LineCrush. Building AI-powered sports analytics at scale.
									Open to contracts & consulting.
								</p>
								<div className="flex items-center justify-center sm:justify-start gap-3">
									<a
										href="https://github.com/spragginsdesigns"
										target="_blank"
										rel="noopener noreferrer"
										className="text-muted-foreground hover:text-primary transition-colors"
										aria-label="GitHub"
									>
										<Github className="w-5 h-5" />
									</a>
									<a
										href="https://twitter.com/spragginsdesign"
										target="_blank"
										rel="noopener noreferrer"
										className="text-muted-foreground hover:text-primary transition-colors"
										aria-label="Twitter"
									>
										<Twitter className="w-5 h-5" />
									</a>
									<a
										href="https://www.linkedin.com/in/spragginsdesigns/"
										target="_blank"
										rel="noopener noreferrer"
										className="text-muted-foreground hover:text-primary transition-colors"
										aria-label="LinkedIn"
									>
										<Linkedin className="w-5 h-5" />
									</a>
								</div>
							</div>
						</div>
					</div>

					{/* Back to blog */}
					<div className="mt-10 text-center">
						<Link
							href="/blog"
							className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-card/50 border border-border/30 text-foreground hover:border-primary/50 hover:text-primary transition-all group"
						>
							<ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
							Back to all posts
						</Link>
					</div>
				</div>
			</footer>
		</main>
	);
}
