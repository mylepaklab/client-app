import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-200 shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<div className="flex items-center space-x-3">
						<figure className="w-10 h-10 flex items-center justify-center">
							<img
								src="/assets/images/main.webp"
								alt="BIMTranslator logo"
								className="max-w-full h-auto mx-auto"
								loading="lazy"
							/>
						</figure>
						<span className="font-bold text-xl text-charcoal">
							BIMTranslator
						</span>
					</div>
					<nav className="hidden md:flex items-center space-x-8">
						<a
							href="/test-connection"
							className="text-charcoal hover:text-brand-700 transition-colors font-medium"
						>
							Demo
						</a>
						<a
							href="https://github.com/mylepaklab/bimtranslator"
							className="text-charcoal hover:text-brand-700 transition-colors font-medium"
						>
							GitHub
						</a>
					</nav>
					<button
						className="md:hidden p-2 text-charcoal hover:text-brand-700 transition-colors rounded-lg hover:bg-brand-50"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						aria-label="Toggle mobile menu"
					>
						{mobileMenuOpen ? (
							<X className="w-6 h-6" />
						) : (
							<Menu className="w-6 h-6" />
						)}
					</button>
				</div>

				{mobileMenuOpen && (
					<motion.div
						className="md:hidden border-t border-brand-200 py-4 bg-white/95 backdrop-blur-md"
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
					>
						<nav className="flex flex-col space-y-3">
							<a
								href="/test-connection"
								className="text-charcoal hover:text-brand-700 transition-colors px-2 py-2 font-medium rounded-lg hover:bg-brand-50"
								onClick={() => setMobileMenuOpen(false)}
							>
								Demo
							</a>
							<a
								href="https://github.com/mylepaklab/bimtranslator"
								className="text-charcoal hover:text-brand-700 transition-colors px-2 py-2 font-medium rounded-lg hover:bg-brand-50"
								onClick={() => setMobileMenuOpen(false)}
							>
								GitHub
							</a>
							<div className="sm:hidden mt-3 px-2">
								<span className="bg-gradient-to-r from-brand-600 to-brand-700 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
									SEA Developer Challenge
								</span>
							</div>
						</nav>
					</motion.div>
				)}
			</div>
		</header>
	);
}
