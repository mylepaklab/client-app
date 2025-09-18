import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

import { StatusChips } from "./status-chips";
import { WebcamSection } from "./webcam-section";
import { BufferSection } from "./buffer-section";
import { PhrasePlayer } from "./phrase-player";
import { TourProvider } from "./tour-provider";
import { ErrorDisplay } from "./error-display";

import { useMLModel } from "~/hooks/use-ml-model.hook";
import { useHandSignPrediction } from "~/hooks/use-hand-sign-prediction.hook";
import { useAnimationPlayer } from "~/hooks/use-animation-player.hook";
import { useTour } from "~/hooks/use-tour.hook";
import { useFormAnswer } from "~/hooks/use-form-answer.hook";

import { PHRASES } from "~/constants/contents/demo.content";

export function HandSignPlayer() {
	const webcamRef = useRef<Webcam>(null);
	const playerRef = useRef<HTMLCanvasElement | null>(null);

	const [selectedPhrase, setSelectedPhrase] = useState<string>(PHRASES[0].key);

	const { model, labelMap, error, setError } = useMLModel();

	const { prediction, buffer, detecting, setDetecting, clearBuffer } =
		useHandSignPrediction(webcamRef, model, labelMap);

	const { matched, confidence, loading, playing, playAnimation } =
		useAnimationPlayer();

	const { runTour, startTour, endTour } = useTour(!!model);

	const { submitFormAnswer } = useFormAnswer();

	const onStop = useCallback(async () => {
		const text = buffer.trim();

		try {
			await submitFormAnswer(`${text} STOP`);
		} catch (e) {
			console.error("Form answer submission failed", e);
			setError("Form answer submission failed");
		}
	}, [buffer, submitFormAnswer, setError]);

	const onToggleDetection = useCallback(() => {
		setDetecting(!detecting);
	}, [detecting, setDetecting]);

	const onPlayAnimation = useCallback(async () => {
		if (!playerRef.current) return;
		try {
			await playAnimation(selectedPhrase, playerRef.current);
		} catch (e: any) {
			setError(e.message);
		}
	}, [selectedPhrase, playAnimation, setError]);

	return (
		<section
			aria-label="Hand sign translator"
			className="w-full max-w-6xl mx-auto p-4 md:p-8"
			style={{ backgroundColor: "var(--color-brand-50)" }}
		>
			<TourProvider runTour={runTour} onTourEnd={endTour} />

			<div className="mb-6 flex items-center justify-between gap-4 tour-header">
				<h1
					className="text-2xl font-semibold"
					style={{ color: "var(--color-ink)" }}
				>
					Try it out!
				</h1>

				<StatusChips
					isModelReady={!!model}
					isDetecting={detecting}
					onShowTutorial={startTour}
				/>
			</div>

			<div className="grid lg:grid-cols-2 gap-6">
				<div className="space-y-4">
					<WebcamSection
						ref={webcamRef}
						detecting={detecting}
						prediction={prediction}
						onToggleDetection={onToggleDetection}
						onClearBuffer={clearBuffer}
					/>

					<BufferSection buffer={buffer} onTranslate={onStop} />

					<ErrorDisplay error={error} />
				</div>

				<div className="space-y-4">
					<PhrasePlayer
						ref={playerRef}
						selectedPhrase={selectedPhrase}
						loading={loading}
						playing={playing}
						matched={matched}
						confidence={confidence}
						onPhraseChange={setSelectedPhrase}
						onPlayAnimation={onPlayAnimation}
					/>
				</div>
			</div>
		</section>
	);
}
