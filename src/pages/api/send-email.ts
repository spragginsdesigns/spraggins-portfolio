import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

const LIMITS = {
	MAX_REQUESTS_PER_HOUR: 5,
	MAX_NAME_LENGTH: 100,
	MAX_EMAIL_LENGTH: 254,
	MAX_MESSAGE_LENGTH: 5000,
};

interface RateLimitEntry {
	count: number;
	resetTime: number;
}

// In-memory rate limit store (resets on server restart)
const rateLimitStore = new Map<string, RateLimitEntry>();

function getClientIp(req: NextApiRequest): string {
	const forwarded = req.headers["x-forwarded-for"];
	return typeof forwarded === "string"
		? forwarded.split(",")[0].trim()
		: req.socket.remoteAddress || "unknown";
}

function checkRateLimit(ip: string): boolean {
	const now = Date.now();
	const entry = rateLimitStore.get(ip);

	if (!entry || now > entry.resetTime) {
		rateLimitStore.set(ip, { count: 1, resetTime: now + 60 * 60 * 1000 });
		return true;
	}

	if (entry.count >= LIMITS.MAX_REQUESTS_PER_HOUR) {
		return false;
	}

	entry.count++;
	return true;
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") {
		res.setHeader("Allow", ["POST"]);
		return res.status(405).end(`Method ${req.method} Not Allowed`);
	}

	const { name, email, message, website } = req.body ?? {};

	// Honeypot: real visitors never fill this hidden field. Pretend success
	// so bots don't learn they were caught.
	if (website) {
		return res.status(200).json({ message: "Email sent successfully" });
	}

	if (
		typeof name !== "string" ||
		typeof email !== "string" ||
		typeof message !== "string" ||
		!name.trim() ||
		!email.trim() ||
		!message.trim()
	) {
		return res.status(400).json({ error: "Name, email, and message are required" });
	}

	if (
		name.length > LIMITS.MAX_NAME_LENGTH ||
		email.length > LIMITS.MAX_EMAIL_LENGTH ||
		message.length > LIMITS.MAX_MESSAGE_LENGTH
	) {
		return res.status(400).json({ error: "Input too long" });
	}

	if (!EMAIL_PATTERN.test(email)) {
		return res.status(400).json({ error: "Please provide a valid email address" });
	}

	if (!checkRateLimit(getClientIp(req))) {
		return res.status(429).json({
			error: "Too many messages. Please try again later or email me directly.",
		});
	}

	if (!process.env.GMAIL_APP_PASSWORD) {
		console.error("GMAIL_APP_PASSWORD is not configured");
		return res.status(500).json({ error: "Email service is not configured" });
	}

	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true, // use SSL
		auth: {
			user: "spragginsdesigns@gmail.com",
			pass: process.env.GMAIL_APP_PASSWORD,
		},
	});

	const safeName = escapeHtml(name.trim());
	const safeEmail = escapeHtml(email.trim());
	const safeMessage = escapeHtml(message.trim()).replace(/\n/g, "<br />");

	const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4a90e2; color: white; padding: 10px; text-align: center; }
          .content { background-color: #f4f4f4; padding: 20px; border-radius: 5px; }
          .footer { text-align: center; margin-top: 20px; font-size: 0.8em; color: #888; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
          </div>
          <div class="content">
            <h2>Contact Details:</h2>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <h2>Message:</h2>
            <p>${safeMessage}</p>
          </div>
          <div class="footer">
            <p>This email was sent from your portfolio website contact form.</p>
          </div>
        </div>
      </body>
      </html>
    `;

	try {
		await transporter.sendMail({
			from: "spragginsdesigns@gmail.com",
			to: "spragginsdesigns@gmail.com",
			replyTo: email.trim(),
			subject: `New Contact from ${name.trim().slice(0, 80)}`,
			html: htmlTemplate,
		});

		return res.status(200).json({ message: "Email sent successfully" });
	} catch (error) {
		console.error("Error sending email:", error);
		return res.status(500).json({ error: "Failed to send email" });
	}
}
