import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
	weight: ["400", "500", "700"],
	subsets: ["latin"],
	variable: "--font-poppins"
});

export const metadata: Metadata = {
	title: "Austin Spraggins | Co-Founder & CTO | Senior Software Engineer",
	description:
		"Co-Founder & CTO building production systems at scale. 350+ React components, 45+ microservices, AI/ML integrations, and 100+ database tables. Full-stack expertise in Next.js, Python, PostgreSQL, and cloud infrastructure.",
	authors: [{ name: "Austin Spraggins" }],
	keywords:
		"Austin Spraggins, CTO, Co-Founder, Senior Software Engineer, Full Stack Developer, AI Engineer, ML Engineer, React, Next.js, TypeScript, Python, PostgreSQL, LineCrush, DevOps, System Architecture, Fresno CA",
	metadataBase: new URL("https://www.spragginsdesigns.xyz"),
	alternates: {
		canonical: "https://www.spragginsdesigns.xyz"
	},
	openGraph: {
		title: "Austin Spraggins | Co-Founder & CTO | Senior Software Engineer",
		description:
			"Co-Founder & CTO building production systems at scale. 350+ React components, 45+ microservices, AI/ML integrations. Available for contracts and consulting.",
		url: "https://www.spragginsdesigns.xyz/",
		siteName: "Austin Spraggins - Senior Software Engineer",
		images: [
			{
				url: "https://spraggins-designs.s3.us-east-1.amazonaws.com/images/og-image.png",
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
		title: "Austin Spraggins | Co-Founder & CTO | Senior Software Engineer",
		description:
			"Co-Founder & CTO building production systems at scale. 350+ React components, 45+ microservices, AI/ML integrations. Available for contracts and consulting.",
		images: [
			{
				url: "https://spraggins-designs.s3.us-east-1.amazonaws.com/images/og-image.png",
				alt: "Austin Spraggins - Co-Founder & CTO Portfolio"
			}
		],
		creator: "@spragginsdesign"
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
				<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
				<meta name="msapplication-TileColor" content="#da532c" />
				<meta name="theme-color" content="#ffffff" />
			</head>
			<body className="font-sans bg-background text-foreground">
				{children}
			</body>
		</html>
	);
}
