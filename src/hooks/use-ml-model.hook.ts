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

				const loadedModel = await tmImage.load(URL.MODEL, URL.METADATA);

				setModel(loadedModel);
				console.log("Teachable Machine model loaded successfully");

				const metadataResponse = await fetch(URL.METADATA);
				if (!metadataResponse.ok) throw new Error("Metadata file not found");

				const metadata = await metadataResponse.json();
				const labels: string[] = metadata?.labels ?? [];
				const map: Record<number, string> = {};
				labels.length
					? labels.forEach((l, i) => (map[i] = l))
					: Array.from({ length: 6 }, (_, i) => (map[i] = `Class ${i}`));

				setLabelMap(map);
				console.log("Label map loaded:", map);
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
