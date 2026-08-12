"use client";

import { useEffect, useState } from "react";

export interface TocHeading {
	id: string;
	text: string;
	level: 2 | 3;
}

export default function TableOfContents({
	headings
}: {
	headings: TocHeading[];
}) {
	const [activeId, setActiveId] = useState<string>("");

	useEffect(() => {
		// Track which heading is closest above the reading line
		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries.filter((entry) => entry.isIntersecting);
				if (visible.length > 0) {
					setActiveId(visible[0].target.id);
				}
			},
			{ rootMargin: "-96px 0px -66% 0px", threshold: 0 }
		);

		headings.forEach((heading) => {
			const el = document.getElementById(heading.id);
			if (el) observer.observe(el);
		});

		return () => observer.disconnect();
	}, [headings]);

	if (headings.length < 2) return null;

	const scrollTo = (id: string) => (event: React.MouseEvent) => {
		event.preventDefault();
		document
			.getElementById(id)
			?.scrollIntoView({ behavior: "smooth", block: "start" });
		window.history.replaceState(null, "", `#${id}`);
	};

	return (
		<nav aria-label="Table of contents" className="text-sm">
			<p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70 mb-4">
				On this page
			</p>
			<ul className="space-y-1 border-l border-border/30">
				{headings.map((heading) => (
					<li key={heading.id}>
						<a
							href={`#${heading.id}`}
							onClick={scrollTo(heading.id)}
							className={`block py-1.5 pr-2 leading-snug border-l -ml-px transition-colors ${
								heading.level === 3 ? "pl-8" : "pl-4"
							} ${
								activeId === heading.id
									? "border-primary text-primary"
									: "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
							}`}
						>
							{heading.text}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}
