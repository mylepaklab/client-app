import { useReducedMotion } from "framer-motion";

export const useAnimation = () => {
	const shouldReduceMotion = useReducedMotion();

	const fadeInUp = {
		initial: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
		animate: { opacity: 1, y: 0 },
		transition: { duration: shouldReduceMotion ? 0 : 0.6 },
	};

	const staggerContainer = {
		animate: {
			transition: {
				staggerChildren: shouldReduceMotion ? 0 : 0.1,
			},
		},
	};

	return { fadeInUp, staggerContainer };
};
