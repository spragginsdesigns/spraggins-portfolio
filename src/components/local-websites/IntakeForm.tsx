"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Send } from "lucide-react";
import { LOCAL_SITES } from "@/lib/local-websites";

const inputClass =
	"bg-card/50 border border-border/50 text-foreground placeholder:text-muted-foreground/60 text-base rounded-lg focus:ring-primary focus:border-primary outline-none block w-full p-3 transition-colors";

/**
 * Three-field intake for business owners: name, phone, what you do.
 * Posts to the existing contact handler, which accepts a phone number in
 * place of an email for this source.
 */
const IntakeForm: React.FC<{ idPrefix?: string }> = ({
	idPrefix = "intake"
}) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError(null);

		const form = e.currentTarget;
		const name = (form.elements.namedItem("business") as HTMLInputElement)
			.value;
		const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
		const message = (form.elements.namedItem("about") as HTMLTextAreaElement)
			.value;
		const website = (form.elements.namedItem("website") as HTMLInputElement)
			.value;

		try {
			const response = await fetch("/api/send-email", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name,
					phone,
					message,
					website,
					source: "local-websites"
				})
			});

			if (!response.ok) {
				const data = await response.json().catch(() => null);
				throw new Error(data?.error || "Failed to send");
			}

			setIsSubmitted(true);
			form.reset();
		} catch (err) {
			setError(
				err instanceof Error && err.message !== "Failed to send"
					? err.message
					: `Something went wrong. Call or text me at ${LOCAL_SITES.phoneDisplay} instead.`
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div>
			<AnimatePresence mode="wait">
				{isSubmitted ? (
					<motion.div
						key="done"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						className="rounded-xl border border-green-500/30 bg-green-500/10 p-5 text-center"
					>
						<div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-background">
							<Check className="h-5 w-5" />
						</div>
						<p className="font-semibold">Got it.</p>
						<p className="mt-1 text-sm text-muted-foreground">
							I&apos;ll text you within one business day. If it&apos;s urgent,
							call me at {LOCAL_SITES.phoneDisplay}.
						</p>
						<button
							type="button"
							onClick={() => setIsSubmitted(false)}
							className="mt-3 text-sm text-primary hover:underline"
						>
							Send another
						</button>
					</motion.div>
				) : (
					<motion.form
						key="form"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onSubmit={handleSubmit}
						className="space-y-4"
					>
						{/* Honeypot - hidden from humans, bots fill it and get silently dropped */}
						<input
							type="text"
							name="website"
							tabIndex={-1}
							autoComplete="off"
							aria-hidden="true"
							className="absolute -left-[9999px] h-0 w-0 opacity-0"
						/>
						<div>
							<label
								htmlFor={`${idPrefix}-business`}
								className="mb-1.5 block text-sm font-medium"
							>
								Business name
							</label>
							<input
								id={`${idPrefix}-business`}
								name="business"
								type="text"
								autoComplete="organization"
								maxLength={100}
								placeholder="Valley Auto Repair"
								className={inputClass}
								required
							/>
						</div>
						<div>
							<label
								htmlFor={`${idPrefix}-phone`}
								className="mb-1.5 block text-sm font-medium"
							>
								Your phone
							</label>
							<input
								id={`${idPrefix}-phone`}
								name="phone"
								type="tel"
								autoComplete="tel"
								inputMode="tel"
								maxLength={30}
								placeholder="559-555-0123"
								className={inputClass}
								required
							/>
						</div>
						<div>
							<label
								htmlFor={`${idPrefix}-about`}
								className="mb-1.5 block text-sm font-medium"
							>
								What you do
							</label>
							<textarea
								id={`${idPrefix}-about`}
								name="about"
								rows={3}
								maxLength={1000}
								placeholder="Auto repair and smog checks on Blackstone"
								className={inputClass}
								required
							/>
						</div>
						<button
							type="submit"
							disabled={isSubmitting}
							className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-semibold text-background transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-60"
						>
							{isSubmitting ? (
								<span className="h-5 w-5 animate-spin rounded-full border-r-2 border-t-2 border-background" />
							) : (
								<>
									<Send className="h-4 w-4" />
									Send me the details
								</>
							)}
						</button>
						{error && (
							<p className="text-center text-sm text-red-400">{error}</p>
						)}
					</motion.form>
				)}
			</AnimatePresence>
		</div>
	);
};

export default IntakeForm;
