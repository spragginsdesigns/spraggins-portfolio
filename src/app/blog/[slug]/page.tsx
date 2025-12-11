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
			<div className="border-b border-border/50">
				<div className="container mx-auto px-4 py-8">
					<Link
						href="/blog"
						className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to Blog
					</Link>

					{/* Meta */}
					<div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
						<span className="inline-flex items-center gap-1.5">
							<Calendar className="w-4 h-4" />
							{formatDate(post.date)}
						</span>
						<span className="inline-flex items-center gap-1.5">
							<Clock className="w-4 h-4" />
							{post.readTime}
						</span>
						{post.featured && (
							<span className="text-primary font-medium">Featured</span>
						)}
					</div>

					<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
						{post.title}
					</h1>
					<p className="text-muted-foreground mt-4 text-lg max-w-3xl">
						{post.description}
					</p>

					{/* Tags */}
					<div className="flex flex-wrap gap-2 mt-6">
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
			</div>

			{/* Content */}
			<article className="container mx-auto px-4 py-12">
				<div className="prose prose-invert prose-lg max-w-3xl mx-auto prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground prose-code:text-primary prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-border/50">
					{/* @ts-expect-error - MDXRemote types are complex */}
					<MDXRemote source={post.content} options={{ mdxOptions }} />
				</div>
			</article>

			{/* Footer CTA */}
			<div className="border-t border-border/50">
				<div className="container mx-auto px-4 py-12 text-center">
					<p className="text-muted-foreground mb-4">
						Building in public at LineCrush. More posts coming soon.
					</p>
					<Link
						href="/blog"
						className="inline-flex items-center gap-2 text-primary hover:underline"
					>
						<ArrowLeft className="w-4 h-4" />
						View all posts
					</Link>
				</div>
			</div>
		</main>
	);
}
