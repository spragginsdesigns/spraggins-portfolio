import { getPostBySlug, getAllPosts, formatDate } from "@/lib/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
	ArrowLeft,
	ArrowRight,
	Calendar,
	Clock,
	Tag,
	Briefcase
} from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode, ComponentPropsWithoutRef } from "react";
import { isValidElement } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import ReadingProgress from "@/components/ReadingProgress";
import TableOfContents, { type TocHeading } from "@/components/TableOfContents";
import CopyLinkButton from "@/components/CopyLinkButton";
import Footer from "@/components/Footer";

const SITE_URL = "https://www.spragginsdesigns.xyz";

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

	const url = `${SITE_URL}/blog/${slug}`;

	return {
		title: `${post.title} | Austin Spraggins`,
		description: post.description,
		keywords: [
			...post.tags,
			"Austin Spraggins",
			"LineCrush",
			"CTO",
			"Software Engineering",
			"Dev Blog"
		],
		alternates: {
			canonical: url
		},
		authors: [{ name: "Austin Spraggins", url: SITE_URL }],
		creator: "Austin Spraggins",
		category: post.tags[0],
		openGraph: {
			title: post.title,
			description: post.description,
			type: "article",
			publishedTime: post.date,
			modifiedTime: post.date,
			url,
			siteName: "Austin Spraggins - Senior Software Engineer",
			locale: "en_US",
			authors: ["Austin Spraggins"],
			section: post.tags[0],
			tags: post.tags
			// og:image comes from the file-based opengraph-image.tsx next to this
			// page, which renders a unique card per post.
		},
		twitter: {
			card: "summary_large_image",
			title: post.title,
			description: post.description,
			creator: "@spragginsdesign",
			site: "@spragginsdesign"
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

// --- Heading anchors + table of contents -----------------------------------

function slugifyHeading(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, "")
		.trim()
		.replace(/\s+/g, "-");
}

// Strip inline markdown (links, bold, italics, code) down to plain text so the
// regex-extracted TOC entries match what the rendered headings display.
function stripInlineMarkdown(text: string): string {
	return text
		.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
		.replace(/[*_`~]/g, "")
		.trim();
}

function extractHeadings(content: string): TocHeading[] {
	const withoutCodeBlocks = content.replace(/```[\s\S]*?```/g, "");
	const headings: TocHeading[] = [];
	const headingRegex = /^(#{2,3})\s+(.+)$/gm;
	let match: RegExpExecArray | null;

	while ((match = headingRegex.exec(withoutCodeBlocks)) !== null) {
		const text = stripInlineMarkdown(match[2]);
		headings.push({
			id: slugifyHeading(text),
			text,
			level: match[1].length === 2 ? 2 : 3
		});
	}

	return headings;
}

function nodeToText(node: ReactNode): string {
	if (typeof node === "string" || typeof node === "number") {
		return String(node);
	}
	if (Array.isArray(node)) {
		return node.map(nodeToText).join("");
	}
	if (isValidElement<{ children?: ReactNode }>(node)) {
		return nodeToText(node.props.children);
	}
	return "";
}

// h2/h3 get stable ids (matching the TOC) and scroll offset for the sticky bar
const mdxComponents = {
	h2: (props: ComponentPropsWithoutRef<"h2">) => (
		<h2
			id={slugifyHeading(nodeToText(props.children))}
			className="scroll-mt-28"
			{...props}
		/>
	),
	h3: (props: ComponentPropsWithoutRef<"h3">) => (
		<h3
			id={slugifyHeading(nodeToText(props.children))}
			className="scroll-mt-28"
			{...props}
		/>
	)
};

// --- Brand icons (lucide brand icons are deprecated) ------------------------

function XIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			className={className}
			aria-hidden="true"
		>
			<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
		</svg>
	);
}

function LinkedInIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			className={className}
			aria-hidden="true"
		>
			<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
		</svg>
	);
}

function GitHubIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			className={className}
			aria-hidden="true"
		>
			<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
		</svg>
	);
}

// ---------------------------------------------------------------------------

export default async function BlogPostPage({ params }: Props) {
	const { slug } = await params;
	const post = getPostBySlug(slug);

	if (!post) {
		notFound();
	}

	const url = `${SITE_URL}/blog/${slug}`;
	const headings = extractHeadings(post.content);
	const wordCount = post.content.split(/\s+/).filter(Boolean).length;
	const readMinutes = parseInt(post.readTime, 10);

	const allPosts = getAllPosts();
	const postIndex = allPosts.findIndex((p) => p.slug === slug);
	const newerPost = postIndex > 0 ? allPosts[postIndex - 1] : null;
	const olderPost =
		postIndex >= 0 && postIndex < allPosts.length - 1
			? allPosts[postIndex + 1]
			: null;

	const blogPostJsonLd = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: post.title,
		description: post.description,
		datePublished: post.date,
		dateModified: post.date,
		keywords: post.tags.join(", "),
		articleSection: post.tags[0],
		wordCount,
		...(Number.isFinite(readMinutes) && {
			timeRequired: `PT${readMinutes}M`
		}),
		inLanguage: "en-US",
		url,
		image: `${SITE_URL}/og-image.png`,
		author: {
			"@type": "Person",
			name: "Austin Spraggins",
			url: SITE_URL,
			jobTitle: "Co-Founder & Chief Technology Officer",
			sameAs: [
				"https://github.com/spragginsdesigns",
				"https://www.linkedin.com/in/spragginsdesigns/",
				"https://twitter.com/spragginsdesign"
			]
		},
		publisher: {
			"@type": "Person",
			name: "Austin Spraggins",
			url: SITE_URL
		},
		isPartOf: {
			"@type": "Blog",
			"@id": `${SITE_URL}/blog`,
			name: "Austin Spraggins - Dev Blog"
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": url
		}
	};

	const breadcrumbJsonLd = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Home",
				item: SITE_URL
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Blog",
				item: `${SITE_URL}/blog`
			},
			{
				"@type": "ListItem",
				position: 3,
				name: post.title,
				item: url
			}
		]
	};

	return (
		<main className="min-h-screen bg-background relative overflow-hidden">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostJsonLd) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
			/>

			{/* Reading Progress Bar */}
			<ReadingProgress />

			{/* Subtle background gradient orbs */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
				<div className="absolute top-1/2 -left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-3xl" />
			</div>

			{/* Header */}
			<header className="border-b border-border/20 bg-background/80 backdrop-blur-md sticky top-0 z-10">
				<div className="max-w-3xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
					<Link
						href="/blog"
						className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
					>
						<ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
						Back to Blog
					</Link>
					<Link
						href="/"
						className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
					>
						Austin Spraggins
					</Link>
				</div>
			</header>

			{/* Hero */}
			<div className="relative">
				<div className="max-w-3xl mx-auto px-6 sm:px-8 pt-12 sm:pt-20 pb-10 sm:pb-14">
					{/* Breadcrumb + eyebrow */}
					<nav
						aria-label="Breadcrumb"
						className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground/70 mb-6"
					>
						<Link href="/" className="hover:text-primary transition-colors">
							Home
						</Link>
						<span aria-hidden="true">/</span>
						<Link href="/blog" className="hover:text-primary transition-colors">
							Blog
						</Link>
						{post.tags[0] && (
							<>
								<span aria-hidden="true">/</span>
								<span className="text-primary">{post.tags[0]}</span>
							</>
						)}
					</nav>

					{/* Title */}
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-[1.12] tracking-tight mb-6">
						{post.title}
					</h1>

					{/* Description */}
					<p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
						{post.description}
					</p>

					{/* Author & meta row */}
					<div className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-6 border-t border-border/30">
						<Link href="/" className="flex items-center gap-3 group">
							<div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-border/30 group-hover:ring-primary/50 transition-all">
								<Image
									src="/images/profile_pic_main2_lessthan1MB.png"
									alt="Austin Spraggins"
									fill
									className="object-cover"
								/>
							</div>
							<div>
								<p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
									Austin Spraggins
								</p>
								<p className="text-xs text-muted-foreground">
									Co-Founder &amp; CTO, LineCrush
								</p>
							</div>
						</Link>
						<div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
							<span className="inline-flex items-center gap-2">
								<Calendar className="w-4 h-4 text-primary/70" />
								<time dateTime={post.date}>{formatDate(post.date)}</time>
							</span>
							<span className="inline-flex items-center gap-2">
								<Clock className="w-4 h-4 text-primary/70" />
								{post.readTime} read
							</span>
							{post.featured && (
								<span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
									Featured
								</span>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Divider */}
			<div className="max-w-3xl mx-auto px-6 sm:px-8">
				<div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
			</div>

			{/* Content + table of contents */}
			<div className="relative max-w-3xl mx-auto px-6 sm:px-8">
				<aside className="hidden xl:block absolute top-0 bottom-0 left-full ml-14 w-60">
					<div className="sticky top-28 pt-12 max-h-[calc(100vh-8rem)] overflow-y-auto">
						<TableOfContents headings={headings} />
					</div>
				</aside>

				<article className="relative py-12 sm:py-16">
					<div className="prose prose-base md:prose-lg prose-invert max-w-none prose-headings:font-bold prose-headings:text-foreground prose-headings:tracking-tight prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-5 prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-strong:font-semibold prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:marker:text-primary prose-code:text-primary prose-code:bg-card prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.85em] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:text-sm prose-img:rounded-xl prose-img:border prose-img:border-border/40 prose-hr:border-border/50 prose-blockquote:border-primary prose-blockquote:bg-card/30 prose-blockquote:py-1 prose-blockquote:text-muted-foreground prose-blockquote:italic prose-blockquote:rounded-r-lg [&_pre]:max-w-[calc(100vw-3rem)] sm:[&_pre]:max-w-full">
						{/* @ts-expect-error - MDXRemote types are complex */}
						<MDXRemote source={post.content} components={mdxComponents} options={{ mdxOptions }} />
					</div>

					{/* Tags */}
					<div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-border/30">
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
				</article>
			</div>

			{/* Divider */}
			<div className="max-w-3xl mx-auto px-6 sm:px-8">
				<div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
			</div>

			{/* Footer */}
			<footer className="relative">
				<div className="max-w-3xl mx-auto px-6 sm:px-8 py-14 sm:py-20">
					{/* Share section */}
					<div className="text-center mb-14">
						<p className="text-sm text-muted-foreground mb-4">
							Enjoyed this post? Share it with others.
						</p>
						<div className="flex flex-wrap items-center justify-center gap-3">
							<a
								href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(url)}`}
								target="_blank"
								rel="noopener noreferrer"
								className="p-3 rounded-full bg-card/50 border border-border/30 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
								aria-label="Share on X"
							>
								<XIcon className="w-5 h-5" />
							</a>
							<a
								href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
								target="_blank"
								rel="noopener noreferrer"
								className="p-3 rounded-full bg-card/50 border border-border/30 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
								aria-label="Share on LinkedIn"
							>
								<LinkedInIcon className="w-5 h-5" />
							</a>
							<CopyLinkButton url={url} />
						</div>
					</div>

					{/* Previous / next posts */}
					{(newerPost || olderPost) && (
						<nav
							aria-label="More posts"
							className="grid sm:grid-cols-2 gap-4 mb-14"
						>
							{newerPost ? (
								<Link
									href={`/blog/${newerPost.slug}`}
									className="group p-5 rounded-xl bg-card/30 border border-border/30 hover:border-primary/40 hover:bg-card/50 transition-all"
								>
									<span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
										<ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
										Newer post
									</span>
									<p className="font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
										{newerPost.title}
									</p>
								</Link>
							) : (
								<div className="hidden sm:block" />
							)}
							{olderPost && (
								<Link
									href={`/blog/${olderPost.slug}`}
									className="group p-5 rounded-xl bg-card/30 border border-border/30 hover:border-primary/40 hover:bg-card/50 transition-all sm:text-right"
								>
									<span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
										Older post
										<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
									</span>
									<p className="font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
										{olderPost.title}
									</p>
								</Link>
							)}
						</nav>
					)}

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
								<p className="text-sm text-muted-foreground mb-4 leading-relaxed">
									Co-Founder &amp; CTO at LineCrush, building AI-powered sports
									analytics and an autonomous engineering agent fleet. Former
									web development instructor at Bitwise Industries and Geekwise
									Academy. Based in Fresno, CA.
								</p>
								<div className="flex items-center justify-center sm:justify-start gap-3">
									<a
										href="https://github.com/spragginsdesigns"
										target="_blank"
										rel="noopener noreferrer"
										className="text-muted-foreground hover:text-primary transition-colors"
										aria-label="GitHub"
									>
										<GitHubIcon className="w-5 h-5" />
									</a>
									<a
										href="https://twitter.com/spragginsdesign"
										target="_blank"
										rel="noopener noreferrer"
										className="text-muted-foreground hover:text-primary transition-colors"
										aria-label="X (Twitter)"
									>
										<XIcon className="w-5 h-5" />
									</a>
									<a
										href="https://www.linkedin.com/in/spragginsdesigns/"
										target="_blank"
										rel="noopener noreferrer"
										className="text-muted-foreground hover:text-primary transition-colors"
										aria-label="LinkedIn"
									>
										<LinkedInIcon className="w-5 h-5" />
									</a>
								</div>
							</div>
						</div>
					</div>

					{/* Consulting CTA */}
					<div className="mt-6 p-6 sm:p-8 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-sm">
						<div className="flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
							<div className="flex items-start gap-4">
								<div className="hidden sm:flex p-2.5 rounded-lg bg-primary/10 border border-primary/20 shrink-0">
									<Briefcase className="w-5 h-5 text-primary" />
								</div>
								<div>
									<h3 className="font-semibold text-foreground mb-1">
										Have a project in mind?
									</h3>
									<p className="text-sm text-muted-foreground">
										I&apos;m open to contracts &amp; consulting - AI systems,
										full-stack products, and agentic engineering.
									</p>
								</div>
							</div>
							<Link
								href="/#contact"
								className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary/10 border border-primary/30 text-primary font-medium text-sm hover:bg-primary/20 transition-all group"
							>
								Get in touch
								<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
							</Link>
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
			<Footer />
		</main>
	);
}
