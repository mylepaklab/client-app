import { useState, useCallback } from "react";
import { api } from "~/lib/axios";

interface TranslationResponse {
	original: string;
	translated: string;
	confidence: number;
	model: string;
	matched_occupation: string | null;
	tokens_used: {
		completion_tokens: number;
		prompt_tokens: number;
		total_tokens: number;
	};
}

export const useFormAnswer = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [translationResponse, setTranslationResponse] =
		useState<TranslationResponse | null>(null);
	const [showTranslation, setShowTranslation] = useState(false);

	const submitFormAnswer = useCallback(
		async (text: string) => {
			if (isLoading) return;

			if (!text.trim()) return;

			setIsLoading(true);
			setError(null);
			setShowTranslation(false);

			try {
				const response = await api.get("/form_answer", {
					params: { text_to_translate: `${text} STOP` },
				});
				console.log("Form answer response:", response.data);
				setTranslationResponse(response.data);
				setShowTranslation(true);
				return response.data;
			} catch (e) {
				console.error("Translate failed", e);
				setError("Translate request failed");
				setTranslationResponse(null);
				throw e;
			} finally {
				setIsLoading(false);
			}
		},
		[isLoading]
	);

	const clearTranslation = useCallback(() => {
		setTranslationResponse(null);
		setShowTranslation(false);
		setError(null);
	}, []);

	return {
		submitFormAnswer,
		isLoading,
		error,
		translationResponse,
		showTranslation,
		clearTranslation,
	};
};
