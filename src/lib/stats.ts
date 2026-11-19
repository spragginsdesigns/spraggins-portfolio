// Canonical LineCrush / portfolio stats - single source of truth.
// Fleet numbers measured 2026-11-17 against the fleet job ledger. Repository
// numbers measured 2026-11-18 against the LineCrush monorepo's main branch:
// commits reachable from main, API route files, shared agent skill
// definitions, frontend .tsx files, and tables created by the migration
// files (a floor, not a count of live tables).
// Update here first; prose files (llms.txt, README.md, CLAUDE.md, AGENTS.md)
// must be kept in sync manually.

export const STATS = {
	// Public repository badge on Nov 17, 2026, rounded down to whole hours.
	lineCrushEditorHours: 2252,
	// July 5 Godot project and playable build to the September 10 Steam release.
	firstGameToSteamDays: 67,
	verifiedDate: "2026-11-17",
	repoMeasuredDate: "2026-11-18",
	monorepoCommitsExact: 43649,
	monorepoCommits2026: 26369,
	apiHandlers: 725,
	agentSkills: 70,
	tsxModules: 2300,
	productClients: 4,
	sports: 14,
	postgresTables: 450,
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
	commits: "43,000+",
	commitsCompact: "43K+",
	commitsExact: "43,649",
	commits2026: "26,369",
	apiHandlers: "725",
	agentSkills: "70",
	tsxModules: "~2,300",
	productClients: "4",
	sports: "14+",
	postgresTables: "450+",
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
	campaignWaveRange: "10 to 30",
	playablePilots: 12,
	steamAchievements: 34,
	deckResolution: "1280×800",
	lifetimeWishlistAdds: 152,
	wishlistSnapshotDisplay: "November 19, 2026"
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
