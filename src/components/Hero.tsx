import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, FileText, MapPin } from "lucide-react";
import { FMT, STATS } from "@/lib/stats";
import styles from "./Portfolio.module.css";
import WorkPreview from "./WorkPreview";

const evidence = [
	{
		value: `${STATS.lineCrushEditorHours.toLocaleString("en-US")}+`,
		label: "WakaTime editor hours on LineCrush",
		href: "https://wakatime.com/badge/github/spragginsdesigns/Context-Pro-AI.svg"
	},
	{
		value: FMT.fleetCompletedJobs,
		label: "Jobs completed by the fleet",
		href: "/work/linecrush#c2"
	},
	{
		value: `${STATS.firstGameToSteamDays} days`,
		label: "First playable build to Steam",
		href: "/#game-spotlight"
	}
];

export default function Hero() {
	return (
		<section className={styles.hero} aria-labelledby="portfolio-title">
			<div className={styles.wrap}>
				<div className={styles.heroGrid}>
					<div className={styles.heroCopy}>
						<div className={styles.identity}>
							<Image
								src="/images/work/austin-spraggins.webp"
								alt=""
								width={52}
								height={52}
								className={styles.portrait}
							/>
							<div>
								<h1 id="portfolio-title">Austin Spraggins</h1>
								<span><MapPin size={12} aria-hidden="true" /> Fresno, California</span>
							</div>
						</div>
						<p className={styles.role}>Senior Product Engineer</p>
						<p className={styles.heroHeadline}>I build products.<br /><span>From the interface<br className={styles.desktopBreak} /> to the infrastructure.</span></p>
						<p className={styles.intro}>
							Co-Founder &amp; CTO at LineCrush. I started the codebase, built the business with Jay,
							and built the iOS and Android apps for both LineCrush and SureWord myself.
						</p>
						<div className={styles.actions}>
							<a href="#projects" className={styles.primaryAction}>
								See selected work <ArrowDownRight size={19} aria-hidden="true" />
							</a>
							<Link href="/resume" className={styles.secondaryAction}>
								<FileText size={17} aria-hidden="true" /> View résumé
							</Link>
						</div>
						<a href="#faith" className={styles.faithLink}>Saved by grace through faith in Jesus Christ</a>
					</div>
					<WorkPreview />
				</div>
				<dl className={styles.evidence}>
					{evidence.map(({ value, label, href }) => (
						<div key={label}>
							<dt className={styles.evidenceLabel}>{label}</dt>
							<dd>
								<a href={href} aria-label={`${value} ${label}`}>
									{value} <ArrowRight size={15} aria-hidden="true" />
								</a>
							</dd>
						</div>
					))}
				</dl>
			</div>
		</section>
	);
}
