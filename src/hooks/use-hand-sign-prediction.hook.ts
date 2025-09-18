import { useState, useRef, useCallback, useEffect } from "react";
import * as tmImage from "@teachablemachine/image";
import Webcam from "react-webcam";
import { PREDICT_MS } from "~/constants/contents/demo.content";

interface PredictionResult {
	index: number;
	name: string;
	prob: number;
}

interface UseHandSignPredictionReturn {
	prediction: PredictionResult | null;
	buffer: string;
	detecting: boolean;
	setDetecting: (detecting: boolean) => void;
	clearBuffer: () => void;
	setBuffer: (buffer: string) => void;
}

function createImageFromVideo(video: HTMLVideoElement): HTMLCanvasElement {
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d")!;

	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;

	ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

	return canvas;
}

export function useHandSignPrediction(
	webcamRef: React.RefObject<Webcam>,
	model: tmImage.CustomMobileNet | null,
	labelMap: Record<number, string>
): UseHandSignPredictionReturn {
	const [prediction, setPrediction] = useState<PredictionResult | null>(null);
	const [buffer, setBuffer] = useState<string>("");
	const [detecting, setDetecting] = useState(true);

	const isProcessing = useRef(false);

	const stableRef = useRef<{ lastPrediction: string | null; ticks: number }>({
		lastPrediction: null,
		ticks: 0,
	});

	const CONFIDENCE_THRESHOLD = 0.3;
	const REQUIRED_TICKS = 2;

	const predict = useCallback(async () => {
		if (!detecting || !webcamRef.current || !model || isProcessing.current)
			return;

		const video = webcamRef.current.video as HTMLVideoElement | null;
		if (!video || video.readyState !== 4) return;

		isProcessing.current = true;

		try {
			const canvas = createImageFromVideo(video);

			const predictions = await model.predict(canvas);

			if (predictions && predictions.length > 0) {
				let topIndex = 0;
				let topProb = predictions[0].probability;

				for (let i = 1; i < predictions.length; i++) {
					if (predictions[i].probability > topProb) {
						topProb = predictions[i].probability;
						topIndex = i;
					}
				}

				const className = labelMap[topIndex] || `Class ${topIndex}`;

				setPrediction({ index: topIndex, name: className, prob: topProb });

				if (topProb > CONFIDENCE_THRESHOLD) {
					const current = className;

					if (stableRef.current.lastPrediction === current) {
						stableRef.current.ticks += 1;

						if (stableRef.current.ticks >= REQUIRED_TICKS) {
							setBuffer((prev) => {
								const words = prev.trim().split(" ").filter(Boolean);
								const last = words[words.length - 1];
								if (last !== current && current.length > 0) {
									return prev ? `${prev} ${current}` : current;
								}
								return prev;
							});
							stableRef.current.ticks = 0;
						}
					} else {
						stableRef.current.lastPrediction = current;
						stableRef.current.ticks = 1;
					}
				} else {
					stableRef.current.lastPrediction = null;
					stableRef.current.ticks = 0;
				}
			}
		} catch (err) {
			console.error("Prediction error:", err);
		} finally {
			isProcessing.current = false;
		}
	}, [model, labelMap, detecting, webcamRef]);

	const clearBuffer = useCallback(() => {
		setBuffer("");
		stableRef.current.lastPrediction = null;
		stableRef.current.ticks = 0;
		isProcessing.current = false;
	}, []);

	useEffect(() => {
		if (!model) return;
		const interval = setInterval(() => {
			predict();
		}, PREDICT_MS);
		return () => clearInterval(interval);
	}, [model, predict]);

	return {
		prediction,
		buffer,
		detecting,
		setDetecting,
		clearBuffer,
		setBuffer,
	};
}
