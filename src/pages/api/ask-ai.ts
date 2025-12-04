import type { NextApiRequest, NextApiResponse } from "next";

// ============================================
// RATE LIMITING & COST PROTECTION
// ============================================
// - 10 requests per minute per IP
// - 50 requests per day per IP
// - Max 200 output tokens per response
// - Questions limited to 500 characters
// ============================================

interface RateLimitEntry {
	count: number;
	resetTime: number;
	dailyCount: number;
	dailyResetTime: number;
}

// In-memory rate limit store (resets on server restart)
const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMIT = {
	MAX_REQUESTS_PER_MINUTE: 10,
	MAX_REQUESTS_PER_DAY: 50,
	MAX_QUESTION_LENGTH: 500,
	MAX_OUTPUT_TOKENS: 200,
};

function getRateLimitKey(req: NextApiRequest): string {
	// Get IP from various headers (for Vercel/proxies)
	const forwarded = req.headers["x-forwarded-for"];
	const ip = typeof forwarded === "string"
		? forwarded.split(",")[0].trim()
		: req.socket.remoteAddress || "unknown";
	return ip;
}

function checkRateLimit(ip: string): { allowed: boolean; message?: string } {
	const now = Date.now();
	const entry = rateLimitStore.get(ip);

	if (!entry) {
		// First request from this IP
		rateLimitStore.set(ip, {
			count: 1,
			resetTime: now + 60 * 1000, // 1 minute
			dailyCount: 1,
			dailyResetTime: now + 24 * 60 * 60 * 1000, // 24 hours
		});
		return { allowed: true };
	}

	// Check and reset minute counter
	if (now > entry.resetTime) {
		entry.count = 0;
		entry.resetTime = now + 60 * 1000;
	}

	// Check and reset daily counter
	if (now > entry.dailyResetTime) {
		entry.dailyCount = 0;
		entry.dailyResetTime = now + 24 * 60 * 60 * 1000;
	}

	// Check daily limit first
	if (entry.dailyCount >= RATE_LIMIT.MAX_REQUESTS_PER_DAY) {
		return {
			allowed: false,
			message: "Daily limit reached. Please try again tomorrow!"
		};
	}

	// Check per-minute limit
	if (entry.count >= RATE_LIMIT.MAX_REQUESTS_PER_MINUTE) {
		return {
			allowed: false,
			message: "Too many requests. Please wait a minute before asking again."
		};
	}

	// Increment counters
	entry.count++;
	entry.dailyCount++;
	rateLimitStore.set(ip, entry);

	return { allowed: true };
}

// Clean up old entries periodically (every 100 requests)
let requestCount = 0;
function cleanupStore() {
	requestCount++;
	if (requestCount % 100 === 0) {
		const now = Date.now();
		const keysToDelete: string[] = [];
		rateLimitStore.forEach((entry, ip) => {
			if (now > entry.dailyResetTime) {
				keysToDelete.push(ip);
			}
		});
		keysToDelete.forEach(ip => rateLimitStore.delete(ip));
	}
}

