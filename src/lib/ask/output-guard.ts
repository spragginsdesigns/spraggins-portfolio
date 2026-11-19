// Last line of defence for the portfolio agent's privacy rules. The system
// prompt tells the model what stays private; this checks what it actually
// wrote. Keep this file free of imports and of non-erasable TypeScript:
// scripts/ask-evals.mjs loads it directly with Node.

/**
 * Terms the agent must never introduce into an answer: the names of Austin's
 * children, private repository names, and the names of sportsbooks, exchanges
 * and odds providers. The provider list is the industry at large, not a list
 * of what LineCrush uses, so that the agent cannot name or guess a source.
 * Extra terms can be added without a deploy through ASK_DENY_TERMS
 * (comma-separated).
 */
export const BUILT_IN_DENY_TERMS: readonly string[] = [
	"Julian", "Lilly",
	"Context-Pro-AI", "bible-ai-explorer",
	"DraftKings", "FanDuel", "BetMGM", "Caesars", "Pinnacle", "PrizePicks", "Underdog", "Bet365", "ESPN BET", "Fanatics",
	"BetRivers", "Hard Rock Bet", "Bovada", "Circa", "Kalshi", "Polymarket", "Sportradar", "Genius Sports", "OddsJam", "The Odds API"
];

export const WITHHELD_ANSWER = "That answer touched on something this site keeps private, so it was withheld. Ask about Austin's public work, or reach him through the [contact form](/#contact).";

export function denyTerms(extra: string | undefined = typeof process === "undefined" ? undefined : process.env.ASK_DENY_TERMS): string[] {
	const added = (extra ?? "").split(",").map((term) => term.trim()).filter((term) => term.length > 2);
	return [...BUILT_IN_DENY_TERMS, ...added];
}

function pattern(term: string): RegExp {
	const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/[\s-]+/g, "[\\s-]*");
	return new RegExp(`(?<![A-Za-z0-9])${escaped}(?![A-Za-z0-9])`, "i");
}

/** The first deny term found in `text`, ignoring terms the visitor typed themselves. */
export function findDeniedTerm(text: string, visitorText: string, terms: readonly string[] = denyTerms()): string | null {
	for (const term of terms) {
		const matcher = pattern(term);
		// Repeating a name back to the visitor who supplied it reveals nothing.
		if (matcher.test(text) && !matcher.test(visitorText)) return term;
	}
	return null;
}

/**
 * Checks a streamed answer as it arrives. Text is released a little behind
 * the stream so that a term split across two chunks is caught before any of
 * it reaches the visitor.
 */
export class OutputGuard {
	tripped: string | null = null;
	private text = "";
	private released = 0;
	private readonly terms: string[];
	private readonly holdBack: number;
	private readonly visitorText: string;

	constructor(visitorText: string, terms: string[] = denyTerms()) {
		this.visitorText = visitorText;
		this.terms = terms;
		this.holdBack = terms.reduce((longest, term) => Math.max(longest, term.length), 0) + 2;
	}

	/** Adds streamed text and returns the part that is now safe to send. */
	push(delta: string): string {
		if (this.tripped) return "";
		this.text += delta;
		this.tripped = findDeniedTerm(this.text, this.visitorText, this.terms);
		if (this.tripped) return "";
		const end = Math.max(this.released, this.text.length - this.holdBack);
		const safe = this.text.slice(this.released, end);
		this.released = end;
		return safe;
	}

	/** Returns the held-back tail once the stream has ended cleanly. */
	flush(): string {
		if (this.tripped) return "";
		const rest = this.text.slice(this.released);
		this.released = this.text.length;
		return rest;
	}
}
