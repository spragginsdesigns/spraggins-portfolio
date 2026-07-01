import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-card/50 border-t border-border/50 text-foreground py-8">
			<div className="container mx-auto px-4">
				<div className="flex flex-col md:flex-row justify-between items-center">
					<div className="mb-4 md:mb-0">
						<p>&copy; {currentYear} Spraggins Designs. All rights reserved.</p>
					</div>
					<div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
						<Link href="/" className="hover:text-primary transition-colors">
							Home
						</Link>
						<Link
							href="#about"
							className="hover:text-primary transition-colors"
						>
							About
						</Link>
						<Link
							href="#projects"
							className="hover:text-primary transition-colors"
						>
							Projects
						</Link>
						<Link
							href="#expertise"
							className="hover:text-primary transition-colors"
						>
							Expertise
						</Link>
						<Link
							href="#contact"
							className="hover:text-primary transition-colors"
						>
							Contact
						</Link>
						<Link
							href="/blog"
							className="hover:text-primary transition-colors"
						>
							Blog
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
