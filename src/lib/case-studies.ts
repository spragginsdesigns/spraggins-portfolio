import { FMT, GUNMETAL_ORBIT, STATS } from "./stats";

export const caseStudySlugs = ["linecrush", "sureword", "game-development", "independent"] as const;
export type CaseStudySlug = (typeof caseStudySlugs)[number];

type StudyLink = { label: string; href: string; badgeProduct?: string };
type StudyImage = { src: string; alt: string; caption: string; shape: "portrait" | "landscape" };
type StudyMetric = { label: string; value: string };

type CaseStudySection = {
	id: string;
	label: string;
	title: string;
	paragraphs: string[];
	media?: StudyImage[];
	steps?: string[];
	metrics?: StudyMetric[];
	metricNote?: string;
	proof?: StudyLink[];
};

type CaseStudy = {
	name: string;
	title: string;
	intro: string;
	description: string;
	role: string;
	result: string;
	period: string;
	published: string;
	accent: string;
	cover: string;
	stack: string[];
	links: StudyLink[];
	timeline: { date: string; event: string }[];
	sections: CaseStudySection[];
};

const lineCrushWeb = { label: "LineCrush web app", href: "https://www.linecrush.com" };
const lineCrushApple = { label: "LineCrush on the App Store", href: "https://apps.apple.com/us/app/linecrush-sports-research/id6774968606" };
const lineCrushPlay = { label: "LineCrush on Google Play", href: "https://play.google.com/store/apps/details?id=com.linecrush.android" };
const lineCrushChangelog = { label: "Mobile release history", href: "https://www.linecrush.com/changelog" };
const sureWordWeb = { label: "SureWord web app", href: "https://sureword.app" };
const sureWordApple = { label: "SureWord on the App Store", href: "https://apps.apple.com/us/app/sureword-ai-bible-study-guide/id6820260211" };
const sureWordPlay = { label: "SureWord on Google Play", href: "https://play.google.com/store/apps/details?id=com.spragginsdesigns.sureword" };
const steam = { label: "Gunmetal Orbit on Steam", href: GUNMETAL_ORBIT.steamUrl };
const cutLoose = { label: "Cut Loose on itch.io", href: "https://spragginsdesigns.itch.io/cut-loose" };
const twoCities = { label: "Two Cities Off Road", href: "https://twocitiesoffroad.com/" };
const github = { label: "Austin's GitHub", href: "https://github.com/spragginsdesigns" };

