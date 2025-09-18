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

function softmax(logits: number[]): number[] {
	const maxLogit = Math.max(...logits);
	const scores = logits.map((logit) => Math.exp(logit - maxLogit));
	const sum = scores.reduce((a, b) => a + b, 0);
	return scores.map((score) => score / sum);
}

export function useHandSignPrediction(
	webcamRef: React.RefObject<Webcam>,
	model: tf.LayersModel | null,
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

		const video = webcamRef.current.video;
		if (!video || video.readyState !== 4) return;

		isProcessing.current = true;

		let input: tf.Tensor | null = null;
		let output: tf.Tensor | null = null;

		try {
			input = tf.tidy(() => {
				return tf.browser
					.fromPixels(video)
					.resizeBilinear([256, 256])
					.toFloat()
					.div(255) // Normalize input values to [0,1]
					.expandDims(0); // shape: [1, 256, 256, 3]
			});

			output = model.predict(input) as tf.Tensor;
			const logits = await output.data();

			const probabilities = softmax(Array.from(logits));

			const topIndices = probabilities
				.map((prob, index) => ({ prob, index }))
				.sort((a, b) => b.prob - a.prob)
				.slice(0, 3);

			console.log(
				"Top 3 predictions:",
				topIndices.map((item) => ({
					class: labelMap[item.index] || `Class ${item.index}`,
					probability: (item.prob * 100).toFixed(1) + "%",
				}))
			);

			const topIndex = topIndices[0].index;
			const topConfidence = topIndices[0].prob;
			const className = labelMap[topIndex] || `Class ${topIndex}`;

			setPrediction({
				index: topIndex,
				name: className,
				prob: topConfidence,
			});

			if (topConfidence > CONFIDENCE_THRESHOLD) {
				const currentPrediction = className;
				console.log(
					`High confidence prediction: ${currentPrediction} (${(
						topConfidence * 100
					).toFixed(1)}%)`
				);

				if (stableRef.current.lastPrediction === currentPrediction) {
					stableRef.current.ticks += 1;
					console.log(`Stable ticks: ${stableRef.current.ticks}`);

					if (stableRef.current.ticks >= REQUIRED_TICKS) {
						setBuffer((currentBuffer) => {
							const bufferWords = currentBuffer
								.trim()
								.split(" ")
								.filter((w) => w.length > 0);
							const lastWord = bufferWords[bufferWords.length - 1];

							if (
								lastWord !== currentPrediction &&
								currentPrediction.length > 0
							) {
								const newBuffer = currentBuffer
									? `${currentBuffer} ${currentPrediction}`
									: currentPrediction;
								console.log(
									`Adding to buffer: "${currentPrediction}" -> Buffer: "${newBuffer}"`
								);
								return newBuffer;
							}
							return currentBuffer;
						});
						stableRef.current.ticks = 0;
					}
				} else {
					stableRef.current.lastPrediction = currentPrediction;
					stableRef.current.ticks = 1;
					console.log(`New prediction detected: ${currentPrediction}`);
				}
			} else {
				stableRef.current.lastPrediction = null;
				stableRef.current.ticks = 0;
			}
		} catch (error) {
			console.error("Prediction error:", error);
		} finally {
			if (input) {
				input.dispose();
			}
			if (output) {
				output.dispose();
			}

			isProcessing.current = false;
		}
	}, [model, labelMap, detecting, webcamRef]);

	const clearBuffer = useCallback(() => {
		setBuffer("");
		stableRef.current.lastPrediction = null;
		stableRef.current.ticks = 0;
		isProcessing.current = false; // Reset processing state
	}, []);

	useEffect(() => {
		if (Object.keys(labelMap).length > 0) {
			console.log("Label map received:", labelMap);
			console.log("Available labels:", Object.values(labelMap));
		}
	}, [labelMap]);

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
