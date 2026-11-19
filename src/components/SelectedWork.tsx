import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Code2, Store } from "lucide-react";
import { BrandIcon } from "@/components/BrandIcon";
import { FMT, GUNMETAL_ORBIT, STATS } from "@/lib/stats";
import styles from "./Portfolio.module.css";
import ReleaseFrame, { lineCrushRelease } from "./ReleaseFrame";

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

export default function SelectedWork() {
	return (
		<section id="projects" aria-labelledby="selected-work-title" className={styles.selected} tabIndex={-1}>
			<div className={styles.wrap}>
				<h2 id="selected-work-title" className={styles.sectionTitle}>Selected work</h2>
				<article className={styles.leadCase} aria-labelledby="linecrush-lead-title">
					<div className={styles.leadCopy}>
						<p className={styles.projectRole}>Co-Founder &amp; CTO</p>
						<h3 id="linecrush-lead-title">LineCrush</h3>
						<p className={styles.projectTitle}>From the first codebase to a live research platform</p>
						<p className={styles.projectText}>
							I started the Next.js and Python codebase and built LineCrush with Jay. I built real-time updates
							and automated backend releases. I started both native apps, kept writing SwiftUI and Kotlin
							after launch, and own both store releases. The fleet I built delivers most new app features.
						</p>
						<p className={styles.projectStack}>Next.js · Python · SwiftUI · Kotlin</p>
						<Link className={styles.textAction} href="/work/linecrush">
							<BrandIcon href="/work/linecrush" /> Read the LineCrush case study <ArrowRight size={17} aria-hidden="true" />
						</Link>
					</div>
					<div className={styles.previewStage} data-linecrush-destination>
						<ReleaseFrame {...lineCrushRelease} />
					</div>
				</article>

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

				<article className={styles.project} data-project="sureword">
					<div className={styles.projectCopy}>
						<p className={styles.projectRole}>Creator &amp; Engineer</p>
						<h3>SureWord</h3>
						<p className={styles.projectTitle}>Personal Bible study that continues across devices</p>
						<p className={styles.projectText}>
							I created SureWord and shipped the web, Android, iPhone, iPad, and Mac apps myself. Your reading,
							notes, and questions carry across devices, and Bible quotations come from the stored Scripture text.
							SureWord has a free plan and optional Pro.
						</p>
						<p className={styles.projectStack}>Next.js · AI SDK · React Native · SwiftUI</p>
						<Link className={styles.textAction} href="/work/sureword">
							<BrandIcon href="/work/sureword" /> Explore SureWord <ArrowRight size={17} aria-hidden="true" />
						</Link>
					</div>
					<div className={styles.projectMedia}>
						<Image src="/images/work/sureword-study.webp" alt="SureWord on iPhone answering a study question with Scripture citations"
							width={720} height={1565} sizes="(max-width: 640px) 145px, 180px" />
					</div>
				</article>

				<section className={styles.fleet} id="ai-systems" aria-labelledby="fleet-title">
					<div>
						<p className={styles.projectRole}>Developer tooling</p>
						<h3 id="fleet-title">C2 and the engineering fleet</h3>
						<p className={styles.projectText}>
							I built the engineering agent fleet and our issue tracker, C2. Jay and I operate the fleet together.
							The LineCrush case study follows one change all the way to the App Store release notes.
						</p>
						<Link href="/work/linecrush#c2" className={styles.textAction}>
							<BrandIcon href="/work/linecrush" /> See how we ship <ArrowRight size={17} aria-hidden="true" />
						</Link>
					</div>
					<div className={styles.fleetFact}>
						<strong>{FMT.fleetJobsWithCommitLinks}</strong>
						<span>completed fleet jobs with a recorded commit link</span>
						<time dateTime={STATS.verifiedDate}>Through November 17, 2026</time>
					</div>
				</section>

				<article className={styles.game} id="game-spotlight">
					<div className={styles.gameMedia}>
						<Image src="/images/games/gunmetal-orbit/screenshot-v2-1.jpg" alt="Gunmetal Orbit gameplay: a final-wave boss fight around the mining station"
							fill sizes="(max-width: 760px) 100vw, 48vw" />
					</div>
					<div className={styles.gameCopy}>
						<p className={styles.projectRole}><BrandIcon href="/games" /> Commercial game · Steam</p>
						<h3>{GUNMETAL_ORBIT.name}</h3>
						<p className={styles.projectText}>
							I designed and developed Gunmetal Orbit in Godot for Steam Deck first and took it from the first
							playable build to a paid Steam release in {STATS.firstGameToSteamDays} days. I built the release
							pipeline and kept testing on Deck, where I fixed a shop navigation bug and added a controller regression test.
						</p>
						<div className={styles.actions}>
						<Link href="/work/game-development" className={styles.textAction}>Read the game development case study <ArrowRight size={17} aria-hidden="true" /></Link>
						<Link href="/games" className={styles.textAction}>Explore the game <ArrowRight size={17} aria-hidden="true" /></Link>
							<a href={GUNMETAL_ORBIT.steamUrl} className={styles.textAction}><BrandIcon href={GUNMETAL_ORBIT.steamUrl} /> Steam <ArrowUpRight size={17} aria-hidden="true" /></a>
						</div>
					</div>
				</article>

				<div className={styles.moreWork}>
					<div id="local-websites">
						<Store size={23} aria-hidden="true" />
						<h3>Paid client work</h3>
						<p>Automated course registration for SaveALife CPR and built a live catalog and inquiry site for Two Cities Off Road.</p>
						<Link href="/work/independent#client-delivery" className={styles.textAction}>Explore client work <ArrowRight size={16} aria-hidden="true" /></Link>
						<a href="https://twocitiesoffroad.com/" className={styles.textAction}><BrandIcon href="https://twocitiesoffroad.com/" /> Visit Two Cities Off Road <ArrowUpRight size={16} aria-hidden="true" /></a>
						<Link href="/local-websites" className={styles.textAction}>Websites for Fresno businesses <ArrowRight size={16} aria-hidden="true" /></Link>
					</div>
					<div>
						<Code2 size={23} aria-hidden="true" />
						<h3>Open source</h3>
						<p>Contributed a session-exit fix to the tty7 terminal and published a React component for showing apps in a Steam Deck frame.</p>
						<Link href="/work/independent#developer-tools" className={styles.textAction}>Explore public tools <ArrowRight size={16} aria-hidden="true" /></Link>
						<a href="https://github.com/l0ng-ai/tty7/pull/877" className={styles.textAction}><BrandIcon href="https://github.com" /> Read the tty7 pull request <ArrowUpRight size={16} aria-hidden="true" /></a>
						<a href="https://www.npmjs.com/package/react-steam-deck" className={styles.textAction}><BrandIcon href="https://www.npmjs.com" size={26} /> Find react-steam-deck on npm <ArrowUpRight size={16} aria-hidden="true" /></a>
					</div>
				</div>
			</div>
		</section>
	);
}
