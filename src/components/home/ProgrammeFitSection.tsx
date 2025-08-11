import { motion } from "framer-motion";
import {
	programmeFitAreas,
	challengeBadges,
} from "~/constants/contents/home.content";
import { getIcon } from "~/lib/utils";

interface ProgrammeFitSectionProps {
	fadeInUp: any;
	staggerContainer: any;
}

export function ProgrammeFitSection({
	fadeInUp,
	staggerContainer,
}: ProgrammeFitSectionProps) {
	return (
		<section className="py-20 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<motion.div
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					variants={staggerContainer}
				>
					<motion.h2
						className="text-3xl md:text-4xl font-bold text-charcoal mb-4 text-center"
						variants={fadeInUp}
					>
						SEA Developer Challenge alignment
					</motion.h2>

					<motion.p className="text-ink text-center mb-10" variants={fadeInUp}>
						We map BIMTranslator to the scoring used in this challenge.
					</motion.p>

					{/* Round badges */}
					<motion.div
						className="flex flex-wrap justify-center gap-3 mb-10"
						variants={fadeInUp}
					>
						{challengeBadges.map((badge, index) => (
							<span
								key={index}
								className={`px-3 py-1 text-sm rounded-full border border-brand-200 ${
									badge.variant === "primary"
										? "bg-brand-700 text-white"
										: "bg-brand-100 text-brand-800"
								}`}
							>
								{badge.text}
							</span>
						))}
					</motion.div>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{programmeFitAreas.map((area, index) => {
							const IconComponent = getIcon(area.icon);
							return (
								<motion.div
									key={index}
									className="p-6 rounded-2xl bg-surface shadow-lg border border-brand-200"
									variants={fadeInUp}
								>
									<div className="flex items-center justify-between mb-3">
										<div className="flex items-center gap-3">
											<IconComponent className="w-6 h-6 text-brand-700" />
											<h3 className="text-xl font-semibold text-charcoal">
												{area.title}
											</h3>
										</div>
										<span className="px-2 py-0.5 text-xs rounded bg-brand-100 text-brand-800 border border-brand-200">
											{area.percentage}
										</span>
									</div>
									<ul className="space-y-2 text-ink">
										{area.points.map((point, pointIndex) => (
											<li key={pointIndex}>{point}</li>
										))}
									</ul>
								</motion.div>
							);
						})}
					</div>
				</motion.div>
			</div>
		</section>
	);
}
