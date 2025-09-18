import { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import { URL } from "~/constants/contents/demo.content";

interface UseMLModelReturn {
	model: tf.LayersModel | null;
	labelMap: Record<number, string>;
	error: string;
	setError: (error: string) => void;
}

class RescalingLayer extends tf.layers.Layer {
	private scale: number;
	private offset: number;

	constructor(args: any) {
		super(args);
		this.scale = args.scale || 1.0;
		this.offset = args.offset || 0.0;
	}

	call(inputs: tf.Tensor | tf.Tensor[]): tf.Tensor | tf.Tensor[] {
		return tf.tidy(() => {
			const input = Array.isArray(inputs) ? inputs[0] : inputs;
			return tf.add(tf.mul(input, this.scale), this.offset);
		});
	}

	getClassName() {
		return "Rescaling";
	}

	static get className() {
		return "Rescaling";
	}
}

export function useMLModel(): UseMLModelReturn {
	const [model, setModel] = useState<tf.LayersModel | null>(null);
	const [labelMap, setLabelMap] = useState<Record<number, string>>({});
	const [error, setError] = useState("");

	useEffect(() => {
		const loadModel = async () => {
			try {
				await tf.setBackend("webgl");
				await tf.ready();

				try {
					tf.serialization.registerClass(RescalingLayer);
				} catch (e) {
					console.log(
						"Rescaling layer already registered or registration failed:",
						e
					);
				}

				const loadedModel = await tf.loadLayersModel(URL.MODEL);
				setModel(loadedModel);
				console.log("Model loaded");

				tf.tidy(
					() => loadedModel.predict(tf.zeros([1, 256, 256, 3])) as tf.Tensor
				);
			} catch (err) {
				console.error("Error loading model:", err);
				setError("Failed to load TFJS model");
			}
		};
		loadModel();
	}, []);

	useEffect(() => {
		const loadLabels = async () => {
			try {
				const res = await fetch(URL.LABELS);
				const data = (await res.json()) as Record<string, number>;

				const flipped = Object.entries(data).reduce<Record<number, string>>(
					(acc, [label, idx]) => {
						acc[idx] = label;
						return acc;
					},
					{}
				);
				setLabelMap(flipped);
				console.log("Label map loaded:", flipped);
			} catch (err) {
				console.error("Failed to load label map:", err);
				setLabelMap({});
			}
		};
		loadLabels();
	}, []);

	return { model, labelMap, error, setError };
}
