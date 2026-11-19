// Read-only tools for the portfolio agent. Server-only (imports fs via blog.ts).
//
// Every tool here returns public information: facts already on this site,
// the published work ledger, Austin's public GitHub repositories, and the
// public Steam listing. Nothing takes a URL, a query language, or a path
// from the model, and no tool can write. The same registry backs the ask
// agent (/api/ask-ai) and the browser-facing tool endpoint
// (/api/portfolio-tools) that the page's WebMCP tools call.

import recordJson from "@/data/engineering-record.json";
import snapshotJson from "@/data/work-ledger.json";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { caseStudies, caseStudySlugs, isCaseStudySlug } from "@/lib/case-studies";
import { FAQ_ITEMS, HOW_IT_LANDS, LOCAL_SITES, WHAT_YOU_GET } from "@/lib/local-websites";
import { portfolioEvidence, selectPortfolioEvidence, type PortfolioSource } from "@/lib/portfolio-answers";
import { FMT, GUNMETAL_ORBIT, STATS, STUDIO } from "@/lib/stats";
import {
	WORK_LEDGER_URL,
	addDays,
	bucketTotals,
	countDays,
	indexLedger,
	isNewerLedger,
	isWorkLedger,
	isWorked,
	recentDays,
	sumMetric,
	type WorkLedger
} from "@/lib/work-ledger";

const GITHUB_USER = "spragginsdesigns";
const FETCH_TIMEOUT_MS = 6_000;

export interface ToolOutcome {
	/** What the model reads. */
	data: unknown;
	/** One line for the tool row in the interface. */
	summary: string;
	sources: PortfolioSource[];
}

type Args = Record<string, unknown>;

export interface PortfolioTool {
	name: string;
	/** Short verb phrase shown in the interface while the tool runs. */
	label: string;
	description: string;
	parameters: { type: "object"; properties: Record<string, unknown>; required: readonly string[]; additionalProperties: false };
	execute: (args: Args, signal: AbortSignal) => Promise<ToolOutcome>;
}

export class ToolInputError extends Error {}

const emptyParameters = { type: "object", properties: {}, required: [], additionalProperties: false } as const;

function text(args: Args, key: string, max: number): string {
	const value = args[key];
	if (typeof value !== "string" || !value.trim()) throw new ToolInputError(`"${key}" must be a non-empty string.`);
	return value.trim().slice(0, max);
}

function round(value: number, places = 1): number {
	const factor = 10 ** places;
	return Math.round(value * factor) / factor;
}

