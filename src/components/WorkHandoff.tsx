"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useScroll } from "framer-motion";
import styles from "./Portfolio.module.css";

export default function WorkHandoff({ children }: { children: ReactNode }) {
	const root = useRef<HTMLDivElement>(null);
	const { scrollY } = useScroll();

	useEffect(() => {
		const group = root.current;
		const source = group?.querySelector<HTMLElement>("[data-linecrush-source]");
		const destination = group?.querySelector<HTMLElement>("[data-linecrush-destination]");
		const preview = source?.closest<HTMLElement>("[data-preview]");
		const work = destination?.closest<HTMLElement>("#projects");
		if (!group || !source || !destination || !preview || !work) return;

		const motion = window.matchMedia("(min-width: 1001px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)");
		let layout: { holdTop: number; sourceTop: number; fadeDistance: number; settle: number; finish: number; dx: number; dy: number } | null = null;
		let frame = 0;

		function paint(y: number) {
			if (!layout || !group || !source) return;
			const { holdTop, sourceTop, fadeDistance, settle, finish, dx, dy } = layout;
			// Hash navigation can round the anchor position to a whole pixel.
			const phase = y + 1 >= finish ? "docked" : y >= sourceTop - holdTop ? "moving" : "start";
			if (group.dataset.workHandoff !== phase) group.dataset.workHandoff = phase;
			if (phase !== "moving") return;

			// Hold the frame in the viewport, then release it into the measured destination.
			const progress = Math.max(0, Math.min(1, (y - settle) / Math.max(1, finish - settle)));
			const eased = progress * progress * (3 - 2 * progress);
			const pinned = y + holdTop - sourceTop;
			const fade = Math.max(0, Math.min(1, (y - sourceTop + holdTop * 0.3) / fadeDistance));
			source.style.setProperty("--handoff-x", `${(dx * eased).toFixed(2)}px`);
			source.style.setProperty("--handoff-y", `${(pinned + (dy - pinned) * eased).toFixed(2)}px`);
			group.style.setProperty("--handoff-intro-opacity", (1 - fade).toFixed(3));
		}

		function measure() {
			if (!group || !source || !destination || !preview || !work) return;
			if (!motion.matches || preview.dataset.preview !== "linecrush") {
				layout = null;
				delete group.dataset.workHandoff;
				return;
			}

			const y = window.scrollY;
			const from = source.getBoundingClientRect();
			const to = destination.getBoundingClientRect();
			const sourceTop = from.top + y;
			const holdTop = Math.max(108, Math.min(176, window.innerHeight * 0.19));
			const margin = Number.parseFloat(getComputedStyle(work).scrollMarginTop) || 0;
			const finish = work.getBoundingClientRect().top + y - margin;
			layout = {
				holdTop,
				sourceTop,
				fadeDistance: window.innerHeight * 0.3,
				settle: Math.max(sourceTop - holdTop, finish - window.innerHeight * 0.22),
				finish,
				dx: to.left - from.left,
				dy: to.top - from.top,
			};
			paint(y);
		}

		function scheduleMeasure() {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(measure);
		}

		const resize = new ResizeObserver(scheduleMeasure);
		resize.observe(source);
		resize.observe(destination);
		resize.observe(group);
		const tabs = new MutationObserver(measure);
		tabs.observe(preview, { attributes: true, attributeFilter: ["data-preview"] });
		motion.addEventListener("change", measure);
		window.addEventListener("resize", scheduleMeasure);
		const unsubscribe = scrollY.on("change", paint);
		measure();

		return () => {
			cancelAnimationFrame(frame);
			resize.disconnect();
			tabs.disconnect();
			motion.removeEventListener("change", measure);
			window.removeEventListener("resize", scheduleMeasure);
			unsubscribe();
			delete group.dataset.workHandoff;
			group.style.removeProperty("--handoff-intro-opacity");
			source.style.removeProperty("--handoff-x");
			source.style.removeProperty("--handoff-y");
		};
	}, [scrollY]);

	return <div ref={root} className={styles.handoff}>{children}</div>;
}
