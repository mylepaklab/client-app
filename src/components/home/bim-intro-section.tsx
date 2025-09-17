import { motion } from "framer-motion";
import { Hand, Users, Globe, Accessibility } from "lucide-react";

interface BimIntroSectionProps {
	fadeInUp: any;
	staggerContainer: any;
}

export function BimIntroSection({
	fadeInUp,
	staggerContainer,
}: BimIntroSectionProps) {
	return (
		<section id="bim-intro" className="py-24 px-4 sm:px-6 lg:px-8 bg-surface">
			<div className="max-w-6xl mx-auto">
				<motion.div
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					variants={staggerContainer}
				>
					<motion.div className="text-center mb-16" variants={fadeInUp}>
						<h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-6 leading-tight">
							What is{" "}
							<span className="bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent">
								BIM
							</span>
							?
						</h2>
						<p className="text-xl md:text-2xl text-ink max-w-4xl mx-auto leading-relaxed">
							BIM (Bahasa Isyarat Malaysia) is the official sign language of
							Malaysia, used by the deaf and hard of hearing community to
							communicate.
						</p>
					</motion.div>

					<motion.div
						className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
						variants={staggerContainer}
					>
						<motion.div
							className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-brand-200"
							variants={fadeInUp}
						>
							<div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
								<Hand className="w-8 h-8 text-brand-600" />
							</div>
							<h3 className="text-lg font-semibold text-charcoal mb-2">
								Visual Language
							</h3>
							<p className="text-ink text-sm">
								Uses hand shapes, movements, and facial expressions to convey
								meaning
							</p>
						</motion.div>

						<motion.div
							className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-brand-200"
							variants={fadeInUp}
						>
							<div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
								<Users className="w-8 h-8 text-brand-600" />
							</div>
							<h3 className="text-lg font-semibold text-charcoal mb-2">
								Community
							</h3>
							<p className="text-ink text-sm">
								Primary language for thousands of deaf and hard of hearing
								Malaysians
							</p>
						</motion.div>

						<motion.div
							className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-brand-200"
							variants={fadeInUp}
						>
							<div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
								<Globe className="w-8 h-8 text-brand-600" />
							</div>
							<h3 className="text-lg font-semibold text-charcoal mb-2">
								Cultural Identity
							</h3>
							<p className="text-ink text-sm">
								A language with its own grammar and cultural meaning
							</p>
						</motion.div>

						<motion.div
							className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-brand-200"
							variants={fadeInUp}
						>
							<div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
								<Accessibility className="w-8 h-8 text-brand-600" />
							</div>
							<h3 className="text-lg font-semibold text-charcoal mb-2">
								Accessibility
							</h3>
							<p className="text-ink text-sm">
								Key for deaf users to communicate and access information
							</p>
						</motion.div>
					</motion.div>

					<motion.div
						className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-brand-200"
						variants={fadeInUp}
					>
						<div className="grid md:grid-cols-2 gap-8 items-center">
							<div>
								<h3 className="text-2xl font-bold text-charcoal mb-4">
									The Digital Divide
								</h3>
								<p className="text-ink mb-4 leading-relaxed">
									While BIM is a rich and expressive language, most digital
									services and AI tools don't support sign language input. This
									creates barriers for BIM users who want to interact with
									technology naturally.
								</p>
								<p className="text-ink leading-relaxed">
									Our interactive demo lets you experience BIM translation
									firsthand - show signs to your camera for real-time text
									conversion, or select phrases to learn the corresponding BIM
									gestures through animated demonstrations.
								</p>
							</div>
							<div className="relative">
								<div className="aspect-square bg-gradient-to-br from-brand-100 to-brand-200 rounded-2xl flex items-center justify-center">
									<div className="text-center">
										<Hand className="w-24 h-24 text-brand-600 mx-auto mb-4" />
										<p className="text-brand-700 font-semibold">BIM Gestures</p>
										<div className="my-4">
											<div className="w-16 h-1 bg-brand-600 mx-auto rounded-full"></div>
											<div className="w-8 h-1 bg-brand-400 mx-auto rounded-full mt-1"></div>
										</div>
										<p className="text-brand-700 font-semibold">Clear Text</p>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
