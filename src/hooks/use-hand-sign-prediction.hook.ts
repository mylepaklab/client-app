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

	const stableRef = useRef<{ idx: number | null; ticks: number }>({
		idx: null,
		ticks: 0,
	});

	const predict = useCallback(async () => {
		if (!detecting) return;
		const video = webcamRef.current?.video as HTMLVideoElement | undefined;
		if (!video || video.readyState !== 4 || !model) return;

		const { output, probs } = await tf.tidy(() => {
			const input = tf.browser
				.fromPixels(video)
				.resizeBilinear([256, 256])
				.toFloat()
				.expandDims(0);
			const out = model.predict(input) as tf.Tensor;
			return {
				output: out,
				probs: (out as any).softmax ? (out as any).softmax() : out,
			};
		});

		const data = await probs.data();
		let topIdx = -1;
		let topVal = -Infinity;
		let secondVal = -Infinity;
		for (let i = 0; i < data.length; i++) {
			const v = data[i];
			if (v > topVal) {
				secondVal = topVal;
				topVal = v;
				topIdx = i;
			} else if (v > secondVal) {
				secondVal = v;
			}
		}

		output.dispose();
		if (probs !== output) probs.dispose();

		const name = labelMap[topIdx] ?? `class_${topIdx}`;
		setPrediction({ index: topIdx, name, prob: topVal });

		const clearMargin = topVal - secondVal >= 0.15;
		if (clearMargin) {
			const last = stableRef.current.idx;
			if (last === topIdx) {
				stableRef.current.ticks += 1;
			} else {
				stableRef.current.idx = topIdx;
				stableRef.current.ticks = 1;
			}
			if (stableRef.current.ticks >= 2) {
				if (!buffer.endsWith(name) && /^[A-Z0-9]+$/.test(name)) {
					setBuffer((b) => b + name);
				}
			}
		} else {
			stableRef.current.idx = null;
			stableRef.current.ticks = 0;
		}
	}, [model, labelMap, buffer, detecting, webcamRef]);

	const clearBuffer = useCallback(() => {
		setBuffer("");
		stableRef.current.idx = null;
		stableRef.current.ticks = 0;
	}, []);

	useEffect(() => {
		if (!model) return;
		const id = setInterval(predict, PREDICT_MS);
		return () => clearInterval(id);
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
