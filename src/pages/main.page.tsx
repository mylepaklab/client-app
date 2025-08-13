import { Header } from "~/components/home/Header";
import { Footer } from "~/components/home/Footer";
import { HeroSection } from "~/components/home/HeroSection";
import { ProblemSection } from "~/components/home/ProblemSection";
import { HowItWorksSection } from "~/components/home/HowItWorksSection";
import { ProgrammeFitSection } from "~/components/home/ProgrammeFitSection";
import { LivePreviewSection } from "~/components/home/LivePreviewSection";
import { EvidenceSection } from "~/components/home/EvidenceSection";
import { FaqSection } from "~/components/home/FaqSection";
import { OurTeamSection } from "~/components/home/our-team";

import { useAnimation } from "~/hooks/use-animation.hook";

export function Page() {
	const { fadeInUp, staggerContainer } = useAnimation();

	return (
		<div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 text-ink">
			<Header />

			<main className="pt-16">
				<HeroSection fadeInUp={fadeInUp} staggerContainer={staggerContainer} />

				<ProblemSection
					fadeInUp={fadeInUp}
					staggerContainer={staggerContainer}
				/>

				<HowItWorksSection
					fadeInUp={fadeInUp}
					staggerContainer={staggerContainer}
				/>

				<ProgrammeFitSection
					fadeInUp={fadeInUp}
					staggerContainer={staggerContainer}
				/>

				<LivePreviewSection fadeInUp={fadeInUp} />

				<EvidenceSection
					fadeInUp={fadeInUp}
					staggerContainer={staggerContainer}
				/>

				<OurTeamSection />

				<FaqSection fadeInUp={fadeInUp} staggerContainer={staggerContainer} />
			</main>

			<Footer />
		</div>
	);
}
