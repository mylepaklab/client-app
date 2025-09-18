import { useState, useCallback } from "react";
import { api } from "~/lib/axios";

export const useFormAnswer = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const submitFormAnswer = useCallback(
		async (text: string) => {
			if (isLoading) return;

			if (!text.trim()) return;

			setIsLoading(true);
			setError(null);

			try {
				const response = await api.get("/form_answer", {
					params: { text_to_translate: `${text} STOP` },
				});
				console.log("Form answer response:", response.data);
				return response.data;
			} catch (e) {
				console.error("Translate failed", e);
				setError("Translate request failed");
				throw e;
			} finally {
				setIsLoading(false);
			}
		},
		[isLoading]
	);

	return { submitFormAnswer, isLoading, error };
};
