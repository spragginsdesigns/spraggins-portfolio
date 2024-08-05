import type { NextApiRequest, NextApiResponse } from "next";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = "UCG33v2g2KT3hXXWLLbCFBcA";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const response = await fetch(
			`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
		);
		const data = await response.json();
		console.log("YouTube API response:", data); // Debug log
		if (data.items && data.items.length > 0 && data.items[0].statistics) {
			res.status(200).json(data.items[0].statistics);
		} else {
			console.error("Unexpected API response structure:", data);
			res.status(500).json({ error: "Unexpected API response structure" });
		}
	} catch (error) {
		console.error("Error fetching YouTube stats:", error);
		res.status(500).json({ error: "Error fetching YouTube stats" });
	}
}