const AUSTIN_CONTEXT = `You are an AI assistant embedded in Austin Spraggins' portfolio website terminal. You can ONLY answer questions about Austin Spraggins. If someone asks about anything unrelated to Austin, politely redirect them to ask about Austin instead.

## About Austin Spraggins

### Professional
- **Current Role:** Co-Founder, CTO & Senior Software Engineer at LineCrush Inc (https://linecrush.com)
- **Company:** LineCrush - A sports analytics platform serving thousands of users
- **Experience:** 2+ years building production systems at scale with end-to-end ownership across the entire stack

### Technical Expertise
**Frontend:** Next.js 15, React (353+ components built), TypeScript, Tailwind CSS, Framer Motion
**Backend:** Python (45+ microservices), Node.js, FastAPI, REST APIs
**Database:** PostgreSQL/Neon (100+ tables designed), Redis caching, MongoDB
**AI/ML:** OpenAI GPT, Anthropic Claude, Perplexity, Google Vision (4+ LLM integrations in production)
**Infrastructure:** AWS (S3, SES, CloudFront), Ubuntu VPS, Vercel, Docker
**Data:** Web scrapers, real-time pipelines, NLP, cron jobs

### Key Metrics at LineCrush
- 353+ React components
- 45+ Python microservices
- 100+ PostgreSQL tables
- 4+ LLM integrations
- 13 sports covered
- 99.9% uptime

### Education
- AA in Web Development (5+ years in college, consistently high grades)
- Self-taught in Python, AI/ML, and cloud infrastructure
- Continuous learner and open source contributor

### Teaching Experience
- Former Web Development instructor at Bitwise Industries and Geekwise Academy (2021-2023)
- Taught HTML, CSS, JavaScript, React
- Mentored 50+ students into tech careers
- Developed curriculum and hands-on projects

### Personal
- **Location:** Fresno, California (grew up in the mountains of O'Neals, CA)
- **Family:** Proud father of two children - Julian and Lilly
- **Faith:** Christian - faith is central to his life and work
- **Background:** Lost his father at age 8; later cared for his mother when she became blind. Former truck driver before transitioning to tech. Went through a transformative life experience that profoundly changed his perspective, helping him find faith, inner peace, and renewed purpose.

### Values & Mission
- Mission: To serve God, be a good father and provider, and build technology that makes the world more intelligent, loving, and just
- Believes technology should extend human gifts, not replace them
- Values kindness, respect, and honesty in all interactions
- Problem-solving style: Thinks through problems deeply, plans carefully, takes things step by step

### Availability
**Austin is OPEN to contracts and consulting work!**
Services offered:
- Full-stack application development
- AI/ML integration & prompt engineering
- System architecture & scalability consulting
- Technical leadership & mentoring
- Code review & optimization

### Contact
- Email: spragginsdesigns@gmail.com
- GitHub: github.com/spragginsdesigns
- LinkedIn: linkedin.com/in/spragginsdesigns
- Twitter: @spragginsdesign
- Portfolio: spragginsdesigns.xyz

### Featured Projects
1. **LineCrush** (Flagship) - Sports analytics platform with AI-powered insights
2. **Bible AI Explorer** - AI-powered Bible study application
3. **SaveALife CPR** - Emergency CPR guidance application
4. **AI Tutor WebApp** - Educational AI assistant for students
5. **Perplexity MCP Server** - MCP server for Perplexity AI integration

## Response Guidelines
- Keep responses concise (2-4 sentences max)
- Be friendly and professional
- If asked to do something unrelated to Austin (like write code, answer trivia, etc.), politely decline and suggest they ask about Austin instead
- You can be conversational but always bring it back to Austin's skills, experience, or availability
- If asked about hiring Austin, be enthusiastic and provide contact info
- NEVER make up information about Austin that isn't in this context`;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	// Rate limiting
	cleanupStore();
	const ip = getRateLimitKey(req);
	const rateCheck = checkRateLimit(ip);

	if (!rateCheck.allowed) {
		return res.status(429).json({ error: rateCheck.message });
	}

	const { question } = req.body;

	if (!question || typeof question !== "string") {
		return res.status(400).json({ error: "Question is required" });
	}

	// Limit question length
	if (question.length > RATE_LIMIT.MAX_QUESTION_LENGTH) {
		return res.status(400).json({
			error: `Question too long. Max ${RATE_LIMIT.MAX_QUESTION_LENGTH} characters.`
		});
	}

	const apiKey = process.env.OPENAI_API_KEY;

	if (!apiKey) {
		return res.status(500).json({ error: "OpenAI API key not configured" });
	}

	try {
		const response = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				model: "gpt-4o-mini", // Using gpt-4o-mini as fallback since gpt-5.1 may not be available
				messages: [
					{
						role: "system",
						content: AUSTIN_CONTEXT,
					},
					{
						role: "user",
						content: question,
					},
				],
				max_tokens: RATE_LIMIT.MAX_OUTPUT_TOKENS,
				temperature: 0.7,
			}),
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.error("OpenAI API error:", errorData);
			return res.status(response.status).json({
				error: errorData.error?.message || "Failed to get AI response",
			});
		}

		const data = await response.json();
		const outputText = data.choices?.[0]?.message?.content ||
			"I couldn't generate a response. Please try again.";

		return res.status(200).json({ response: outputText });
	} catch (error) {
		console.error("Error calling OpenAI:", error);
		return res.status(500).json({ error: "Failed to process request" });
	}
}
