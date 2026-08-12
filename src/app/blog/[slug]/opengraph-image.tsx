import { ImageResponse } from "next/og";
import { getPostBySlug, getAllPosts, formatDate } from "@/lib/blog";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Blog post by Austin Spraggins";

export function generateStaticParams() {
	return getAllPosts().map((post) => ({ slug: post.slug }));
}

interface Props {
	params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
	const { slug } = await params;
	const post = getPostBySlug(slug);

	const title = post?.title ?? "Dev Blog";
	const description = post?.description ?? "";
	const date = post ? formatDate(post.date) : "";
	const readTime = post?.readTime ?? "";
	const tags = post?.tags.slice(0, 3) ?? [];
	// Satori requires display:flex on multi-child divs, so keep this one string
	const byline = ["Co-Founder & CTO, LineCrush", date, readTime && `${readTime} read`]
		.filter(Boolean)
		.join(" · ");

	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					padding: "64px 72px",
					backgroundColor: "#060b11",
					backgroundImage:
						"radial-gradient(circle at 85% 10%, rgba(92, 225, 230, 0.14), transparent 45%), radial-gradient(circle at 10% 95%, rgba(92, 225, 230, 0.08), transparent 40%)",
					color: "#f4f7f8",
					fontFamily: "sans-serif"
				}}
			>
				{/* Top accent bar */}
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "6px",
						background:
							"linear-gradient(90deg, transparent, #5ce1e6, transparent)"
					}}
				/>

				{/* Eyebrow */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "14px",
						fontSize: "26px",
						color: "#5ce1e6",
						letterSpacing: "2px",
						textTransform: "uppercase"
					}}
				>
					<div
						style={{
							width: "12px",
							height: "12px",
							borderRadius: "50%",
							backgroundColor: "#5ce1e6"
						}}
					/>
					spragginsdesigns.xyz · Dev Blog
				</div>

				{/* Title + description */}
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "24px",
						maxWidth: "1000px"
					}}
				>
					<div
						style={{
							fontSize: title.length > 45 ? "58px" : "68px",
							fontWeight: 700,
							lineHeight: 1.12,
							letterSpacing: "-1.5px",
							display: "block",
							lineClamp: 3
						}}
					>
						{title}
					</div>
					{description ? (
						<div
							style={{
								fontSize: "27px",
								lineHeight: 1.45,
								color: "#9aa7b1",
								display: "block",
								lineClamp: 2
							}}
						>
							{description}
						</div>
					) : null}
				</div>

				{/* Footer row */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						width: "100%"
					}}
				>
					<div
						style={{ display: "flex", flexDirection: "column", gap: "6px" }}
					>
						<div style={{ fontSize: "28px", fontWeight: 700 }}>
							Austin Spraggins
						</div>
						<div style={{ fontSize: "22px", color: "#9aa7b1" }}>{byline}</div>
					</div>
					<div style={{ display: "flex", gap: "12px" }}>
						{tags.map((tag) => (
							<div
								key={tag}
								style={{
									fontSize: "20px",
									color: "#5ce1e6",
									border: "1px solid rgba(92, 225, 230, 0.35)",
									borderRadius: "999px",
									padding: "8px 20px",
									backgroundColor: "rgba(92, 225, 230, 0.08)"
								}}
							>
								{tag}
							</div>
						))}
					</div>
				</div>
			</div>
		),
		size
	);
}
