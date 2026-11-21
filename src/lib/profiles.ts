/**
 * Austin's public profiles: the single source for profile links and the
 * JSON-LD sameAs lists. Add a profile here, then render it where links show.
 */
export const PROFILES = {
	github: "https://github.com/spragginsdesigns",
	linkedin: "https://www.linkedin.com/in/spragginsdesigns/",
	twitter: "https://twitter.com/spragginsdesign",
	gitwork: "https://gitwork.dev/spragginsdesigns"
} as const;

export const PROFILE_SAME_AS: string[] = Object.values(PROFILES);
