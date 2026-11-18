// Canonical LineCrush / portfolio stats - single source of truth.
// Fleet numbers measured 2026-11-17 against the fleet job ledger; the rest on
// 2026-08-08 against the LineCrush monorepo.
// Update here first; prose files (llms.txt, README.md, CLAUDE.md, AGENTS.md)
// must be kept in sync manually.

export const STATS = {
	// Public repository badge on Nov 17, 2026, rounded down to whole hours.
	lineCrushEditorHours: 2252,
	// July 5 Godot project and playable build to the September 10 Steam release.
	firstGameToSteamDays: 67,
	verifiedDate: "2026-11-17",
	monorepoCommitsExact: 30128,
	monorepoCommits2026: 12873,
	apiHandlers: 366,
	agentSkills: 64,
	tsxModules: 1000,
	productClients: 4,
	sports: 14,
	postgresTables: 120,
	llmProviders: 5,
	fleet: {
		since: "June 23, 2026",
		completedJobs: 14111,
		completionPct: 91,
		issuesPerDay: 124,
		jobsWithCommitLinks: 10745
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
	sports: "14+",
	postgresTables: "120+",
	llmProviders: "5",
	yearsInProduction: "2+",
	gameBuilds: "3+",
	fleetCompletedJobs: STATS.fleet.completedJobs.toLocaleString("en-US"),
	fleetCompletion: "91%",
	fleetPerDay: `~${STATS.fleet.issuesPerDay}`,
	fleetJobsWithCommitLinks: STATS.fleet.jobsWithCommitLinks.toLocaleString("en-US"),
	fleetSince: STATS.fleet.since
} as const;

export const GUNMETAL_ORBIT = {
	name: "Gunmetal Orbit",
	tagline: "Built on Deck. Unleashed on PC.",
	genre: "Space-mining arena roguelite",
	steamAppId: 4975430,
	steamUrl: "https://store.steampowered.com/app/4975430",
	releaseDate: "2026-09-10",
	releaseDateDisplay: "September 10, 2026",
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
