import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, FileText, MapPin } from "lucide-react";
import styles from "./Portfolio.module.css";
import WorkPreview from "./WorkPreview";

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
							and took native iOS and Android apps to both stores for LineCrush and SureWord.
						</p>
						<div className={styles.actions}>
							<a href="#projects" className={styles.primaryAction}>
								See selected work <ArrowDownRight size={19} aria-hidden="true" />
							</a>
							<Link href="/resume" className={styles.secondaryAction}>
								<FileText size={17} aria-hidden="true" /> View résumé
							</Link>
						</div>
						<Link href="/faith" className={styles.faithLink}>Saved by grace through faith in Jesus Christ</Link>
					</div>
					<WorkPreview />
				</div>
			</div>
		</section>
	);
}
