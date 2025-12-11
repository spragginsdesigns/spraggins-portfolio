"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, PenLine } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlogPostMeta {
	slug: string;
	title: string;
	description: string;
	date: string;
	tags: string[];
	readTime: string;
	featured: boolean;
}

interface BlogPreviewProps {
	posts: BlogPostMeta[];
}

const formatDate = (dateString: string): string => {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric"
	});
};

const BlogPreview: React.FC<BlogPreviewProps> = ({ posts }) => {
	// Show latest 3 posts
	const latestPosts = posts.slice(0, 3);

	if (latestPosts.length === 0) {
		return null;
	}

	return (
		<section id="blog" className="bg-background text-foreground py-20">
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					viewport={{ once: true }}
					className="text-center mb-12"
				>
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
						<PenLine className="w-4 h-4" />
						<span className="text-sm font-medium">Dev Blog</span>
					</div>
					<h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
						Learning in Public
					</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto text-lg">
						Notes from the trenches. What I learn building AI-powered systems,
						leading engineering at LineCrush, and shipping code every day.
					</p>
				</motion.div>

				{/* Blog Posts Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
					{latestPosts.map((post, index) => (
						<motion.div
							key={post.slug}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							viewport={{ once: true }}
						>
							<Link href={`/blog/${post.slug}`}>
								<Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 group overflow-hidden">
									<div className="p-6">
										{/* Meta Row */}
										<div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
											<span className="inline-flex items-center gap-1.5">
												<Calendar className="w-3.5 h-3.5 text-primary" />
												{formatDate(post.date)}
											</span>
											<span className="inline-flex items-center gap-1.5">
												<Clock className="w-3.5 h-3.5 text-primary" />
												{post.readTime}
											</span>
										</div>

										{/* Title */}
										<h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-2">
											{post.title}
										</h3>

										{/* Description */}
										<p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
											{post.description}
										</p>

										{/* Tags */}
										<div className="flex flex-wrap gap-2 mb-4">
											{post.tags.slice(0, 3).map((tag) => (
												<Badge
													key={tag}
													variant="secondary"
													className="text-xs bg-secondary/50"
												>
													{tag}
												</Badge>
											))}
										</div>

										{/* Read More */}
										<div className="flex items-center gap-2 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
											Read article
											<ArrowRight className="w-4 h-4" />
										</div>
									</div>
								</Card>
							</Link>
						</motion.div>
					))}
				</div>

				{/* CTA Button */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					viewport={{ once: true }}
					className="text-center"
				>
					<Link
						href="/blog"
						className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary/10 border border-primary/30 text-primary font-medium hover:bg-primary/20 hover:border-primary/50 transition-all duration-300"
					>
						View all posts
						<ArrowRight className="w-4 h-4" />
					</Link>
				</motion.div>
			</div>
		</section>
	);
};

export default BlogPreview;
