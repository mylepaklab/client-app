import { motion } from "framer-motion";

const teamMembers = [
	{
		name: "Fatin Nadiah",
		role: "Backend Developer",
		image: "https://tailone.tailwindtemplate.net/src/img/dummy/avatar3.png",
		linkedin: "https://www.linkedin.com/in/fatin-nadiah-mat-ali-462611ab/",
	},
	{
		name: "Fatin Najihah",
		role: "Machine Learning Engineer",
		image: "https://tailone.tailwindtemplate.net/src/img/dummy/avatar3.png",
		linkedin:
			"https://www.linkedin.com/in/fatin-najihah-mat-ali-b9981911a/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
	},
	{
		name: "Rahman Nurudin",
		role: "Frontend Developer",
		image: "https://tailone.tailwindtemplate.net/src/img/dummy/avatar2.png",
		linkedin: "https://www.linkedin.com/in/rahmannrdn/",
	},
	{
		name: "Prof. Muhammad Azmi Ayub",
		role: "Machine Learning Engineer",
		image: "https://tailone.tailwindtemplate.net/src/img/dummy/avatar4.png",
		linkedin: "https://www.linkedin.com/in/muhammad-azmi-ayub-7200a945/",
	},
];

interface OurTeamSectionProps {
	fadeInUp: any;
	staggerContainer: any;
}

export const OurTeamSection = ({
	fadeInUp,
	staggerContainer,
}: OurTeamSectionProps) => {
	return (
		<section id="team" className="py-24 px-4 sm:px-6 lg:px-8 bg-surface">
			<div className="container xl:max-w-6xl mx-auto">
				<motion.header
					className="text-center mx-auto mb-16"
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					variants={staggerContainer}
				>
					<motion.h2
						className="text-4xl md:text-5xl leading-normal mb-6 font-bold text-charcoal"
						variants={fadeInUp}
					>
						<span className="font-light">Meet Our</span> Team
					</motion.h2>
					<motion.p
						className="text-lg text-cocoa/80 max-w-2xl mx-auto"
						variants={fadeInUp}
					>
						Meet the passionate innovators behind our BIM translation technology
					</motion.p>
				</motion.header>

				<motion.div
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6"
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					variants={staggerContainer}
				>
					{teamMembers?.map((member) => (
						<motion.div key={member.name} className="group" variants={fadeInUp}>
							<div className="relative overflow-hidden bg-white rounded-2xl border border-brand-200 shadow-lg transition-transform transform hover:scale-105 min-h-[442px] flex flex-col items-center justify-center h-full">
								<div className="relative overflow-hidden p-8">
									<div className="relative">
										<img
											src={member.image}
											className="w-32 h-32 mx-auto rounded-full bg-brand-50 shadow-lg ring-4 ring-brand-100 transition-all duration-300 group-hover:ring-brand-300 "
											alt={member.name}
										/>
									</div>
								</div>

								<div className="px-8 pt-8 text-center">
									<h3 className="text-xl leading-normal font-bold mb-2 text-charcoal">
										{member.name}
									</h3>
									<p className="text-cocoa/70 leading-relaxed font-medium mb-4">
										{member.role}
									</p>

									<div className="flex justify-center space-x-3">
										<a
											className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand-100 text-brand-600 hover:bg-brand-500 hover:text-white transition-all duration-300 transform hover:scale-110"
											aria-label="LinkedIn link"
											href={member.linkedin}
											target="_blank"
											rel="noopener noreferrer"
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
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
};
