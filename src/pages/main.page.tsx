import { Header } from "~/components/home/Header";
import { Footer } from "~/components/home/Footer";
import { HeroSection } from "~/components/home/hero-section";
import { BimIntroSection } from "~/components/home/bim-intro-section";
import { ProblemSection } from "~/components/home/problem-section";
import { HowItWorksSection } from "~/components/home/how-it-works-section";
import { WhyThisMattersSection } from "~/components/home/why-this-matters.section";
import { ImpactSection } from "~/components/home/impact-section";
import { EvidenceSection } from "~/components/home/evidence-section";
import { FaqSection } from "~/components/home/faq-section";
import { OurTeamSection } from "~/components/home/our-team";

import { useAnimation } from "~/hooks/use-animation.hook";

export function Page() {
	const { fadeInUp, staggerContainer } = useAnimation();

	return (
		<div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 text-ink">
			<Header />

			<main className="pt-16">
				<HeroSection fadeInUp={fadeInUp} staggerContainer={staggerContainer} />
				<BimIntroSection
					fadeInUp={fadeInUp}
					staggerContainer={staggerContainer}
				/>
				<ProblemSection
					fadeInUp={fadeInUp}
					staggerContainer={staggerContainer}
				/>
				<ImpactSection fadeInUp={fadeInUp} />
				<HowItWorksSection
					fadeInUp={fadeInUp}
					staggerContainer={staggerContainer}
				/>
				<WhyThisMattersSection
					fadeInUp={fadeInUp}
					staggerContainer={staggerContainer}
				/>
				<EvidenceSection
					fadeInUp={fadeInUp}
					staggerContainer={staggerContainer}
				/>
				<OurTeamSection
					fadeInUp={fadeInUp}
					staggerContainer={staggerContainer}
				/>
				<FaqSection fadeInUp={fadeInUp} staggerContainer={staggerContainer} />
			</main>

			<Footer />
		</div>
	);
}
