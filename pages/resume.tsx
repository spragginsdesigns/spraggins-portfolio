import Resume from "@/components/Resume";
import Footer from "@/components/Footer";

export default function ResumePage() {
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-4xl font-bold mb-8 text-center">My Resume</h1>
			<Resume />
			<Footer />
		</div>
	);
}
