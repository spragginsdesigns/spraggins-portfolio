import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
	weight: ["400", "500", "700"],
	subsets: ["latin"],
	variable: "--font-poppins"
});

export const metadata: Metadata = {
	title: "Austin Spraggins | CTO, AI Engineer, Builder",
	description:
		"Co-Founder & CTO building production AI systems at scale. 800+ React components, 115+ Python services, 25,000+ commits, and 5 LLM providers in production. Full-stack expertise in Next.js, TypeScript, Python, PostgreSQL, and cloud infrastructure. Open to contracts & consulting.",
	authors: [{ name: "Austin Spraggins", url: "https://www.spragginsdesigns.xyz" }],
	creator: "Austin Spraggins",
	keywords:
		"Austin Spraggins, CTO, Co-Founder, Senior Software Engineer, Full Stack Developer, AI Engineer, LLM Integration, MCP Servers, AI Agents, React, Next.js, TypeScript, Python, PostgreSQL, LineCrush, DevOps, System Architecture, Fresno CA, Contract Software Engineer, Consulting",
	metadataBase: new URL("https://www.spragginsdesigns.xyz"),
	alternates: {
		canonical: "https://www.spragginsdesigns.xyz"
	},
	openGraph: {
		title: "Austin Spraggins | CTO, AI Engineer, Builder",
		description:
			"Co-Founder & CTO building production AI systems at scale. 800+ React components, 115+ Python services, 25,000+ commits. Available for contracts and consulting.",
		url: "https://www.spragginsdesigns.xyz/",
		siteName: "Austin Spraggins - Senior Software Engineer",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: "Austin Spraggins - Co-Founder & CTO Portfolio"
			}
		],
		locale: "en_US",
		type: "website"
	},
	twitter: {
		card: "summary_large_image",
		title: "Austin Spraggins | CTO, AI Engineer, Builder",
		description:
			"Co-Founder & CTO building production AI systems at scale. 800+ React components, 115+ Python services, 25,000+ commits. Available for contracts and consulting.",
		images: [
			{
				url: "/og-image.png",
				alt: "Austin Spraggins - Co-Founder & CTO Portfolio"
			}
		],
		creator: "@spragginsdesign",
		site: "@spragginsdesign"
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1
		}
	},
	verification: {
		google:
			"google-site-verification=bw8wGUVh-PMCf-cYVVbDt4SdImX1hpYsa_edlymxSaI" // May need to update this
	}
};

const personJsonLd = {
	"@context": "https://schema.org",
	"@type": "Person",
	name: "Austin Spraggins",
	url: "https://www.spragginsdesigns.xyz",
	image: "https://www.spragginsdesigns.xyz/images/profile_pic_main2_lessthan1MB.png",
	jobTitle: "Co-Founder & Chief Technology Officer",
	worksFor: {
		"@type": "Organization",
		name: "LineCrush Inc",
		url: "https://www.linecrush.com"
	},
	address: {
		"@type": "PostalAddress",
		addressLocality: "Fresno",
		addressRegion: "CA",
		addressCountry: "US"
	},
	email: "mailto:spragginsdesigns@gmail.com",
	alumniOf: {
		"@type": "CollegeOrUniversity",
		name: "Clovis Community College"
	},
	knowsAbout: [
		"Full-Stack Development",
		"AI Engineering",
		"LLM Integration",
		"MCP Servers",
		"Next.js",
		"React",
		"TypeScript",
		"Python",
		"PostgreSQL",
		"System Architecture",
		"DevOps"
	],
	sameAs: [
		"https://github.com/spragginsdesigns",
		"https://www.linkedin.com/in/spragginsdesigns/",
		"https://twitter.com/spragginsdesign"
	]
};

const websiteJsonLd = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	name: "Austin Spraggins - Senior Software Engineer",
	url: "https://www.spragginsdesigns.xyz",
	author: { "@type": "Person", name: "Austin Spraggins" }
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${inter.variable} ${poppins.variable}`}>
			<head>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/apple-icon-180x180.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png"
				/>
				<link rel="manifest" href="/site.webmanifest" />
				<link
					rel="alternate"
					type="application/rss+xml"
					title="Austin Spraggins — Dev Blog"
					href="/feed.xml"
				/>
				<meta name="msapplication-TileColor" content="#0a0a0a" />
				<meta name="theme-color" content="#0a0a0a" />
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
				/>
			</head>
			<body className="font-sans bg-background text-foreground">
				{children}
				<Analytics />
			</body>
		</html>
	);
}
