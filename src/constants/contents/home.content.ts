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
		title: "Allow Camera Access",
		description:
			"Enable webcam and position your hand in the frame for detection",
		icon: "Camera",
		bgColor: "bg-blue-100 dark:bg-blue-900/20",
		iconColor: "text-blue-600 dark:text-blue-400",
	},
	{
		title: "Hold Hand Steady",
		description: "TensorFlow.js model recognizes BIM gestures in real-time",
		icon: "Brain",
		bgColor: "bg-purple-100 dark:bg-purple-900/20",
		iconColor: "text-purple-600 dark:text-purple-400",
	},
	{
		title: "Translate or Learn",
		description: "Get text translation or watch phrase animations to learn BIM",
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
		title: "Breaking Communication Barriers",
		icon: "Globe",
		percentage: "",
		points: [
			"Enables deaf and hard of hearing users to interact with digital services naturally",
			"Reduces dependency on human interpreters for basic communication",
			"Makes AI assistants and online platforms accessible to BIM users",
			"Supports independence and digital inclusion for the deaf community",
		],
	},
	{
		title: "Proven Technology",
		icon: "Rocket",
		percentage: "",
		points: [
			"Live demo with real-time BIM recognition you can try right now",
			"Browser-based TensorFlow.js model for privacy and speed",
			"Real-time hand tracking with visual feedback",
			"Graceful fallbacks and clear user guidance",
		],
	},
	{
		title: "Privacy-First Design",
		icon: "Shield",
		percentage: "",
		points: [
			"No video data ever leaves your device",
			"All processing happens locally in your browser",
			"Only hand landmark coordinates are analyzed",
			"Complete transparency about data usage",
		],
	},
	{
		title: "Interactive Learning",
		icon: "Sparkles",
		percentage: "",
		points: [
			"Learn BIM gestures through animated demonstrations",
			"Practice with real-time feedback and confidence scoring",
			"Bidirectional tool - translate signs or learn new ones",
			"Encourages BIM literacy and cultural understanding",
		],
	},
	{
		title: "Technical Innovation",
		icon: "Cpu",
		percentage: "",
		points: [
			"Real-time gesture recognition entirely in the browser",
			"Custom-trained model specifically for BIM gestures",
			"Smooth filtering for stable hand landmark detection",
			"Optimized for speed and accuracy",
		],
	},
	{
		title: "Accessible Experience",
		icon: "Smile",
		percentage: "",
		points: [
			"One-click start with immediate camera access",
			"Visual feedback and clear user interface",
			"Works on desktop and mobile devices",
			"Designed with and for the deaf community",
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
