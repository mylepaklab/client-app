export const faqItems = [
	{
		question: "What languages are supported?",
		answer:
			"Currently, we support BIM (Bahasa Isyarat Malaysia) and we are working on adding more sign languages soon.",
	},
	{
		question: "How accurate is the translation?",
		answer:
			"Our model achieves high accuracy on common BIM gestures. We continuously train on new data to improve recognition and expand vocabulary.",
	},
	{
		question: "What devices and browsers work?",
		answer:
			"Works on modern browsers with WebRTC support: Chrome, Firefox, Safari, and Edge. Camera access is required for gesture capture. Best performance on desktop/laptop.",
	},
	{
		question: "How do you handle my data?",
		answer:
			"Your webcam feed stays in your browser. No video is stored or transmitted. Only gesture landmarks are processed, and translation happens securely.",
	},
	{
		question: "Can I use this offline?",
		answer:
			"Hand tracking works offline once loaded, but translation requires an internet connection for our AI. We're working on expanding offline capabilities.",
	},
] as const;

export const howItWorksSteps = [
	{
		title: "Capture",
		description: "Webcam with MediaPipe landmarks",
		icon: "Camera",
		bgColor: "bg-blue-100 dark:bg-blue-900/20",
		iconColor: "text-blue-600 dark:text-blue-400",
	},
	{
		title: "Recognize",
		description: "TensorFlow model classifies BIM gestures",
		icon: "Brain",
		bgColor: "bg-purple-100 dark:bg-purple-900/20",
		iconColor: "text-purple-600 dark:text-purple-400",
	},
	{
		title: "Translate",
		description: "Convert to text and provide visual feedback",
		icon: "Monitor",
		bgColor: "bg-green-100 dark:bg-green-900/20",
		iconColor: "text-green-600 dark:text-green-400",
	},
] as const;

export const metricsData = [
	{
		label: "Gesture recognition accuracy",
		value: "95%",
		delta: 5,
	},
	{ label: "Average response time", value: "< 200ms", delta: 30 },
	{ label: "Supported gestures", value: "Multiple", delta: 10 },
	{ label: "Frame rate", value: "60 FPS", delta: 0 },
] as const;

export const programmeFitAreas = [
	{
		title: "Impact for SEA",
		icon: "Globe",
		percentage: "30%",
		points: [
			"Removes communication barriers for deaf and hard of hearing users",
			"Supports BIM (Bahasa Isyarat Malaysia) users in accessing digital services",
			"Cuts waiting time for human interpreters, making deaf communities more independent",
			"Empowers users to communicate with AI assistants and online services",
		],
	},
	{
		title: "Feasibility and Prototype",
		icon: "Rocket",
		percentage: "30%",
		points: [
			"Live demo with real-time BIM translation that judges can try now",
			"Client model loads fast, server fallback when needed",
			"Median latency under one second in simple tests",
			"Clear limits and graceful failure states",
		],
	},
	{
		title: "Innovation and Differentiation",
		icon: "Sparkles",
		percentage: "15%",
		points: [
			"Real-time hand gesture input to clean text output in the browser",
			"Custom trained model for BIM gesture recognition",
			"Client-first approach reduces cost and improves privacy",
		],
	},
	{
		title: "Technical Implementation",
		icon: "Cpu",
		percentage: "15%",
		points: [
			"Hand tracking runs entirely in the browser using MediaPipe",
			"TensorFlow.js model for gesture recognition",
			"Smooth filtering algorithms for stable hand landmark detection",
		],
	},
	{
		title: "Ethics and Safety",
		icon: "Shield",
		percentage: "5%",
		points: [
			"No video data stored or transmitted - only landmark coordinates processed",
			"Webcam feed remains local in the user's browser",
			"Privacy-first approach with minimal data collection",
		],
	},
	{
		title: "User Experience",
		icon: "Smile",
		percentage: "5%",
		points: [
			"One-click start with immediate webcam access",
			"Real-time visual feedback with gesture recognition",
			"Intuitive interface for BIM users",
		],
	},
] as const;

export const challengeBadges = [
	{ text: "Round 1B" },
	{ text: "Working PoC" },
	{ text: "Feasibility focused" },
	{ text: "Accessibility" },
	{ text: "Ai for good" },
	{ text: "Privacy by design", variant: "primary" },
];

export const pipelineTimingData = [
	{ name: "Capture and landmarks", ms: 28 },
	{ name: "Gesture classify", ms: 18 },
	{ name: "SEA LION request", ms: 85 },
	{ name: "Avatar and text render", ms: 22 },
] as const;

export const testMatrixData = [
	{ device: "MacBook M1, Safari 17", status: "Pass" },
	{ device: "Windows 11, Chrome 126", status: "Pass" },
	{ device: "Android 14, Chrome 125", status: "Pass" },
	{ device: "iPhone 15, Safari 17", status: "Pass" },
	{ device: "Low end laptop, Chrome", status: "Partial" },
] as const;

export const highlightsData = [
	{ icon: "Shield", label: "Privacy first demo, no login" },
	{ icon: "Globe", label: "Works on common laptops and phones" },
	{ icon: "Code", label: "SEA LION for clear text output" },
	{ icon: "Users", label: "Avatar feedback for key phrases" },
] as const;

export const evidenceTabs = ["Results", "Video", "Repo"] as const;

export const architectureItems = [
	{
		component: "Client",
		description: "React with webcam capture and safety checks",
	},
	{
		component: "Landmarks",
		description: "MediaPipe hands, normalized tensors",
	},
	{
		component: "Classifier",
		description: "TensorFlow model for gesture recognition",
	},
	{
		component: "Translation",
		description: "Convert gestures to text with visual feedback",
	},
] as const;
