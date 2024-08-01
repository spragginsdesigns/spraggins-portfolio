"use client";

import React from "react";

const Contact: React.FC = () => {
	const emailAddress = "austin@spragginsdesigns.xyz";

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const name = (form.elements.namedItem("name") as HTMLInputElement).value;
		const email = (form.elements.namedItem("email") as HTMLInputElement).value;
		const message = (form.elements.namedItem("message") as HTMLTextAreaElement)
			.value;

		const subject = `Contact from ${name}`;
		const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;

		window.location.href = `mailto:${emailAddress}?subject=${encodeURIComponent(
			subject
		)}&body=${encodeURIComponent(body)}`;
	};

	return (
		<section id="contact" className="bg-background text-text py-20">
			<div className="container mx-auto px-4">
				<h2 className="text-4xl font-heading font-bold mb-12 text-center">
					Get In Touch
				</h2>
				<form className="max-w-lg mx-auto" onSubmit={handleSubmit}>
					<div className="mb-6">
						<label htmlFor="name" className="block mb-2 text-sm font-medium">
							Your Name
						</label>
						<input
							type="text"
							id="name"
							name="name"
							className="bg-surface border border-gray-600 text-text text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
							placeholder="John Doe"
							required
						/>
					</div>
					<div className="mb-6">
						<label htmlFor="email" className="block mb-2 text-sm font-medium">
							Your Email
						</label>
						<input
							type="email"
							id="email"
							name="email"
							className="bg-surface border border-gray-600 text-text text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
							placeholder="name@example.com"
							required
						/>
					</div>
					<div className="mb-6">
						<label htmlFor="message" className="block mb-2 text-sm font-medium">
							Your Message
						</label>
						<textarea
							id="message"
							name="message"
							rows={4}
							className="bg-surface border border-gray-600 text-text text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
							placeholder="Your message here..."
							required
						></textarea>
					</div>
					<button
						type="submit"
						className="bg-primary text-background hover:bg-opacity-80 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
					>
						Send Message
					</button>
				</form>
			</div>
		</section>
	);
};

export default Contact;
