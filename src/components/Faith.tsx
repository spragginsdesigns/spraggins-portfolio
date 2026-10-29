import Image from "next/image";
import { DM_Serif_Display } from "next/font/google";
import { ArrowRight } from "lucide-react";
import { FaQuoteLeft } from "react-icons/fa6";
import styles from "./Faith.module.css";

const testimonySerif = DM_Serif_Display({
	weight: "400",
	style: ["normal", "italic"],
	subsets: ["latin"],
	display: "swap",
	variable: "--font-testimony"
});

export default function Faith() {
	return (
		<section
			id="faith"
			aria-labelledby="faith-heading"
			className={`${testimonySerif.variable} ${styles.faith}`}
		>
			<div className={styles.hero}>
				<div className={styles.artwork} aria-hidden="true">
					<Image
						src="/images/faith/cross-in-the-light.webp"
						alt=""
						fill
						sizes="(min-width: 1440px) 1440px, 100vw"
						className={styles.crossImage}
					/>
				</div>
				<div className={`${styles.container} ${styles.heroContent}`}>
					<h2 id="faith-heading" className={styles.headline}>
						<span>Saved by grace.</span>
						<em>Living for Him.</em>
					</h2>
					<p className={styles.declaration}>
						Jesus Christ is my Lord and Savior.
					</p>
					<p className={styles.introduction}>
						My faith is the foundation of my life, my family,
						and the things I build.
					</p>
					<a href="#my-testimony" className={styles.readLink}>
						<span>Read my testimony</span>
						<ArrowRight size={19} strokeWidth={1.6} aria-hidden="true" />
					</a>
				</div>
			</div>

			<div className={styles.container}>
				<div id="my-testimony" className={styles.testimony} tabIndex={-1}>
					<div className={styles.story}>
						<h3>A new life. A daily walk.</h3>
						<p>
							I went through a difficult period in my life when I was afraid
							of what might happen to me. But God kept me safe. He gave me
							time to be still, read His Word, and rebuild my life. I was
							born again in Christ, and He gave me a purpose I didn&apos;t
							have before.
						</p>
						<p>
							I didn&apos;t earn His grace. And I&apos;m still growing,
							learning to listen for God and follow Him each day. I believe
							the whole Bible, from Genesis to Revelation, is His Word. It
							shapes how I raise my children, treat people, and approach my work.
						</p>
					</div>
					<figure className={styles.scripture}>
						<FaQuoteLeft className={styles.quoteMark} size={28} aria-hidden="true" />
						<blockquote>
							<p>
								Therefore if any man be in Christ, he is a new creature:
								old things are passed away; behold, all things are become new.
							</p>
						</blockquote>
						<figcaption>2 Corinthians 5:17 <span aria-hidden="true">/</span> KJV</figcaption>
					</figure>
				</div>

				<div className={styles.sureword}>
					<div className={styles.surewordCopy}>
						<h3>Faith, put into practice.</h3>
						<p>
							I built SureWord to honor God and help others in their own walk with Him.
						</p>
					</div>
					<div className={styles.surewordAction}>
						<a href="https://sureword.app" className={styles.surewordLink}>
							Explore SureWord
							<ArrowRight size={23} strokeWidth={1.6} aria-hidden="true" />
						</a>
						<span className={styles.domain}>sureword.app</span>
					</div>
				</div>
			</div>
		</section>
	);
}
