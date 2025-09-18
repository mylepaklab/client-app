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

function toCenterCropTensor(video: HTMLVideoElement, size = 256) {
	const anyFn = toCenterCropTensor as any;
	const canvas: HTMLCanvasElement =
		anyFn._canvas || (anyFn._canvas = document.createElement("canvas"));
	const ctx: CanvasRenderingContext2D =
		anyFn._ctx || (anyFn._ctx = canvas.getContext("2d")!);

	const s = Math.min(video.videoWidth, video.videoHeight);
	const sx = (video.videoWidth - s) / 2;
	const sy = (video.videoHeight - s) / 2;

	canvas.width = size;
	canvas.height = size;

	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, size, size);

	ctx.drawImage(video, sx, sy, s, s, 0, 0, size, size);

	return tf.browser.fromPixels(canvas).toFloat().div(255).expandDims(0);
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
	const checkedShapeRef = useRef(false);

	const stableRef = useRef<{ lastPrediction: string | null; ticks: number }>({
		lastPrediction: null,
		ticks: 0,
	});

	const CONFIDENCE_THRESHOLD = 0.3;
	const REQUIRED_TICKS = 2;
	const INPUT_SIZE = 256;

	const predict = useCallback(async () => {
		if (!detecting || !webcamRef.current || !model || isProcessing.current)
			return;

		const video = webcamRef.current.video as HTMLVideoElement | null;
		if (!video || video.readyState !== 4) return;

		isProcessing.current = true;

		let input: tf.Tensor | null = null;
		let logits: tf.Tensor | null = null;
		let probs: tf.Tensor | null = null;

		try {
			input = toCenterCropTensor(video, INPUT_SIZE); // [1, 256, 256, 3]

			logits = model.predict(input) as tf.Tensor;

			if (!checkedShapeRef.current) {
				const outShape = logits.shape;
				const numClasses = outShape[outShape.length - 1] ?? 0;
				const labelCount = Object.keys(labelMap).length;
				if (numClasses !== labelCount) {
					console.error(
						`Model classes ${numClasses} do not match labels ${labelCount}. Fix either the model or the label mapping`
					);
					isProcessing.current = false;
					return;
				}
				checkedShapeRef.current = true;
			}

			probs = tf.softmax(logits);
			const arr = await probs.data();

			let topIndex = 0;
			let topProb = -Infinity;
			for (let i = 0; i < arr.length; i++) {
				const p = arr[i];
				if (p > topProb) {
					topProb = p;
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
		} catch (err) {
			console.error("Prediction error:", err);
		} finally {
			if (input) input.dispose();
			if (logits) logits.dispose();
			if (probs) probs.dispose();
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
