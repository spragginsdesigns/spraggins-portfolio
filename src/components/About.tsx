import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandIcon } from "@/components/BrandIcon";
import styles from "./About.module.css";

const chapters = [
	{
		period: "Before tech",
		title: "A different kind of daily driver.",
		text: "My first career was driving trucks. The work was different, but taking responsibility and following through mattered just as much. I brought that with me when I went back to school.",
		footnote: "From the road to the classroom",
	},
	{
		period: "2021",
		title: "Learning the foundations.",
		text: "I earned my A.S. in Information Systems: Web Design at Clovis Community College. I also started doing web development work for Effycient and the college, building client sites and maintaining web pages.",
		footnote: "Clovis Community College",
	},
	{
		period: "Jan 2022 - Jul 2023",
		title: "Teaching what I was building.",
		text: "I taught web development at Bitwise Industries and Geekwise Academy. We worked through HTML, CSS, JavaScript, and React. Helping someone get their first app working was definitely one of the best parts.",
		footnote: "Web Development Instructor",
	},
	{
		period: "2023 - 2024",
		title: "Real businesses, real requirements.",
		text: "As a paid full-stack developer for Gelateria Del Centro, I built and maintained the business website. I owned the implementation, content updates, and search visibility, and learned what it takes to keep a site useful after launch.",
		footnote: "Client development",
	},
	{
		period: "2024 - today",
		title: "Starting LineCrush. Building it with Jay.",
		text: "I started the codebase in 2024 and built LineCrush with my co-founder, Jay. It grew into a paid sports research platform. As CTO, I work across the product, backend, infrastructure, and the things that need fixing once people actually use it.",
		footnote: "Co-Founder & CTO",
		href: "/work/linecrush",
		linkLabel: "The LineCrush story",
	},
	{
		period: "2026",
		title: "More products. A different way to build.",
		text: "I built the iOS and Android apps for both LineCrush and SureWord myself. I also brought SureWord to Mac, released Gunmetal Orbit on Steam, and designed the agent fleet our team uses to keep shipping. I run those agents all day from my desktop, laptop, and phone. I know how to brief them properly, how to review their work, and when to stop one that's headed the wrong way.",
		footnote: "Native apps, applied AI, and games",
		href: "/work/sureword",
		linkLabel: "Why I built SureWord",
	},
];

export default function About() {
	return (
			<section id="about" aria-labelledby="about-heading" className={styles.about}>
				<div className={styles.container}>
					<div className={styles.sectionLabel}>
						<span className={styles.location}>Fresno, California</span>
					</div>
					<header className={styles.header}>
						<h2 id="about-heading">From the road<br />to building <span>products.</span></h2>
						<p>
							I didn&apos;t take a straight path into software. I drove trucks,
							went back to college, taught web development, and started building
							products of my own. I&apos;m still learning every day.
						</p>
					</header>
					<div className={styles.storyGrid}>
						<aside className={styles.context} aria-label="What matters to me">
							<div className={styles.personal}>
								<span className={styles.smallLabel}>The reason behind it</span>
								<h3>A father.<br />A believer.<br />A builder.</h3>
								<p>
									I&apos;m a father of two, and being there for my children matters
									more to me than any title. After a difficult period in my life,
									I found faith in Jesus Christ and a renewed purpose.
								</p>
								<p>
									I want to serve God, provide for my family, and build things
									that help people. That&apos;s what I&apos;m working toward.
								</p>
								<Link href="/faith" className={styles.personalLink}>
									My faith and testimony <ArrowUpRight size={16} aria-hidden="true" />
								</Link>
							</div>
							<div className={styles.consistency}>
								<span className={styles.smallLabel}>Showing up / 2025</span>
								<p className={styles.commitDays}>355<span> / 365</span></p>
								<p>Days with a LineCrush commit under my name.</p>
								<p>During the build-out I remember some weeks going past 100 hours between engineering and running the business.</p>
								<p className={styles.measurementNote}>
									From the commit history, checked November 17, 2026. Commit
									timestamps show which days I was active.
								</p>
								<a href="#work-log" className={styles.textLink}>
									See the measured work log <ArrowUpRight size={16} aria-hidden="true" />
								</a>
							</div>
						</aside>
						<ol className={styles.timeline}>
							{chapters.map((chapter) => (
								<li key={chapter.period} className={styles.chapter}>
									<div className={styles.chapterMeta}>
										<span>{chapter.period}</span>
									</div>
									<h3>{chapter.title}</h3>
									<p>{chapter.text}</p>
									<div className={styles.chapterFooter}>
										<span>{chapter.footnote}</span>
										{chapter.href && (
											<Link href={chapter.href} className={styles.textLink}>
												<BrandIcon href={chapter.href} size={16} />
												{chapter.linkLabel} <ArrowUpRight size={15} aria-hidden="true" />
											</Link>
										)}
									</div>
								</li>
							))}
						</ol>
					</div>
				</div>
			</section>
	);
}
