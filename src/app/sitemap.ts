import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://www.spragginsdesigns.xyz";
	const posts = getAllPosts();

	const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
		url: `${baseUrl}/blog/${post.slug}`,
		lastModified: new Date(post.date),
		changeFrequency: "yearly",
		priority: 0.7
	}));

	return [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1
		},
		{
			url: `${baseUrl}/blog`,
			lastModified: posts.length ? new Date(posts[0].date) : new Date(),
			changeFrequency: "weekly",
			priority: 0.8
		},
		...postEntries
	];
}
