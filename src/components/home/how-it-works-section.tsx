import { motion } from "framer-motion";
import {
	howItWorksSteps,
	architectureItems,
	highlightsData,
} from "~/constants/contents/home.content";
import { getIcon } from "~/lib/utils";

interface HowItWorksSectionProps {
	fadeInUp: any;
	staggerContainer: any;
}

export function HowItWorksSection({
	fadeInUp,
	staggerContainer,
}: HowItWorksSectionProps) {
	return (
		<section
			id="how-it-works"
			className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-brand-50 to-white"
		>
			<div className="max-w-7xl mx-auto">
				<motion.div
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					variants={staggerContainer}
				>
					<motion.h2
						className="text-4xl md:text-5xl font-bold text-charcoal mb-16 text-center leading-tight"
						variants={fadeInUp}
					>
						How it works
					</motion.h2>

					<div className="grid lg:grid-cols-12 gap-10 items-start mb-12">
						{/* Timeline */}
						<div className="lg:col-span-7">
							<ol className="space-y-8">
								{howItWorksSteps.map((step, index) => {
									const IconComponent = getIcon(step.icon);
									const last = index === howItWorksSteps.length - 1;
									return (
										<motion.li
											key={index}
											className="relative pl-14 pb-2"
											variants={fadeInUp}
										>
											{/* number token */}
											<span className="absolute left-0 top-1 flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white font-bold shadow-lg">
												{index + 1}
											</span>
											{/* connector */}
											{!last && (
												<span
													aria-hidden
													className="absolute left-5 top-11 bottom-0 w-px bg-brand-200"
												/>
											)}

											<div className="rounded-2xl bg-white border border-brand-100 shadow p-6">
												<div className="flex items-start gap-4">
													<div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow">
														<IconComponent className="w-6 h-6 text-white" />
													</div>
													<div>
														<h3 className="text-xl font-bold text-charcoal mb-2">
															{step.title}
														</h3>
														<p className="text-ink leading-relaxed">
															{step.description}
														</p>
													</div>
												</div>
											</div>
										</motion.li>
									);
								})}
							</ol>
						</div>

						<motion.aside
							className="lg:col-span-5 rounded-3xl border border-brand-200 bg-surface p-6 shadow-lg"
							variants={fadeInUp}
						>
							<h3 className="text-xl font-semibold text-charcoal mb-4 text-center">
								Architecture at a glance
							</h3>
							<figure className="rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 border border-brand-200 aspect-video flex items-center justify-center mb-4">
								<figure className="size-full">
									<img
										src="/assets/images/architecture.webp"
										alt="Architecture diagram"
										className="w-full h-full object-cover rounded-2xl"
									/>
								</figure>
							</figure>
							<ul className="text-ink space-y-2 text-sm">
								{architectureItems.map((item, index) => (
									<li key={index} className="flex items-center gap-2">
										<span>{item.component}</span>
										<span className="text-brand-500">→</span>
										<span>{item.description}</span>
									</li>
								))}
							</ul>
						</motion.aside>
					</div>

					<motion.div
						className="rounded-2xl bg-surface border border-brand-200 p-6"
						variants={fadeInUp}
					>
						<h3 className="text-xl font-semibold text-charcoal mb-4 text-center">
							Highlights
						</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
							{highlightsData.map((highlight, index) => {
								const IconComponent = getIcon(highlight.icon);
								return (
									<div
										key={index}
										className="flex items-center gap-3 p-4 rounded-xl bg-white border border-brand-100"
									>
										<IconComponent className="w-5 h-5 text-brand-700" />
										<span className="text-ink">{highlight.label}</span>
									</div>
								);
							})}
						</div>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
