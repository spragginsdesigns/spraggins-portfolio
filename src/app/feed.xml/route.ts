import { getAllPosts } from "@/lib/blog";

const SITE_URL = "https://www.spragginsdesigns.xyz";

function escapeXml(text: string): string {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

export async function GET() {
	const posts = getAllPosts();

	const items = posts
		.map(
			(post) => `		<item>
			<title>${escapeXml(post.title)}</title>
			<link>${SITE_URL}/blog/${post.slug}</link>
			<guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
			<description>${escapeXml(post.description)}</description>
			<pubDate>${new Date(post.date).toUTCString()}</pubDate>
			${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n			")}
		</item>`
		)
		.join("\n");

	const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>Austin Spraggins - Dev Blog</title>
		<link>${SITE_URL}/blog</link>
		<description>Notes from the trenches: building AI-powered systems, leading engineering at LineCrush, and shipping code every day.</description>
		<language>en-us</language>
		<atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
	</channel>
</rss>`;

	return new Response(rss, {
		headers: {
			"Content-Type": "application/rss+xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600"
		}
	});
}
