import { useState } from "react";
import { motion } from "framer-motion";
import { evidenceTabs, metricsData } from "~/constants/contents/home.content";

interface EvidenceSectionProps {
	fadeInUp: any;
	staggerContainer: any;
}

export function EvidenceSection({
	fadeInUp,
	staggerContainer,
}: EvidenceSectionProps) {
	const [openFaq, setOpenFaq] = useState<number | null>(1);

	return (
		<section id="evidence" className="py-20 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<motion.div
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					variants={staggerContainer}
				>
					<motion.h2
						className="text-3xl md:text-4xl font-bold text-charcoal mb-8 text-center"
						variants={fadeInUp}
					>
						Proof
					</motion.h2>

					<motion.div
						className="mx-auto mb-8 w-full max-w-3xl rounded-xl bg-surface p-1 border border-brand-200"
						variants={fadeInUp}
					>
						<div className="grid grid-cols-3 text-sm font-semibold">
							{evidenceTabs.map((tab, index) => (
								<button
									key={tab}
									onClick={() => setOpenFaq(index)}
									className={`py-2.5 rounded-lg transition ${
										openFaq === index
											? "bg-brand-700 text-white shadow"
											: "text-charcoal hover:bg-brand-50"
									}`}
									aria-selected={openFaq === index}
									role="tab"
								>
									{tab}
								</button>
							))}
						</div>
					</motion.div>

					<div role="tabpanel" hidden={openFaq !== 0}>
						<motion.div
							className="bg-surface rounded-2xl p-8 shadow-lg mb-8"
							variants={fadeInUp}
						>
							<h3 className="text-xl font-semibold text-charcoal mb-6 text-center">
								Performance results
							</h3>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
								{metricsData.map((m, i) => (
									<div key={i} className="text-center">
										<div className="text-2xl font-bold text-brand-700 mb-1">
											{m.value}
										</div>
										<div className="text-sm text-ink">{m.label}</div>
									</div>
								))}
							</div>
						</motion.div>
					</div>

					<div role="tabpanel" hidden={openFaq !== 1}>
						<motion.div
							className="bg-surface rounded-2xl p-8 shadow-lg"
							variants={fadeInUp}
						>
							<div className="aspect-video bg-brand-100 rounded-xl border-2 border-dashed border-brand-300 flex items-center justify-center mb-4 overflow-hidden">
								<iframe
									className="w-full h-full rounded-xl"
									src="https://www.youtube.com/embed/J_8QQJmwkWA"
									title="BIMTranslator Demo Video"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
									allowFullScreen
									loading="lazy"
								/>
							</div>
							<p className="text-sm text-ink text-center">
								Short clip about what is BIMTranslator and how it works.
							</p>
						</motion.div>
					</div>

					<div role="tabpanel" hidden={openFaq !== 2}>
						<motion.div
							variants={fadeInUp}
							className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
						>
							<div className="bg-surface rounded-2xl p-8 shadow-lg">
								<h3 className="text-xl font-semibold text-charcoal mb-2">
									Client App
								</h3>
								<p className="text-ink mb-4">
									Frontend React app with TensorFlow.js model and real-time hand
									detection.
								</p>
								<a
									href="https://github.com/mylepaklab/client-app"
									target="_blank"
									rel="noopener noreferrer"
									className="text-brand-700 hover:text-brand-800 font-medium"
								>
									View repo →
								</a>
							</div>
							<div className="bg-surface rounded-2xl p-8 shadow-lg">
								<h3 className="text-xl font-semibold text-charcoal mb-2">
									Backend API
								</h3>
								<p className="text-ink mb-4">
									Server API for animation sequences and phrase matching.
								</p>
								<a
									href="https://github.com/mylepaklab/backend-API"
									target="_blank"
									rel="noopener noreferrer"
									className="text-brand-700 hover:text-brand-800 font-medium"
								>
									View repo →
								</a>
							</div>
							<div className="bg-surface rounded-2xl p-8 shadow-lg">
								<h3 className="text-xl font-semibold text-charcoal mb-2">
									Data Collection
								</h3>
								<p className="text-ink mb-4">
									MediaPipe data collection code for training the BIM gesture
									model.
								</p>
								<a
									href="https://github.com/mylepaklab/MediaPipeDataCollectionCode"
									target="_blank"
									rel="noopener noreferrer"
									className="text-brand-700 hover:text-brand-800 font-medium"
								>
									View repo →
								</a>
							</div>
						</motion.div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
