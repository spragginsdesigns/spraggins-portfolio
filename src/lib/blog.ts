import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogPost {
	slug: string;
	title: string;
	description: string;
	date: string;
	tags: string[];
	readTime: string;
	featured: boolean;
	content: string;
}

export interface BlogPostMeta {
	slug: string;
	title: string;
	description: string;
	date: string;
	tags: string[];
	readTime: string;
	featured: boolean;
}

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export function getAllPosts(): BlogPostMeta[] {
	if (!fs.existsSync(BLOG_DIR)) {
		return [];
	}

	const files = fs.readdirSync(BLOG_DIR);
	const posts = files
		.filter((file) => file.endsWith(".mdx"))
		.map((file) => {
			const filePath = path.join(BLOG_DIR, file);
			const fileContent = fs.readFileSync(filePath, "utf-8");
			const { data } = matter(fileContent);

			const slug = file.replace(/\.mdx$/, "");

			return {
				slug,
				title: data.title || "Untitled",
				description: data.description || "",
				date: data.date || new Date().toISOString().split("T")[0],
				tags: data.tags || [],
				readTime: data.readTime || "5 min",
				featured: data.featured || false
			};
		})
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return posts;
}

export function getPostBySlug(slug: string): BlogPost | null {
	const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

	if (!fs.existsSync(filePath)) {
		return null;
	}

	const fileContent = fs.readFileSync(filePath, "utf-8");
	const { data, content } = matter(fileContent);

	return {
		slug,
		title: data.title || "Untitled",
		description: data.description || "",
		date: data.date || new Date().toISOString().split("T")[0],
		tags: data.tags || [],
		readTime: data.readTime || "5 min",
		featured: data.featured || false,
		content
	};
}

export function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	});
}
