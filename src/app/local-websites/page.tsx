import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LocalWebsitesShowcase from "@/components/local-websites/LocalWebsitesShowcase";
import { FAQ_ITEMS, LOCAL_SITES } from "@/lib/local-websites";

const BASE_URL = "https://www.spragginsdesigns.xyz";

const title = `Websites for ${LOCAL_SITES.city} Businesses | ${LOCAL_SITES.businessName}`;
const description = `A full website for your ${LOCAL_SITES.city} business, built from your listings and photos and live in a day. ${LOCAL_SITES.buildPrice} to build, ${LOCAL_SITES.hostingPrice} hosting, no contract. Call or text ${LOCAL_SITES.phoneDisplay}.`;

export const metadata: Metadata = {
	title,
	description,
	keywords:
		"Fresno web design, Fresno website designer, small business website Fresno, local business website, Clovis web design, Spraggins Designs, Austin Spraggins",
	alternates: {
		canonical: `${BASE_URL}/local-websites`
	},
	openGraph: {
		title,
		description,
		url: `${BASE_URL}/local-websites`,
		siteName: "Austin Spraggins - Spraggins Designs",
		images: [
			{
				url: "/og-image.png",
				width: 1200,
				height: 630,
				alt: `${LOCAL_SITES.businessName} - websites for ${LOCAL_SITES.city} businesses`
			}
		],
		locale: "en_US",
		type: "website"
	},
	twitter: {
		card: "summary_large_image",
		title,
		description,
		images: [
			{
				url: "/og-image.png",
				alt: `${LOCAL_SITES.businessName} - websites for ${LOCAL_SITES.city} businesses`
			}
		]
	}
};

const serviceJsonLd = {
	"@context": "https://schema.org",
	"@type": "ProfessionalService",
	name: LOCAL_SITES.businessName,
	description,
	url: `${BASE_URL}/local-websites`,
	telephone: "+1-559-818-0467",
	email: LOCAL_SITES.email,
	sameAs: [LOCAL_SITES.googleProfileUrl],
	priceRange: "$",
	areaServed: {
		"@type": "City",
		name: `${LOCAL_SITES.city}, ${LOCAL_SITES.region}`
	},
	address: {
		"@type": "PostalAddress",
		addressLocality: LOCAL_SITES.city,
		addressRegion: LOCAL_SITES.region,
		addressCountry: "US"
	},
	founder: {
		"@type": "Person",
		name: "Austin Spraggins",
		url: BASE_URL
	},
	makesOffer: [
		{
			"@type": "Offer",
			name: "Local business website build",
			price: LOCAL_SITES.buildPriceValue,
			priceCurrency: "USD",
			url: `${BASE_URL}/local-websites`
		},
		{
			"@type": "Offer",
			name: "Hosting, domain, SSL, and contact form",
			price: LOCAL_SITES.hostingPriceValue,
			priceCurrency: "USD",
			priceSpecification: {
				"@type": "UnitPriceSpecification",
				price: LOCAL_SITES.hostingPriceValue,
				priceCurrency: "USD",
				billingIncrement: 1,
				unitCode: "MON"
			},
			url: `${BASE_URL}/local-websites`
		}
	]
};

const faqJsonLd = {
	"@context": "https://schema.org",
	"@type": "FAQPage",
	mainEntity: FAQ_ITEMS.map((item) => ({
		"@type": "Question",
		name: item.title,
		acceptedAnswer: {
			"@type": "Answer",
			text: item.description
		}
	}))
};

export default function LocalWebsitesPage() {
	return (
		<main className="bg-background min-h-screen relative">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
			/>
			<div className="relative z-10">
				<Header />
				<LocalWebsitesShowcase />
				<Footer />
			</div>
		</main>
	);
}
