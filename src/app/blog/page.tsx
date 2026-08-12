import { getAllPosts, formatDate, type BlogPostMeta } from "@/lib/blog";
import Link from "next/link";
import {
	ArrowLeft,
	ArrowRight,
	ArrowUpRight,
	Calendar,
	Clock,
	FileText,
	Rss,
	Send
} from "lucide-react";
import type { Metadata } from "next";
import Footer from "@/components/Footer";

const SITE_URL = "https://www.spragginsdesigns.xyz";

export const metadata: Metadata = {
	title: "Dev Blog | Austin Spraggins",
	description:
		"Engineering notes from Austin Spraggins, Co-Founder & CTO at LineCrush: autonomous AI agent fleets, full-stack development, game dev, and startup life.",
	keywords: [
		"Austin Spraggins",
		"Dev Blog",
		"AI Agents",
		"Autonomous Engineering",
		"LineCrush",
		"Full-Stack Development",
		"Godot",
		"Startups"
	],
	alternates: {
		canonical: `${SITE_URL}/blog`,
		types: { "application/rss+xml": `${SITE_URL}/feed.xml` }
	},
	openGraph: {
		title: "Dev Blog | Austin Spraggins",
		description:
			"Engineering notes on autonomous AI agent fleets, full-stack development, game dev, and startup life at LineCrush.",
		url: `${SITE_URL}/blog`,
		siteName: "Austin Spraggins - Senior Software Engineer",
		locale: "en_US",
		type: "website"
	},
	twitter: {
		card: "summary_large_image",
		title: "Dev Blog | Austin Spraggins",
		description:
			"Engineering notes on autonomous AI agent fleets, full-stack development, game dev, and startup life at LineCrush.",
		creator: "@spragginsdesign",
		site: "@spragginsdesign"
	}
};

function TagChip({ tag }: { tag: string }) {
	return (
		<span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider text-primary/90 border border-primary/25 bg-primary/5">
			{tag}
		</span>
	);
}

function PostCard({ post }: { post: BlogPostMeta }) {
	return (
		<Link href={`/blog/${post.slug}`} className="group block h-full">
			<article className="relative flex flex-col h-full p-7 sm:p-8 rounded-2xl border border-border/30 bg-card/20 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-card/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
				{/* Meta row */}
				<div className="flex items-center gap-x-4 text-sm text-muted-foreground mb-4">
					<span className="inline-flex items-center gap-1.5">
						<Calendar className="w-3.5 h-3.5 text-primary/60" />
						<time dateTime={post.date}>{formatDate(post.date)}</time>
					</span>
					<span className="inline-flex items-center gap-1.5">
						<Clock className="w-3.5 h-3.5 text-primary/60" />
						{post.readTime}
					</span>
				</div>

				{/* Title */}
				<h3 className="text-xl sm:text-2xl font-bold text-foreground leading-snug tracking-tight group-hover:text-primary transition-colors duration-300 mb-3">
					{post.title}
				</h3>

				{/* Excerpt */}
				<p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3 mb-6">
					{post.description}
				</p>

				{/* Tags + arrow */}
				<div className="mt-auto flex items-end justify-between gap-4">
					<div className="flex flex-wrap gap-1.5">
						{post.tags.slice(0, 3).map((tag) => (
							<TagChip key={tag} tag={tag} />
						))}
					</div>
					<ArrowUpRight className="w-5 h-5 shrink-0 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
				</div>
			</article>
		</Link>
	);
}

