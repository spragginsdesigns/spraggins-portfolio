import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { caseStudies, caseStudySlugs, isCaseStudySlug } from "@/lib/case-studies";
import styles from "./work.module.css";

const BASE_URL = "https://www.spragginsdesigns.xyz";
type PageProps = { params: { slug: string } };

export function generateStaticParams() {
	return caseStudySlugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
	if (!isCaseStudySlug(params.slug)) return {};
	const study = caseStudies[params.slug];
	const title = `${study.name} case study | Austin Spraggins`;
	const url = `${BASE_URL}/work/${params.slug}`;
	const images = [{ url: study.cover, width: 1536, height: 1024, alt: `${study.name} case study cover` }];

	return {
		title,
		description: study.description,
		alternates: { canonical: url },
		openGraph: {
			title,
			description: study.description,
			url,
			siteName: "Austin Spraggins",
			type: "article",
			publishedTime: study.published,
			locale: "en_US",
			images
		},
		twitter: {
			card: "summary_large_image",
			title,
			description: study.description,
			creator: "@spragginsdesign",
			images
		}
	};
}

function StudyLink({ href, label }: { href: string; label: string }) {
	if (href.startsWith("/")) {
		return <Link href={href}>{label}<ArrowRight size={14} aria-hidden="true" /></Link>;
	}

	return <a href={href}>{label}<ArrowUpRight size={14} aria-hidden="true" /></a>;
}

export default function CaseStudyPage({ params }: PageProps) {
	if (!isCaseStudySlug(params.slug)) notFound();
	const slug = params.slug;
	const study = caseStudies[slug];
	const url = `${BASE_URL}/work/${slug}`;
	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "Article",
				"@id": `${url}#article`,
				headline: `${study.name} | ${study.title}`,
				datePublished: study.published,
				dateModified: "2026-11-18",
				description: study.description,
				url,
				mainEntityOfPage: url,
				image: `${BASE_URL}${study.cover}`,
				author: { "@type": "Person", name: "Austin Spraggins", url: BASE_URL }
			},
			{
				"@type": "BreadcrumbList",
				itemListElement: [
					{ "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
					{ "@type": "ListItem", position: 2, name: `${study.name} case study`, item: url }
				]
			}
		]
	};

	return (
		<div className={styles.page} style={{ "--study-accent": study.accent } as CSSProperties}>
			<a href="#case-study" className={styles.skipLink}>Skip to case study</a>
			<Header />
			<main id="case-study" className={styles.main}>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
				/>
				<div className={styles.container}>
					<Link href="/#projects" className={styles.backLink}>
						<ArrowLeft size={15} aria-hidden="true" /> All selected work
					</Link>
					<article>
						<header className={styles.hero}>
							<div className={styles.heroCopy}>
								<p className={styles.eyebrow}>{study.name}</p>
								<h1>{study.title}</h1>
								<p className={styles.intro}>{study.intro}</p>
								<div className={styles.links}>
									{study.links.map((link) => <StudyLink key={link.href} {...link} />)}
								</div>
							</div>
							<figure className={styles.cover}>
								<div className={styles.coverFrame}>
									<Image src={study.cover} alt="" fill priority sizes="(max-width: 800px) calc(100vw - 36px), (max-width: 1250px) 50vw, 620px" />
								</div>
								<figcaption>AI-generated illustration</figcaption>
							</figure>
						</header>
						<dl className={styles.facts}>
							<div><dt>Role</dt><dd>{study.role}</dd></div>
							<div><dt>Shipped</dt><dd>{study.result}</dd></div>
							<div><dt>Timeline</dt><dd>{study.period}</dd></div>
						</dl>

						<div className={styles.readingLayout}>
							<aside className={styles.rail}>
								<nav aria-labelledby="chapter-nav-title">
									<p className={styles.eyebrow} id="chapter-nav-title">In this case study</p>
									<ul>
										<li><a href="#milestones">Milestones <ArrowDown size={13} aria-hidden="true" /></a></li>
										{study.sections.map(({ id, label }) => (
											<li key={id}><a href={`#${id}`}>{label} <ArrowDown size={13} aria-hidden="true" /></a></li>
										))}
									</ul>
								</nav>
							</aside>

							<div className={styles.story}>
								<section id="milestones" className={styles.storySection} aria-labelledby="milestones-title">
									<h2 id="milestones-title">Milestones</h2>
									<ol className={styles.timeline}>
										{study.timeline.map(({ date, event }) => (
											<li key={date}><span>{date}</span><p>{event}</p></li>
										))}
									</ol>
								</section>
								{study.sections.map((section) => (
									<section key={section.id} id={section.id} className={styles.storySection} aria-labelledby={`${section.id}-title`}>
										<p className={styles.eyebrow}>{section.label}</p>
										<h2 id={`${section.id}-title`}>{section.title}</h2>
										<div className={styles.prose}>
											{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
										</div>
										{section.media && (
											<div className={section.media.length > 1 ? styles.mediaGrid : styles.mediaSingle}>
												{section.media.map(({ src, alt, caption, shape }) => (
													<figure key={src} className={styles.figure}>
														<div className={`${styles.imageFrame} ${styles[shape]}`}>
															<Image src={src} alt={alt} fill sizes={shape === "portrait" ? "(max-width: 500px) 42vw, 250px" : "(max-width: 800px) 92vw, 840px"} />
														</div>
														<figcaption>{caption}</figcaption>
													</figure>
												))}
											</div>
										)}
										{section.steps && (
											<ol className={styles.steps} aria-label="Workflow">
												{section.steps.map((step) => <li key={step}>{step}</li>)}
											</ol>
										)}
										{section.metrics && (
											<div className={styles.metricBand}>
												<dl className={styles.metrics}>
													{section.metrics.map(({ label, value }) => (
														<div key={label}><dt>{label}</dt><dd>{value}</dd></div>
													))}
												</dl>
												<p className={styles.metricNote}>{section.metricNote}</p>
											</div>
										)}
										{section.proof && (
											<div className={styles.proofLinks}>
												{section.proof.map((link) => <StudyLink key={link.href} {...link} />)}
											</div>
										)}
									</section>
								))}
								<ul className={styles.stack} aria-label="Technologies used">
									{study.stack.map((item) => <li key={item}>{item}</li>)}
								</ul>
							</div>
						</div>
					</article>

					<section className={styles.moreWork} aria-labelledby="more-work-title">
						<h2 id="more-work-title">More case studies</h2>
						<ul>
							{caseStudySlugs.filter((otherSlug) => otherSlug !== slug).map((otherSlug) => {
								const other = caseStudies[otherSlug];
								return (
									<li key={otherSlug}>
										<Link href={`/work/${otherSlug}`}>
											<span className={styles.thumbnail}>
												<Image src={other.cover} alt="" fill sizes="(max-width: 500px) 96px, (max-width: 1250px) 30vw, 390px" />
											</span>
											<span className={styles.cardTitle}>{other.name}<ArrowRight size={17} aria-hidden="true" /></span>
										</Link>
									</li>
								);
							})}
						</ul>
					</section>
				</div>
			</main>
			<Footer />
		</div>
	);
}