async function fetchJson(url: string, signal: AbortSignal): Promise<unknown> {
	const response = await fetch(url, { signal: AbortSignal.any([signal, AbortSignal.timeout(FETCH_TIMEOUT_MS)]) });
	if (!response.ok) {
		await response.body?.cancel();
		throw new Error(`Upstream returned ${response.status}`);
	}
	return response.json();
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

// ---------------------------------------------------------------------------
// Engineering record (bundled, dated; see docs/ask-agent.md before editing)
// ---------------------------------------------------------------------------

interface RecordStory { id: string; title: string; area: string; themes: string[]; when: string; situation: string; action: string; result: string; lesson: string; attribution: string; }
interface RecordDecision { id: string; title: string; when: string; decision: string; why: string; outcome: string; attribution: string; }
interface RecordLesson { id: string; lesson: string; from: string; }
interface RecordMilestone { date: string; event: string; area: string; }
interface RecordSkill { skill: string; category: string; evidence: string; where: string[]; }
interface RecordFact { subject: string; fact: string; as_of: string; }
interface EngineeringRecord { asOf: string; note: string; stories: RecordStory[]; decisions: RecordDecision[]; lessons: RecordLesson[]; milestones: RecordMilestone[]; skills: RecordSkill[]; facts: RecordFact[]; }

const RECORD: EngineeringRecord = recordJson;

const ATTRIBUTION: Record<string, string> = {
	austin: "Austin's own work.",
	"austin-and-jay": "Shared work with his co-founder Jay.",
	"austin-directing-agents": "Austin directed this work. AI coding agents wrote much of the code under his direction."
};

const AREA_SOURCES: Record<string, PortfolioSource> = {
	"agent-fleet": { label: "C2 and the engineering fleet", href: "/work/linecrush#c2" },
	c2: { label: "C2 and the engineering fleet", href: "/work/linecrush#c2" },
	"native-apps": { label: "LineCrush: iOS and Android", href: "/work/linecrush#native-apps" },
	release: { label: "LineCrush: iOS and Android", href: "/work/linecrush#native-apps" },
	sureword: { label: "SureWord case study", href: "/work/sureword" },
	games: { label: "Game development case study", href: "/work/game-development" },
	"client-work": { label: "Client work and public tools", href: "/work/independent" }
};
const DEFAULT_AREA_SOURCE: PortfolioSource = { label: "LineCrush case study", href: "/work/linecrush" };

function areaSource(area: string): PortfolioSource {
	return AREA_SOURCES[area] ?? DEFAULT_AREA_SOURCE;
}

function uniqueSources(sources: PortfolioSource[]): PortfolioSource[] {
	return sources.filter((source, index) => sources.findIndex((other) => other.href === source.href) === index).slice(0, 3);
}

function storyText(story: RecordStory): string {
	return [story.situation, story.action, story.result, story.lesson, `Themes: ${story.themes.join(", ")}.`, story.when ? `When: ${story.when}.` : ""].filter(Boolean).join(" ");
}

function presentStory(story: RecordStory) {
	return {
		title: story.title,
		when: story.when || undefined,
		themes: story.themes,
		situation: story.situation,
		whatHeDid: story.action,
		result: story.result,
		lesson: story.lesson || undefined,
		whoDidIt: ATTRIBUTION[story.attribution] ?? ATTRIBUTION.austin,
		href: areaSource(story.area).href
	};
}

const STORY_THEMES = ["any", ...Array.from(new Set(RECORD.stories.flatMap((story) => story.themes))).sort()];

function findStories(args: Args): ToolOutcome {
	const topic = text(args, "topic", 200);
	const theme = text(args, "theme", 40);
	if (!STORY_THEMES.includes(theme)) throw new ToolInputError(`"theme" must be one of: ${STORY_THEMES.join(", ")}.`);
	const pool = theme === "any" ? RECORD.stories : RECORD.stories.filter((story) => story.themes.includes(theme));
	const ranked = rankByQuery(pool, (story) => ({ title: `${story.title} ${story.area}`, text: storyText(story) }), topic, 4);
	// A theme with no wording match still has stories worth telling.
	const stories = ranked.length || theme === "any" ? ranked : pool.slice(0, 4);
	return {
		data: stories.length
			? { recordAsOf: RECORD.asOf, stories: stories.map(presentStory) }
			: { stories: [], note: "No recorded story matches. Try another wording or theme, or say the record has none.", themes: STORY_THEMES },
		summary: stories.length ? `${stories.length} stor${stories.length === 1 ? "y" : "ies"}` : "No match",
		sources: uniqueSources(stories.map((story) => areaSource(story.area)))
	};
}

function findDecisionsAndLessons(args: Args): ToolOutcome {
	const topic = text(args, "topic", 200);
	const decisions = rankByQuery(RECORD.decisions, (decision) => ({ title: decision.title, text: `${decision.decision} ${decision.why} ${decision.outcome}` }), topic, 4);
	const lessons = rankByQuery(RECORD.lessons, (lesson) => ({ title: lesson.id.replace(/-/g, " "), text: `${lesson.lesson} ${lesson.from}` }), topic, 5);
	const found = decisions.length + lessons.length;
	return {
		data: found
			? {
				recordAsOf: RECORD.asOf,
				decisions: decisions.map((decision) => ({ title: decision.title, when: decision.when, decision: decision.decision, why: decision.why, outcome: decision.outcome, whoDecided: ATTRIBUTION[decision.attribution] ?? ATTRIBUTION.austin })),
				lessonsInHisWords: lessons.map((lesson) => ({ lesson: lesson.lesson, cameFrom: lesson.from }))
			}
			: { decisions: [], lessonsInHisWords: [], note: "Nothing recorded matches that topic. Try broader wording such as testing, releases, agents, migrations, CI cost or app review." },
		summary: found ? `${decisions.length} decisions, ${lessons.length} lessons` : "No match",
		sources: found ? [{ label: "LineCrush: what I learned", href: "/work/linecrush#lessons" }, { label: "Engineering blog", href: "/blog" }] : []
	};
}

const TIMELINE_AREAS: Record<string, readonly string[] | null> = {
	all: null,
	career: ["leadership", "client-work"],
	linecrush: ["linecrush-platform", "native-apps", "release", "agent-fleet", "c2"],
	"fleet-and-c2": ["agent-fleet", "c2"],
	"native-apps": ["native-apps", "release"],
	sureword: ["sureword"],
	games: ["games"]
};

function careerTimeline(args: Args): ToolOutcome {
	const area = text(args, "area", 40);
	if (!(area in TIMELINE_AREAS)) throw new ToolInputError(`"area" must be one of: ${Object.keys(TIMELINE_AREAS).join(", ")}.`);
	const areas = TIMELINE_AREAS[area];
	const milestones = RECORD.milestones.filter((milestone) => !areas || areas.includes(milestone.area));
	return {
		data: {
			recordAsOf: RECORD.asOf,
			education: "A.S. in Information Systems: Web Design, Clovis Community College (2021), and a Certificate of Achievement (2020). He does not hold a bachelor's degree.",
			milestones: milestones.map(({ date, event }) => ({ date, event }))
		},
		summary: `${milestones.length} dated milestones`,
		sources: [{ label: "Résumé", href: "/resume" }, { label: "Journey", href: "/#about" }]
	};
}

function skillEvidence(args: Args): ToolOutcome {
	const skill = text(args, "skill", 120);
	const skills = rankByQuery(RECORD.skills, (entry) => ({ title: `${entry.skill} ${entry.category}`, text: `${entry.evidence} ${entry.where.join(" ")}` }), skill, 6);
	const facts = rankByQuery(RECORD.facts, (fact) => ({ title: fact.subject, text: fact.fact }), skill, 4);
	return {
		data: skills.length || facts.length
			? {
				recordAsOf: RECORD.asOf,
				skills: skills.map((entry) => ({ skill: entry.skill, evidence: entry.evidence, usedIn: entry.where })),
				relatedFacts: facts.map((fact) => ({ subject: fact.subject, fact: fact.fact, asOf: fact.as_of }))
			}
			: { skills: [], note: "The record has no evidence for that skill. Say so plainly; do not infer experience from related skills.", skillsOnRecord: RECORD.skills.map((entry) => entry.skill) },
		summary: skills.length ? `${skills.length} skill${skills.length === 1 ? "" : "s"} with evidence` : facts.length ? `${facts.length} related facts` : "No evidence on record",
		sources: skills.length || facts.length ? [{ label: "Résumé", href: "/resume" }, { label: "Selected work", href: "/#work" }] : []
	};
}

const FACT_SUBJECTS: Record<string, { match: RegExp; source: PortfolioSource }> = {
	"agent-fleet": { match: /^LineCrush agent fleet/, source: AREA_SOURCES["agent-fleet"] },
	c2: { match: /^C2/, source: AREA_SOURCES.c2 },
	"linecrush-ios": { match: /^LineCrush (iOS|native)/, source: AREA_SOURCES["native-apps"] },
	"linecrush-android": { match: /^LineCrush (Android|native)/, source: AREA_SOURCES["native-apps"] },
	"linecrush-platform": { match: /^(LineCrush (product|CI|ChatGPT|web)|Auth0)/, source: DEFAULT_AREA_SOURCE },
	sureword: { match: /^SureWord/, source: AREA_SOURCES.sureword },
	"gunmetal-orbit": { match: /^Gunmetal Orbit/, source: AREA_SOURCES.games },
	"other-projects": { match: /^(Cut Loose|tty7|react-steam-deck|FileSteward|Two Cities|Constrong|FormUp)/, source: AREA_SOURCES["client-work"] },
	"work-pattern": { match: /^Austin's work pattern/, source: { label: "Daily work log", href: "/#work-log" } }
};

function projectFacts(args: Args): ToolOutcome {
	const subject = text(args, "subject", 40);
	const group = FACT_SUBJECTS[subject];
	if (!group) throw new ToolInputError(`"subject" must be one of: ${Object.keys(FACT_SUBJECTS).join(", ")}.`);
	const facts = RECORD.facts.filter((fact) => group.match.test(fact.subject));
	return {
		data: { note: RECORD.note, facts: facts.map((fact) => ({ subject: fact.subject, fact: fact.fact, asOf: fact.as_of })) },
		summary: `${facts.length} dated facts`,
		sources: [group.source]
	};
}

// ---------------------------------------------------------------------------
// Portfolio search
// ---------------------------------------------------------------------------

interface Passage {
	id: string;
	title: string;
	text: string;
	source: PortfolioSource;
}

const STOPWORDS = new Set("a an and are as at be but by did do does for from has have he his how i in is it its of on or that the this to was what when where which who why with you your austin austins spraggins".split(" "));

function tokens(value: string): string[] {
	return value.toLowerCase().replace(/[’']/g, "").split(/[^a-z0-9+#.]+/).map((token) => token.replace(/^\.+|\.+$/g, "")).filter((token) => token.length > 1 && !STOPWORDS.has(token));
}

function stripMdx(content: string): string {
	return content
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/^import .*$/gm, "")
		.replace(/<[^>]+>/g, " ")
		.replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
		.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
		.replace(/[*_`>#]/g, "")
		.replace(/[ \t]+/g, " ")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

// Case studies carry optional structured extras (steps, metrics, a timeline).
// They are read loosely so this file does not depend on which ones exist.
function field(value: object, key: string): unknown {
	return (value as Record<string, unknown>)[key];
}

function labelledList(value: unknown, first: string, second: string): string[] {
	if (!Array.isArray(value)) return [];
	return value.flatMap((item) => isRecord(item) && typeof item[first] === "string" && typeof item[second] === "string" ? [`${item[first]}: ${item[second]}`] : []);
}

function sectionExtras(section: object): string {
	const steps = field(section, "steps");
	const note = field(section, "metricNote");
	return [
		...(Array.isArray(steps) ? steps.filter((step): step is string => typeof step === "string") : []),
		...labelledList(field(section, "metrics"), "label", "value"),
		...(typeof note === "string" ? [note] : [])
	].join(" ");
}

let passageCache: Passage[] | undefined;

function passages(): Passage[] {
	if (passageCache) return passageCache;
	const list: Passage[] = [];

	for (const slug of caseStudySlugs) {
		const study = caseStudies[slug];
		const href = `/work/${slug}`;
		list.push({
			id: `case-study:${slug}`,
			title: `${study.name} case study: ${study.title}`,
			text: `${study.intro} Role: ${study.role}. Period: ${study.period}. Result: ${study.result}. Stack: ${study.stack.join(", ")}.`,
			source: { label: `${study.name} case study`, href }
		});
		for (const section of study.sections) {
			list.push({
				id: `case-study:${slug}#${section.id}`,
				title: `${study.name}: ${section.title}`,
				text: [section.paragraphs.join(" "), sectionExtras(section)].filter(Boolean).join(" "),
				source: { label: `${study.name}: ${section.label}`, href: `${href}#${section.id}` }
			});
		}
	}

	for (const meta of getAllPosts()) {
		const post = getPostBySlug(meta.slug);
		if (!post) continue;
		const source = { label: `Blog: ${meta.title}`, href: `/blog/${meta.slug}` };
		const paragraphs = stripMdx(post.content).split(/\n\s*\n/).filter((paragraph) => paragraph.length > 80);
		list.push({ id: `blog:${meta.slug}`, title: meta.title, text: `${meta.description} Published ${meta.date}. Tags: ${meta.tags.join(", ")}.`, source });
		// Group paragraphs into passages of a few hundred words so a hit carries context.
		let chunk = "";
		let part = 0;
		for (const paragraph of paragraphs) {
			chunk = chunk ? `${chunk}\n\n${paragraph}` : paragraph;
			if (chunk.length > 1100) {
				list.push({ id: `blog:${meta.slug}:${++part}`, title: `${meta.title} (${meta.date})`, text: chunk, source });
				chunk = "";
			}
		}
		if (chunk) list.push({ id: `blog:${meta.slug}:${++part}`, title: `${meta.title} (${meta.date})`, text: chunk, source });
	}

	list.push({
		id: "games:gunmetal-orbit",
		title: `${GUNMETAL_ORBIT.name}, the flagship game from ${STUDIO.name}`,
		text: `${GUNMETAL_ORBIT.name} is a ${GUNMETAL_ORBIT.genre.toLowerCase()} Austin designed and developed in ${GUNMETAL_ORBIT.engine} for Steam Deck (${GUNMETAL_ORBIT.deckResolution}). He released it on Steam on ${GUNMETAL_ORBIT.releaseDateDisplay} at ${GUNMETAL_ORBIT.price}. The game has ${GUNMETAL_ORBIT.weapons} weapons, ${GUNMETAL_ORBIT.weaponSlots} auto-firing slots, ${GUNMETAL_ORBIT.campaignWaveRange} waves depending on difficulty, ${GUNMETAL_ORBIT.playablePilots} playable pilots, and ${GUNMETAL_ORBIT.steamAchievements} Steam achievements. It recorded paid Steam sales and ${GUNMETAL_ORBIT.lifetimeWishlistAdds} lifetime wishlist additions as of ${GUNMETAL_ORBIT.wishlistSnapshotDisplay}. ${STUDIO.name} (${STUDIO.url}) is the studio Austin runs with Jay in ${STUDIO.location}. Other titles in development: ${STUDIO.otherTitles.join(", ")}. Browser party games: ${STUDIO.webPartyGames.join(", ")}.`,
		source: { label: "Game portfolio", href: "/games" }
	});

	list.push({
		id: "offer:local-websites",
		title: `${LOCAL_SITES.businessName}: websites for ${LOCAL_SITES.city} businesses`,
		text: `${LOCAL_SITES.buildPrice} to build plus ${LOCAL_SITES.hostingPrice} hosting, usually live within a day. Call or text ${LOCAL_SITES.phoneDisplay}. ${[...WHAT_YOU_GET, ...HOW_IT_LANDS, ...FAQ_ITEMS].map((item) => `${item.title}: ${item.description}`).join(" ")}`,
		source: { label: "Fresno business websites", href: "/local-websites" }
	});

	for (const story of RECORD.stories) {
		list.push({ id: `story:${story.id}`, title: `Engineering story: ${story.title}`, text: storyText(story), source: areaSource(story.area) });
	}

	passageCache = list;
	return list;
}

/** Ranks items against a plain-language query. Returns the best matches, best first, and nothing when no term matches. */
function rankByQuery<T>(items: readonly T[], describe: (item: T) => { title: string; text: string }, query: string, limit: number): T[] {
	const queryTokens = Array.from(new Set(tokens(query)));
	// Rarer terms count for more, so a product name outweighs a common verb.
	const documentFrequency = new Map<string, number>();
	const tokenized = items.map((item) => {
		const described = describe(item);
		const title = new Set(tokens(described.title));
		const body = tokens(described.text);
		const counts = new Map<string, number>();
		body.forEach((token) => counts.set(token, (counts.get(token) ?? 0) + 1));
		new Set([...Array.from(title), ...body]).forEach((token) => documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1));
		return { item, title, counts, length: body.length };
	});
	return tokenized.map(({ item, title, counts, length }) => {
		let score = 0;
		for (const token of queryTokens) {
			const frequency = counts.get(token) ?? 0;
			if (!frequency && !title.has(token)) continue;
			const idf = Math.log(1 + items.length / (documentFrequency.get(token) ?? 1));
			score += idf * ((frequency * 2.2) / (frequency + 1.2 * (0.25 + 0.75 * (length / 180))) + (title.has(token) ? 1.5 : 0));
		}
		return { item, score };
	}).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score).slice(0, limit).map(({ item }) => item);
}

