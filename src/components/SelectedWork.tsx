import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Code2, Gamepad2, Store } from "lucide-react";
import { FMT, GUNMETAL_ORBIT, STATS } from "@/lib/stats";
import styles from "./Portfolio.module.css";

const projects = [
	{
		slug: "linecrush",
		name: "LineCrush",
		role: "Co-Founder & CTO",
		title: "From a web codebase to two native app stores",
		description: "I started the codebase and built LineCrush with Jay. I built the iOS app in SwiftUI and the Android app in Kotlin and Jetpack Compose myself, then took both through release and store review.",
		stack: "Next.js · Python · SwiftUI · Kotlin",
		image: "/images/work/linecrush-research.webp",
		alt: "LineCrush on iPhone with player statistics, a research card, and a historical chart",
		height: 1564
	},
	{
		slug: "sureword",
		name: "SureWord",
		role: "Creator & Engineer",
		title: "One study that continues across devices",
		description: "I built SureWord for the web, then built the iOS and Android apps myself. To keep verse quotations exact, the server supplies the Scripture text while the AI explains it.",
		stack: "Next.js · AI SDK · React Native · SwiftUI",
		image: "/images/work/sureword-study.webp",
		alt: "SureWord on iPhone answering a study question with Scripture citations",
		height: 1565
	}
] as const;

export default function SelectedWork() {
	return (
		<section id="projects" aria-labelledby="selected-work-title" className={styles.selected}>
			<div className={styles.wrap}>
				<h2 id="selected-work-title" className={styles.sectionTitle}>Selected work</h2>
				<div className={styles.projectGrid}>
					{projects.map((project) => (
						<article className={styles.project} data-project={project.slug} key={project.slug}>
							<div className={styles.projectCopy}>
								<p className={styles.projectRole}>{project.role}</p>
								<h3>{project.name}</h3>
								<p className={styles.projectTitle}>{project.title}</p>
								<p className={styles.projectText}>{project.description}</p>
								<p className={styles.projectStack}>{project.stack}</p>
								<Link className={styles.textAction} href={`/work/${project.slug}`}>
									Explore {project.name}
									<ArrowRight size={17} aria-hidden="true" />
								</Link>
							</div>
							<div className={styles.projectMedia}>
								<Image src={project.image} alt={project.alt} width={720} height={project.height}
									sizes="(max-width: 640px) 145px, (max-width: 1000px) 220px, 250px" />
							</div>
						</article>
					))}
				</div>

				<section className={styles.fleet} id="ai-systems" aria-labelledby="fleet-title">
					<div>
						<p className={styles.projectRole}>Developer tooling</p>
						<h3 id="fleet-title">C2 and the engineering fleet</h3>
						<p className={styles.projectText}>
							I designed the agent fleet we use at LineCrush and led the move from Linear to our own issue tracker, C2.
							The LineCrush case study follows one change all the way to the App Store release notes.
						</p>
						<Link href="/work/linecrush#c2" className={styles.textAction}>
							See how we ship <ArrowRight size={17} aria-hidden="true" />
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
						<Image src="/images/games/gunmetal-orbit/screenshot-release-1.jpg" alt="Gunmetal Orbit gameplay"
							fill sizes="(max-width: 760px) 100vw, 48vw" />
					</div>
					<div className={styles.gameCopy}>
						<p className={styles.projectRole}><Gamepad2 size={17} aria-hidden="true" /> Commercial game · Steam</p>
						<h3>{GUNMETAL_ORBIT.name}</h3>
						<p className={styles.projectText}>
							I built a space-mining roguelite for Steam Deck and PC. It took {STATS.firstGameToSteamDays} days to get
							from the first playable build to Steam. After launch, I caught a shop navigation bug on my own Steam Deck
							and wrote a regression test that drives the same UI with controller input.
						</p>
						<div className={styles.actions}>
							<Link href="/games" className={styles.textAction}>Explore the game <ArrowRight size={17} aria-hidden="true" /></Link>
							<a href={GUNMETAL_ORBIT.steamUrl} className={styles.textAction}>Steam <ArrowUpRight size={17} aria-hidden="true" /></a>
						</div>
					</div>
				</article>

				<div className={styles.moreWork}>
					<div id="local-websites">
						<Store size={23} aria-hidden="true" />
						<h3>Paid client work</h3>
						<p>Automated course registration for SaveALife CPR and built a live catalog and inquiry site for Two Cities Off Road.</p>
						<a href="https://twocitiesoffroad.com/" className={styles.textAction}>Visit Two Cities Off Road <ArrowUpRight size={16} aria-hidden="true" /></a>
						<Link href="/local-websites" className={styles.textAction}>Websites for Fresno businesses <ArrowRight size={16} aria-hidden="true" /></Link>
					</div>
					<div>
						<Code2 size={23} aria-hidden="true" />
						<h3>Open source</h3>
						<p>Contributed a session-exit fix to the tty7 terminal and published a React component for showing apps in a Steam Deck frame.</p>
						<a href="https://github.com/l0ng-ai/tty7/pull/877" className={styles.textAction}>Read the tty7 pull request <ArrowUpRight size={16} aria-hidden="true" /></a>
						<a href="https://www.npmjs.com/package/react-steam-deck" className={styles.textAction}>Find react-steam-deck on npm <ArrowUpRight size={16} aria-hidden="true" /></a>
					</div>
				</div>
			</div>
		</section>
	);
}
