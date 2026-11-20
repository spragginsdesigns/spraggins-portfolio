import { FMT, GUNMETAL_ORBIT, STATS } from "./stats";

export type PortfolioSource = { label: string; href: string };

export type PortfolioEvidence = {
	id: string;
	answer: string;
	sources: readonly PortfolioSource[];
};

const linecrushSource = { label: "LineCrush case study", href: "/work/linecrush" };
const c2Source = { label: "C2 and the engineering fleet", href: "/work/linecrush#c2" };
const surewordSource = { label: "SureWord case study", href: "/work/sureword" };
const resumeSource = { label: "Engineering résumé", href: "/resume" };
const aboutSource = { label: "Austin's journey", href: "/#about" };
const workSource = { label: "Selected work", href: "/#projects" };

export const overviewEvidence: PortfolioEvidence = {
	id: "overview",
	answer: "Austin Spraggins is a Fresno-based product engineer and the co-founder and CTO of LineCrush. He started its codebase in 2024 and built the sports research product with Jay. He started LineCrush's native iOS and Android apps and took them through store review, and he built SureWord's apps himself. He designed the C2 engineering delivery system and released Gunmetal Orbit on Steam. LineCrush, SureWord, and Gunmetal Orbit all have real users and earn revenue. LineCrush and SureWord have free and paid plans. Before founding products, he drove trucks, returned to college, and taught web development.",
	sources: [resumeSource, workSource, aboutSource]
};

type Topic = "ownership" | "native" | "linecrush" | "fleet" | "sureword" | "grounding" | "reliability" | "games" | "background" | "faith" | "metrics" | "stack" | "collaboration" | "clients" | "opensource" | "contact" | "fit";

type Entry = PortfolioEvidence & {
	topic: Topic;
	patterns: readonly RegExp[];
};

