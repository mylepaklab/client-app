import { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import { URL } from "~/constants/contents/demo.content";

interface UseMLModelReturn {
	model: tf.LayersModel | null;
	labelMap: Record<number, string>;
	error: string;
	setError: (error: string) => void;
}

export function useMLModel(): UseMLModelReturn {
	const [model, setModel] = useState<tf.LayersModel | null>(null);
	const [labelMap, setLabelMap] = useState<Record<number, string>>({});
	const [error, setError] = useState("");

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				await tf.setBackend("webgl");
				await tf.ready();
				const m = await tf.loadLayersModel(URL.MODEL);
				if (!mounted) return;
				setModel(m);
				tf.tidy(() => m.predict(tf.zeros([1, 256, 256, 3])) as tf.Tensor);
			} catch (e) {
				console.error("Model load failed", e);
				setError("Failed to load TFJS model");
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const res = await fetch(URL.LABELS);
				const mapping = (await res.json()) as Record<string, number>;
				const flipped = Object.entries(mapping).reduce<Record<number, string>>(
					(acc, [label, idx]) => {
						acc[idx] = label;
						return acc;
					},
					{}
				);
				if (mounted) setLabelMap(flipped);
			} catch (e) {
				console.error("Labels load failed", e);
				setLabelMap({});
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);

	return { model, labelMap, error, setError };
}