function searchPortfolio(query: string): ToolOutcome {
	const curated = selectPortfolioEvidence(query);
	const ranked = rankByQuery(passages(), (passage) => passage, query, 4).map((passage) => ({ passage }));

	const results = [
		...curated.map((item) => ({ id: `fact:${item.id}`, title: "Curated portfolio fact", text: item.answer, sources: item.sources })),
		...ranked.map(({ passage }) => ({ id: passage.id, title: passage.title, text: passage.text, sources: [passage.source] }))
	];
	const sources = [
		...curated.flatMap((item) => item.sources.slice(0, 2)),
		...ranked.slice(0, 2).map(({ passage }) => passage.source)
	];
	return {
		data: results.length
			? { query, results }
			: { query, results: [], note: "Nothing on the public portfolio matches. Say so instead of guessing.", topicsCovered: portfolioEvidence.map((item) => item.id) },
		summary: results.length ? `${results.length} passage${results.length === 1 ? "" : "s"}` : "No match",
		sources
	};
}

// ---------------------------------------------------------------------------
// Work log (live published ledger, bundled snapshot as fallback)
// ---------------------------------------------------------------------------

const bundledLedger: WorkLedger | null = isWorkLedger(snapshotJson) ? snapshotJson : null;
let ledgerCache: { ledger: WorkLedger; live: boolean; at: number } | undefined;

