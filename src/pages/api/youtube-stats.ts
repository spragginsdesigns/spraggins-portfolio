import type { NextApiRequest, NextApiResponse } from "next";

const CHANNEL_ID = "UCG33v2g2KT3hXXWLLbCFBcA";
const EMPTY_STATS = { viewCount: "0", subscriberCount: "0", videoCount: "0" };

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const apiKey = process.env.YOUTUBE_API_KEY;
	if (!apiKey) {
		return res.status(200).json(EMPTY_STATS);
	}

	try {
		const response = await fetch(
			`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${apiKey}`
		);
		if (!response.ok) {
			console.warn(`YouTube stats unavailable (${response.status})`);
			return res.status(200).json(EMPTY_STATS);
		}

		const data = await response.json();
		if (data.items && data.items.length > 0 && data.items[0].statistics) {
			return res.status(200).json(data.items[0].statistics);
		}

		return res.status(200).json(EMPTY_STATS);
	} catch {
		console.warn("YouTube stats unavailable");
		return res.status(200).json(EMPTY_STATS);
	}
}
