"use client";

import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

interface CountUpProps {
	end: number;
	duration?: number;
	className?: string;
	format?: (value: number) => string;
}

export const CountUp: React.FC<CountUpProps> = ({
	end,
	duration = 1600,
	className,
	format = (value) => value.toLocaleString(),
}) => {
	const [value, setValue] = useState(0);
	const { ref, inView } = useInView({ threshold: 0.4, triggerOnce: true });

	useEffect(() => {
		if (!inView) return;

		let frame: number;
		const start = performance.now();

		const tick = (now: number) => {
			const progress = Math.min((now - start) / duration, 1);
			// easeOutExpo — fast start, satisfying settle
			const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
			setValue(Math.round(end * eased));
			if (progress < 1) {
				frame = requestAnimationFrame(tick);
			}
		};

		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [inView, end, duration]);

	return (
		<span ref={ref} className={className}>
			{format(value)}
		</span>
	);
};
