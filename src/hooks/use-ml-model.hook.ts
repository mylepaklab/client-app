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

				const modelResponse = await fetch(URL.MODEL);
				if (!modelResponse.ok) {
					throw new Error(`Model file not found: ${URL.MODEL}`);
				}

				const loadedModel = await tmImage.load(URL.MODEL, URL.WEIGHTS);
				setModel(loadedModel);
				console.log("Teachable Machine model loaded successfully");

				try {
					const metadataResponse = await fetch(URL.METADATA);
					if (!metadataResponse.ok) {
						throw new Error("Metadata file not found");
					}

					const metadata = await metadataResponse.json();

					const labelMapping: Record<number, string> = {};
					if (metadata && metadata.labels) {
						metadata.labels.forEach((label: string, index: number) => {
							labelMapping[index] = label;
						});
					} else {
						for (let i = 0; i < 6; i++) {
							labelMapping[i] = `Class ${i}`;
						}
					}
					setLabelMap(labelMapping);
					console.log("Label map loaded:", labelMapping);
				} catch (metadataErr) {
					console.warn(
						"Could not load metadata, using default labels:",
						metadataErr
					);

					const labelMapping: Record<number, string> = {};
					for (let i = 0; i < 6; i++) {
						labelMapping[i] = `Class ${i}`;
					}
					setLabelMap(labelMapping);
				}
			} catch (err) {
				console.error("Error loading Teachable Machine model:", err);
				setError(
					`Failed to load Teachable Machine model: ${
						err instanceof Error ? err.message : "Unknown error"
					}`
				);
			}
		};

		loadModel();
	}, []);

	return { model, labelMap, error, setError };
}