export const caseStudies: Record<CaseStudySlug, CaseStudy> = {
	linecrush: {
		name: "LineCrush",
		title: "The AI fleet, C2, and two native apps.",
		intro: "I built LineCrush's self-sustaining, self-improving AI engineering fleet and C2, our replacement for Linear. I started the web codebase and grew LineCrush into a paid sports research product with Jay. I started both native apps from scratch and took them through store review and release.",
		description: "Austin Spraggins started the LineCrush codebase, built its AI fleet and C2, and took both native apps from their first commits to the stores.",
		role: "Co-founder & CTO",
		result: "Operating subscription business · Web, iOS and Android",
		period: "May 2024 to present",
		published: "2026-11-17",
		accent: "#80e9dc",
		cover: "/images/work/linecrush-sunburst-26.webp",
		stack: ["Next.js", "TypeScript", "Python", "PostgreSQL", "Redis", "SwiftUI", "Kotlin", "Claude Code", "Codex"],
		links: [{ ...lineCrushWeb, label: "Web app" }, { ...lineCrushApple, badgeProduct: "LineCrush" }, { ...lineCrushPlay, badgeProduct: "LineCrush" }],
		timeline: [
			{ date: "May 2024", event: "Started the athlete research codebase and built the first search, profiles and summaries." },
			{ date: "Fall 2024", event: "Launched the research product after building account access, subscriptions and scheduled reports." },
			{ date: "2025", event: "Built out reports, live research and integrations with Jay. We adopted the LineCrush name in October." },
			{ date: "June 2026", event: "Started the SwiftUI and Kotlin apps and the engineering agent fleet." },
			{ date: "Fall 2026", event: "Shipped both apps, published a ChatGPT integration and moved engineering work into C2." }
		],
		sections: [
			{
				id: "c2", label: "AI fleet & C2", title: "How the fleet keeps shipping",
				paragraphs: [
					"I built the fleet in June 2026 around the process we already used to take an issue from investigation through release. I designed it to sustain and improve itself, so routine work rarely needs a person to step in. Jay and I oversee it together.",
					"I built C2 to replace Linear and keep the issue, the work, and the evidence together. I led the move and brought over roughly 19,000 historical issues while active work kept moving.",
					"One trail ends in LineCrush iOS 2.9.0. The team and fleet delivered first-quarter passing, rushing and receiving leaders in Signals. You can see where that work landed in the App Store release notes."
				],
				steps: ["Investigate", "Implement", "Verify the product", "Review", "Ship", "Check the release"],
				media: [
					{ src: "/images/work/c2-sunburst-26.webp", alt: "Compute modules arranged around a gold light with cyan connections", caption: "Engineering fleet · GPT Image 2.6 Sunburst", shape: "landscape" }
				],
				metrics: [
					{ label: "Completed fleet jobs", value: FMT.fleetCompletedJobs },
					{ label: "Completed jobs with a recorded commit URL", value: FMT.fleetJobsWithCommitLinks },
					{ label: "Admitted jobs completed", value: FMT.fleetCompletion }
				],
				metricNote: "Fleet ledger snapshot, November 17, 2026. Jobs include implementation, investigation and documentation. The commit-URL count measures job records with a link.",
				proof: [{ ...lineCrushApple, label: "iOS 2.9.0 release notes" }, { label: "Published fleet walkthrough", href: "/blog/2026-08-08-no-humans-in-the-merge-loop" }]
			},
			{
				id: "native-apps", label: "iOS & Android", title: "I started and shipped both native apps",
				paragraphs: [
					"Jay and I decided to move from a Capacitor wrapper to platform-native apps so we could build the research experience around how people use each phone. I started both apps from scratch in June 2026 and wrote their first month myself. In SwiftUI, I built the swipeable research cards, stats and insights on their reverse faces, and a chart fed by line history. In Kotlin and Jetpack Compose, I built the typed API client, native sign-in and guest entry, and the swipe deck with rewind and cart.",
					"I kept writing native code after launch. I updated the research cards across web, iOS, and Android so the player's name and matchup stayed visible when a card flipped to its stats. I also moved answer narration on-device in the iOS app.",
					"App Review hit a case the demo account had missed. A fresh user with no history got an error. I traced the review requests, reproduced the failure with an empty account on an iPad simulator, and fixed the empty state. It made the new-account journey part of what a release had to prove.",
					"I shipped Android to Google Play in August 2026 and iOS to the App Store in September. I built release automation for signed test builds, store submissions, and staged rollouts. The fleet I designed has written most of the apps' feature code since the first month. I own releases and store review for both."
				],
				media: [
					{ src: "/images/work/linecrush-research.webp", alt: "LineCrush iPhone research card with player data and a chart", caption: "Player research · App Store screenshot", shape: "portrait" },
					{ src: "/images/work/linecrush-native.webp", alt: "A second screen from the released LineCrush mobile app", caption: "LineCrush mobile · App Store screenshot", shape: "portrait" }
				],
				proof: [lineCrushChangelog, lineCrushApple, lineCrushPlay]
			},
			{
				id: "ownership", label: "Founding & ownership", title: "From athlete search to a paid research product",
				paragraphs: [
					"I took the Gelateria Del Centro job because I wanted to build software full time. After I built their site, an introduction through that work led to the project that became LineCrush and to meeting Jay Raynor. He brought deep sports research expertise. I started the original Next.js, TypeScript and Python codebase in May 2024.",
					"The first player search, profiles and AI summaries answered a practical question: what's changed about an athlete since the last time you looked? I added source-linked quotes and reports, then built account access, Stripe subscriptions and scheduled processing so people could use it every day.",
					"Jay and I built out the product together. My work included the swipeable Picks experience, matchup and player research, LineCrushBot, and Sonar search and alerts. We connected those surfaces to the data and services behind them so readers could move from a current story to the quote, the matchup and the numbers in context.",
					"In 2025 the LineCrush repository recorded a non-merge commit under my Git identity on 355 of 365 days. That was before the fleet launched. The count measures days with recorded Git activity."
				],
				proof: [{ label: "LineCrush founders and launch video", href: "https://www.linecrush.com/about-us" }, { label: "Explore Sonar", href: "https://www.linecrush.com/sonar" }, { label: "Read the daily work log", href: "/#work-log" }]
			},
			{
				id: "product-decisions", label: "Product decisions", title: "Help readers get to the evidence faster",
				paragraphs: [
					"In 2025 I changed how LineCrushBot presented research in a stream. The answer could still be arriving when the summary appeared, so I let the answer finish before showing the summary. Jay refined the summary itself. We were working on the same reader experience from two sides.",
					"I found a different problem using the product myself in 2026. I asked about that night's main event and got research for another day. I built a Today card that explained the key point and the main risk in plain language, with sources the reader could open. I also changed the research experience so an open-ended event question got event context and showed what the assistant was checking."
				],
				media: [{ src: "/images/work/linecrush-web-live.webp", alt: "LineCrush's web research deck with a tutorial card between matchup and player statistics", caption: "LineCrush Vibes · Live web app", shape: "landscape" }],
				proof: [
					{ label: "Explore Vibes", href: "https://www.linecrush.com/vibes" },
					{ label: "Try LineCrushBot", href: "https://www.linecrush.com/linecrushbot" }
				]
			},
			{
				id: "platform", label: "Platform engineering", title: "Make changing sports data usable across clients",
				paragraphs: [
					"I started the Next.js and TypeScript web app and the Python backend. I built the real-time delivery that brought research updates to the web app and notifications. My work also covered data ingestion, search, reports, PostgreSQL, caching, and background jobs.",
					"Early on, I wired billing updates into the cached account views so a plan change would show up across the site. Later I fixed a case where overlapping jobs could regenerate the same research at the same time. I made replacement atomic, kept the previous history, and bounded how often a failed item could retry.",
					"One of my hardest infrastructure changes was moving a live product from Auth0 to Clerk. I kept existing account identifiers stable so saved data and subscriptions could still resolve to their owners. I built a compatibility layer for existing endpoints, rehearsed the import, checked the results, and updated the native clients to work with the new sessions.",
					"I added health monitoring for scheduled jobs and automated backend deploys. When Picks felt sluggish, I profiled it in DevTools and found hundreds of elements paying for the same blur effect. I cut GPU compositing layers from 360 to 80, got an example player headshot from about 238 KB down to 3 KB, and moved code people only needed after interacting off the initial load. On March 16, 2026, Vercel recorded a desktop production Real Experience Score of 100."
				]
			},
			{
				id: "production", label: "Production operations", title: "Measure the problem on the running service",
				paragraphs: [
					"When an outbound traffic alert fired in November 2026, I directed a production audit to find what was driving it and keep sports data current. We traced the traffic to individual workloads, then tested a change to the database writer against the existing one. On a bounded replay of 12 players, it sent about 36% fewer bytes to PostgreSQL with matching stored results. After deploy, we watched a scheduled production refresh complete.",
					"I built off-host backups and tested what I could actually get back. In October 2026 the restore recovered six selected production artifacts that matched byte for byte. A restored Git checkout also passed its integrity check and kept six commits that had never been pushed.",
					"The November audit found that a backup run could produce a snapshot without passing verification. We fixed its recovery behavior, verified a new encrypted snapshot, and restored a sample of configuration and schema files to check against the originals."
				]
			},
			{
				id: "integrations", label: "Integrations", title: "Put research where people already work",
				paragraphs: [
					"I built a Chrome extension and worked on betslip image analysis, research chat and voice, and notifications outside the site. The common product problem was preserving useful context when users moved between a research session, a browser and a phone.",
					"I moved long-running Discord bot requests to background workers so the bot could keep accepting messages. After rollout I found a difference in how replies were delivered. I fixed it, and the follow-up passed all 39 database assertions across seven scenarios.",
					"In October 2026 I built the hosted ChatGPT MCP integration. It exposes a bounded set of read-only public research tools that return structured results with source context. I also built WebMCP tools for the browser. With Jay and the fleet, we delivered a real-time sports news API for a business customer."
				],
				proof: [{ label: "LineCrush in ChatGPT", href: "https://chatgpt.com/plugins/plugin_asdk_app_6ad6200f5d308191826093af74536aa2" }]
			},
			{
				id: "founder-operations", label: "Founder operations", title: "Build tools the business can make decisions with",
				paragraphs: [
					"I built our acquisition dashboard from the reporting integrations through the database and API to the founder view. I wanted us to see how signups and paid outcomes tracked by campaign. A signup with ambiguous attribution stayed ambiguous, and missing reporting stayed unknown. That mattered when we used the numbers to make decisions.",
					"I also worked on Gievs, our website delivery product. The fleet built much of the intake and checkout flow. I fixed a sales notification that reached only one person when multiple callers shared the assignment. The change finds the assigned recipients, removes duplicates, and records delivery failures separately."
				],
				proof: [{ label: "Gievs website", href: "https://gievs.com/" }]
			},
			{
				id: "lessons", label: "What I learned", title: "Build it so the next release is easier to run",
				paragraphs: [
					"LineCrush taught me how to own everything from the first web app to a production service with paying customers. I learned native app development, server operations and release engineering as the company needed them, then turned the repeated parts into checks and tools Jay and I could use again.",
					"I'm proud of the company and products we built together. Today a release can move through a process the team can follow and inspect. I still like getting into the code, tracing a failure and putting the fix in people's hands. Building a company gave me more ways to do that."
				]
			}
		]
	},
	sureword: {
		name: "SureWord",
		title: "A Bible study that picks up where you left off.",
		intro: "I created SureWord and shipped its web, Android, iPhone, iPad, and Mac apps myself. I built it to help people study Scripture and grow in their relationship with God. Reading, questions, and notes carry across devices. With memory enabled, what you choose to share can shape your next study. There's a free plan and optional Pro.",
		description: "Austin Spraggins created and shipped SureWord across web, Android, iPhone, iPad, and Mac with exact Scripture quotations, user-controlled memory, and free and Pro plans.",
		role: "Creator & product engineer",
		result: "Web, Android, iPhone, iPad and Mac · Free plan and optional Pro",
		period: "July 2024 to present",
		published: "2026-11-17",
		accent: "#f1cb92",
		cover: "/images/work/sureword-sunburst-26.webp",
		stack: ["Next.js", "AI SDK", "PostgreSQL", "pgvector", "Expo", "React Native", "SwiftUI"],
		links: [{ ...sureWordWeb, label: "Web app" }, { ...sureWordApple, badgeProduct: "SureWord" }, { ...sureWordPlay, badgeProduct: "SureWord" }],
		timeline: [
			{ date: "2024 to 2025", event: "Started the web app and prototyped Bible study on mobile." },
			{ date: "August 2026", event: "Built the Expo Android client and began the SwiftUI client." },
			{ date: "October to November 2026", event: "Took the iPhone, iPad, and Mac apps through App Store release and shipped Android on Google Play." }
		],
		sections: [
			{
				id: "product", label: "Study experience", title: "Give a reader a place to return to",
				paragraphs: [
					"The first version was a small Bible question-and-answer app. I tried an early Kotlin prototype and a separate Expo experiment before building the store clients. I expanded the product into a place to read a passage, follow a cross-reference, ask about a verse and save what you learned. It now includes an offline KJV reader, highlights, notes, reading plans, word study and audio.",
					"I built the reader and the conversational experience to work together. A citation can open the actual passage in context. A reader can return to their notes or reading plan when they come back, and choose whether their saved context shapes study suggestions and devotionals."
				],
				media: [
					{ src: "/images/work/sureword-study.webp", alt: "SureWord study conversation with Scripture citations", caption: "Study conversation · App Store screenshot", shape: "portrait" },
					{ src: "/images/work/sureword-reader.webp", alt: "SureWord's Bible reading experience on iPhone", caption: "Bible reader · App Store screenshot", shape: "portrait" }
				],
				proof: [sureWordApple]
			},
			{
				id: "grounding", label: "Scripture retrieval", title: "The server supplies the verse text",
				paragraphs: [
					"People often remember the meaning of a passage more clearly than its words. I built Bible search to combine semantic matches and keyword hits. If the vector search fails, the keyword path can still return useful passages.",
					"I replaced a separate model review with Scripture lookup inside the streamed answer. When the model cites a verse, the server inserts the stored Bible text. The model explains the passage, and the reader can open the verse in its chapter."
				],
				steps: ["Find passages by meaning or words", "Resolve the reference", "Stream the stored verse", "Open it in context"]
			},
			{
				id: "memory", label: "Personalization", title: "Carry forward what a reader chooses to share",
				paragraphs: [
					"I added tools for saved context and a server-side preference that controls whether it participates in future study. The server scopes memory reads and changes to the signed-in owner. A reader can see, add, correct or delete memories and turn the feature off.",
					"Study context can include what someone is reading, questions they have been exploring and what they choose to share about their beliefs or circumstances. That lets a devotional or suggested question begin where the reader is in their study."
				],
				proof: [sureWordApple, sureWordPlay]
			},
			{
				id: "notes-accessibility", label: "Notes & accessibility", title: "Keep the work a reader already did",
				paragraphs: [
					"I wanted people to be able to write their own notes while the AI was working. I changed the editor so a late AI response couldn't overwrite a newer edit, and made line breaks and formatting survive across editors. The Android release check recovered a saved AI edit after the note was closed and reopened right away.",
					"I also built text scaling across web and native clients. The release checks covered a 320-pixel-wide web layout with doubled text and Android at twice the system text size. They checked draft text and keyboard focus on web, and selection and formatting in the Apple editors."
				],
				proof: [sureWordApple, sureWordPlay]
			},
			{
				id: "delivery", label: "Release & reliability", title: "One study backend across four experiences",
				paragraphs: [
					"I built the web app and backend in Next.js, the Android app in Expo and React Native, and the iPhone, iPad, and Mac apps in SwiftUI. I took the mobile and Mac apps through store review and release. They share the backend for Scripture, chat, notes, and study context, with navigation and reader controls built for each device.",
					"I traced incomplete chat responses through the stream, persisted answer and tool side effects, then checked combinations of account tiers and study modes. I also changed answer-ready notifications to generic notices so a private study question would stay inside the app.",
					"I built the subscription flow around one application entitlement across Stripe, Apple and Google Play. When Apple reversed a refund, I made SureWord restore access for the latest transaction. An older transaction could arrive late and the current plan still had to stand. On Google Play I made the plan and usage allowance read from the same membership snapshot so they agreed after a renewal.",
					"On Android the same build can move through test tracks into production. On Apple I maintained separate build and signing paths for iPhone, iPad and Mac. I kept release notes with the code so we could check what changed against the actual build.",
					"SureWord has a free plan and optional paid Pro. More new accounts started using SureWord in the first 18 days of November 2026 than in the same period in October."
				],
				proof: [sureWordWeb, sureWordApple, sureWordPlay]
			}
		]
	},
	"game-development": {
		name: "Game development",
		title: "From first playable to Steam.",
		intro: `I designed and developed Gunmetal Orbit in Godot for Steam Deck first. I took it from the first playable build to a paid Steam release in ${STATS.firstGameToSteamDays} days, then added macOS support and kept shipping updates. I used the same build and playtest loop for Cut Loose and Seven Days.`,
		description: `How Austin Spraggins designed and developed Gunmetal Orbit, took it from first playable to a paid Steam launch in ${STATS.firstGameToSteamDays} days, and built its testing and release pipeline.`,
		role: "Game developer & release owner",
		result: "Steam release, Windows jam build and Quest competition build",
		period: "July to November 2026",
		published: "2026-11-18",
		accent: "#f5c68c",
		cover: "/images/work/games-sunburst-26.webp",
		stack: ["Godot", "GDScript", "Steamworks", "Unreal Engine", "C++", "OpenXR"],
		links: [{ ...steam, badgeProduct: "Gunmetal Orbit" }, { ...cutLoose, badgeProduct: "Cut Loose" }, { label: "LineCrush Games", href: "/games" }],
		timeline: [
			{ date: "July 2026", event: "Started the Godot project, built the first playable mining loop and launched the studio site." },
			{ date: GUNMETAL_ORBIT.releaseDateDisplay, event: "Launched Gunmetal Orbit on Steam for Windows and Linux, including Steam Deck." },
			{ date: "October 2026", event: "Released a signed and notarized macOS build on Steam." },
			{ date: "November 2026", event: "Uploaded the Seven Days Quest competition build and released Cut Loose on itch.io." }
		],
		sections: [
			{
				id: "gunmetal-orbit", label: "Commercial release", title: "Make mining part of the combat decision",
				paragraphs: [
					"Gunmetal Orbit started with a loop I could play on a Steam Deck: crack asteroids, carry ore, dodge enemies and decide when to bank the haul. I grew that loop into a commercial space roguelite with weapon builds, wave bosses, a station that fights alongside you and controller-first menus.",
					"I owned gameplay direction, the Godot project, playtesting and the Steam release, using AI tools during development. I took the game through Valve's store and build reviews and launched it on September 10, 2026. Steam credits me as developer and LineCrush Games as publisher.",
					"After launch I found a shop bug on my Steam Deck that made two slots unreachable with a controller. I fixed the focus navigation and added a regression test that drives the shop with controller input. I built release checks that run the exported game through mining, combat, banking ore and starting the next round.",
					`I set up Steam Cloud and ${GUNMETAL_ORBIT.steamAchievements} achievements, and built a release pipeline that stages and checks builds before they go live. The changelog records over 100 post-launch Steam-channel version entries.`,
					`Steamworks recorded paid Steam sales and ${GUNMETAL_ORBIT.lifetimeWishlistAdds} lifetime wishlist additions as of ${GUNMETAL_ORBIT.wishlistSnapshotDisplay}, up from 75 wishlist additions on September 17.`
				],
				media: [{ src: "/images/games/gunmetal-orbit/screenshot-v2-1.jpg", alt: "Gunmetal Orbit boss fight next to the mining station", caption: "Gunmetal Orbit · Released gameplay", shape: "landscape" }],
				proof: [steam, { label: "Public changelog", href: "https://games.linecrush.com/gunmetal-orbit/changelog" }, { label: "Gameplay and screenshots", href: "/games" }]
			},
			{
				id: "studio", label: "Studio launch", title: "Give the game a home outside the storefront",
				paragraphs: [
					"I launched the LineCrush Games site in July 2026. I built the product pages, support and press materials, and a place to read the manual. I connected the public patch notes to the game's changelog so players could follow fixes and updates after the Steam release.",
					"I also published the React Steam Deck frame used to show game and app previews. It draws the device in SVG and takes the live preview as a React child."
				],
				proof: [
					{ label: "LineCrush Games studio", href: "https://games.linecrush.com/" },
					{ label: "Steam Deck frame package", href: "https://www.npmjs.com/package/react-steam-deck" }
				]
			},
			{
				id: "cut-loose", label: "Epic AI MegaJam", title: "Ship an Unreal prototype people can play",
				paragraphs: [
					"I entered Cut Loose solo and directed the agents that built the Unreal C++ gameplay and stages. I picked one move to build the game around. Aim a cut while time slows, then use what falls or opens up to change your route.",
					"I went from scaffold to a Windows jam release in four days. After 85 tests passed, my first full playthrough found four problems the tests missed. I kept playing the packaged builds and used what I found to decide what needed fixing before submission."
				],
				proof: [cutLoose]
			},
			{
				id: "seven-days", label: "Mixed reality", title: "Design a garden you can tend with your hands",
				paragraphs: [
					"I designed and led the Godot mixed-reality build for Seven Days. The experience pairs tracked-hand interactions with a guided creation garden, sound, and saved progression.",
					"I exercised the interaction flow in the XR simulator, checked replay and export, and uploaded a signed build to the private Quest Competition channel."
				]
			}
		]
	},
	independent: {
		name: "Client work & public tools",
		title: "Build for the workflow people already have.",
		intro: "Outside the flagship products, I built customer sites, booking automation, developer tools and prototypes. The projects range from live business workflows to public experiments with a repo or demo you can inspect.",
		description: "Austin Spraggins's client engineering, public code, applied AI prototypes and open-source projects from 2023 to 2026.",
		role: "Full-stack engineer & contributor",
		result: "Live client work, published tooling and prototypes",
		period: "Late 2023 to November 2026",
		published: "2026-11-18",
		accent: "#b8d5ff",
		cover: "/images/work/independent-sunburst-26.webp",
		stack: ["Next.js", "AWS Lambda", "Cloudflare", "React", "Kotlin", "TypeScript", "Rust", "MCP"],
		links: [twoCities, github, { label: "React Steam Deck on npm", href: "https://www.npmjs.com/package/react-steam-deck" }],
		timeline: [
			{ date: "2023 to 2024", event: "Built and maintained web work for Gelateria Del Centro in Fresno." },
			{ date: "2025", event: "Built client sites and booking automation alongside tutor, team-management and MCP projects." },
			{ date: "2026", event: "Shipped Two Cities Off Road, published a React package, contributed to tty7 and built hackathon demos." }
		],
		sections: [
			{
				id: "client-delivery", label: "Client engineering", title: "Work that had to fit a real business",
				paragraphs: [
					"I built the catalog, fabrication gallery and inquiry flow for Two Cities Off Road. I also built an editor the owner can use to update products, photos and the homepage. Saving changes and publishing are separate steps, and the editor checks the deployed content version so the owner can tell when the site is actually updated.",
					"For SaveALife CPR, I rebuilt the booking-to-registration workflow when a portal change broke the previous version. The AWS Lambda integration verifies bookings, finds the right course, updates registration and reports the result. I verified the production login and read-only course lookup, and checked that invalid bookings were rejected.",
					"I worked on Gelateria Del Centro's Fresno web application and built the Constrong contractor site with Jay. Constrong paired a responsive project gallery with a contact flow and local search metadata. For H.O.E INK, I built a studio landing page with service information and a booking inquiry that prepares an email."
				],
				media: [{ src: "/images/work/two-cities-live.webp", alt: "Two Cities Off Road homepage showing an off-road buggy and a link to browse fabrication builds", caption: "Two Cities Off Road · Live client site", shape: "landscape" }],
				proof: [
					twoCities,
					{ label: "Live content version", href: "https://twocitiesoffroad.com/build.json" },
					{ label: "Gelateria Del Centro source", href: "https://github.com/spragginsdesigns/Gelateria-Del-Centro-WebApp" },
					{ label: "Constrong source", href: "https://github.com/spragginsdesigns/constrong" },
					{ label: "H.O.E INK site", href: "https://hoeink.vercel.app/" }
				]
			},
			{
				id: "developer-tools", label: "Developer tooling", title: "Publish small tools that someone else can use",
				paragraphs: [
					"I contributed three changes that tty7's maintainer merged. I added Kimi Code detection and session resume without wiping existing user settings, built a shortcut that jumps to the agent that's been waiting longest across windows, and fixed input still being sent after a terminal session exited.",
					"I built Perplexity and PostgreSQL MCP servers and published a zero-dependency React component that frames a live app inside a Steam Deck illustration. I built AI Docs Digest and DocMagic to combine documentation into Markdown for use with AI tools."
				],
				proof: [
					{ label: "tty7 upstream fix", href: "https://github.com/l0ng-ai/tty7/pull/877" },
					{ label: "tty7 Kimi Code integration", href: "https://github.com/l0ng-ai/tty7/pull/694" },
					{ label: "tty7 agent navigation", href: "https://github.com/l0ng-ai/tty7/pull/1164" },
					{ label: "Perplexity MCP source", href: "https://github.com/spragginsdesigns/perplexity-mcp-server" },
					{ label: "PostgreSQL MCP source", href: "https://github.com/spragginsdesigns/neon-pg-mcp-server" },
					{ label: "AI Docs Digest source", href: "https://github.com/spragginsdesigns/ai-docs-digest" },
					{ label: "DocMagic source", href: "https://github.com/spragginsdesigns/doc-magic" }
				]
			},
			{
				id: "filesteward", label: "Android pre-release", title: "Resume the work without repeating a file change",
				paragraphs: [
					"I built FileSteward AI in Kotlin so an assistant can organize files on Android with the person's approval. I saved tool progress and pending proposals so a restart can pick up where the assistant left off.",
					"If Android closed the app halfway through moving a file, I couldn't assume the move had failed. I made the app check the file before retrying and flag uncertain changes for review. The source for the public v0.15.0 pre-release includes tests for both cases."
				],
				proof: [{ label: "FileSteward v0.15.0 pre-release", href: "https://github.com/spragginsdesigns/filesteward-ai-releases/releases/tag/v0.15.0" }]
			},
			{
				id: "experiments", label: "Evaluation & prototypes", title: "Make the result inspectable",
				paragraphs: [
					"I built Ghostcount as a retrospective ledger-backing replay with a Rust attestation component and a public dashboard. The committed replay shows a gap almost 40 hours before the identification timestamp in the incident record. That timing comes from a historical replay.",
					"For Jury Swarm, I built a testnet demo that compares AI reviewers and records how they rank hackathon entries. The public demo includes a replay of recorded outputs. I also directed an agent-assisted PayPal sandbox prototype for team treasurers, with recorded receipts and a read-only assistant.",
					"I built FormUp for youth coaches to track player assessments, rosters, schedules, and messages. Coaches approve team roles, and players and parents have read-only portals. The Next.js and Convex web app is live, and the repo includes an Expo companion app in development.",
					"I also built an AI tutor that guides students through a problem and Clearline, a public-health dashboard demo built with generated sample data."
				],
				proof: [
					{ label: "Ghostcount replay", href: "https://spragginsdesigns.github.io/ghostcount/" },
					{ label: "Jury Swarm demo", href: "https://spragginsdesigns.github.io/jury-swarm/" },
					{ label: "Sideline source", href: "https://github.com/spragginsdesigns/sideline" },
					{ label: "FormUp source", href: "https://github.com/spragginsdesigns/soccer-team-management" },
					{ label: "FormUp web app", href: "https://soccer-team-management-umber.vercel.app/" },
					{ label: "AI Tutor source", href: "https://github.com/spragginsdesigns/ai-tutor-webapp" },
					{ label: "Clearline source", href: "https://github.com/spragginsdesigns/clearline" }
				]
			},
			{
				id: "earlier-builds", label: "Earlier builds", title: "Small projects from 2024",
				paragraphs: [
					"I built the Woodward Bluffs community site for residents and the activities committee. I also published TreeMapMD, a Rust desktop tool that exports directory trees as Markdown, and a Windows log viewer that searches large text files with PowerShell.",
					"I experimented with AI as a practical interface in a few smaller apps: SmartShell for Windows command suggestions, Prompt Perfector for prompt editing, and AI Favicon Creator for generating site icons."
				],
				proof: [
					{ label: "Woodward Bluffs source", href: "https://github.com/spragginsdesigns/bluffstuff" },
					{ label: "TreeMapMD source", href: "https://github.com/spragginsdesigns/treemap_md" },
					{ label: "Windows Log Search source", href: "https://github.com/spragginsdesigns/Log-Search-Tool-Windows" },
					{ label: "SmartShell source", href: "https://github.com/spragginsdesigns/SmartShell" },
					{ label: "Prompt Perfector source", href: "https://github.com/spragginsdesigns/AI-Prompt-Perfector" },
					{ label: "AI Favicon Creator source", href: "https://github.com/spragginsdesigns/AI-Favicon-Creator" }
				]
			}
		]
	}
};

export function isCaseStudySlug(slug: string): slug is CaseStudySlug {
	return caseStudySlugs.some((value) => value === slug);
}
