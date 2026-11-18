"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./Portfolio.module.css";

const products = [
	{
		id: "linecrush", name: "LineCrush", category: "Sports research",
		platform: "Native iPad app", role: "Co-Founder & CTO",
		description: "One product. Web, iOS, and Android.",
		image: "/images/work/editorial-linecrush.webp", width: 825, height: 1100,
		alt: "The shipped LineCrush native iPad app, with a historical player-statistics chart and research navigation",
		href: "/work/linecrush", link: "Read the case study", stack: "Next.js / SwiftUI / Kotlin / Python"
	},
	{
		id: "sureword", name: "SureWord", category: "Bible study",
		platform: "Native iPad app", role: "Creator & Engineer",
		description: "Bible study with Scripture at its center.",
		image: "/images/work/editorial-sureword.webp", width: 687, height: 908,
		alt: "The shipped SureWord iPad app answering Bible study questions with quoted Scripture and verse references",
		href: "/work/sureword", link: "Read the case study", stack: "Next.js / AI SDK / React Native / SwiftUI"
	},
	{
		id: "gunmetal", name: "Gunmetal Orbit", category: "Game development",
		platform: "Released on Steam", role: "Game Creator & Engineer",
		description: "A space-mining roguelite, built and shipped.",
		image: "/images/games/gunmetal-orbit/screenshot-v2-1.jpg", width: 1280, height: 720,
		alt: "Gunmetal Orbit gameplay showing a final-wave boss fight around the mining station and the player interface",
		href: "/games", link: "Explore the game", stack: "Godot / Steam / Steam Deck"
	}
] as const;

export default function WorkPreview() {
	const [active, setActive] = useState(0);
	const tabs = useRef<(HTMLButtonElement | null)[]>([]);
	const product = products[active];

	function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
		let next: number;
		if (event.key === "ArrowRight") next = (index + 1) % products.length;
		else if (event.key === "ArrowLeft") next = (index + products.length - 1) % products.length;
		else if (event.key === "Home") next = 0;
		else if (event.key === "End") next = products.length - 1;
		else return;
		event.preventDefault();
		setActive(next);
		tabs.current[next]?.focus();
	}

	return (
		<div className={styles.workPreview} data-preview={product.id}>
			<p className={styles.previewEyebrow}>Selected releases</p>
			<div className={styles.previewTabs} role="tablist" aria-label="Preview a shipped product">
				{products.map((item, index) => (
					<button key={item.id} type="button" role="tab" id={`preview-tab-${item.id}`}
						aria-selected={active === index} aria-controls={`preview-panel-${item.id}`}
						tabIndex={active === index ? 0 : -1} ref={(node) => { tabs.current[index] = node; }}
						onClick={() => setActive(index)} onKeyDown={(event) => onTabKeyDown(event, index)}>
						{item.name}
					</button>
				))}
			</div>
			{products.map((item, index) => (
				<div key={item.id} role="tabpanel" id={`preview-panel-${item.id}`}
					aria-labelledby={`preview-tab-${item.id}`} hidden={active !== index} tabIndex={0}>
					<div className={styles.previewStage}>
						<div className={styles.previewMargin} aria-hidden="true"><span>{item.category}</span><span>{item.platform}</span></div>
						<Image src={item.image} alt={item.alt} width={item.width} height={item.height}
							priority={index === 0} sizes="(max-width: 650px) 270px, (max-width: 1000px) 330px, 380px"
							className={styles.previewImage} />
					</div>
					<div className={styles.previewCaption}>
						<div><p>{item.role}</p><h2>{item.description}</h2></div>
					</div>
					<div className={styles.previewFoot}><span>{item.stack}</span><Link href={item.href} aria-label={`${item.link}: ${item.name}`}>{item.link} <ArrowUpRight size={15} aria-hidden="true" /></Link></div>
				</div>
			))}
		</div>
	);
}
