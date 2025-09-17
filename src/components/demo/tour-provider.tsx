import Joyride, { Step, CallBackProps, STATUS } from "react-joyride";

const TOUR_KEY = "handsign_tour_seen_v1";

interface TourProviderProps {
	runTour: boolean;
	onTourEnd: () => void;
}

export function TourProvider({ runTour, onTourEnd }: TourProviderProps) {
	const onTourCallback = (data: CallBackProps) => {
		const { status } = data;
		const finished = status === STATUS.FINISHED || status === STATUS.SKIPPED;
		if (finished) {
			localStorage.setItem(TOUR_KEY, "1");
			onTourEnd();
		}
	};

	const steps: Step[] = [
		{
			target: ".tour-header",
			content:
				"Welcome. This page helps you translate hand signs into text and play phrase animations.",
			disableBeacon: true,
		},
		{
			target: ".tour-webcam",
			content:
				"Your camera preview appears here. Keep your hand steady and inside the frame for best results.",
		},
		{
			target: ".tour-detect-toggle",
			content: "You can pause or resume detection any time.",
		},
		{
			target: ".tour-buffer",
			content:
				"Detected letters build up here. Use Translate to send them for processing.",
		},
		{
			target: ".tour-translate",
			content:
				"Translate sends the buffer to the server. It will not work when the buffer is empty.",
		},
		{
			target: ".tour-phrase-select",
			content: "Pick a phrase to learn its motion sequence.",
		},
		{
			target: ".tour-play",
			content: "Play animation draws the hand bones over time on the canvas.",
		},
		{
			target: ".tour-canvas",
			content: "The animation renders here. Use it as a visual guide.",
		},
		{
			target: ".tour-status",
			content: "Status chips show model readiness and current detection state.",
		},
	];

	return (
		<Joyride
			steps={steps}
			run={runTour}
			continuous
			showSkipButton
			scrollToFirstStep
			hideCloseButton
			callback={onTourCallback}
			styles={{
				options: {
					primaryColor: "var(--color-brand-500)",
					textColor: "var(--color-ink)",
					zIndex: 10000,
				},
				tooltip: {
					borderRadius: 12,
				},
			}}
		/>
	);
}

export function shouldStartTour(isModelReady: boolean): boolean {
	return isModelReady && !localStorage.getItem(TOUR_KEY);
}