// Only public portfolio facts belong here. Keep private employment research,
// customer records and the operational internals of LineCrush out of answers.
const entries: readonly Entry[] = [
	{
		id: "personal-ownership", topic: "ownership",
		patterns: [/\b(personally|himself|hands[ -]on|own hands|actually (build|built|code|coded))\b/, /\bwhat (did|does|has) (austin|he) (build|built|make|made|ship|shipped|own|create|created)\b/, /\b(ownership|individual contribution|his contribution)\b/, /\b(?:only|just) (?:use |using )?(?:ai|agents?)\b/, /\b(?:ai|agents?).{0,30}\b(?:write|wrote|code|coded|coding)\b/],
		answer: "Austin started LineCrush's codebase and built the business with Jay. He started both LineCrush mobile apps from scratch, in SwiftUI for iOS and Kotlin with Jetpack Compose for Android, and wrote their first month himself. Since then most of their feature code has come from the engineering fleet he designed and directs, and he owns their releases and store review. He also built SureWord's web, iOS and Android apps himself. At LineCrush, examples of his mobile work include the first iOS research cards, the Kotlin API client, Android authentication and the swipeable research deck. He designed C2 and the engineering fleet, which contributes to ongoing implementation and releases.",
		sources: [linecrushSource, surewordSource, c2Source]
	},
	{
		id: "native-apps", topic: "native",
		patterns: [/\b(native|swiftui|swift|kotlin|jetpack|android|ios|iphone|ipad|mobile|app stores?)\b/],
		answer: "Austin started LineCrush's iOS app in SwiftUI and its Android app in Kotlin with Jetpack Compose, and wrote the first month of both himself. He then kept building them with the engineering fleet he designed, which now writes most of their feature code, while he owns releases and store review. His early work included the iOS research cards and search, and the Android API client, authentication and research deck. For SureWord, he built the Android app with Expo and React Native and the iPhone, iPad and Mac apps with SwiftUI. Both products reached the App Store and Google Play.",
		sources: [{ label: "Native app ownership", href: "/work/linecrush#native-apps" }, surewordSource, resumeSource]
	},
	{
		id: "linecrush-product", topic: "linecrush",
		patterns: [/\bline\s?crush\b/, /\b(sports research|sports analytics|flagship|production platform)\b/],
		answer: `LineCrush is the paid sports research platform Austin started in 2024 and built with co-founder Jay. As CTO, he works across application code, backend services, data, infrastructure, native clients and releases. The product is available on web, iOS and Android. The public portfolio records ${FMT.apiHandlers} API handlers and ${FMT.postgresTables} database tables as platform scale, not as a count of code personally written by Austin. His case study also shows how new-account failures and release maintenance became part of ongoing product ownership.`,
		sources: [linecrushSource, { label: "LineCrush product", href: "https://www.linecrush.com" }, { label: "LineCrush on the App Store", href: "https://apps.apple.com/us/app/linecrush-sports-research/id6774968606" }]
	},
	{
		id: "trading-infrastructure", topic: "linecrush",
		patterns: [/\btrad(?:e|er|ing)\b/, /\b(?:partial fills?|duplicate orders?|order reconciliation|paper[ -]trading|live execution)\b/],
		answer: "Austin built LineCrush's first paper-trading engine and extended it to live execution across multiple venues. He built order tracking and reconciliation around partial fills and uncertain responses to protect against duplicate orders. In his AI-assisted order workflow, the model proposes an order from plain English and a person reviews and approves it before submission.",
		sources: [{ label: "Trading infrastructure case study", href: "/work/linecrush#trading-infrastructure" }]
	},
	{
		id: "c2-delivery", topic: "fleet",
		patterns: [/\bc2\b/, /\b(fleet|agents?|autonomous|automation|delivery system|issue track(?:er|ing)|ship(?:ping)? process)\b/],
		answer: `Austin designed C2 and LineCrush's engineering agent fleet, which he and Jay operate together. C2 connects an issue, its run and its delivery evidence, and brought roughly 19,000 historical issue records into the same system as new work. The public delivery pattern is investigate, implement, verify the product, review, ship and check the result. As of November 17, 2026, the fleet ledger recorded ${FMT.fleetCompletedJobs} completed jobs and ${FMT.fleetJobsWithCommitLinks} completed jobs containing a commit URL. Jobs include investigations and documentation, so those figures aren't unique features or Austin's personal commits.`,
		sources: [c2Source, { label: "LineCrush release notes", href: "https://apps.apple.com/us/app/linecrush-sports-research/id6774968606" }, { label: "Daily Work Log", href: "/#work-log" }]
	},
	{
		id: "sureword-product", topic: "sureword",
		patterns: [/\bsure\s?word\b/, /\b(bible (study|app)|scripture|study (memory|context)|rag|retrieval|pgvector)\b/],
		answer: "Austin created SureWord to support a person's relationship with God through Scripture. He built and shipped the Next.js web app, the Expo and React Native Android app, and the SwiftUI apps for iPhone, iPad, and Mac. He owns the product and engineering, using Claude Code and Codex throughout development. The server supplies exact Bible quotations, and readers can carry questions, reading, and notes across devices. Optional saved memory carries study context into later conversations. SureWord has a free plan and optional paid Pro.",
		sources: [surewordSource, { label: "Try SureWord", href: "https://sureword.app" }, { label: "SureWord on the App Store", href: "https://apps.apple.com/app/id6820260211" }]
	},
	{
		id: "sureword-grounding", topic: "grounding",
		patterns: [/\b(ground(?:ed|ing)?|hallucinat\w*|canonical|quot(?:e|es|ation|ations)|accurate (bible|scripture)|semantic|keyword|vector)\b/],
		answer: "SureWord combines meaning-based retrieval with keyword search, including a keyword fallback when vector retrieval is unavailable. For Bible quotations, the server resolves the referenced passage from the stored Bible and inserts its canonical text into the stream. The model explains the passage without having to reproduce its exact wording from memory. This separates quotation accuracy from interpretation quality. It doesn't make every explanation infallible. Austin's public case study describes that engineering decision and links to the product people can try.",
		sources: [{ label: "SureWord grounding decision", href: "/work/sureword#grounding" }, { label: "Try SureWord", href: "https://sureword.app" }]
	},
	{
		id: "production-reliability", topic: "reliability",
		patterns: [/\b(reliab\w*|debug\w*|bug|bugs|failure|failures|testing|tested|regression|empty state|new account|app review|quality)\b/],
		answer: "Austin's public work includes a LineCrush App Review failure that only affected a fresh account with no history. He traced the review requests, reproduced the failure on an iPad simulator and fixed the empty state. For SureWord, shared server behavior keeps Scripture handling and saved study context consistent across clients, with keyword fallback when vector retrieval is unavailable. These are concrete reliability decisions, not a claim of zero defects. His Steam work also includes reproducing a shop navigation bug on his own Steam Deck and adding a controller-driven regression test.",
		sources: [{ label: "LineCrush release failure and fix", href: "/work/linecrush#native-apps" }, surewordSource, { label: "Steam game work", href: "/#game-spotlight" }]
	},
	{
		id: "gunmetal-orbit", topic: "games",
		patterns: [/\b(gunmetal|orbit|steam|deck|godot|games?|roguelite|controller)\b/],
		answer: `Austin built Gunmetal Orbit, a space-mining arena roguelite released on Steam for PC and Steam Deck on ${GUNMETAL_ORBIT.releaseDateDisplay}. His public portfolio records ${STATS.firstGameToSteamDays} days from the first playable build to Steam. After release, he caught a shop navigation bug on his own Steam Deck and wrote a regression test that drives the UI with controller input. It is a commercial release through LineCrush Games, the studio he runs with Jay. The Steam listing is the public artifact people can inspect.`,
		sources: [{ label: "Game portfolio", href: "/games" }, { label: "Gunmetal Orbit on Steam", href: GUNMETAL_ORBIT.steamUrl }, { label: "LineCrush Games", href: "https://games.linecrush.com" }]
	},
	{
		id: "career-background", topic: "background",
		patterns: [/\b(truck\w*|background|journey|career|college|education|degree|teach\w*|instructor|bitwise|geekwise|clovis|from .+ to cto)\b/, /\b(?:when|how long).{0,45}\b(?:coding|programming|engineering|software|web development)\b/],
		answer: "Austin drove trucks before returning to college and moving into software. He earned an A.S. in Information Systems: Web Design at Clovis Community College in 2021, alongside web development work for Effycient and the college. From January 2022 through July 2023 he taught HTML, CSS, JavaScript and React at Bitwise Industries and Geekwise Academy. Paid client work followed, and in 2024 he started the LineCrush codebase and built the company with Jay. His public timeline connects those steps to his current product engineering work.",
		sources: [aboutSource, resumeSource, linecrushSource]
	},
	{
		id: "faith-and-family", topic: "faith",
		patterns: [/\b(faith|christian|christ|jesus|god|testimony|belie(?:f|fs|ver)|father(?:hood)?|family|children|values|purpose|difficult period|challenging time)\b/],
		answer: "Austin describes himself as a father of two, a believer and a builder. After a difficult period in his life, he found faith in Jesus Christ and renewed purpose. His public testimony says faith shapes how he raises his children, treats people and approaches his work. He wants to serve God, provide for his family and build things that help people. SureWord is a direct expression of that purpose, built to support people in studying Scripture and their relationship with God.",
		sources: [{ label: "Faith and testimony", href: "/faith" }, aboutSource, surewordSource]
	},
	{
		id: "work-metrics", topic: "metrics",
		patterns: [/\b(hours?|metrics?|measur\w*|work[ -]?(log|ledger)|wakatime|contributions?|commits?|counts?|statistics|stats|throughput|productivity)\b/],
		answer: "Austin's Daily Work Log separates the clock time from first to last prompt, active prompting time, time at the computer and summed agent runtime. First to last prompt includes breaks and isn't hours worked. Active prompting only counts gaps of up to 30 minutes between prompts, so it misses long agent runs, review, testing and meetings and reads low. Time at the computer comes from keyboard and mouse input and is measured from November 18, 2026. Agent hours sum runtime across parallel sessions and aren't Austin's working hours. GitHub contributions include fleet commits. Days run from 4 AM to 4 AM Pacific. Only daily totals and public work buckets are published. Prompt text, code and private working directories stay off the public page.",
		sources: [{ label: "Daily Work Log and definitions", href: "/#work-log" }, c2Source, aboutSource]
	},
	{
		id: "engineering-stack", topic: "stack",
		patterns: [/\b(stack|technolog\w*|languages?|frameworks?|typescript|javascript|react|next\.?js|python|postgres(?:ql)?|redis|aws|vercel|docker|backend|frontend|full[ -]?stack|infrastructure|mcp|llm|ai sdk)\b/],
		answer: "Austin's production work spans Next.js, React and TypeScript on the web, Python and Node.js services, PostgreSQL and Redis, and AWS, Vercel, Ubuntu VPS and Docker infrastructure. He built LineCrush's native foundations in SwiftUI and Kotlin with Jetpack Compose. SureWord uses Next.js, AI SDK, PostgreSQL and pgvector, Expo on Android and SwiftUI on Apple devices. His applied AI work includes multi-provider features, retrieval, streaming and developer tooling. The case studies tie those technologies to released products and specific ownership.",
		sources: [resumeSource, linecrushSource, surewordSource]
	},
	{
		id: "team-collaboration", topic: "collaboration",
		patterns: [/\b(collaborat\w*|team(?:work)?|co[ -]?founder|leadership|lead(?:ing)?|jay|work(?:ing)? with|mentor\w*|communication)\b/],
		answer: "Austin started LineCrush's first implementation, then built the product with co-founder Jay. As CTO he works across technical direction, product implementation, operations and release maintenance. He designed C2 and the engineering fleet, and he and Jay operate it together. Current product delivery includes substantial fleet implementation and release work, so team output is distinct from Austin's personal coding. His earlier web development teaching at Bitwise and Geekwise also gives concrete context for explaining software and helping others build it.",
		sources: [linecrushSource, c2Source, aboutSource]
	},
	{
		id: "paid-client-work", topic: "clients",
		patterns: [/\b(clients?|freelanc\w*|consult\w*|paid work|local (business|websites?)|savealife|cpr|two cities|gelateria|effycient|customer websites?)\b/],
		answer: "Austin's public client work includes automated course registration for SaveALife CPR and a live catalog and inquiry site for Two Cities Off Road. His timeline also records paid full-stack development for Gelateria Del Centro during 2023 and 2024, owning implementation, content updates and search visibility. This adds direct business website work to his product portfolio. The public examples show delivered functionality without exposing private customer records or commercial details. His Fresno website service has its own page with the current offer and contact route.",
		sources: [workSource, { label: "Two Cities Off Road", href: "https://twocitiesoffroad.com/" }, { label: "Fresno business websites", href: "/local-websites" }]
	},
	{
		id: "public-code", topic: "opensource",
		patterns: [/\b(open[ -]?source|tty7|pull request|github|public code|code sample|react[ -]steam[ -]deck|npm)\b/],
		answer: "Austin has three PRs merged into tty7: #694 for Kimi Code support, #877 for the terminal session-exit fix, and #1164 for jumping to the longest-waiting agent. As of November 19, 2026, #1163, #1165, #1166, and #1167 are open and #1174 is an open draft. Austin also published react-steam-deck on npm and open-sourced MCP servers for Neon Postgres and Perplexity search.",
		sources: [{ label: "tty7 pull requests and statuses", href: "/work/independent#tty7" }, { label: "react-steam-deck on npm", href: "https://www.npmjs.com/package/react-steam-deck" }, workSource]
	},
	{
		id: "why-looking", topic: "contact",
		patterns: [/\b(why (?:is|did|would|does) (?:he|austin) .{0,40}(?:leav\w*|look\w*|step\w*|mov\w*|quit\w*)|leav\w* line\s?crush|stepp\w* (?:back|away|down)|job (?:search|hunt)|look\w* for (?:a|his next|another|new) (?:job|role|position)|still (?:at|with) line\s?crush|next (?:job|role))\b/, /\b(leav\w*|stepp\w*|quit\w*|looking|job search|co-?founder still|what happened)\b/, /\bwhy\b.{0,50}\b(leav\w*|looking|stepp\w*|quit\w*)|\b(leav\w*|quit\w*) .{0,20}line\s?crush\b/, /\b(leav\w*|stepp\w* (?:back|away|down)|quit\w*)\b/],
		answer: "Austin is looking for his next full-time, hands-on engineering job. LineCrush is stable, with live products and paying customers, and the platform and agent fleet he built now run day to day without needing him full time. He and co-founder Jay worked well together throughout and Austin remains a co-founder. What he loves is building and learning new things, and he wants to do that full time on a team again. He wrote about the decision in his November 19, 2026 post.",
		sources: [{ label: "LineCrush Doesn't Need Me Full Time Anymore", href: "/blog/2026-11-19-linecrush-doesnt-need-me-full-time-anymore" }, resumeSource, { label: "Contact Austin", href: "/#contact" }]
	},
	{
		id: "contact", topic: "contact",
		patterns: [/\b(contact|reach|email|e-mail|hire|hiring|available|availability|schedule|interview|remote|hybrid|on-?site|in[ -]person|office|relocat\w*|location|based|timezone|time zone|fresno)\b/],
		answer: "Austin is looking for his next full-time, hands-on engineering job, and is also open to contracts and consulting. He is open to remote, hybrid or in-office work and would relocate for the right job. He is based in Fresno, California, in Pacific Time. His public résumé and portfolio contact form are the best starting points for discussing a role, a contract or a project. The résumé page also lists spragginsdesigns@gmail.com. Start date, scope and terms are for a conversation with Austin. For an engineering evaluation, the LineCrush and SureWord case studies provide specific product responsibilities and released work to discuss.",
		sources: [{ label: "Contact Austin", href: "/#contact" }, resumeSource, linecrushSource]
	},
	{
		id: "engineering-level", topic: "fit",
		patterns: [/\b(junior|senior|seniority|mid[ -]?level|entry[ -]?level|staff|principal|expert\w*|skilled|talented|beginner|novice)\b/, /\b(?:how|what) (?:good|strong|experienced|senior|skilled|level)\b/, /\b(?:any|actually|really) good\b/],
		answer: "Austin's public record is senior-level engineering. He has been co-founder and CTO of LineCrush since April 2024, started its codebase, and owns architecture, releases and production problems across web, backend, data and two native apps, working with co-founder Jay. Dated examples of the judgment involved: he moved every account from Auth0 to Clerk without changing a user ID (June 19, 2026), took the web app to a Vercel Real Experience Score of 100 (March 16, 2026), and designed C2, which replaced Linear in 12 days after a full comparison of 18,931 issues found zero mismatches. Outside reviewers have passed his releases at Apple, Google Play, Valve and OpenAI. The limit is team scale: LineCrush is a two-founder company, so the record shows no management of a large engineering team.",
		sources: [resumeSource, linecrushSource, c2Source]
	},
	{
		id: "learning-speed", topic: "fit",
		patterns: [/\b(learn\w*|ramp\w*|onboard\w*|up to speed|pick(?:s|ed|ing)? (?:it |things? |that )?up|adapt\w*|unfamiliar|under pressure|deadlines?)\b/, /\b(?:new|different|another|our|unfamiliar) (?:domain|business|industry|codebase|stack|product|field|team|company)\b/, /\bhow (?:fast|quick\w*|long|soon)\b.{0,60}\b(?:learn\w*|ramp\w*|onboard\w*|productive|contribut\w*|up to speed|understand\w*)\b/],
		answer: `Austin's record is of learning new ground quickly while shipping on it. He joined the project that became LineCrush as CTO in April 2024, started its codebase on May 2, and its first paying customer came in late November 2024. He writes that he did not know how to build most of the platform's parts then, including native mobile apps, backend servers and infrastructure, and learned each one because the product needed it. Dated first attempts since: LineCrush's Android app went from first commit to Google Play production in 65 days and the iOS app was approved 88 days after its first native commit, his first Steam game went from first playable to release in ${STATS.firstGameToSteamDays} days, LineCrush's ChatGPT plugin was submitted on October 19, 2026 and approved on November 2, and C2 replaced Linear 12 days after its written contract. The limit of this record is that it comes from one company and his own products, so it does not show him joining an existing team in another industry.`,
		sources: [{ label: "LineCrush Doesn't Need Me Full Time Anymore", href: "/blog/2026-11-19-linecrush-doesnt-need-me-full-time-anymore" }, linecrushSource, resumeSource]
	},
	{
		id: "engineering-fit", topic: "fit",
		patterns: [/\b(why (?:should|would)|good fit|strengths?|qualif\w*|experience|resume|résumé|senior|product engineer|role|candidate|evaluate|proof|evidence|portfolio|projects|products|accomplishments?|achievements?|shipped work)\b/],
		answer: "Austin's strongest public evidence is end-to-end product ownership: starting LineCrush's codebase, co-building it with Jay, implementing native app foundations, handling release failures, and designing C2 and the engineering fleet. SureWord shows independent applied AI and cross-platform product work. Gunmetal Orbit adds a commercial Steam release, while client sites and the tty7 contribution provide other inspectable examples. That supports a discussion about full-stack product, mobile and applied AI roles. The résumé and case studies provide concrete starting points rather than a guarantee of fit for every team.",
		sources: [resumeSource, linecrushSource, surewordSource]
	}
];