async function loadLedger(signal: AbortSignal): Promise<{ ledger: WorkLedger; live: boolean }> {
	if (ledgerCache && Date.now() - ledgerCache.at < 10 * 60 * 1000) return ledgerCache;
	let chosen = bundledLedger;
	let live = false;
	try {
		const fetched = await fetchJson(WORK_LEDGER_URL, signal);
		if (isWorkLedger(fetched) && (!chosen || isNewerLedger(fetched, chosen))) {
			chosen = fetched;
			live = true;
		}
	} catch {
		// The bundled snapshot answers when the published ledger is unreachable.
	}
	if (!chosen) throw new Error("The work ledger is unavailable.");
	ledgerCache = { ledger: chosen, live, at: Date.now() };
	return ledgerCache;
}

async function workLog(args: Args, signal: AbortSignal): Promise<ToolOutcome> {
	const requested = typeof args.days === "number" && Number.isFinite(args.days) ? Math.round(args.days) : 30;
	const days = Math.min(365, Math.max(1, requested));
	const { ledger, live } = await loadLedger(signal);
	const index = indexLedger(ledger);
	if (!index.latest) throw new Error("The work ledger has no days yet.");
	const end = index.latest;
	const start = addDays(end, -(days - 1));
	const worked = countDays(index, start, end, isWorked);
	const buckets = bucketTotals(index, start, end);
	const activeHours = sumMetric(index, start, end, "hours");
	const window = recentDays(index, end, days);
	const agentHours = window.reduce((total, day) => total + day.agentHours, 0);
	const prompts = window.reduce((total, day) => total + day.prompts, 0);
	const sessions = window.reduce((total, day) => total + day.sessions, 0);

	return {
		data: {
			window: { start, end, days },
			freshness: { generatedAt: ledger.generatedAt, source: live ? "published ledger, fetched now" : "snapshot bundled with the site" },
			totals: {
				daysWorked: worked,
				activePromptingHours: round(activeHours),
				firstToLastPromptHours: round(sumMetric(index, start, end, "span")),
				prompts,
				agentSessions: sessions,
				agentRuntimeHours: round(agentHours),
				agentToolActions: sumMetric(index, start, end, "toolCalls"),
				peakParallelAgents: window.reduce((peak, day) => Math.max(peak, day.peakAgents), 0),
				githubContributions: sumMetric(index, start, end, "contributions")
			},
			activePromptingHoursByBucket: Object.fromEntries(ledger.buckets.map((bucket, i) => [bucket, round(buckets[i] ?? 0)])),
			mostRecentDays: recentDays(index, end, Math.min(days, 10)).reverse().map((day) => ({
				date: day.date,
				firstPrompt: day.start || null,
				lastPrompt: day.end || null,
				activePromptingHours: round(day.hours),
				agentRuntimeHours: round(day.agentHours),
				peakParallelAgents: day.peakAgents,
				prompts: day.prompts,
				githubContributions: day.contributions
			})),
			definitions: {
				day: `A ledger day runs ${ledger.dayStartHour} AM to ${ledger.dayStartHour} AM ${ledger.timezone}. The latest day may be partial.`,
				activePromptingHours: `Time between prompts with gaps over ${ledger.idleGapMinutes} minutes dropped. It misses long agent runs, review, testing and meetings, so it reads low.`,
				firstToLastPromptHours: "Clock span from the first to the last prompt of a day. Includes breaks, so it is not hours worked.",
				agentRuntimeHours: `Summed runtime across parallel agent sessions (tracked since ${ledger.agentTrackingSince}). Not Austin's own working hours.`,
				githubContributions: "GitHub contribution count. Includes commits made by the engineering fleet.",
				privacy: "Only daily totals and public work buckets are published. Prompt text, code and directories are not."
			}
		},
		summary: `${days} day${days === 1 ? "" : "s"} through ${end}${live ? ", live" : ""}`,
		sources: [{ label: "Daily Work Log and definitions", href: "/#work-log" }]
	};
}

