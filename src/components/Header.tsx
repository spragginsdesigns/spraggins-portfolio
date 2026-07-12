"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
	{ label: "AI Systems", href: "/#ai-systems" },
	{ label: "Projects", href: "/#projects" },
	{ label: "Expertise", href: "/#expertise" },
	{ label: "About", href: "/#about" },
	{ label: "Blog", href: "/blog" },
	{ label: "Contact", href: "/#contact" }
];

const Header: React.FC = () => {
	const [scrolled, setScrolled] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 40);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<header
			className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
				scrolled || menuOpen
					? "bg-background/80 backdrop-blur-md border-b border-border/40 shadow-lg shadow-background/20"
					: "bg-transparent border-b border-transparent"
			}`}
		>
			<div className="container mx-auto px-4 h-14 flex items-center justify-between">
				<Link
					href="/"
					className="font-heading font-bold text-lg tracking-tight"
					onClick={() => setMenuOpen(false)}
				>
					<span className="text-primary">Austin</span>{" "}
					<span className="text-foreground">Spraggins</span>
				</Link>

				{/* Desktop nav */}
				<nav className="hidden lg:flex items-center gap-5">
					{navLinks.map((link) => (
						<Link
							key={link.label}
							href={link.href}
							className="text-sm text-muted-foreground hover:text-primary transition-colors"
						>
							{link.label}
						</Link>
					))}
					<Link
						href="/#contact"
						className="text-sm font-semibold bg-primary text-background px-4 py-1.5 rounded-full hover:shadow-lg hover:shadow-primary/25 transition-all"
					>
						Hire Me
					</Link>
				</nav>

				{/* Mobile menu button */}
				<button
					type="button"
					className="lg:hidden p-2 text-muted-foreground hover:text-primary transition-colors"
					aria-label={menuOpen ? "Close menu" : "Open menu"}
					aria-expanded={menuOpen}
					onClick={() => setMenuOpen((open) => !open)}
				>
					{menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
				</button>
			</div>

			{/* Mobile nav */}
			{menuOpen && (
				<nav className="lg:hidden bg-background/95 backdrop-blur-md border-b border-border/40">
					<div className="container mx-auto px-4 py-3 flex flex-col gap-1">
						{navLinks.map((link) => (
							<Link
								key={link.label}
								href={link.href}
								className="py-2.5 text-sm text-muted-foreground hover:text-primary transition-colors"
								onClick={() => setMenuOpen(false)}
							>
								{link.label}
							</Link>
						))}
					</div>
				</nav>
			)}
		</header>
	);
};

export default Header;
