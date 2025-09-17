import { useState, useEffect } from "react";
import { shouldStartTour } from "~/components/demo/tour-provider";

interface UseTourReturn {
	runTour: boolean;
	startTour: () => void;
	endTour: () => void;
}

export function useTour(isModelReady: boolean): UseTourReturn {
	const [runTour, setRunTour] = useState(false);

	// only once per browser.
	useEffect(() => {
		if (shouldStartTour(isModelReady)) {
			setRunTour(true);
		}
	}, [isModelReady]);

	const startTour = () => setRunTour(true);
	const endTour = () => setRunTour(false);

	return {
		runTour,
		startTour,
		endTour,
	};
}
