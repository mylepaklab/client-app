export const OurTeamSection = () => {
	const teamMembers = [
		{
			name: "Fatin Nadiah",
			role: "Backend Developer",
			image: "https://tailone.tailwindtemplate.net/src/img/dummy/avatar3.png",
		},
		{
			name: "Fatin Najihah",
			role: "Machine Learning Engineer",
			image: "https://tailone.tailwindtemplate.net/src/img/dummy/avatar3.png",
		},
		{
			name: "Rahman Nurudin",
			role: "Frontend Developer",
			image: "https://tailone.tailwindtemplate.net/src/img/dummy/avatar2.png",
		},
		{
			name: "Prof. Muhammad Azmi Ayub",
			role: "Machine Learning Engineer",
			image: "https://tailone.tailwindtemplate.net/src/img/dummy/avatar4.png",
		},
	];

	return (
		<section id="team" className="py-24 px-4 sm:px-6 lg:px-8 bg-surface">
			<div className="container xl:max-w-6xl mx-auto">
				<header className="text-center mx-auto mb-16">
					<h2 className="text-4xl md:text-5xl leading-normal mb-6 font-bold text-charcoal">
						<span className="font-light">Meet Our</span> Team
					</h2>
					<div className="flex items-center justify-center space-x-4 mb-4">
						<div className="h-px bg-gradient-to-r from-transparent to-brand-300 w-20"></div>
						<div className="w-3 h-3 rounded-full bg-gradient-to-br from-brand-500 to-brand-700"></div>
						<div className="h-px bg-gradient-to-l from-transparent to-brand-300 w-20"></div>
					</div>
					<p className="text-lg text-cocoa/80 max-w-2xl mx-auto">
						Meet the passionate innovators behind our BIM translation technology
					</p>
				</header>

				{/* Team Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
					{teamMembers.map((member, index) => (
						<div key={index} className="group">
							<div className="relative overflow-hidden bg-white rounded-2xl border border-brand-200">
								{/* Avatar Section */}
								<div className="relative overflow-hidden p-8">
									<div className="relative">
										<img
											src={member.image}
											className="w-32 h-32 mx-auto rounded-full bg-brand-50 shadow-lg ring-4 ring-brand-100 transition-all duration-300 group-hover:ring-brand-300"
											alt={member.name}
										/>
										<div className="absolute inset-0 rounded-full bg-gradient-to-t from-brand-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
									</div>
								</div>

								{/* Info Section */}
								<div className="px-8 pt-8 mb-10 text-center">
									<h3 className="text-xl leading-normal font-bold mb-2 text-charcoal">
										{member.name}
									</h3>
									<p className="text-cocoa/70 leading-relaxed font-medium mb-4">
										{member.role}
									</p>

									{/* Social Icons */}
									<div className="flex justify-center space-x-3">
										<a
											className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand-100 text-brand-600 hover:bg-brand-500 hover:text-white transition-all duration-300 transform hover:scale-110"
											aria-label="Twitter link"
											href="#"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="w-5 h-5"
												viewBox="0 0 512 512"
												fill="currentColor"
											>
												<path d="M496,109.5a201.8,201.8,0,0,1-56.55,15.3,97.51,97.51,0,0,0,43.33-53.6,197.74,197.74,0,0,1-62.56,23.5A99.14,99.14,0,0,0,348.31,64c-54.42,0-98.46,43.4-98.46,96.9a93.21,93.21,0,0,0,2.54,22.1,280.7,280.7,0,0,1-203-101.3A95.69,95.69,0,0,0,36,130.4C36,164,53.53,193.7,80,211.1A97.5,97.5,0,0,1,35.22,199v1.2c0,47,34,86.1,79,95a100.76,100.76,0,0,1-25.94,3.4,94.38,94.38,0,0,1-18.51-1.8c12.51,38.5,48.92,66.5,92.05,67.3A199.59,199.59,0,0,1,39.5,405.6,203,203,0,0,1,16,404.2A278.68,278.68,0,0,0,166.74,448c181.36,0,280.44-147.7,280.44-275.8,0-4.2-.11-8.4-.31-12.5A198.48,198.48,0,0,0,496,109.5Z" />
											</svg>
										</a>
										<a
											className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand-100 text-brand-600 hover:bg-brand-500 hover:text-white transition-all duration-300 transform hover:scale-110"
											aria-label="LinkedIn link"
											href="#"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="w-5 h-5"
												viewBox="0 0 512 512"
												fill="currentColor"
											>
												<path d="M444.17,32H70.28C49.85,32,32,46.7,32,66.89V441.61C32,461.91,49.85,480,70.28,480H444.06C464.6,480,480,461.79,480,441.61V66.89C480.12,46.7,464.6,32,444.17,32ZM170.87,405.43H106.69V205.88h64.18ZM141,175.54h-.46c-20.54,0-33.84-15.29-33.84-34.43,0-19.49,13.65-34.42,34.65-34.42s33.85,14.82,34.31,34.42C175.65,160.25,162.35,175.54,141,175.54ZM405.43,405.43H341.25V296.32c0-26.14-9.34-44-32.56-44-17.74,0-28.24,12-32.91,23.69-1.75,4.2-2.22,9.92-2.22,15.76V405.43H209.38V205.88h64.18v27.77c9.34-13.3,23.93-32.44,57.88-32.44,42.13,0,74,27.77,74,87.64Z" />
											</svg>
										</a>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
