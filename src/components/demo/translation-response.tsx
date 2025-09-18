import { useState, useEffect } from "react";

interface TranslationResponseProps {
	response: {
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
	} | null;
	isVisible: boolean;
}

interface LanguageTranslation {
	language: string;
	text: string;
	flag: string;
	code: string;
}

export function TranslationResponseDisplay({
	response,
	isVisible,
}: TranslationResponseProps) {
	const [animations, setAnimations] = useState<boolean[]>([]);

	const parseTranslations = (translatedText: string): LanguageTranslation[] => {
		const translations: LanguageTranslation[] = [];

		const malayMatch = translatedText.match(
			/Malay:\s*\n\s*(.*?)(?=\n\n|Thai:|$)/s
		);
		if (malayMatch) {
			translations.push({
				language: "Malay",
				text: malayMatch[1].trim(),
				flag: "🇲🇾",
				code: "ms",
			});
		}

		const thaiMatch = translatedText.match(
			/Thai:\s*\n\s*(.*?)(?=\n\n|Vietnamese:|$)/s
		);
		if (thaiMatch) {
			translations.push({
				language: "Thai",
				text: thaiMatch[1].trim(),
				flag: "🇹🇭",
				code: "th",
			});
		}

		const vietnameseMatch = translatedText.match(/Vietnamese:\s*\n\s*(.*?)$/s);
		if (vietnameseMatch) {
			translations.push({
				language: "Vietnamese",
				text: vietnameseMatch[1].trim(),
				flag: "🇻🇳",
				code: "vi",
			});
		}

		return translations;
	};

	const translations = response ? parseTranslations(response.translated) : [];

	useEffect(() => {
		if (isVisible && translations.length > 0) {
			setAnimations(new Array(translations.length).fill(false));

			translations.forEach((_, index) => {
				setTimeout(() => {
					setAnimations((prev) => {
						const newAnimations = [...prev];
						newAnimations[index] = true;
						return newAnimations;
					});
				}, index * 200);
			});
		}
	}, [isVisible, translations.length]);

	if (!response || !isVisible) return null;

	const getConfidenceColor = (confidence: number) => {
		if (confidence >= 0.7) return "var(--color-brand-500)";
		if (confidence >= 0.4) return "var(--color-brand-400)";
		return "var(--color-brand-300)";
	};

	const getConfidenceLabel = (confidence: number) => {
		if (confidence >= 0.7) return "High";
		if (confidence >= 0.4) return "Medium";
		return "Low";
	};

	return (
		<div className="w-full max-w-4xl mx-auto p-6 space-y-6">
			<div className="text-center space-y-4">
				<div
					className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
					style={{ backgroundColor: "var(--color-brand-100)" }}
				>
					<span
						className="font-semibold text-lg"
						style={{ color: "var(--color-ink)" }}
					>
						Translation Results
					</span>
				</div>

				<div className="space-y-4">
					<div
						className="p-4 rounded-lg border-2 border-dashed"
						style={{
							borderColor: "var(--color-brand-200)",
							backgroundColor: "var(--color-surface)",
						}}
					>
						<p
							className="text-sm font-medium"
							style={{ color: "var(--color-brand-700)" }}
						>
							Original Text:
						</p>
						<p
							className="text-lg font-medium mt-1"
							style={{ color: "var(--color-ink)" }}
						>
							"{response.original}"
						</p>
					</div>

					<div
						className="p-4 rounded-lg border-2 border-solid"
						style={{
							borderColor: "var(--color-brand-300)",
							backgroundColor: "var(--color-brand-50)",
						}}
					>
						<p
							className="text-sm font-medium mb-2"
							style={{ color: "var(--color-brand-700)" }}
						>
							Complete Translation:
						</p>
						<div
							className="text-sm leading-relaxed whitespace-pre-line"
							style={{ color: "var(--color-ink)" }}
						>
							{response.translated}
						</div>
					</div>
				</div>

				<div className="flex justify-center">
					<div
						className="flex items-center gap-3 px-4 py-2 rounded-lg"
						style={{ backgroundColor: "var(--color-brand-50)" }}
					>
						<div className="flex items-center gap-2">
							<div
								className="w-3 h-3 rounded-full"
								style={{
									backgroundColor: getConfidenceColor(response.confidence),
								}}
							></div>
							<span
								className="text-sm font-medium"
								style={{ color: "var(--color-ink)" }}
							>
								Confidence: {getConfidenceLabel(response.confidence)} (
								{(response.confidence * 100).toFixed(1)}%)
							</span>
						</div>
						<div
							className="w-px h-4"
							style={{ backgroundColor: "var(--color-brand-200)" }}
						></div>
						<span
							className="text-xs"
							style={{ color: "var(--color-brand-600)" }}
						>
							{response.tokens_used.total_tokens} tokens
						</span>
					</div>
				</div>
			</div>

			<div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
				{translations.map((translation, index) => (
					<div
						key={translation.code}
						className={`relative overflow-hidden rounded-xl p-6 transition-all duration-500 transform hover:shadow-2xl hover:-translate-y-1 hover:scale-105 ${
							animations[index]
								? "translate-y-0 opacity-100 scale-100"
								: "translate-y-8 opacity-0 scale-95"
						}`}
						style={{
							backgroundColor: "var(--color-surface)",
							border: "2px solid var(--color-brand-200)",
							boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
						}}
					>
						<div
							className="absolute top-0 left-0 w-full h-1"
							style={{
								background: `linear-gradient(90deg, var(--color-brand-400), var(--color-brand-500), var(--color-brand-600))`,
							}}
						></div>

						<div className="flex items-center gap-3 mb-4">
							<span className="text-3xl">{translation.flag}</span>
							<div>
								<h3
									className="font-bold text-lg"
									style={{ color: "var(--color-ink)" }}
								>
									{translation.language}
								</h3>
								<span
									className="text-xs font-mono px-2 py-1 rounded"
									style={{
										backgroundColor: "var(--color-brand-100)",
										color: "var(--color-brand-700)",
									}}
								>
									{translation.code.toUpperCase()}
								</span>
							</div>
						</div>

						<div className="space-y-3">
							<div
								className="p-4 rounded-lg"
								style={{ backgroundColor: "var(--color-brand-50)" }}
							>
								<p
									className="text-base leading-relaxed"
									style={{ color: "var(--color-ink)" }}
								>
									{translation.text}
								</p>
							</div>

							<button
								onClick={() => navigator.clipboard.writeText(translation.text)}
								className="w-full py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-400"
								style={{
									backgroundColor: "var(--color-brand-100)",
									color: "var(--color-brand-700)",
								}}
							>
								📋 Copy Text
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
