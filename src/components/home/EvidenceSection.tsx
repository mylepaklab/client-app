import { useState } from "react";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
import {
	evidenceTabs,
	metricsData,
	pipelineTimingData,
	testMatrixData,
} from "~/constants/contents/home.content";

interface EvidenceSectionProps {
	fadeInUp: any;
	staggerContainer: any;
}

export function EvidenceSection({
	fadeInUp,
	staggerContainer,
}: EvidenceSectionProps) {
	const [openFaq, setOpenFaq] = useState<number | null>(null);

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
						className="text-3xl md:text-4xl font-bold text-charcoal mb-8 text-center"
						variants={fadeInUp}
					>
						Proof
					</motion.h2>

					{/* Tabs */}
					<motion.div
						className="mx-auto mb-8 w-full max-w-3xl rounded-xl bg-surface p-1 border border-brand-200"
						variants={fadeInUp}
					>
						<div className="grid grid-cols-3 text-sm font-semibold">
							{evidenceTabs.map((tab, index) => (
								<button
									key={tab}
									onClick={() => setOpenFaq(index)} // reuse state slot to avoid new state
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

					{/* Panels */}
					<div role="tabpanel" hidden={openFaq !== 0}>
						{/* Result stats */}
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
										{m.delta && (
											<div
												className={`text-xs mt-1 ${
													m.delta > 0 ? "text-green-700" : "text-red-700"
												}`}
											>
												{m.delta > 0 ? "▲" : "▼"} {Math.abs(m.delta)}%
											</div>
										)}
									</div>
								))}
							</div>
							<p className="text-xs text-brand-600 mt-6 text-center">
								Method, single run on the listed test device, fixed seed,
								stratified split. Replace with your exact details.
							</p>
						</motion.div>

						{/* Pipeline timing */}
						<motion.div
							className="bg-surface rounded-2xl p-8 shadow-lg mb-8"
							variants={fadeInUp}
						>
							<h3 className="text-xl font-semibold text-charcoal mb-4">
								Pipeline timing
							</h3>
							<div className="space-y-4">
								{pipelineTimingData.map((step, index) => (
									<div key={index}>
										<div className="flex justify-between text-sm mb-1">
											<span className="text-charcoal">{step.name}</span>
											<span className="text-ink">{step.ms} ms</span>
										</div>
										<div className="h-2 w-full bg-brand-100 rounded-full overflow-hidden">
											<div
												className="h-full bg-brand-700"
												style={{ width: `${Math.min(100, step.ms)}%` }}
												aria-hidden
											/>
										</div>
									</div>
								))}
							</div>
						</motion.div>

						{/* Test matrix */}
						<motion.div
							className="bg-surface rounded-2xl p-8 shadow-lg"
							variants={fadeInUp}
						>
							<h3 className="text-xl font-semibold text-charcoal mb-4">
								Test matrix
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
								{testMatrixData.map((result, index) => (
									<div
										key={index}
										className="p-4 rounded-xl border border-brand-200 bg-white flex items-center justify-between"
									>
										<span className="text-ink">{result.device}</span>
										<span
											className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
												result.status === "Pass"
													? "bg-green-100 text-green-800"
													: "bg-yellow-100 text-yellow-800"
											}`}
										>
											{result.status}
										</span>
									</div>
								))}
							</div>
							<p className="text-xs text-brand-600 mt-4">
								Replace with your exact devices and versions. Include any known
								limits.
							</p>
						</motion.div>
					</div>

					{/* Video panel */}
					<div role="tabpanel" hidden={openFaq !== 1}>
						<motion.div
							className="bg-surface rounded-2xl p-8 shadow-lg"
							variants={fadeInUp}
						>
							<div className="aspect-video bg-brand-100 rounded-xl border-2 border-dashed border-brand-300 flex items-center justify-center mb-4">
								<a
									href="https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
									className="inline-flex items-center space-x-2 bg-brand-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-800 focus:ring-4 focus:ring-brand-600"
								>
									<Play className="w-5 h-5" />
									<span>Watch demo video</span>
								</a>
							</div>
							<p className="text-sm text-ink text-center">
								Short clip that shows capture, classify, translate, and avatar.
							</p>
						</motion.div>
					</div>

					{/* Repo panel */}
					<div role="tabpanel" hidden={openFaq !== 2}>
						<motion.div
							className="grid md:grid-cols-2 gap-8"
							variants={fadeInUp}
						>
							<div className="bg-surface rounded-2xl p-8 shadow-lg">
								<h3 className="text-xl font-semibold text-charcoal mb-2">
									GitHub
								</h3>
								<p className="text-ink mb-4">Code, issues, and setup guide.</p>
								<a
									href="https://github.com/mylepaklab/bimtranslator"
									className="text-brand-700 hover:text-brand-800 font-medium"
								>
									Open repo →
								</a>
							</div>
							<div className="bg-surface rounded-2xl p-8 shadow-lg">
								<h3 className="text-xl font-semibold text-charcoal mb-2">
									Pitch deck
								</h3>
								<p className="text-ink mb-4">
									Slides for the programme judges.
								</p>
								<a
									href="https://your-deck-link"
									className="text-brand-700 hover:text-brand-800 font-medium"
								>
									View deck →
								</a>
							</div>
						</motion.div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
