import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Faith from "@/components/Faith";

const BASE_URL = "https://www.spragginsdesigns.xyz";
const description =
	"Austin Spraggins' testimony: saved by grace through faith in Jesus Christ, and why he built SureWord.";

export const metadata: Metadata = {
	title: "My Faith and Testimony | Austin Spraggins",
	description,
	alternates: { canonical: `${BASE_URL}/faith` },
	openGraph: {
		title: "Saved by grace. Living for Him.",
		description,
		url: `${BASE_URL}/faith`,
		type: "profile"
	}
};

export default function FaithPage() {
	return (
		<>
			<Header />
			<main id="main-content">
				<Faith />
			</main>
			<Footer />
		</>
	);
}
