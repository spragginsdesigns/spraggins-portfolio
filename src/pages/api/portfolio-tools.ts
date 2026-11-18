import type { NextApiRequest, NextApiResponse } from "next";
import { checkRateLimit, clientKey } from "@/lib/ask/rate-limit";
import { PORTFOLIO_TOOLS, findTool, runTool } from "@/lib/ask/tools";

// Public, read-only access to the same tools the ask agent uses. The page's
// WebMCP tools call this so a visitor's own browser agent can look up
// Austin's work directly. No model runs here, so the limit is looser.

const RATE = { perMinute: 30, perDay: 400 };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	res.setHeader("Cache-Control", "no-store");

	if (req.method === "GET") {
		return res.status(200).json({
			tools: PORTFOLIO_TOOLS.map(({ name, description, parameters }) => ({ name, description, inputSchema: parameters }))
		});
	}
	if (req.method !== "POST") {
		res.setHeader("Allow", "GET, POST");
		return res.status(405).json({ error: "Method not allowed." });
	}

	const name = typeof req.body?.name === "string" ? req.body.name : "";
	if (!findTool(name)) {
		return res.status(404).json({ error: "Unknown tool. GET this endpoint for the list." });
	}
	const rateCheck = checkRateLimit("tools", clientKey(req), RATE);
	if (!rateCheck.allowed) {
		return res.status(429).json({ error: rateCheck.message });
	}

	const outcome = await runTool(name, req.body?.arguments, AbortSignal.timeout(12_000));
	return res.status(outcome.ok ? 200 : 422).json({ ok: outcome.ok, result: outcome.data, sources: outcome.sources });
}
