import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { faqItems } from "~/constants/contents/home.content";

interface FaqSectionProps {
	fadeInUp: any;
	staggerContainer: any;
}

export function FaqSection({ fadeInUp, staggerContainer }: FaqSectionProps) {
	const [openFaq, setOpenFaq] = useState<number | null>(null);

	return (
		<section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
			<div className="max-w-4xl mx-auto">
				<motion.div
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					variants={staggerContainer}
				>
					<motion.h2
						className="text-3xl md:text-4xl font-bold text-charcoal mb-12 text-center"
						variants={fadeInUp}
					>
						Frequently asked questions
					</motion.h2>
					<div className="space-y-4">
						{faqItems.map((item, index) => (
							<motion.div
								key={index}
								className="border border-brand-200 rounded-xl overflow-hidden bg-surface"
								variants={fadeInUp}
							>
								<button
									className="w-full px-6 py-4 text-left hover:bg-brand-50 transition-colors flex justify-between items-center"
									onClick={() => setOpenFaq(openFaq === index ? null : index)}
									aria-expanded={openFaq === index}
								>
									<span className="font-semibold text-charcoal">
										{item.question}
									</span>
									<ChevronDown
										className={`w-5 h-5 text-brand-600 transition-transform ${
											openFaq === index ? "rotate-180" : ""
										}`}
									/>
								</button>
								{openFaq === index && (
									<div className="px-6 py-4 bg-brand-50">
										<p className="text-ink">{item.answer}</p>
									</div>
								)}
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>
		</section>
	);
}
