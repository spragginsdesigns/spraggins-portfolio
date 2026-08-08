// Canonical LineCrush / portfolio stats — single source of truth.
// Verified 2026-08-08 against the LineCrush monorepo and fleet job ledger.
// Update here first; prose files (llms.txt, README.md, CLAUDE.md, AGENTS.md)
// must be kept in sync manually.

export const STATS = {
	verifiedDate: "2026-08-08",
	monorepoCommitsExact: 30128,
	monorepoCommits2026: 12873,
	apiHandlers: 366,
	agentSkills: 64,
	tsxModules: 1000,
	productClients: 4,
	sports: 12,
	postgresTables: 120,
	llmProviders: 5,
	fleet: {
		since: "June 23, 2026",
		issuesWorked: 4426,
		completionPct: 95,
		issuesPerDay: 90,
		jobsShippedCommits: 2730
	}
} as const;

// Pre-formatted strings, safe to interpolate into terminal ASCII art and prose.
export const FMT = {
	commits: "30,000+",
	commitsCompact: "30K+",
	commitsExact: "30,128",
	commits2026: "12,873",
	apiHandlers: "366",
	agentSkills: "64",
	tsxModules: "~1,000",
	productClients: "4",
	sports: "12",
	postgresTables: "120+",
	llmProviders: "5",
	yearsInProduction: "2+",
	gameBuilds: "3+",
	fleetIssues: "4,426",
	fleetCompletion: "95%",
	fleetPerDay: "~90",
	fleetJobsCommits: "2,730",
	fleetSince: "June 23, 2026"
} as const;

export const GUNMETAL_ORBIT = {
	name: "Gunmetal Orbit",
	tagline: "Built on Deck. Unleashed on PC.",
	genre: "Space-mining arena roguelite",
	steamAppId: 4975430,
	steamUrl: "https://store.steampowered.com/app/4975430",
	releaseDate: "2026-08-21",
	releaseDateDisplay: "August 21, 2026",
	price: "$4.99",
	engine: "Godot 4.7",
	weapons: 28,
	weaponSlots: 6,
	waves: 22,
	hazardLevels: "0–5",
	characters: ["Gunner", "Bulkhead"],
	deckResolution: "1280×800 @ 60fps"
} as const;

export const STUDIO = {
	name: "LineCrush Games",
	url: "https://games.linecrush.com",
	motto: "Small crew. Massive games.",
	location: "Fresno, CA",
	crew: ["Austin", "Jay"],
	otherTitles: ["Space Miner", "RockHunter", "MERIDIAN", "Last Crew"],
	webPartyGames: ["Ringer", "PartyPack"]
} as const;
