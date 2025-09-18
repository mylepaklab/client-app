import { useState, useEffect } from "react";
import * as tmImage from "@teachablemachine/image";
import { URL } from "~/constants/contents/demo.content";

interface UseMLModelReturn {
	model: tmImage.CustomMobileNet | null;
	labelMap: Record<number, string>;
	error: string;
	setError: (error: string) => void;
}

export function useMLModel(): UseMLModelReturn {
	const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
	const [labelMap, setLabelMap] = useState<Record<number, string>>({});
	const [error, setError] = useState("");

	useEffect(() => {
		const loadModel = async () => {
			try {
				console.log("Loading Teachable Machine model...");

				const loadedModel = await tmImage.load(URL.MODEL, URL.WEIGHTS);
				setModel(loadedModel);
				console.log("Teachable Machine model loaded successfully");

				const classes = loadedModel.getClassLabels();
				const labelMapping: Record<number, string> = {};
				classes.forEach((label: string, index: number) => {
					labelMapping[index] = label;
				});
				setLabelMap(labelMapping);
				console.log("Label map loaded:", labelMapping);
			} catch (err) {
				console.error("Error loading Teachable Machine model:", err);
				setError("Failed to load Teachable Machine model");
			}
		};

		loadModel();
	}, []);

	return { model, labelMap, error, setError };
}
