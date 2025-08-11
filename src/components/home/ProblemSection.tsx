import { motion } from "framer-motion";

interface ProblemSectionProps {
	fadeInUp: any;
	staggerContainer: any;
}

export function ProblemSection({
	fadeInUp,
	staggerContainer,
}: ProblemSectionProps) {
	return (
		<section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
			<div className="max-w-6xl mx-auto">
				<motion.div
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					variants={staggerContainer}
				>
					<motion.h2
						className="text-4xl md:text-5xl font-bold text-charcoal mb-12 text-center leading-tight"
						variants={fadeInUp}
					>
						What we solve
					</motion.h2>

					<motion.div className="grid md:grid-cols-2 gap-8" variants={fadeInUp}>
						{/* Main problems */}
						<div className="p-8 rounded-3xl bg-brand-50 border border-brand-200 shadow-sm">
							<h3 className="text-xl font-semibold text-charcoal mb-4">
								Main problems
							</h3>
							<ul className="space-y-3">
								<li className="flex items-start gap-3">
									<span className="mt-2 w-2 h-2 rounded-full bg-brand-600"></span>
									<span className="text-ink">
										Most AI tools expect speech or typing, BIM is signed with
										hands.
									</span>
								</li>
								<li className="flex items-start gap-3">
									<span className="mt-2 w-2 h-2 rounded-full bg-brand-600"></span>
									<span className="text-ink">
										Public services rarely offer BIM input, access is limited
										outside office hours.
									</span>
								</li>
								<li className="flex items-start gap-3">
									<span className="mt-2 w-2 h-2 rounded-full bg-brand-600"></span>
									<span className="text-ink">
										Existing tools are slow and not accurate for real time use.
									</span>
								</li>
							</ul>
						</div>

						{/* What BIMTranslator does */}
						<div className="p-8 rounded-3xl bg-gradient-to-br from-brand-100 to-brand-200 border border-brand-200 shadow-lg">
							<h3 className="text-xl font-semibold text-charcoal mb-4">
								What BIMTranslator does
							</h3>
							<ul className="space-y-3">
								<li className="flex items-start gap-3">
									<span className="mt-2 w-2 h-2 rounded-full bg-brand-800"></span>
									<span className="text-ink">
										Captures BIM with a webcam, extracts landmarks with
										MediaPipe.
									</span>
								</li>
								<li className="flex items-start gap-3">
									<span className="mt-2 w-2 h-2 rounded-full bg-brand-800"></span>
									<span className="text-ink">
										Classifies gestures with a Scikit Learn model.
									</span>
								</li>
								<li className="flex items-start gap-3">
									<span className="mt-2 w-2 h-2 rounded-full bg-brand-800"></span>
									<span className="text-ink">
										Sends intent to SEA LION, returns clear text, animates an
										avatar for feedback.
									</span>
								</li>
							</ul>
							<p className="text-sm text-brand-700 mt-4">
								Scope, Malay Sign Language to text, output uses SEA LION
								supported languages.
							</p>
						</div>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
