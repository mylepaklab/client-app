import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

type NavItem = { label: string; href: string };

const NAV_ITEMS: NavItem[] = [
	{ label: "Problem", href: "#problem" },
	{ label: "Impact", href: "#impact" },
	{ label: "How it works", href: "#how-it-works" },
	{ label: "Fit", href: "#fit" },
	{ label: "Evidence", href: "#evidence" },
	{ label: "Team", href: "#team" },
	{ label: "FAQ", href: "#faq" },
];

export function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [activeId, setActiveId] = useState<string>("");

	useEffect(() => {
		const ids = NAV_ITEMS.map((n) => n.href.replace("#", ""));
		const els = ids
			.map((id) => document.getElementById(id))
			.filter(Boolean) as HTMLElement[];

		if (els.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((e) => e.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
				if (visible[0]) setActiveId(visible[0].target.id);
			},
			{ rootMargin: "-20% 0px -70% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
		);

		els.forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	}, []);

	const desktopNav = useMemo(
		() =>
			NAV_ITEMS.map((item) => {
				const isActive = activeId && item.href === `#${activeId}`;
				return (
					<a
						key={item.href}
						href={item.href}
						className={`font-medium transition-colors ${
							isActive ? "text-brand-700" : "text-charcoal hover:text-brand-700"
						}`}
						aria-current={isActive ? "page" : undefined}
					>
						{item.label}
					</a>
				);
			}),
		[activeId]
	);

	return (
		<header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-200 shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					<a href="#hero" className="flex items-center space-x-3">
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
						<span className="hidden sm:inline bg-gradient-to-r from-brand-600 to-brand-700 text-white text-[11px] px-2 py-1 rounded-full font-semibold">
							MyLepakLab
						</span>
					</a>

					<nav className="hidden md:flex items-center space-x-6">
						{desktopNav}
					</nav>

					<div className="hidden md:flex items-center space-x-3">
						<a
							href="https://github.com/mylepaklab?tab=repositories"
							className="px-3 py-2 rounded-lg font-medium text-charcoal hover:text-brand-700 hover:bg-brand-50 transition-colors"
						>
							GitHub
						</a>
						<a
							href="/demo"
							className="px-4 py-2 rounded-lg font-semibold bg-brand-700 text-white hover:bg-brand-800 focus:ring-4 focus:ring-brand-600 transition-colors"
						>
							Open live demo
						</a>
					</div>

					<button
						className="md:hidden p-2 text-charcoal hover:text-brand-700 rounded-lg hover:bg-brand-50 transition-colors"
						onClick={() => setMobileMenuOpen((v) => !v)}
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
						<nav className="flex flex-col">
							{NAV_ITEMS.map((item) => (
								<a
									key={item.href}
									href={item.href}
									className="text-charcoal hover:text-brand-700 transition-colors px-2 py-2 font-medium rounded-lg hover:bg-brand-50"
									onClick={() => setMobileMenuOpen(false)}
								>
									{item.label}
								</a>
							))}
							<div className="mt-3 grid grid-cols-2 gap-2 px-2">
								<a
									href="https://github.com/mylepaklab?tab=repositories"
									className="text-center px-3 py-2 rounded-lg font-medium text-charcoal hover:text-brand-700 hover:bg-brand-50 transition-colors"
									onClick={() => setMobileMenuOpen(false)}
								>
									GitHub
								</a>
								<a
									href="/demo"
									className="text-center px-3 py-2 rounded-lg font-semibold bg-brand-700 text-white hover:bg-brand-800 focus:ring-4 focus:ring-brand-600 transition-colors"
									onClick={() => setMobileMenuOpen(false)}
								>
									Open live demo
								</a>
							</div>
							<div className="mt-3 px-2">
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
