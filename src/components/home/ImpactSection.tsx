import { motion } from "framer-motion";
import { Users, Heart, Clock, Rocket, Cpu, CheckCircle2 } from "lucide-react";

interface ImpactFeasibilitySectionProps {
	fadeInUp: any;
}

export function ImpactSection({ fadeInUp }: ImpactFeasibilitySectionProps) {
	return (
		<section id="impact" className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
			<div className="max-w-6xl mx-auto">
				<motion.div
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					variants={fadeInUp}
					className="text-center"
				>
					<h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-6">
						Real Impact, Real Feasibility
					</h2>
					<p className="text-ink max-w-2xl mx-auto mb-10">
						This project is not just a demo. It already solves a real problem
						for people in Southeast Asia and can scale with clear steps.
					</p>
				</motion.div>

				<motion.div
					variants={fadeInUp}
					className="grid md:grid-cols-3 gap-6 mb-12"
				>
					<div className="bg-white rounded-2xl p-6 shadow border text-center">
						<Users className="w-8 h-8 text-brand-700 mx-auto mb-3" />
						<div className="text-3xl font-bold text-charcoal">466M+</div>
						<p className="text-sm text-ink">
							People in SEA with language barriers
						</p>
					</div>
					<div className="bg-white rounded-2xl p-6 shadow border text-center">
						<Heart className="w-8 h-8 text-red-600 mx-auto mb-3" />
						<div className="text-3xl font-bold text-charcoal">Instant</div>
						<p className="text-sm text-ink">
							Access for deaf & hard-of-hearing users
						</p>
					</div>
					<div className="bg-white rounded-2xl p-6 shadow border text-center">
						<Clock className="w-8 h-8 text-brand-700 mx-auto mb-3" />
						<div className="text-3xl font-bold text-charcoal">&lt;1s</div>
						<p className="text-sm text-ink">Median translation latency</p>
					</div>
				</motion.div>

				<motion.div
					variants={fadeInUp}
					className="grid md:grid-cols-2 gap-8 mb-12"
				>
					<div className="bg-white rounded-2xl p-6 shadow border">
						<h3 className="text-xl font-semibold mb-4 text-charcoal">
							Technical Proof
						</h3>
						<ul className="text-ink space-y-3">
							<li>
								<Cpu className="inline w-5 h-5 text-brand-700 mr-2" /> Browser
								model runs ~5MB, loads in &lt;1s
							</li>
							<li>
								<Cpu className="inline w-5 h-5 text-brand-700 mr-2" /> Fallback
								API latency ~200ms in SEA region
							</li>
							<li>
								<Cpu className="inline w-5 h-5 text-brand-700 mr-2" />{" "}
								Privacy-first, no permanent storage
							</li>
						</ul>
					</div>
					<div className="bg-brand-100 rounded-2xl p-6 border-2 border-dashed border-brand-300">
						<h3 className="text-xl font-semibold mb-4 text-charcoal">
							Next Steps
						</h3>
						<ul className="text-ink space-y-3">
							<li>
								<CheckCircle2 className="inline w-5 h-5 text-brand-700 mr-2" />{" "}
								Multi-language support (Thai, Vietnamese, Indonesian)
							</li>
							<li>
								<CheckCircle2 className="inline w-5 h-5 text-brand-700 mr-2" />{" "}
								Community feedback loop for continuous improvement
							</li>
							<li>
								<CheckCircle2 className="inline w-5 h-5 text-brand-700 mr-2" />{" "}
								Offline mode via PWA for low-connectivity areas
							</li>
						</ul>
					</div>
				</motion.div>

				<motion.div variants={fadeInUp} className="text-center">
					<a
						href="/demo"
						className="inline-flex items-center gap-2 bg-brand-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-brand-800 focus:ring-4 focus:ring-brand-600"
					>
						<Rocket className="w-5 h-5" />
						<span>Try the live demo</span>
					</a>
				</motion.div>
			</div>
		</section>
	);
}