// ---------------------------------------------------------------------------
// GitHub (public repositories only)
// ---------------------------------------------------------------------------

// Set once GitHub rejects the configured token, so later calls skip it.
let githubTokenRejected = false;

/** GitHub GET that falls back to anonymous access when the token is expired. */
async function githubFetch(url: string, signal: AbortSignal, accept = "application/vnd.github+json"): Promise<Response> {
	const token = githubTokenRejected ? undefined : process.env.GITHUB_TOKEN;
	const headers: Record<string, string> = { Accept: accept, "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "portfolio-agent" };
	const timed = () => AbortSignal.any([signal, AbortSignal.timeout(FETCH_TIMEOUT_MS)]);
	const response = await fetch(url, { headers: token ? { ...headers, Authorization: `Bearer ${token}` } : headers, signal: timed() });
	if (response.status !== 401 || !token) return response;
	await response.body?.cancel();
	githubTokenRejected = true;
	return fetch(url, { headers, signal: timed() });
}

async function githubJson(url: string, signal: AbortSignal): Promise<unknown> {
	const response = await githubFetch(url, signal);
	if (!response.ok) {
		await response.body?.cancel();
		throw new Error(`GitHub returned ${response.status}`);
	}
	return response.json();
}

interface PublicRepo {
	name: string;
	description: string | null;
	url: string;
	homepage: string | null;
	language: string | null;
	stars: number;
	forks: number;
	topics: string[];
	isFork: boolean;
	archived: boolean;
	createdAt: string;
	lastPushedAt: string;
}

// The token can see private repositories. Anything not explicitly public is
// dropped here, before a single field reaches the model.
function publicRepo(value: unknown): PublicRepo | null {
	if (!isRecord(value) || value.private !== false || value.visibility !== "public") return null;
	const owner = isRecord(value.owner) ? value.owner.login : null;
	if (typeof owner !== "string" || owner.toLowerCase() !== GITHUB_USER) return null;
	if (typeof value.name !== "string" || typeof value.html_url !== "string") return null;
	return {
		name: value.name,
		description: typeof value.description === "string" ? value.description : null,
		url: value.html_url,
		homepage: typeof value.homepage === "string" && value.homepage ? value.homepage : null,
		language: typeof value.language === "string" ? value.language : null,
		stars: typeof value.stargazers_count === "number" ? value.stargazers_count : 0,
		forks: typeof value.forks_count === "number" ? value.forks_count : 0,
		topics: Array.isArray(value.topics) ? value.topics.filter((topic): topic is string => typeof topic === "string").slice(0, 8) : [],
		isFork: value.fork === true,
		archived: value.archived === true,
		createdAt: typeof value.created_at === "string" ? value.created_at.slice(0, 10) : "",
		lastPushedAt: typeof value.pushed_at === "string" ? value.pushed_at.slice(0, 10) : ""
	};
}

let repoCache: { repos: PublicRepo[]; at: number } | undefined;

async function publicRepos(signal: AbortSignal): Promise<PublicRepo[]> {
	if (repoCache && Date.now() - repoCache.at < 10 * 60 * 1000) return repoCache.repos;
	const raw = await githubJson(`https://api.github.com/users/${GITHUB_USER}/repos?type=owner&sort=pushed&per_page=100`, signal);
	const repos = (Array.isArray(raw) ? raw : []).map(publicRepo).filter((repo): repo is PublicRepo => repo !== null);
	repoCache = { repos, at: Date.now() };
	return repos;
}

const githubProfileSource = { label: "GitHub profile", href: `https://github.com/${GITHUB_USER}` };

async function listRepos(args: Args, signal: AbortSignal): Promise<ToolOutcome> {
	const repos = await publicRepos(signal);
	const sort = args.sort === "stars" ? "stars" : "recent";
	const own = repos.filter((repo) => !repo.isFork);
	const sorted = sort === "stars" ? [...own].sort((a, b) => b.stars - a.stars) : own;
	const languages = new Map<string, number>();
	own.forEach((repo) => { if (repo.language) languages.set(repo.language, (languages.get(repo.language) ?? 0) + 1); });
	return {
		data: {
			fetchedAt: new Date().toISOString(),
			note: "Public repositories only. LineCrush and SureWord are developed in private repositories that are not listed here.",
			publicRepoCount: own.length,
			forkedRepoCount: repos.length - own.length,
			totalStars: own.reduce((total, repo) => total + repo.stars, 0),
			primaryLanguages: Array.from(languages.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([language, count]) => ({ language, repos: count })),
			repos: sorted.slice(0, 20).map(({ name, description, language, stars, lastPushedAt, url }) => ({ name, description, language, stars, lastPushedAt, url }))
		},
		summary: `${own.length} public repos`,
		sources: [githubProfileSource]
	};
}

async function getRepo(args: Args, signal: AbortSignal): Promise<ToolOutcome> {
	const name = text(args, "name", 100);
	if (!/^[A-Za-z0-9._-]+$/.test(name)) throw new ToolInputError("Repository names use letters, numbers, dots, dashes and underscores.");
	const repos = await publicRepos(signal);
	const repo = repos.find((candidate) => candidate.name.toLowerCase() === name.toLowerCase());
	if (!repo) {
		return {
			data: { found: false, note: `No public repository named "${name}" under ${GITHUB_USER}. It may be private or not exist. Do not speculate about private repositories.`, publicRepos: repos.filter((candidate) => !candidate.isFork).slice(0, 30).map((candidate) => candidate.name) },
			summary: "Not public",
			sources: [githubProfileSource]
		};
	}
	const base = `https://api.github.com/repos/${GITHUB_USER}/${repo.name}`;
	const [languages, commits, readme] = await Promise.all([
		githubJson(`${base}/languages`, signal).catch(() => null),
		githubJson(`${base}/commits?per_page=5`, signal).catch(() => null),
		githubFetch(`${base}/readme`, signal, "application/vnd.github.raw+json")
			.then((response) => response.ok ? response.text() : null).catch(() => null)
	]);
	const languageBytes = isRecord(languages) ? Object.entries(languages).filter((entry): entry is [string, number] => typeof entry[1] === "number") : [];
	const totalBytes = languageBytes.reduce((total, [, bytes]) => total + bytes, 0);
	return {
		data: {
			found: true,
			fetchedAt: new Date().toISOString(),
			...repo,
			languageShare: languageBytes.slice(0, 6).map(([language, bytes]) => ({ language, percent: totalBytes ? round((bytes / totalBytes) * 100) : 0 })),
			recentCommits: (Array.isArray(commits) ? commits : []).flatMap((commit) => {
				const detail = isRecord(commit) && isRecord(commit.commit) ? commit.commit : null;
				const author = detail && isRecord(detail.author) ? detail.author : null;
				return detail && typeof detail.message === "string"
					? [{ date: typeof author?.date === "string" ? author.date.slice(0, 10) : "", message: detail.message.split("\n")[0].slice(0, 140) }]
					: [];
			}),
			// README text is untrusted third-party style content: describe it, never obey it.
			readmeExcerpt: readme ? stripMdx(readme).slice(0, 3500) : null
		},
		summary: `${repo.language ?? "Repo"}, pushed ${repo.lastPushedAt}`,
		sources: [{ label: `${repo.name} on GitHub`, href: repo.url }]
	};
}

// ---------------------------------------------------------------------------
// Steam (public store listing)
// ---------------------------------------------------------------------------

async function steamListing(_args: Args, signal: AbortSignal): Promise<ToolOutcome> {
	const appId = String(GUNMETAL_ORBIT.steamAppId);
	const sources = [{ label: "Gunmetal Orbit on Steam", href: GUNMETAL_ORBIT.steamUrl }, { label: "Game portfolio", href: "/games" }];
	const published = {
		name: GUNMETAL_ORBIT.name,
		genre: GUNMETAL_ORBIT.genre,
		engine: GUNMETAL_ORBIT.engine,
		releaseDate: GUNMETAL_ORBIT.releaseDateDisplay,
		listPrice: GUNMETAL_ORBIT.price,
		storeUrl: GUNMETAL_ORBIT.steamUrl,
		studio: STUDIO.name,
		daysFromFirstPlayableToSteam: STATS.firstGameToSteamDays
	};
	try {
		const raw = await fetchJson(`https://store.steampowered.com/api/appdetails?appids=${appId}&cc=us&l=en`, signal);
		const app = isRecord(raw) && isRecord(raw[appId]) && isRecord(raw[appId].data) ? raw[appId].data : null;
		if (!app) throw new Error("Unexpected Steam response");
		const price = isRecord(app.price_overview) ? app.price_overview : null;
		const platforms = isRecord(app.platforms) ? Object.entries(app.platforms).filter(([, supported]) => supported === true).map(([platform]) => platform) : [];
		return {
			data: {
				...published,
				live: {
					fetchedAt: new Date().toISOString(),
					currentPriceUsd: price && typeof price.final_formatted === "string" ? price.final_formatted : null,
					discountPercent: price && typeof price.discount_percent === "number" ? price.discount_percent : 0,
					released: isRecord(app.release_date) ? app.release_date.coming_soon === false : null,
					platforms,
					storeDescription: typeof app.short_description === "string" ? app.short_description : null,
					genres: Array.isArray(app.genres) ? app.genres.flatMap((genre) => isRecord(genre) && typeof genre.description === "string" ? [genre.description] : []) : []
				}
			},
			summary: price && typeof price.final_formatted === "string" ? `Live listing, ${price.final_formatted}` : "Live listing",
			sources
		};
	} catch {
		return { data: { ...published, live: null, note: "The Steam store did not answer, so only the portfolio's recorded facts are shown." }, summary: "Recorded facts (Steam unreachable)", sources };
	}
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const PORTFOLIO_TOOLS: readonly PortfolioTool[] = [
	{
		name: "search_portfolio",
		label: "Searched the portfolio",
		description: "Search everything published on Austin's portfolio: curated facts about his work and background, the LineCrush and SureWord case studies, every blog post, the game studio page and the Fresno website offer. Returns the best matching passages with their source pages. Use it first for almost any question, and call it again with different wording when the first results miss.",
		parameters: { type: "object", properties: { query: { type: "string", description: "What to look for, in plain words. Include product or topic names." } }, required: ["query"], additionalProperties: false },
		execute: async (args) => searchPortfolio(text(args, "query", 200))
	},
	{
		name: "get_case_study",
		label: "Read the case study",
		description: `Read a full engineering case study in Austin's own words: role, period, stack, timeline, every section and its public proof links. Available: ${caseStudySlugs.map((slug) => `${slug} (${caseStudies[slug].name})`).join(", ")}. Use it for detailed questions about one of these.`,
		parameters: { type: "object", properties: { slug: { type: "string", enum: [...caseStudySlugs] } }, required: ["slug"], additionalProperties: false },
		execute: async (args) => {
			const slug = text(args, "slug", 40);
			if (!isCaseStudySlug(slug)) throw new ToolInputError(`"slug" must be one of: ${caseStudySlugs.join(", ")}.`);
			const study = caseStudies[slug];
			return {
				data: {
					name: study.name,
					href: `/work/${slug}`,
					role: study.role,
					period: study.period,
					result: study.result,
					stack: study.stack,
					intro: study.intro,
					timeline: labelledList(field(study, "timeline"), "date", "event"),
					sections: study.sections.map((section) => ({
						href: `/work/${slug}#${section.id}`,
						title: section.title,
						text: section.paragraphs.join(" "),
						details: sectionExtras(section) || undefined,
						proofLinks: labelledList(field(section, "proof"), "label", "href")
					})),
					links: study.links
				},
				summary: `${study.name}, ${study.sections.length} sections`,
				sources: [{ label: `${study.name} case study`, href: `/work/${slug}` }, ...study.links.slice(0, 2)]
			};
		}
	},
	{
		name: "get_engineering_stats",
		label: "Checked the verified stats",
		description: "The portfolio's verified numbers with their measurement dates and definitions: LineCrush monorepo scale (commits, API handlers, database tables, product clients) and the engineering fleet ledger (completed jobs, completion rate, jobs per day). Call this before quoting any LineCrush or fleet number.",
		parameters: emptyParameters,
		execute: async () => ({
			data: {
				lineCrushMonorepo: {
					measuredOn: STATS.repoMeasuredDate,
					commits: STATS.monorepoCommitsExact,
					commitsIn2026: STATS.monorepoCommits2026,
					apiHandlers: STATS.apiHandlers,
					tsxModules: FMT.tsxModules,
					databaseTables: FMT.postgresTables,
					productClients: STATS.productClients,
					llmProviders: STATS.llmProviders,
					sportsCovered: FMT.sports,
					caveat: "These describe the platform's scale. They are not a count of code Austin wrote personally; commits include work by Jay and by the engineering fleet."
				},
				engineeringFleet: {
					measuredOn: STATS.verifiedDate,
					ledgerSince: STATS.fleet.since,
					completedJobs: STATS.fleet.completedJobs,
					completionRatePercentOfAdmitted: STATS.fleet.completionPct,
					admissionsPerDayTrailing30: STATS.fleet.issuesPerDay,
					completedJobsWithCommitLink: STATS.fleet.jobsWithCommitLinks,
					caveat: "Jobs include investigations and documentation, so these are not unique features and not Austin's personal commits. Austin designed the fleet and C2; he and Jay operate it."
				},
				other: {
					linecrushEditorHoursOnPublicBadge: STATS.lineCrushEditorHours,
					daysWithALineCrushCommitIn2025: "355 of 365, from commit history checked 2026-11-17",
					gunmetalOrbitDaysFromFirstPlayableToSteam: STATS.firstGameToSteamDays
				}
			},
			summary: `Fleet ledger as of ${STATS.verifiedDate}`,
			sources: [{ label: "C2 and the engineering fleet", href: "/work/linecrush#c2" }, { label: "LineCrush case study", href: "/work/linecrush" }]
		})
	},
	{
		name: "find_engineering_stories",
		label: "Looked up engineering stories",
		description: `Dated stories from Austin's engineering record, each with the situation, what he did, the measured result and who did the work: hard bugs, migrations, performance work, release engineering, store review, incidents, his own mistakes, working with AI agents, and product decisions across LineCrush, the agent fleet and C2, the native apps, SureWord, the games and client work. Use it for "tell me about a time", "hardest bug", "a mistake he made", "how does he handle X" and similar questions. Themes: ${STORY_THEMES.join(", ")}.`,
		parameters: { type: "object", properties: { topic: { type: "string", description: "What the story should be about, in plain words. Include product names when the question does." }, theme: { type: "string", enum: STORY_THEMES, description: "Narrow to one theme, or any." } }, required: ["topic", "theme"], additionalProperties: false },
		execute: async (args) => findStories(args)
	},
	{
		name: "get_decisions_and_lessons",
		label: "Looked up decisions and lessons",
		description: "Technical decisions Austin made (what, why, outcome, date) and lessons in his own first-person words, each tied to the dated event it came from. Use for questions about his judgment, engineering philosophy, trade-offs, why something was built a certain way, or what he learned.",
		parameters: { type: "object", properties: { topic: { type: "string", description: "Topic in plain words, for example: testing, CI cost, migrations, native apps, agents, release process, model choice." } }, required: ["topic"], additionalProperties: false },
		execute: async (args) => findDecisionsAndLessons(args)
	},
	{
		name: "get_career_timeline",
		label: "Read the timeline",
		description: "Dated milestones: education, roles, product launches, store approvals and major engineering events, oldest first. Use for when something happened, how long something took, the order of events, or his career history.",
		parameters: { type: "object", properties: { area: { type: "string", enum: Object.keys(TIMELINE_AREAS), description: "career = education and roles. all = everything." } }, required: ["area"], additionalProperties: false },
		execute: async (args) => careerTimeline(args)
	},
	{
		name: "get_skill_evidence",
		label: "Checked the skills record",
		description: "What Austin has actually shipped with a given technology or skill, with dated evidence and the products it was used in. Use for any question of the form: does he know X, how much experience with X, has he worked with X. If nothing comes back, the record has no evidence for it.",
		parameters: { type: "object", properties: { skill: { type: "string", description: "A technology or skill, for example: SwiftUI, Postgres, MCP, CI/CD, Godot, Stripe billing, performance." } }, required: ["skill"], additionalProperties: false },
		execute: async (args) => skillEvidence(args)
	},
	{
		name: "get_project_facts",
		label: "Read the project facts",
		description: "Measured, dated facts about one project: size, test counts, release counts, review timelines and delivery figures. More detailed than get_engineering_stats, which stays the source for LineCrush repository scale. Every fact carries the date it was measured.",
		parameters: { type: "object", properties: { subject: { type: "string", enum: Object.keys(FACT_SUBJECTS) } }, required: ["subject"], additionalProperties: false },
		execute: async (args) => projectFacts(args)
	},
	{
		name: "get_work_log",
		label: "Queried the work ledger",
		description: "Live data from Austin's published Daily Work Log: measured prompting hours, clock span, agent runtime, parallel agents, GitHub contributions and hours per project bucket, for the trailing N days. Refreshed hourly. Use for questions about how much he works, recent activity, what he has been focused on lately, or agent usage.",
		parameters: { type: "object", properties: { days: { type: "integer", description: "Trailing window in days, 1 to 365. Use 7 for this week, 30 for this month.", minimum: 1, maximum: 365 } }, required: ["days"], additionalProperties: false },
		execute: workLog
	},
	{
		name: "list_blog_posts",
		label: "Listed the blog posts",
		description: "List every blog post Austin has published, newest first, with date, description and tags.",
		parameters: emptyParameters,
		execute: async () => {
			const posts = getAllPosts();
			return {
				data: { posts: posts.map(({ slug, title, description, date, tags, readTime }) => ({ slug, title, description, date, tags, readTime, href: `/blog/${slug}` })) },
				summary: `${posts.length} posts`,
				sources: [{ label: "Blog", href: "/blog" }]
			};
		}
	},
	{
		name: "read_blog_post",
		label: "Read the blog post",
		description: "Read one blog post in full. Get the slug from list_blog_posts or from a search result href.",
		parameters: { type: "object", properties: { slug: { type: "string", description: "Post slug, for example 2026-08-08-no-humans-in-the-merge-loop" } }, required: ["slug"], additionalProperties: false },
		execute: async (args) => {
			const slug = text(args, "slug", 120);
			// Slugs come from the model, so only names the blog index already lists are read.
			const meta = getAllPosts().find((post) => post.slug === slug);
			const post = meta ? getPostBySlug(meta.slug) : null;
			if (!meta || !post) throw new ToolInputError(`No post with slug "${slug}". Call list_blog_posts for valid slugs.`);
			return {
				data: { title: post.title, date: post.date, tags: post.tags, href: `/blog/${slug}`, body: stripMdx(post.content).slice(0, 9000) },
				summary: `${post.title} (${post.date})`,
				sources: [{ label: `Blog: ${post.title}`, href: `/blog/${slug}` }]
			};
		}
	},
	{
		name: "list_github_repos",
		label: "Queried GitHub",
		description: "Live list of Austin's public GitHub repositories (github.com/spragginsdesigns): names, descriptions, languages, stars and last push dates, plus language totals. Private repositories, including LineCrush and SureWord, are never included.",
		parameters: { type: "object", properties: { sort: { type: "string", enum: ["recent", "stars"], description: "recent = most recently pushed first." } }, required: ["sort"], additionalProperties: false },
		execute: listRepos
	},
	{
		name: "get_github_repo",
		label: "Inspected the repository",
		description: "Live details for one of Austin's public GitHub repositories: description, language breakdown, the five most recent commits and a README excerpt. Works only for public repositories under spragginsdesigns.",
		parameters: { type: "object", properties: { name: { type: "string", description: "Repository name without the owner, for example react-steam-deck" } }, required: ["name"], additionalProperties: false },
		execute: getRepo
	},
	{
		name: "get_steam_listing",
		label: "Checked the Steam listing",
		description: "Live public Steam store data for Gunmetal Orbit: current price and any discount, release status, platforms and store description, alongside the portfolio's recorded facts about the game.",
		parameters: emptyParameters,
		execute: steamListing
	}
];

const byName = new Map(PORTFOLIO_TOOLS.map((tool) => [tool.name, tool]));

export function findTool(name: string): PortfolioTool | undefined {
	return byName.get(name);
}

/** Runs a tool and never throws: a failure becomes data the caller can show. */
export async function runTool(name: string, rawArgs: unknown, signal: AbortSignal): Promise<ToolOutcome & { ok: boolean }> {
	const tool = byName.get(name);
	if (!tool) return { ok: false, data: { error: `Unknown tool "${name}".` }, summary: "Unknown tool", sources: [] };
	try {
		const outcome = await tool.execute(isRecord(rawArgs) ? rawArgs : {}, signal);
		return { ok: true, ...outcome };
	} catch (error) {
		const message = error instanceof ToolInputError ? error.message : "This source did not answer. Continue with the other evidence and say this lookup failed if it matters.";
		return { ok: false, data: { error: message }, summary: error instanceof ToolInputError ? "Invalid input" : "Unavailable", sources: [] };
	}
}
