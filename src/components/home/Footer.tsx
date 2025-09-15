import { Mail, Github } from "lucide-react";

export function Footer() {
	return (
		<footer className="bg-gradient-to-br from-charcoal to-ink text-white py-16 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<div className="grid md:grid-cols-4 gap-12">
					<div className="md:col-span-2">
						<div className="flex items-center space-x-3 mb-6">
							<figure className="w-10 h-10 flex items-center justify-center">
								<img
									src="/assets/images/main.webp"
									alt="BIMTranslator logo"
									className="max-w-full h-auto mx-auto"
									loading="lazy"
								/>
							</figure>
							<span className="font-bold text-2xl">BIMTranslator</span>
						</div>
						<p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
							AI-powered Malay Sign Language translation for everyone. Breaking
							down communication barriers with innovative technology.
						</p>
						<div className="flex space-x-4">
							<a
								href="mailto:mylepaklab@gmail.com"
								className="w-10 h-10 bg-brand-600 hover:bg-brand-700 rounded-lg flex items-center justify-center transition-colors"
							>
								<Mail className="w-5 h-5 text-white" />
							</a>
							<a
								href="https://github.com/mylepaklab?tab=repositories"
								className="w-10 h-10 bg-brand-600 hover:bg-brand-700 rounded-lg flex items-center justify-center transition-colors"
							>
								<Github className="w-5 h-5 text-white" />
							</a>
						</div>
					</div>
					<div>
						<h3 className="font-bold mb-6 text-lg">Product</h3>
						<ul className="space-y-3 text-gray-300">
							<li>
								<a
									href="/demo"
									className="hover:text-brand-400 transition-colors flex items-center space-x-2 group"
								>
									<span>Demo</span>
									<span className="opacity-0 group-hover:opacity-100 transition-opacity">
										→
									</span>
								</a>
							</li>
							<li>
								<a
									href="/docs"
									className="hover:text-brand-400 transition-colors flex items-center space-x-2 group"
								>
									<span>Documentation</span>
									<span className="opacity-0 group-hover:opacity-100 transition-opacity">
										→
									</span>
								</a>
							</li>
						</ul>
					</div>
					<div>
						<h3 className="font-bold mb-6 text-lg">Legal</h3>
						<ul className="space-y-3 text-gray-300">
							<li>
								<a
									href="/privacy"
									className="hover:text-brand-400 transition-colors flex items-center space-x-2 group"
								>
									<span>Privacy Policy</span>
									<span className="opacity-0 group-hover:opacity-100 transition-opacity">
										→
									</span>
								</a>
							</li>
							<li>
								<a
									href="/terms"
									className="hover:text-brand-400 transition-colors flex items-center space-x-2 group"
								>
									<span>Terms of Service</span>
									<span className="opacity-0 group-hover:opacity-100 transition-opacity">
										→
									</span>
								</a>
							</li>
						</ul>
					</div>
				</div>
				<div className="border-t border-gray-700 mt-12 pt-8">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<p className="text-gray-400 mb-4 md:mb-0">
							&copy; 2025 MyLepakLab. All rights reserved.
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
