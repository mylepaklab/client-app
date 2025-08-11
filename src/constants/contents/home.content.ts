export const faqItems = [
	{
		question: "What languages are supported?",
		answer:
			"We support translation to all SEA LION supported languages including English, Malay, Indonesian, Thai, Vietnamese, and more.",
	},
	{
		question: "How accurate is the translation?",
		answer:
			"Our model achieves 95% accuracy on common BIM gestures. We continuously train on new data to improve recognition.",
	},
	{
		question: "What devices and browsers work?",
		answer:
			"Works on modern browsers with WebRTC support: Chrome, Firefox, Safari, Edge. Requires camera access for gesture capture.",
	},
	{
		question: "How do you handle my data?",
		answer:
			"Your webcam feed stays in your browser. No video is stored or transmitted. Only gesture landmarks are processed securely.",
	},
	{
		question: "Will this work offline?",
		answer:
			"Currently requires internet for AI translation. We're working on offline gesture recognition for future releases.",
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
	{ label: "Supported gestures", value: "50+", delta: 15 },
	{ label: "Frame rate", value: "30 FPS", delta: 0 },
] as const;

export const programmeFitAreas = [
	{
		title: "Innovation",
		percentage: "20 percent",
		icon: "Lightbulb",
		points: [
			"Hands first AI chat with BIM input.",
			"Landmarks plus classic classifier lowers latency.",
			"Avatar gives visual feedback for clarity.",
		],
	},
	{
		title: "Technical implementation",
		percentage: "30 percent",
		icon: "Code",
		points: [
			"MediaPipe for hand landmarks.",
			"Scikit Learn model for gesture class.",
			"Flask API connects to SEA LION for text.",
		],
	},
	{
		title: "Impact and relevance",
		percentage: "30 percent",
		icon: "Globe",
		points: [
			"Built for Malay Sign Language users.",
			"Text output in SEA LION supported languages.",
			"Fits public info and service access use cases.",
		],
	},
	{
		title: "Usability",
		percentage: "10 percent",
		icon: "Eye",
		points: [
			"No login for the demo.",
			"Works on common laptops and phones.",
			"Keyboard support and clear focus states.",
		],
	},
	{
		title: "Presentation and demonstration",
		percentage: "10 percent",
		icon: "Presentation",
		points: [
			"Short video shows the full flow.",
			"Live demo link on this page.",
			"Repo and docs are public.",
		],
	},
	{
		title: "Feasibility",
		percentage: "Round 1 B",
		icon: "Target",
		points: [
			"Prototype runs in the browser with webcam.",
			"Back end API is small and easy to host.",
			"Clear next steps, dataset growth and fine tuning.",
		],
	},
] as const;

export const challengeBadges = [
	{
		text: "Round 1 A, Innovation",
		variant: "default" as const,
	},
	{
		text: "Round 1 B, Feasibility",
		variant: "default" as const,
	},
	{
		text: "Round 2 focus",
		variant: "primary" as const,
	},
] as const;

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