/** Every curated public fact, for the ask agent's portfolio search. */
export const portfolioEvidence: readonly PortfolioEvidence[] = [overviewEvidence, ...entries];

const explicitTopics = /\b(line\s?crush|c2|sure\s?word|gunmetal|steam|godot|tty7|savealife|two cities|gelateria|faith|jesus|christian|truck\w*|bitwise|geekwise|college|contact|email|resume|résumé|work[ -]?(log|ledger))\b/;
const contextualFollowUp = /^(?:(?:and|also|but|so)\s+)?(?:what about\b|how about\b|what (?:did|does|has|is|was) (?:he|it|that|this|his)\b|how (?:did|does|has|is|was|would|can) (?:he|it|that|this)\b|(?:can|could) you (?:explain|expand|elaborate)\b|tell me more\b|more (?:detail|about)\b|why\b|how\??$|examples?\??$)/;
const generalAbout = /^(?:(?:tell me|what can you tell me|give me (?:an? )?(?:overview|summary)) (?:about )?|who (?:is|was) )?(?:austin(?: spraggins)?|yourself|him)[?.!\s]*$/;
const focusPatterns: Partial<Record<Topic, RegExp>> = {
	native: /\b(native|swiftui|kotlin|jetpack|android|ios|iphone|ipad|mobile)\b/,
	linecrush: /\bline\s?crush\b/,
	fleet: /\b(c2|fleet|agents?|autonomous)\b/,
	sureword: /\bsure\s?word\b/,
	grounding: /\b(ground(?:ed|ing)?|hallucinat\w*|canonical|quot(?:e|es|ation|ations)|semantic|keyword|vector)\b/,
	reliability: /\b(reliab\w*|debug\w*|bugs?|regression|empty state|app review)\b/,
	games: /\b(gunmetal|steam|godot|roguelite)\b/,
	metrics: /\b(work[ -]?(log|ledger)|hours?|metrics?|contributions?|commits?)\b/
};

