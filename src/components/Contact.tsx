"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaCheck } from "react-icons/fa";

const Contact: React.FC = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		const form = e.currentTarget;
		const name = (form.elements.namedItem("name") as HTMLInputElement).value;
		const email = (form.elements.namedItem("email") as HTMLInputElement).value;
		const message = (form.elements.namedItem("message") as HTMLTextAreaElement)
			.value;

		try {
			const response = await fetch("/api/send-email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ name, email, message })
			});

			if (!response.ok) {
				throw new Error("Failed to send message");
			}

			setIsSubmitted(true);
			form.reset();
		} catch (error) {
			console.error("Error sending email:", error);
			setError("Failed to send message. Please try again later.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const inputVariants = {
		focus: { scale: 1.02, transition: { duration: 0.2 } }
	};

	return (
		<section id="contact" className="bg-background text-text py-20">
			<motion.div
				className="container mx-auto px-4"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<h2 className="text-4xl font-heading font-bold mb-12 text-center">
					Get In Touch
				</h2>
				<form className="max-w-lg mx-auto" onSubmit={handleSubmit}>
					<motion.div
						className="mb-6"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
					>
						<label htmlFor="name" className="block mb-2 text-sm font-medium">
							Your Name
						</label>
						<motion.input
							variants={inputVariants}
							whileFocus="focus"
							type="text"
							id="name"
							name="name"
							className="bg-surface border border-gray-600 text-text text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
							placeholder="Your Name"
							required
						/>
					</motion.div>
					<motion.div
						className="mb-6"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						<label htmlFor="email" className="block mb-2 text-sm font-medium">
							Your Email
						</label>
						<motion.input
							variants={inputVariants}
							whileFocus="focus"
							type="email"
							id="email"
							name="email"
							className="bg-surface border border-gray-600 text-text text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
							placeholder="name@example.com"
							required
						/>
					</motion.div>
					<motion.div
						className="mb-6"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
					>
						<label htmlFor="message" className="block mb-2 text-sm font-medium">
							Your Message
						</label>
						<motion.textarea
							variants={inputVariants}
							whileFocus="focus"
							id="message"
							name="message"
							rows={4}
							className="bg-surface border border-gray-600 text-text text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
							placeholder="Your message here..."
							required
						></motion.textarea>
					</motion.div>
					<motion.button
						type="submit"
						className="bg-primary text-background hover:bg-opacity-80 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center flex items-center justify-center"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						disabled={isSubmitting || isSubmitted}
					>
						{isSubmitting ? (
							<motion.div
								className="w-6 h-6 border-t-2 border-r-2 border-background rounded-full"
								animate={{ rotate: 360 }}
								transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
							></motion.div>
						) : isSubmitted ? (
							<>
								<FaCheck className="mr-2" /> Sent
							</>
						) : (
							<>
								<FaPaperPlane className="mr-2" /> Send Message
							</>
						)}
					</motion.button>
				</form>
				<AnimatePresence>
					{error && (
						<motion.p
							className="text-red-500 mt-4 text-center"
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
						>
							{error}
						</motion.p>
					)}
					{isSubmitted && (
						<motion.div
							className="mt-8 text-center"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.5 }}
						>
							<motion.div
								className="inline-block p-4 bg-green-500 rounded-full"
								initial={{ rotate: 0 }}
								animate={{ rotate: 360 }}
								transition={{ duration: 0.5 }}
							>
								<FaCheck className="text-white text-2xl" />
							</motion.div>
							<motion.h3
								className="text-2xl font-bold mt-4 mb-2"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
							>
								Message Sent Successfully!
							</motion.h3>
							<motion.p
								className="text-gray-600"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.5 }}
							>
								Thank you for reaching out. We&apos;ll get back to you soon!
							</motion.p>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>
		</section>
	);
};

export default Contact;
