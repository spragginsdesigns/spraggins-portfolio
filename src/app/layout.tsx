import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Layout from "../components/Layout";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
	weight: ["400", "500", "700"],
	subsets: ["latin"],
	variable: "--font-poppins"
});

export const metadata: Metadata = {
	title: "Austin Spraggins - Full Stack Developer Portfolio",
	description:
		"The Official Portfolio of Austin Spraggins, a Full Stack Developer specializing in React, Next.js, and modern web technologies. Based in Fresno, CA.",
	authors: [{ name: "Austin Spraggins" }],
	keywords:
		"Austin Spraggins, Spraggins Designs, Web Development, Full Stack Developer, React, Next.js, JavaScript, TypeScript, Software Engineer, Fresno CA, Portfolio",
	metadataBase: new URL("https://www.spragginsdesigns.xyz"),
	alternates: {
		canonical: "https://www.spragginsdesigns.xyz"
	},
	openGraph: {
		title: "Austin Spraggins - Full Stack Developer Portfolio",
		description:
			"Explore the portfolio of Austin Spraggins, a Full Stack Developer specializing in React, Next.js, and modern web technologies. Based in Fresno, CA.",
		url: "https://www.spragginsdesigns.xyz/",
		siteName: "Austin Spraggins Portfolio",
		images: [
			{
				url: "https://opengraph.b-cdn.net/production/images/57d437b6-00af-4dc3-a9eb-7e29e51c5f04.png?token=9VdePgxCJ40PR3vQtoZBslC8r3smw8O8YOX0UfWivzg&height=372&width=1200&expires=33258886154",
				width: 1200,
				height: 372,
				alt: "Austin Spraggins Portfolio Preview"
			}
		],
		locale: "en_US",
		type: "website"
	},
	twitter: {
		card: "summary_large_image",
		title: "Austin Spraggins - Full Stack Developer Portfolio",
		description:
			"Explore the portfolio of Austin Spraggins, a Full Stack Developer specializing in React, Next.js, and modern web technologies. Based in Fresno, CA.",
		images: [
			{
				url: "https://opengraph.b-cdn.net/production/images/57d437b6-00af-4dc3-a9eb-7e29e51c5f04.png?token=9VdePgxCJ40PR3vQtoZBslC8r3smw8O8YOX0UfWivzg&height=372&width=1200&expires=33258886154",
				alt: "Austin Spraggins Portfolio Preview"
			}
		],
		creator: "@AustinSpraggins" // Replace with your actual Twitter handle
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
			<body className="font-sans bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
				<Layout>{children}</Layout>
			</body>
		</html>
	);
}
