import { motion } from "framer-motion";
import { Play } from "lucide-react";

interface HeroSectionProps {
	fadeInUp: any;
	staggerContainer: any;
}

export function HeroSection({ fadeInUp, staggerContainer }: HeroSectionProps) {
	return (
		<section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
			<div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-brand-100"></div>
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(175,95,40,0.08)_1px,transparent_0)] bg-[length:24px_24px]"></div>
			<div className="relative max-w-6xl mx-auto">
				<motion.div
					className="text-center"
					initial="initial"
					animate="animate"
					variants={staggerContainer}
				>
					<motion.div
						className="inline-flex items-center px-4 py-2 rounded-full bg-brand-100 border border-brand-200 text-brand-700 text-sm font-medium mb-8"
						variants={fadeInUp}
					>
						<span>PAN-SEA AI DEVELOPER CHALLENGE 2025</span>
					</motion.div>

					<motion.h1
						className="text-5xl md:text-7xl font-bold text-charcoal mb-8 leading-tight tracking-tight"
						variants={fadeInUp}
					>
						Translate{" "}
						<span className="bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent">
							BIM
						</span>{" "}
						to chat with AI
					</motion.h1>

					<motion.p
						className="text-xl md:text-2xl text-ink mb-12 max-w-4xl mx-auto leading-relaxed"
						variants={fadeInUp}
					>
						Ask with your hands, the avatar mirrors your signs, the assistant
						replies in clear text and can sign key parts for clarity.
					</motion.p>

					<motion.div
						className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8"
						variants={fadeInUp}
					>
						<motion.a
							href="https://docker-react-g40o.onrender.com"
							className="group bg-gradient-to-r from-brand-700 to-brand-800 text-white px-10 py-5 rounded-2xl font-bold text-lg hover:from-brand-800 hover:to-brand-900 focus:ring-4 focus:ring-brand-600 transition-all duration-200 flex items-center space-x-3 shadow-xl hover:shadow-2xl"
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							<Play className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
							<span>Start chat</span>
						</motion.a>
					</motion.div>

					<motion.p className="text-brand-600 font-medium" variants={fadeInUp}>
						No login required • Privacy first design • Built for Deaf
						communities
					</motion.p>
				</motion.div>
			</div>
		</section>
	);
}
