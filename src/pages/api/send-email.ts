import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "POST") {
		const { name, email, message } = req.body;

		// Create a transporter using SMTP
		let transporter = nodemailer.createTransport({
			host: "mail.privateemail.com",
			port: 465,
			secure: true, // use SSL
			auth: {
				user: "austin@spragginsdesigns.xyz",
				pass: process.env.EMAIL_PASSWORD
			}
		});

		// HTML email template
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
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <h2>Message:</h2>
            <p>${message}</p>
          </div>
          <div class="footer">
            <p>This email was sent from your portfolio website contact form.</p>
          </div>
        </div>
      </body>
      </html>
    `;

		try {
			// Send email
			await transporter.sendMail({
				from: "austin@spragginsdesigns.xyz",
				to: "austin@spragginsdesigns.xyz",
				subject: `New Contact from ${name}`,
				html: htmlTemplate
			});

			res.status(200).json({ message: "Email sent successfully" });
		} catch (error) {
			console.error("Error sending email:", error);
			res.status(500).json({ error: "Failed to send email" });
		}
	} else {
		res.setHeader("Allow", ["POST"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
