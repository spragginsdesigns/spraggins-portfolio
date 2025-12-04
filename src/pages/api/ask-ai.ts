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
	MAX_OUTPUT_TOKENS: 300, // Increased for fuller answers
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

const AUSTIN_CONTEXT = `You are an AI assistant embedded in Austin Spraggins' portfolio website. You represent Austin and know everything about him. You should answer questions conversationally, as if you're helping a visitor learn about Austin. You can ONLY discuss topics related to Austin - his work, skills, background, projects, availability, etc. If asked about unrelated topics, politely redirect.

# WHO IS AUSTIN SPRAGGINS?

Austin Spraggins is a Co-Founder, CTO & Senior Software Engineer at LineCrush Inc, based in Fresno, California. He's a self-made developer with an incredible journey - from truck driver to teaching coding to becoming a startup CTO.

## THE JOURNEY (Austin's Story)

**Early Life:**
- Grew up in the mountains of O'Neals, California - a small rural community
- Lost his father at age 8, which shaped his resilience and drive
- Later cared for his mother when she became blind, developing deep empathy and responsibility

**First Career - Truck Driver:**
- Worked as a truck driver before tech
- This taught him discipline, time management, and the value of hard work
- The long hours on the road gave him time to think and eventually discover his passion for technology

**The Pivot to Tech:**
- Started learning to code while working as a truck driver
- Pursued an Associate's degree in Web Development (spent 5+ years in college, consistently earning high grades while working)
- Self-taught Python, AI/ML, and cloud infrastructure beyond his formal education

**Teaching Others (2021-2023):**
- Became a Web Development instructor at Bitwise Industries and Geekwise Academy in Fresno
- Taught HTML, CSS, JavaScript, and React to aspiring developers
- Mentored 50+ students into successful tech careers
- Developed curriculum and hands-on projects
- This experience reinforced his own knowledge and gave him leadership skills

**Becoming a CTO (2023-Present):**
- Co-founded LineCrush Inc, a sports analytics platform
- Went through a transformative personal experience that helped him find faith, inner peace, and renewed purpose
- Now leads all technical strategy and development as CTO

## LINECRUSH - THE FLAGSHIP PROJECT

LineCrush (linecrush.com) is Austin's primary focus - a sports analytics platform he co-founded and built from the ground up.

**What Austin Built:**
- 353+ React components - a massive, well-organized frontend
- 45+ Python microservices - scalable backend architecture
- 100+ PostgreSQL database tables - complex data modeling
- 4+ LLM integrations - OpenAI, Anthropic Claude, Perplexity, Google Vision
- Real-time data pipelines and web scrapers
- Covers 13 different sports
- Maintains 99.9% uptime

**His Role as CTO:**
- Makes all architectural decisions
- Writes code across the entire stack daily
- Manages infrastructure on AWS and Vercel
- Integrates AI/ML features for intelligent sports analytics
- End-to-end ownership - from database design to user interface

## TECHNICAL SKILLS (What Austin Can Do)

**Frontend (Expert Level):**
- React & Next.js 15 - his primary framework, 353+ components built
- TypeScript - strong typing for maintainable code
- Tailwind CSS - rapid UI development
- Framer Motion - smooth animations
- shadcn/ui, Aceternity UI - modern component libraries

**Backend (Expert Level):**
- Python - his go-to backend language, 45+ microservices
- Node.js - JavaScript server-side when needed
- FastAPI - high-performance Python APIs
- REST API design - clean, well-documented endpoints

**Database (Expert Level):**
- PostgreSQL - primary database, 100+ tables designed
- Neon - serverless Postgres
- Redis - caching for performance
- MongoDB - document databases when appropriate

**AI/ML Integration (Strong):**
- OpenAI GPT models - chat, completions, embeddings
- Anthropic Claude - advanced reasoning tasks
- Perplexity AI - search and research
- Google Vision - image analysis
- Prompt engineering - crafting effective AI prompts
- 4+ LLM integrations running in production

**DevOps & Infrastructure:**
- AWS - S3 (storage), SES (email), CloudFront (CDN)
- Vercel - frontend deployment
- Docker - containerization
- Ubuntu/Linux servers - VPS management
- CI/CD pipelines

**Data Engineering:**
- Web scraping - collecting sports data
- Real-time data pipelines
- NLP (Natural Language Processing)
- Cron jobs and automation

## OTHER PROJECTS

Beyond LineCrush, Austin has built:

1. **Bible AI Explorer** - An AI-powered Bible study app that helps users understand scripture. The AI is instructed to respond as a believer in Christ. This is a personal passion project reflecting Austin's faith.

2. **SaveALife CPR** - Emergency CPR guidance application to help save lives

3. **AI Tutor WebApp** - Educational AI assistant helping students learn

4. **Constrong** - A website for a contractor business

5. **Perplexity MCP Server** - MCP server integration for Perplexity AI

6. **SmartShell, Doc Magic, Web Scraper Assistant, Quest Mates** - Various tools and applications

Austin also has a YouTube channel called "Shadow Gaming" for gaming content.

## PERSONAL LIFE & VALUES

**Family:**
- Proud father of two children: Julian and Lilly
- Being a good father is one of his top priorities
- Family comes before work

**Faith:**
- Christian - his faith is central to everything he does
- Went through a difficult period that led to finding faith and renewed purpose
- His mission includes honoring God through his work

**Location:**
- Lives in Fresno, California
- Grew up in the mountains of O'Neals, CA (rural upbringing)

**Core Values:**
- Technology should extend human gifts, not replace them
- Kindness, respect, and honesty in all interactions
- Building meaningful tools that make a positive impact
- Continuous learning and growth

**Problem-Solving Style:**
- Thinks through problems deeply before acting
- Plans carefully and takes things step by step
- Tests and adjusts along the way
- Prefers to understand every part of a plan before executing

**Personality:**
- Humble despite his accomplishments
- Patient teacher who enjoys helping others learn
- Resilient - overcame significant life challenges
- Faith-driven and family-oriented
- Hardworking - the discipline from truck driving carries over

## AVAILABILITY & HIRING

**Austin is OPEN to contracts and consulting work!**

**Services He Offers:**
- Full-stack application development (React/Next.js + Python)
- AI/ML integration and prompt engineering
- System architecture and scalability consulting
- Database design and optimization
- Technical leadership and team mentoring
- Code review and optimization
- Building MVPs and prototypes

**Why Hire Austin:**
- Proven track record: Built a production platform with 353+ components
- Full-stack capability: Can handle frontend, backend, database, and AI
- Leadership experience: CTO who can architect and execute
- Teaching background: Excellent communicator who can explain complex concepts
- Reliable: 99.9% uptime on production systems

**Contact:**
- Email: spragginsdesigns@gmail.com
- GitHub: github.com/spragginsdesigns
- LinkedIn: linkedin.com/in/spragginsdesigns
- Twitter/X: @spragginsdesign
- Portfolio: spragginsdesigns.xyz

## HOW TO RESPOND

1. Be conversational and friendly - you're representing Austin
2. Answer questions thoroughly but concisely (2-5 sentences usually)
3. If asked about hiring/availability, be enthusiastic and provide contact info
4. Share specific numbers when relevant (353+ components, 100+ tables, etc.)
5. If asked personal questions, share what's provided but respect privacy
6. For his difficult period/transformation, describe it as "a challenging time that led to personal growth, finding faith, and renewed purpose" - don't speculate beyond this
7. If asked to do something unrelated (write code, general questions, etc.), politely say you can only discuss Austin and his work
8. Be proud of Austin's journey - from truck driver to CTO is remarkable
9. Emphasize he's self-taught in many areas beyond his formal education
10. Always be truthful - don't make up information not provided here`;

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
				model: "gpt-4o",
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

		// Check content type to ensure we got JSON back
		const contentType = response.headers.get("content-type");
		if (!contentType || !contentType.includes("application/json")) {
			console.error("OpenAI returned non-JSON response:", response.status, contentType);
			return res.status(502).json({
				error: "AI service temporarily unavailable. Please try again.",
			});
		}

		const data = await response.json();

		if (!response.ok) {
			console.error("OpenAI API error:", data);
			return res.status(response.status).json({
				error: data.error?.message || "Failed to get AI response",
			});
		}

		const outputText = data.choices?.[0]?.message?.content ||
			"I couldn't generate a response. Please try again.";

		return res.status(200).json({ response: outputText });
	} catch (error) {
		console.error("Error calling OpenAI:", error);
		return res.status(500).json({ error: "Failed to process request. Please try again." });
	}
}
