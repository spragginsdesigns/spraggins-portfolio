import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, FileText, MapPin } from "lucide-react";
import { FMT, STATS } from "@/lib/stats";
import styles from "./Portfolio.module.css";

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
							<span><MapPin size={16} aria-hidden="true" /> Fresno, California</span>
						</div>
						<h1 id="portfolio-title">Austin <span>Spraggins</span></h1>
						<p className={styles.role}>Senior Product Engineer</p>
						<p className={styles.disciplines}>Full-Stack · Native Mobile · Applied AI</p>
						<p className={styles.currentRole}>Co-Founder &amp; CTO at LineCrush</p>
						<p className={styles.intro}>
							I started LineCrush and built it with my co-founder, Jay. I also built SureWord,
							shipped a game on Steam, and designed the agent fleet our team uses to deliver software.
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
					<div className={styles.heroVisual}>
						<div className={styles.showcase}>
							<Link className={styles.heroLineCrush} href="/work/linecrush" aria-label="Read the LineCrush case study">
								<Image
									src="/images/work/linecrush-native.webp"
									alt="LineCrush's native sports research app showing a research card and historical chart"
									width={720}
									height={1564}
									sizes="(max-width: 640px) 135px, (max-width: 880px) 200px, 290px"
									priority
								/>
							</Link>
							<Link className={styles.heroSureWord} href="/work/sureword" aria-label="Read the SureWord case study">
								<Image
									src="/images/work/sureword-reader.webp"
									alt="SureWord's Bible reader showing highlighted Scripture on iPhone"
									width={600}
									height={1304}
									sizes="(max-width: 640px) 110px, (max-width: 880px) 165px, 220px"
								/>
							</Link>
						</div>
						<div className={styles.visualLinks}>
							<Link href="/work/linecrush">LineCrush <ArrowRight size={14} aria-hidden="true" /></Link>
							<Link href="/work/sureword">SureWord <ArrowRight size={14} aria-hidden="true" /></Link>
						</div>
					</div>
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
