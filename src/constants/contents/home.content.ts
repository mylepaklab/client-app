export const faqItems = [
	{
		question: "What languages are supported?",
		answer:
			"Currently, we support Malay, and we are working on adding more languages soon.",
	},
	{
		question: "How accurate is the translation?",
		answer:
			"Our model achieves 95% accuracy on common BIM gestures. We continuously train on new data to improve recognition.",
	},
	{
		question: "What devices and browsers work?",
		answer:
			"It works on modern browsers with WebRTC support: Chrome, Firefox, Safari, and Edge. Camera access is required for gesture capture.",
	},
	{
		question: "How do you handle my data?",
		answer:
			"Your webcam feed stays in your browser. No video is stored or transmitted. Only gesture landmarks are processed securely.",
	},
	{
		question: "Will this work offline?",
		answer:
			"Currently, an internet connection is required for AI translation. We are working on offline gesture recognition for future releases.",
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
		description: "Scikit Learn classifier",
		icon: "Brain",
		bgColor: "bg-purple-100 dark:bg-purple-900/20",
		iconColor: "text-purple-600 dark:text-purple-400",
	},
	{
		title: "Translate",
		description: "SEA LION output with avatar animation",
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
	{ label: "Supported gestures", value: "4", delta: 10 },
	{ label: "Frame rate", value: "50 FPS", delta: 0 },
] as const;

export const programmeFitAreas = [
	{
		title: "Impact for SEA",
		icon: "Globe",
		percentage: "30%",
		points: [
			"Removes communication barriers for deaf and hard of hearing users",
			"Supports local language pairs such as Malay, but we are working on adding more languages soon.",
			"Cuts waiting time for human relays, making deaf communities more independent",
			"Empowers users to communicate without intermediaries",
		],
	},
	{
		title: "Feasibility and Prototype",
		icon: "Rocket",
		percentage: "30%",
		points: [
			"Live site and API that judges can try now",
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
			"Real time hand or text input to clean output in the browser",
			"Custom glossary for domain terms to keep meaning",
			"Client first approach reduces cost and improves privacy",
		],
	},
	{
		title: "Technical Implementation",
		icon: "Cpu",
		percentage: "15%",
		points: [
			"Client model runs in the browser",
			"Model runs in the browser",
			"Queue and logging only for errors, simple and safe",
		],
	},
	{
		title: "Ethics and Safety",
		icon: "Shield",
		percentage: "5%",
		points: [
			"Consent copy in place and clear privacy note on page",
			"No permanent storage of media in the demo",
			"Request filtering to limit harmful content",
		],
	},
	{
		title: "User Experience",
		icon: "Smile",
		percentage: "5%",
		points: [
			"One click start, no account needed for the demo",
			"Short video explains the flow, embedded on the site",
			"Clean layout with large buttons and readable text",
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
		description: "Scikit Learn model served by the API",
	},
	{
		component: "LLM",
		description: "SEA LION call for clean text",
	},
	{
		component: "Avatar",
		description: "animation synced with output tokens",
	},
] as const;