function normalize(question: string): string {
	return question.toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, " ").trim();
}

function rankedEntries(question: string): { entry: Entry; score: number }[] {
	return entries.map((entry) => ({
		entry,
		score: entry.patterns.reduce((score, pattern) => score + (pattern.test(question) ? 1 : 0), 0)
			+ (focusPatterns[entry.topic]?.test(question)
				? (entry.topic === "linecrush" || entry.topic === "sureword" ? 2 : 3)
				: 0)
	})).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score);
}

/** Select public evidence without allowing old topics to swamp a new question. */
export function selectPortfolioEvidence(question: string, previousQuestion?: string): PortfolioEvidence[] {
	const current = normalize(question);
	if (!current) return [];
	if (generalAbout.test(current) || /^(?:about|overview|summary|introduce (?:austin|yourself))[?.!\s]*$/.test(current)) {
		return [overviewEvidence];
	}

	const ranked = rankedEntries(current);
	const contextual = current.split(/\s+/).length <= 14 && contextualFollowUp.test(current) && !explicitTopics.test(current);
	const refersBack = /\b(it|that|this|he|his|him)\b/.test(current)
		|| /^(?:tell me more|more details?|why|how|examples?)[?.!\s]*$/.test(current)
		|| /^(?:can|could) you (?:explain|expand|elaborate)[?.!\s]*$/.test(current);
	if (contextual && previousQuestion && (ranked.length > 0 || refersBack)) {
		const normalizedPrevious = normalize(previousQuestion);
		const prior = rankedEntries(normalizedPrevious)[0]?.entry;
		if (prior) {
			// A short follow-up can refine a known product, while a new named
			// subject always selects its own evidence above.
			if (!ranked.some(({ entry }) => entry.id === prior.id)) ranked.push({ entry: prior, score: 0 });
		} else if (!ranked.length && generalAbout.test(normalizedPrevious)) {
			return [overviewEvidence];
		}
	}

	return ranked.slice(0, 3).map(({ entry: { id, answer, sources } }) => ({ id, answer, sources }));
}
