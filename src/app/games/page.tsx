import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GamesShowcase from "@/components/games/GamesShowcase";
import { GUNMETAL_ORBIT, STUDIO } from "@/lib/stats";

const BASE_URL = "https://www.spragginsdesigns.xyz";

export const metadata: Metadata = {
	title: `LineCrush Games | ${GUNMETAL_ORBIT.name} — Wishlist on Steam`,
	description: `${STUDIO.motto} ${GUNMETAL_ORBIT.name} is a ${GUNMETAL_ORBIT.genre.toLowerCase()} built on Steam Deck first — releasing on Steam ${GUNMETAL_ORBIT.releaseDateDisplay} at ${GUNMETAL_ORBIT.price}. Wishlist now.`,
	alternates: {
		canonical: `${BASE_URL}/games`
	},
	openGraph: {
		title: `${GUNMETAL_ORBIT.name} — ${STUDIO.name}`,
		description: `${GUNMETAL_ORBIT.genre}. "${GUNMETAL_ORBIT.tagline}" Steam release ${GUNMETAL_ORBIT.releaseDateDisplay}.`,
		url: `${BASE_URL}/games`,
		siteName: "Austin Spraggins - Senior Software Engineer",
		images: [
			{
				url: "/images/games/gunmetal-orbit/capsule.jpg",
				width: 616,
				height: 353,
				alt: `${GUNMETAL_ORBIT.name} key art`
			}
		],
		locale: "en_US",
		type: "website"
	},
	twitter: {
		card: "summary_large_image",
		title: `${GUNMETAL_ORBIT.name} — ${STUDIO.name}`,
		description: `${GUNMETAL_ORBIT.genre}. Steam release ${GUNMETAL_ORBIT.releaseDateDisplay} at ${GUNMETAL_ORBIT.price}. Wishlist now.`,
		images: [
			{
				url: "/images/games/gunmetal-orbit/capsule.jpg",
				alt: `${GUNMETAL_ORBIT.name} key art`
			}
		]
	}
};

const videoGameJsonLd = {
	"@context": "https://schema.org",
	"@type": "VideoGame",
	name: GUNMETAL_ORBIT.name,
	description: `${GUNMETAL_ORBIT.genre}: pilot exosuits with ${GUNMETAL_ORBIT.weaponSlots} auto-firing weapon slots from a ${GUNMETAL_ORBIT.weapons}-weapon arsenal. Mine ore between enemy waves, bank it at the dock, and snowball your build. ${GUNMETAL_ORBIT.tagline}`,
	url: `${BASE_URL}/games`,
	image: `${BASE_URL}/images/games/gunmetal-orbit/capsule.jpg`,
	genre: ["Action Roguelike", "Arena Shooter", "Twin Stick Shooter"],
	gamePlatform: ["Steam Deck", "PC (Windows)", "Linux (SteamOS)"],
	playMode: "https://schema.org/SinglePlayer",
	applicationCategory: "Game",
	datePublished: GUNMETAL_ORBIT.releaseDate,
	author: {
		"@type": "Person",
		name: "Austin Spraggins",
		url: BASE_URL
	},
	publisher: {
		"@type": "Organization",
		name: STUDIO.name,
		url: STUDIO.url
	},
	offers: {
		"@type": "Offer",
		price: "4.99",
		priceCurrency: "USD",
		availability: "https://schema.org/PreOrder",
		url: GUNMETAL_ORBIT.steamUrl
	}
};

const studioJsonLd = {
	"@context": "https://schema.org",
	"@type": "Organization",
	name: STUDIO.name,
	url: STUDIO.url,
	slogan: STUDIO.motto,
	location: {
		"@type": "PostalAddress",
		addressLocality: "Fresno",
		addressRegion: "CA",
		addressCountry: "US"
	},
	founder: {
		"@type": "Person",
		name: "Austin Spraggins",
		url: BASE_URL
	}
};

export default function GamesPage() {
	return (
		<main className="bg-background min-h-screen relative">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(videoGameJsonLd) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(studioJsonLd) }}
			/>
			<div className="relative z-10">
				<Header />
				<GamesShowcase />
				<Footer />
			</div>
		</main>
	);
}
