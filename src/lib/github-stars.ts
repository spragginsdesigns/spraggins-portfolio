// Client-side helper: fetch live star counts for spragginsdesigns repos,
// cached in sessionStorage to stay under GitHub's anonymous rate limit.

export interface GitHubStarsData {
	stars: Record<string, number>;
	repoCount: number;
}

const CACHE_KEY = "github-stars-cache";
const CACHE_TTL_MS = 30 * 60 * 1000;

export async function fetchGitHubStars(): Promise<GitHubStarsData | null> {
	try {
		const raw = sessionStorage.getItem(CACHE_KEY);
		if (raw) {
			const { timestamp, data } = JSON.parse(raw);
			if (Date.now() - timestamp < CACHE_TTL_MS) return data;
		}
	} catch {
		// Storage unavailable — fetch fresh
	}

	try {
		const response = await fetch(
			"https://api.github.com/users/spragginsdesigns/repos?per_page=100"
		);
		if (!response.ok) return null;

		const repos: { name: string; stargazers_count: number }[] =
			await response.json();

		const data: GitHubStarsData = {
			stars: Object.fromEntries(
				repos.map((repo) => [repo.name.toLowerCase(), repo.stargazers_count])
			),
			repoCount: repos.length,
		};

		try {
			sessionStorage.setItem(
				CACHE_KEY,
				JSON.stringify({ timestamp: Date.now(), data })
			);
		} catch {
			// Ignore storage failures
		}

		return data;
	} catch {
		return null;
	}
}

// Overlay live star counts onto a hardcoded project entry, keyed by its
// GitHub repo slug. Falls back to the hardcoded values when offline.
export function withLiveStars<
	T extends { link: string; github?: string; stars?: number; highlight?: string }
>(project: T, starsData: GitHubStarsData | null): T {
	if (!starsData) return project;

	const repoUrl = project.github || project.link;
	const match = repoUrl.match(/github\.com\/spragginsdesigns\/([^/]+)/i);
	if (!match) return project;

	const liveStars = starsData.stars[match[1].toLowerCase()];
	if (liveStars === undefined) return project;

	const isStarHighlight = project.highlight?.toLowerCase().includes("star");
	return {
		...project,
		stars: liveStars,
		highlight:
			isStarHighlight && liveStars > 0
				? `${liveStars} Star${liveStars === 1 ? "" : "s"}`
				: project.highlight,
	};
}
