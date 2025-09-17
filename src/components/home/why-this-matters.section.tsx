import { motion } from "framer-motion";
import { programmeFitAreas } from "~/constants/contents/home.content";
import { getIcon } from "~/lib/icons";

interface Props {
	fadeInUp: any;
	staggerContainer: any;
}

export function WhyThisMattersSection({ fadeInUp, staggerContainer }: Props) {
	return (
		<section id="why" className="py-20 px-4 sm:px-6 lg:px-8">
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
						Why This Matters
					</motion.h2>
					<motion.p
						className="text-ink text-center mb-10 max-w-3xl mx-auto"
						variants={fadeInUp}
					>
						Beyond the technology, this project addresses real barriers faced by
						the deaf community in Malaysia and Southeast Asia.
					</motion.p>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{programmeFitAreas.map((area, index) => {
							const IconComponent = getIcon(area.icon);
							return (
								<motion.div
									key={index}
									className="p-6 rounded-2xl bg-surface shadow-lg border border-brand-200"
									variants={fadeInUp}
								>
									<div className="flex items-center gap-3 mb-4">
										<IconComponent className="w-6 h-6 text-brand-700" />
										<h3 className="text-xl font-semibold text-charcoal">
											{area.title}
										</h3>
									</div>
									<ul className="space-y-2 text-ink">
										{area.points.map((point, pointIndex) => (
											<li key={pointIndex} className="flex items-start gap-2">
												<span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-600 flex-shrink-0"></span>
												<span>{point}</span>
											</li>
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
