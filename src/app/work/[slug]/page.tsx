import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
	caseStudies,
	caseStudySlugs,
	isCaseStudySlug
} from "@/lib/case-studies";
import { FMT, STATS } from "@/lib/stats";
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
			locale: "en_US",
			images: [{ url: `/images/work/${params.slug}-social.jpg`, width: 1200, height: 630, alt: `${study.name} case study by Austin Spraggins` }]
		},
		twitter: {
			card: "summary_large_image",
			title,
			description: study.description,
			creator: "@spragginsdesign",
			images: [{ url: `/images/work/${params.slug}-social.jpg`, alt: `${study.name} case study by Austin Spraggins` }]
		}
	};
}

export default function CaseStudyPage({ params }: PageProps) {
	if (!isCaseStudySlug(params.slug)) notFound();
	const slug = params.slug;
	const study = caseStudies[slug];
	const nextSlug = slug === "linecrush" ? "sureword" : "linecrush";
	const nextStudy = caseStudies[nextSlug];
	const url = `${BASE_URL}/work/${slug}`;
	const jsonLd = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "Article",
				"@id": `${url}#article`,
				headline: `${study.name}: ${study.title}`,
				datePublished: "2026-11-17",
				description: study.description,
				url,
				mainEntityOfPage: url,
				image: `${BASE_URL}/images/work/${slug}-social.jpg`,
				author: {
					"@type": "Person",
					name: "Austin Spraggins",
					url: BASE_URL
				}
			},
			{
				"@type": "BreadcrumbList",
				itemListElement: [
					{ "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
					{
						"@type": "ListItem",
						position: 2,
						name: `${study.name} case study`,
						item: url
					}
				]
			}
		]
	};

	return (
		<div className={`${styles.page} ${slug === "sureword" ? styles.warm : ""}`}>
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
								<p className={styles.eyebrow}>{study.eyebrow}</p>
								<p className={styles.productName}>{study.name}</p>
								<h1>{study.title}</h1>
								<p className={styles.intro}>{study.intro}</p>
								<dl className={styles.facts}>
									<div><dt>My role</dt><dd>{study.role}</dd></div>
									<div><dt>Shipped</dt><dd>{study.result}</dd></div>
									<div><dt>Timeline</dt><dd>{study.period}</dd></div>
								</dl>
								<div className={styles.links}>
									{study.links.map((link) => (
										<a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
											{link.label}<ArrowUpRight size={15} aria-hidden="true" />
											<span className="sr-only"> (opens in a new tab)</span>
										</a>
									))}
								</div>
								{slug === "linecrush" && (
									<a href="#c2" className={styles.sectionLink}>Jump to C2 & the agent fleet <ArrowRight size={15} aria-hidden="true" /></a>
								)}
							</div>
							<figure className={styles.productFigure}>
								<div className={styles.imageFrame}>
									<Image src={study.image} alt={study.imageAlt} fill sizes="(max-width: 700px) 280px, 320px" className={styles.productImage} priority />
								</div>
								<figcaption>{study.imageCaption}</figcaption>
							</figure>
						</header>
						<div className={styles.stack} aria-label="Technologies used">
							{study.stack.map((item) => <span key={item}>{item}</span>)}
						</div>
						<div className={styles.story}>
							{study.sections.map((section) => (
								<section key={section.id} id={section.id} className={styles.storySection} aria-labelledby={`${section.id}-title`}>
									<div className={styles.sectionLabel}>{section.label}</div>
									<div className={styles.sectionBody}>
										<h2 id={`${section.id}-title`}>{section.title}</h2>
										{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
									</div>
								</section>
							))}
							{slug === "linecrush" && (
								<section id="c2" className={styles.storySection} aria-labelledby="c2-title">
									<div className={styles.sectionLabel}>Developer tooling</div>
									<div className={styles.sectionBody}>
										<h2 id="c2-title">C2 and the engineering fleet</h2>
										<div className={styles.proof}>
											<h3>NFL first-quarter statistics in iOS 2.9.0</h3>
											<p>The iOS release notes list first-quarter passing, rushing and receiving leaders in Signals. The delivery record ties that feature to completed work by the team and fleet.</p>
											<a href={study.links[1].href} target="_blank" rel="noopener noreferrer">Read the App Store release notes <ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
										</div>
										<p>I designed the engineering agent fleet and C2, the tracker we use to carry work from an issue through delivery. Jay and I operate it together. Durable work history means an interrupted run doesn&apos;t have to erase what was already learned or built.</p>
										<p>C2 brought roughly 19,000 historical issue records into the same system as new work. It connects the request, the run and the delivery evidence, so a completed task has something concrete behind it. The engineering pattern is investigate, implement, verify the actual product, review, ship and check the result.</p>
										<dl className={styles.metrics}>
											<div><dt>Completed fleet jobs</dt><dd>{FMT.fleetCompletedJobs}</dd></div>
											<div><dt>Completed jobs with a recorded commit URL</dt><dd>{FMT.fleetJobsWithCommitLinks}</dd></div>
										</dl>
										<p className={styles.metricNote}>Job ledger snapshot, <time dateTime={STATS.verifiedDate}>November 17, 2026</time>. Completed work includes investigations and documentation. The second figure counts job records that contain a commit URL.</p>
										<Link href="/blog/2026-08-08-no-humans-in-the-merge-loop" className={styles.sectionLink}>Read the published fleet walkthrough <ArrowRight size={15} aria-hidden="true" /></Link>
									</div>
								</section>
							)}
						</div>
						<section className={styles.takeaway} aria-labelledby="takeaway-title">
							<p className={styles.eyebrow} id="takeaway-title">What I take forward</p>
							<p>{study.takeaway}</p>
						</section>
					</article>
					<div className={styles.nextWork}>
						<Link href={`/work/${nextSlug}`}><span className={styles.eyebrow}>Next case study</span><span>{nextStudy.name}<ArrowRight size={24} aria-hidden="true" /></span></Link>
						<Link href="/#contact" className={styles.contact}>Have something to build? Let&apos;s talk <ArrowUpRight size={16} aria-hidden="true" /></Link>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
