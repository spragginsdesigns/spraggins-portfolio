"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		const updateProgress = () => {
			const scrollTop = window.scrollY;
			const docHeight = document.documentElement.scrollHeight - window.innerHeight;
			const scrollProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
			setProgress(Math.min(scrollProgress, 100));
		};

		window.addEventListener("scroll", updateProgress, { passive: true });
		updateProgress(); // Initial call

		return () => window.removeEventListener("scroll", updateProgress);
	}, []);

	return (
		<div className="fixed top-0 left-0 right-0 z-50 h-1 bg-background/50">
			<div
				className="h-full bg-gradient-to-r from-primary via-cyan-400 to-primary transition-all duration-150 ease-out"
				style={{ width: `${progress}%` }}
			/>
		</div>
	);
}
