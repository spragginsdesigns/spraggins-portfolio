import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import MotionProvider from "@/components/MotionProvider";
import { PROFILE_SAME_AS } from "@/lib/profiles";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
	weight: ["400", "500", "700"],
	subsets: ["latin"],
	variable: "--font-poppins"
});

const siteTitle = "Austin Spraggins | Senior Software Engineer & LineCrush Co-Founder";
const siteDescription = "Austin Spraggins started LineCrush's native apps and leads their releases. Explore his work in applied AI, full-stack engineering, and native mobile.";
const socialImage = {
	url: "/images/work/austin-social.jpg",
	width: 1200,
	height: 630,
	alt: "Austin Spraggins, senior software engineer and LineCrush co-founder"
};

export const metadata: Metadata = {
	title: siteTitle,
	description: siteDescription,
	authors: [{ name: "Austin Spraggins", url: "https://www.spragginsdesigns.xyz" }],
	creator: "Austin Spraggins",
	keywords:
		"Austin Spraggins, CTO, Co-Founder, Agentic AI Engineer, AI Agents, Autonomous Software Delivery, LLM Orchestration, MCP Servers, Codex, Claude, React, Next.js, TypeScript, Python, PostgreSQL, Godot, Gunmetal Orbit, Steam, Steam Deck, Game Development, LineCrush, LineCrush Games, System Architecture, Fresno CA, Spraggins Designs, Fresno web design, small business websites",
	metadataBase: new URL("https://www.spragginsdesigns.xyz"),
	alternates: {
		canonical: "https://www.spragginsdesigns.xyz"
	},
	openGraph: {
		title: siteTitle,
		description: siteDescription,
		url: "https://www.spragginsdesigns.xyz/",
		siteName: "Austin Spraggins",
		images: [socialImage],
		locale: "en_US",
		type: "website"
	},
	twitter: {
		card: "summary_large_image",
		title: siteTitle,
		description: siteDescription,
		images: [socialImage],
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
	telephone: "+1-559-818-0467",
	alumniOf: {
		"@type": "CollegeOrUniversity",
		name: "Clovis Community College"
	},
	knowsAbout: [
		"Full-Stack Development",
		"AI Engineering",
		"Autonomous Software Agents",
		"Agent Orchestration",
		"LLM Integration",
		"MCP Servers",
		"Next.js",
		"React",
		"TypeScript",
		"Python",
		"PostgreSQL",
		"System Architecture",
		"DevOps",
		"Godot Game Development"
	],
	sameAs: PROFILE_SAME_AS
};

const websiteJsonLd = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	name: "Austin Spraggins",
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
					href="/apple-icon-180x180.png?v=relay"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon-32x32.png?v=relay"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon-16x16.png?v=relay"
				/>
				<link rel="icon" href="/favicon.ico?v=relay" sizes="16x16 32x32 48x48" />
				<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png?v=relay" />
				<link rel="icon" type="image/svg+xml" sizes="any" href="/favicon.svg" />
				<link rel="manifest" href="/site.webmanifest" />
				<link
					rel="alternate"
					type="application/rss+xml"
					title="Austin Spraggins - Dev Blog"
					href="/feed.xml"
				/>
				<meta name="msapplication-TileColor" content="#0a0a0a" />
				<meta name="theme-color" content="#0a0a0a" />
				<meta name="darkreader-lock" />
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
				<MotionProvider>{children}</MotionProvider>
				<Analytics />
			</body>
		</html>
	);
}
