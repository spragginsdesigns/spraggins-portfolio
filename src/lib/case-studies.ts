export const caseStudySlugs = ["linecrush", "sureword"] as const;

export type CaseStudySlug = (typeof caseStudySlugs)[number];

type CaseStudySection = {
	id: string;
	label: string;
	title: string;
	paragraphs: readonly string[];
};

type CaseStudy = {
	name: string;
	eyebrow: string;
	title: string;
	intro: string;
	description: string;
	role: string;
	result: string;
	period: string;
	stack: readonly string[];
	image: string;
	imageAlt: string;
	imageCaption: string;
	links: readonly { label: string; href: string }[];
	sections: readonly CaseStudySection[];
	takeaway: string;
};

export const caseStudies = {
	linecrush: {
		name: "LineCrush",
		eyebrow: "Product engineering & developer tooling",
		title: "From the first commit to daily operation.",
		intro:
			"I started the LineCrush codebase in 2024. Jay and I built it into a sports research platform, then extended the product to native apps and built the engineering system that helps us keep shipping.",
		description:
			"How Austin Spraggins co-built LineCrush, launched native SwiftUI and Kotlin apps, and designed C2 and an engineering agent fleet for ongoing delivery.",
		role: "Co-founder & CTO",
		result: "Live on web, App Store & Google Play",
		period: "2024 to present",
		stack: ["Next.js", "TypeScript", "Python", "PostgreSQL", "SwiftUI", "Kotlin"],
		image: "/images/work/linecrush-research.webp",
		imageAlt: "LineCrush sports research app shown in its official store screenshot",
		imageCaption: "The released LineCrush app. Official App Store screenshot.",
		links: [
			{ label: "Visit LineCrush", href: "https://www.linecrush.com" },
			{
				label: "App Store",
				href: "https://apps.apple.com/us/app/linecrush-sports-research/id6774968606"
			},
			{
				label: "Google Play",
				href: "https://play.google.com/store/apps/details?id=com.linecrush.android"
			}
		],
		sections: [
			{
				id: "ownership",
				label: "The responsibility",
				title: "Build the product, then stay responsible for it.",
				paragraphs: [
					"The first implementation was mine. As the company grew, Jay and I developed the product together, from the web experience to the services behind it. My work spans application code, data, infrastructure, native clients and release engineering.",
					"That ownership continues after a feature lands. Account state, loading behavior, release failures and the first experience for a new user are part of the product too. The work is making those pieces hold together in production."
				]
			},
			{
				id: "native-apps",
				label: "From scratch to the stores",
				title: "Native apps started with working user journeys.",
				paragraphs: [
					"I scaffolded the SwiftUI app in June 2026 and built its first research cards, search, filters, stats and insights. Later that month I started the Kotlin and Jetpack Compose client, including its API client, authentication and swipeable research deck. Both use the existing product backend.",
					"App Review exposed a case our demo account had missed. A fresh account with no history hit an error. I traced the review requests, reproduced the failure on an iPad simulator, and fixed the empty state. That experience made the new-account journey part of what a release has to prove.",
					"The Android app reached Google Play in August 2026 and iOS reached the App Store in September. The fleet now carries substantial implementation and release work across both clients. I built the foundations and the delivery system, and the ongoing product is a team effort."
				]
			}
		],
		takeaway:
			"Starting a product is one kind of work. Keeping its accounts, clients, releases and engineering process coherent is the work I want to keep owning."
	},
	sureword: {
		name: "SureWord",
		eyebrow: "Applied AI & cross-platform product",
		title: "A Bible study companion that can pick up where you left off.",
		intro:
			"I built SureWord to support a person's relationship with God through Scripture. It brings Bible reading, questions, notes and optional saved study context into one product, across web, Android and Apple devices.",
		description:
			"Austin Spraggins's SureWord case study: meaning-based Scripture search, canonical quotations, optional study memory, and released web and mobile apps.",
		role: "Founder & product engineer",
		result: "Web, Android, iPhone, iPad & Mac",
		period: "Started 2024, expanded 2026",
		stack: ["Next.js", "AI SDK", "PostgreSQL", "pgvector", "Expo", "SwiftUI"],
		image: "/images/work/sureword-study.webp",
		imageAlt: "SureWord Bible study app shown in its official store screenshot",
		imageCaption: "The released SureWord app. Official App Store screenshot.",
		links: [
			{ label: "Visit SureWord", href: "https://sureword.app" },
			{ label: "App Store", href: "https://apps.apple.com/app/id6820260211" },
			{
				label: "Google Play",
				href: "https://play.google.com/store/apps/details?id=com.spragginsdesigns.sureword"
			}
		],
		sections: [
			{
				id: "product",
				label: "The product",
				title: "Study has continuity beyond one conversation.",
				paragraphs: [
					"SureWord began as a small Bible study web app in July 2024. I rebuilt and expanded it in 2026, adding an Expo Android app and native SwiftUI clients for Apple devices. I own the product and engineering, using Claude Code and Codex throughout the build.",
					"A reader can ask a question, return to a passage, write notes and continue studying across devices. With memory enabled, saved context can carry their study and stated preferences into later conversations. They can view, correct, delete or turn that memory off."
				]
			},
			{
				id: "grounding",
				label: "The engineering decision",
				title: "Let the model explain. Let the server supply the Scripture.",
				paragraphs: [
					"Meaning-based search helps when someone knows what they want to study but doesn't know the exact words. SureWord combines semantic retrieval with keyword search, and keeps a keyword fallback when vector retrieval is unavailable.",
					"For quotations, the server resolves the referenced passage from the stored Bible and inserts its canonical text into the stream. The model can explain the passage without being responsible for reproducing its wording from memory. Exact quotation and the quality of an interpretation are separate concerns."
				]
			},
			{
				id: "delivery",
				label: "From implementation to release",
				title: "One backend, several real ways to use it.",
				paragraphs: [
					"Shared server behavior keeps Scripture handling and saved study context consistent across clients. Each app still needs its own reader, navigation, offline behavior and store release. Android uses Expo and React Native. iPhone, iPad and Mac use SwiftUI.",
					"SureWord is available on the web, Google Play and the App Store. Getting there also meant carrying account access, subscriptions, streaming responses and release maintenance through the actual product. The public apps are the result people can try."
				]
			}
		],
		takeaway:
			"The useful part of AI is how it serves the person using it. For SureWord, that means helping someone stay grounded in Scripture and continue a study that matters to them."
	}
} as const satisfies Record<CaseStudySlug, CaseStudy>;

export function isCaseStudySlug(slug: string): slug is CaseStudySlug {
	return caseStudySlugs.some((value) => value === slug);
}
