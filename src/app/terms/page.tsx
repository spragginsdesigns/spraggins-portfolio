import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

const pageUrl = "https://www.spragginsdesigns.xyz/terms";
const title = "Terms & Conditions | SpragginsDesigns";
const description =
	"Terms for SpragginsDesigns, including the SMS program for the Echo personal assistant at (833) 719-7311.";

export const metadata: Metadata = {
	title,
	description,
	alternates: { canonical: pageUrl }
};

export default function TermsPage() {
	return (
		<LegalPage
			eyebrow="Legal"
			title="Terms & Conditions"
			updated="October 13, 2026"
			intro={
				<p>
					These terms cover this website and the Echo SMS program run by SpragginsDesigns (Austin Spraggins, sole
					proprietor). See also the <a href="/privacy" className="text-primary underline">Privacy Policy</a>.
				</p>
			}
			sections={[
				{
					heading: "Echo SMS program",
					body: (
						<p>
							Echo is a private AI assistant. Its toll-free number, (833) 719-7311, sends texts only to its owner:
							replies to the owner&apos;s texts, reminders, task and job status updates, and failure notices. There is
							no marketing or promotional content.
						</p>
					)
				},
				{
					id: "opt-in",
					heading: "How consent (opt-in) is collected",
					body: (
						<p>
							The only recipient is the account owner. He verified his own mobile number in the Twilio console and opts
							in by texting the assistant first (for example, &quot;START&quot; or any message) at (833) 719-7311. No
							phone numbers are bought, rented, or collected from anyone else.
						</p>
					)
				},
				{
					heading: "Message frequency, cost, and help",
					body: (
						<>
							<p>Message frequency varies. Message and data rates may apply.</p>
							<p>
								Reply STOP to opt out at any time; you will get one confirmation and no further messages. Reply HELP
								for help, or email atmosphere9999@gmail.com.
							</p>
							<p>Carriers are not liable for delayed or undelivered messages.</p>
						</>
					)
				},
				{
					heading: "Website",
					body: (
						<p>
							Content on this site is provided as-is for informational purposes. Project names and trademarks belong
							to their owners.
						</p>
					)
				}
			]}
		/>
	);
}
