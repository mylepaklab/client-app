import { useState, useRef, useCallback, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
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

export function useHandSignPrediction(
	webcamRef: React.RefObject<Webcam>,
	model: tf.LayersModel | null,
	labelMap: Record<number, string>
): UseHandSignPredictionReturn {
	const [prediction, setPrediction] = useState<PredictionResult | null>(null);
	const [buffer, setBuffer] = useState<string>("");
	const [detecting, setDetecting] = useState(true);

	const stableRef = useRef<{ lastPrediction: string | null; ticks: number }>({
		lastPrediction: null,
		ticks: 0,
	});

	const predict = useCallback(async () => {
		if (!detecting || !webcamRef.current || !model) return;

		const video = webcamRef.current.video;
		if (!video || video.readyState !== 4) return;

		const input = tf.tidy(() => {
			return tf.browser
				.fromPixels(video)
				.resizeBilinear([256, 256])
				.toFloat()
				.expandDims(0); // shape: [1, 256, 256, 3]
		});

		const output = model.predict(input) as tf.Tensor;
		const predictionArray = await output.data();

		const topIndex = predictionArray.indexOf(Math.max(...predictionArray));
		const topConfidence = predictionArray[topIndex];

		const className = labelMap[topIndex] || `Class ${topIndex}`;

		setPrediction({
			index: topIndex,
			name: className,
			prob: topConfidence,
		});

		if (topConfidence > 0.7) {
			// Only add high-confidence predictions
			const currentPrediction = className;

			if (stableRef.current.lastPrediction === currentPrediction) {
				stableRef.current.ticks += 1;

				if (stableRef.current.ticks >= 2) {
					const bufferWords = buffer
						.trim()
						.split(" ")
						.filter((w) => w.length > 0);
					const lastWord = bufferWords[bufferWords.length - 1];

					if (lastWord !== currentPrediction && currentPrediction.length > 0) {
						setBuffer((prev) =>
							prev ? `${prev} ${currentPrediction}` : currentPrediction
						);
						console.log("Added to buffer:", currentPrediction);
					}
					stableRef.current.ticks = 0;
				}
			} else {
				stableRef.current.lastPrediction = currentPrediction;
				stableRef.current.ticks = 1;
			}
		} else {
			stableRef.current.lastPrediction = null;
			stableRef.current.ticks = 0;
		}

		tf.dispose([input, output]);
	}, [model, labelMap, buffer, detecting, webcamRef]);

	const clearBuffer = useCallback(() => {
		setBuffer("");
		stableRef.current.lastPrediction = null;
		stableRef.current.ticks = 0;
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