export default function BlogPage() {
	const posts = getAllPosts();
	const [featured, ...rest] = posts;

	const blogJsonLd = {
		"@context": "https://schema.org",
		"@type": "Blog",
		"@id": `${SITE_URL}/blog`,
		name: "Austin Spraggins - Dev Blog",
		description:
			"Engineering notes on autonomous AI agent fleets, full-stack development, game dev, and startup life at LineCrush.",
		url: `${SITE_URL}/blog`,
		inLanguage: "en-US",
		author: {
			"@type": "Person",
			name: "Austin Spraggins",
			url: SITE_URL
		},
		blogPost: posts.map((post) => ({
			"@type": "BlogPosting",
			headline: post.title,
			description: post.description,
			datePublished: post.date,
			url: `${SITE_URL}/blog/${post.slug}`
		}))
	};

	const breadcrumbJsonLd = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
			{ "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` }
		]
	};

	return (
		<main className="min-h-screen bg-background relative overflow-hidden">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
			/>

			{/* Subtle background gradient orbs */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -top-1/3 -right-1/4 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
				<div className="absolute -bottom-1/3 -left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-3xl" />
			</div>

			{/* Header */}
			<header className="border-b border-border/20 bg-background/80 backdrop-blur-md sticky top-0 z-10">
				<div className="max-w-5xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
					>
						<ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
						Back to Portfolio
					</Link>
					<Link
						href="/"
						className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
					>
						Austin Spraggins
					</Link>
				</div>
			</header>

			{/* Masthead */}
			<div className="relative">
				<div className="max-w-5xl mx-auto px-6 sm:px-8 pt-16 sm:pt-24 pb-12 sm:pb-16">
					<div className="flex items-center gap-2.5 mb-5">
						<span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_12px_rgba(92,225,230,0.8)]" />
						<span className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-[0.2em]">
							Engineering Notes
						</span>
					</div>
					<h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-foreground tracking-tight mb-5">
						Dev Blog
					</h1>
					<p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-8">
						Notes from the loop: autonomous AI agents, full-stack systems, and
						what it takes to ship as a two-person company.
					</p>
					<div className="flex items-center gap-6 text-sm text-muted-foreground">
						<span className="inline-flex items-center gap-2">
							<FileText className="w-4 h-4 text-primary/70" />
							{posts.length} {posts.length === 1 ? "post" : "posts"}
						</span>
						<a
							href="/feed.xml"
							className="inline-flex items-center gap-2 text-primary hover:underline underline-offset-4"
						>
							<Rss className="w-4 h-4" />
							RSS
						</a>
					</div>
				</div>
			</div>

			{/* Posts */}
			<div className="relative max-w-5xl mx-auto px-6 sm:px-8 pb-16 sm:pb-24">
				{posts.length === 0 ? (
					<div className="text-center py-20 rounded-2xl border border-border/30 bg-card/20">
						<p className="text-muted-foreground text-lg">
							No posts yet. Check back soon.
						</p>
					</div>
				) : (
					<>
						{/* Featured spotlight */}
						{featured && (
							<Link href={`/blog/${featured.slug}`} className="group block mb-6">
								<article className="relative p-8 sm:p-12 rounded-2xl border border-primary/20 bg-gradient-to-b from-card/50 to-card/20 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
									{/* Top edge glow */}
									<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
									<div className="absolute inset-x-[15%] -top-24 h-32 bg-primary/20 blur-3xl rounded-full pointer-events-none" />

									<div className="relative flex flex-col lg:flex-row lg:items-center gap-8">
										<div className="flex-1 min-w-0">
											<p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4">
												{featured.featured ? "Featured" : "Latest"}
											</p>
											<h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-foreground leading-[1.1] tracking-tight group-hover:text-primary transition-colors duration-300 mb-4">
												{featured.title}
											</h2>
											<p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl mb-6">
												{featured.description}
											</p>
											<div className="flex flex-wrap items-center gap-x-5 gap-y-3">
												<span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground border border-border/40 bg-background/60">
													<Calendar className="w-4 h-4 text-primary/70" />
													<time dateTime={featured.date}>
														{formatDate(featured.date)}
													</time>
												</span>
												<span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground border border-border/40 bg-background/60">
													<Clock className="w-4 h-4 text-primary/70" />
													{featured.readTime} read
												</span>
												<div className="flex flex-wrap gap-1.5">
													{featured.tags.slice(0, 4).map((tag) => (
														<TagChip key={tag} tag={tag} />
													))}
												</div>
											</div>
										</div>

										{/* Arrow CTA */}
										<div className="hidden lg:flex shrink-0 items-center justify-center w-16 h-16 rounded-full border border-primary/30 bg-primary/5 text-primary transition-all duration-300 group-hover:bg-primary/15 group-hover:shadow-[0_0_24px_rgba(92,225,230,0.35)]">
											<ArrowRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
										</div>
									</div>
								</article>
							</Link>
						)}

						{/* Grid of remaining posts */}
						{rest.length > 0 && (
							<div className="grid sm:grid-cols-2 gap-6">
								{rest.map((post) => (
									<PostCard key={post.slug} post={post} />
								))}
							</div>
						)}
					</>
				)}

				{/* Consulting CTA */}
				<div className="mt-14 p-7 sm:p-9 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-sm">
					<div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
						<div className="flex items-start gap-4">
							<div className="hidden sm:flex p-3 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
								<Send className="w-5 h-5 text-primary" />
							</div>
							<div>
								<h2 className="text-lg font-semibold text-foreground mb-1">
									Need help building something great?
								</h2>
								<p className="text-sm sm:text-base text-muted-foreground">
									I&apos;m open to contracts &amp; consulting - AI systems,
									full-stack products, and agentic engineering.
								</p>
							</div>
						</div>
						<Link
							href="/#contact"
							className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary/10 border border-primary/30 text-primary font-medium hover:bg-primary/20 transition-all group"
						>
							Work with me
							<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
						</Link>
					</div>
				</div>
			</div>

			<Footer />
		</main>
	);
}
