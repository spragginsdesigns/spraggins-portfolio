import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";

const pageUrl = "https://www.spragginsdesigns.xyz/privacy";
const title = "Privacy Policy | SpragginsDesigns";
const description =
	"How SpragginsDesigns (Austin Spraggins) handles information, including text messages sent by the Echo personal assistant.";

export const metadata: Metadata = {
	title,
	description,
	alternates: { canonical: pageUrl }
};

export default function PrivacyPage() {
	return (
		<LegalPage
			eyebrow="Legal"
			title="Privacy Policy"
			updated="October 13, 2026"
			intro={
				<p>
					SpragginsDesigns is a sole proprietorship operated by Austin Spraggins. This policy covers this website and
					Echo, a private AI assistant that sends text messages from the toll-free number (833) 719-7311.
				</p>
			}
			sections={[
				{
					heading: "Information we collect",
					body: (
						<p>
							This website does not require an account and does not sell or rent personal information. Echo only
							processes the phone number and message content of its owner, who opted in by texting the assistant.
						</p>
					)
				},
				{
					heading: "Text messaging (SMS)",
					body: (
						<>
							<p>
								Mobile numbers and SMS opt-in consent are used only to send the messages the recipient asked for:
								replies to their texts, reminders, and status alerts.
							</p>
							<p>
								No mobile information will be shared with third parties or affiliates for marketing or promotional
								purposes. Text messaging originator opt-in data and consent will not be shared with any third party,
								except service providers (such as our SMS carrier, Twilio) needed to deliver the messages.
							</p>
						</>
					)
				},
				{
					heading: "Opting out",
					body: (
						<p>
							Reply STOP to any message to stop receiving texts, or HELP for help. You can also email
							atmosphere9999@gmail.com.
						</p>
					)
				},
				{
					heading: "Contact",
					body: <p>Questions about this policy: atmosphere9999@gmail.com.</p>
				}
			]}
		/>
	);
}
