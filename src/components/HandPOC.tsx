import { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";

const MODEL_URL = "/model/model.json";
const METADATA_URL = "/model/metadata.json";
const INPUT_SIZE = 224;
const CONFIDENCE_THRESHOLD = 0.6;

export function HandPOC() {
	const webcamRef = useRef<Webcam>(null);
	const rafRef = useRef<number | null>(null);

	const [model, setModel] = useState<tf.GraphModel | tf.LayersModel | null>(
		null
	);
	const [labels, setLabels] = useState<string[]>([]);
	const [prediction, setPrediction] = useState<{
		className: string;
		probability: number;
	} | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [translationResult, setTranslationResult] = useState<any>(null);
	const [isTranslating, setIsTranslating] = useState<boolean>(false);
	const [detectedText, setDetectedText] = useState<string>("");

	useEffect(() => {
		let cancelled = false;

		const load = async () => {
			try {
				await tf.ready();
				let loaded: tf.GraphModel | tf.LayersModel;

				try {
					loaded = await tf.loadGraphModel(MODEL_URL);
				} catch {
					loaded = await tf.loadLayersModel(MODEL_URL);
				}

				const meta = await fetch(METADATA_URL).then((r) => r.json());
				const lbls: string[] = meta.labels || [];
				if (!cancelled) {
					setModel(loaded);
					setLabels(lbls);

					tf.tidy(() => {
						const warm = tf.zeros([1, INPUT_SIZE, INPUT_SIZE, 3]);
						const out = (loaded as any).predict(warm);
						if (Array.isArray(out)) out.forEach((t) => t.dispose());
						else out.dispose();
					});

					loop();
				}
			} catch (e: any) {
				if (!cancelled) setError(e?.message || "Failed to load model");
			}
		};

		load();

		const loop = () => {
			rafRef.current = requestAnimationFrame(loop);
			predictFrame();
		};

		return () => {
			cancelled = true;
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, []);

	const translateText = async (text: string) => {
		if (!text.trim()) return;

		setIsTranslating(true);
		try {
			const response = await fetch(
				`https://backend-api-fm4g.onrender.com/translate_string?text_to_translate=${encodeURIComponent(
					text
				)}`
			);
			const result = await response.json();
			setTranslationResult(result);
		} catch (error) {
			console.error("Translation failed:", error);
			setError("Translation failed. Please try again.");
		} finally {
			setIsTranslating(false);
		}
	};

	const predictFrame = async () => {
		const cam = webcamRef.current;
		if (!cam?.video || !model) return;
		const video = cam.video as HTMLVideoElement;
		if (video.readyState !== 4) return;

		const res = tf.tidy(() => {
			const img = tf.browser
				.fromPixels(video)
				.resizeBilinear([INPUT_SIZE, INPUT_SIZE])
				.toFloat()
				.div(255)
				.expandDims(0);

			const logits = (model as any).predict(img) as tf.Tensor;
			const probs = tf.softmax(logits);
			return probs.dataSync();
		});

		let maxIdx = 0;
		for (let i = 1; i < res.length; i++) if (res[i] > res[maxIdx]) maxIdx = i;

		const prob = res[maxIdx];
		const className = labels[maxIdx] || "Unknown";

		if (className.toLowerCase() === "stop" && prob >= CONFIDENCE_THRESHOLD) {
			if (detectedText.trim()) {
				translateText(detectedText);
				setDetectedText("");
			}
		} else if (
			className !== "Uncertain" &&
			className !== "Unknown" &&
			prob >= CONFIDENCE_THRESHOLD
		) {
			if (className.toLowerCase() !== "stop") {
				setDetectedText((prev) => (prev ? `${prev} ${className}` : className));
			}
		}

		setPrediction(
			prob >= CONFIDENCE_THRESHOLD
				? { className, probability: prob }
				: { className: "Uncertain", probability: prob }
		);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-surface via-brand-50 to-brand-100 p-6">
			<div className="max-w-4xl mx-auto">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-charcoal mb-2">
						AI Hand Gesture Recognition
					</h1>
					<p className="text-lg text-cocoa/80">
						Real-time machine learning powered gesture detection
					</p>
				</div>

				<div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-brand-200/50">
					<div className="grid md:grid-cols-2 gap-8 items-start">
						<div className="space-y-4">
							<h2 className="text-2xl font-semibold text-charcoal mb-4 flex items-center gap-2">
								<div className="w-3 h-3 bg-brand-500 rounded-full animate-pulse"></div>
								Live Camera Feed
							</h2>

							<div className="relative">
								<div className="absolute inset-0 bg-gradient-to-r from-brand-400 to-brand-600 rounded-2xl blur-lg opacity-20"></div>
								<div className="relative bg-white rounded-2xl p-4 shadow-lg border-2 border-brand-200">
									<Webcam
										ref={webcamRef}
										audio={false}
										screenshotFormat="image/jpeg"
										videoConstraints={{ facingMode: "user" }}
										className="w-full h-64 md:h-80 object-cover rounded-xl"
									/>
								</div>
							</div>
						</div>

						<div className="space-y-6">
							<h2 className="text-2xl font-semibold text-charcoal mb-4 flex items-center gap-2">
								<div className="w-3 h-3 bg-green-500 rounded-full"></div>
								AI Prediction
							</h2>

							{error && (
								<div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
									<div className="flex items-center">
										<div className="flex-shrink-0">
											<svg
												className="h-5 w-5 text-red-400"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
													clipRule="evenodd"
												/>
											</svg>
										</div>
										<div className="ml-3">
											<p className="text-red-700 font-medium">{error}</p>
										</div>
									</div>
								</div>
							)}

							{!prediction && !error && (
								<div className="bg-brand-50 border border-brand-200 rounded-xl p-6">
									<div className="flex items-center justify-center space-x-2">
										<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
										<p className="text-brand-700 font-medium">
											Initializing AI model...
										</p>
									</div>
								</div>
							)}

							{prediction && (
								<div className="space-y-4">
									<div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl p-6 text-white">
										<div className="text-center">
											<h3 className="text-lg font-medium mb-2">
												Detected Gesture
											</h3>
											<div className="text-3xl font-bold mb-2">
												{prediction.className}
											</div>
											<div className="text-brand-100">
												Confidence: {(prediction.probability * 100).toFixed(1)}%
											</div>
										</div>
									</div>

									<div className="bg-white rounded-lg p-4 border border-brand-200">
										<div className="flex justify-between items-center mb-2">
											<span className="text-sm font-medium text-charcoal">
												Confidence Level
											</span>
											<span className="text-sm text-cocoa">
												{(prediction.probability * 100).toFixed(1)}%
											</span>
										</div>
										<div className="w-full bg-brand-100 rounded-full h-3">
											<div
												className="bg-gradient-to-r from-brand-500 to-brand-600 h-3 rounded-full transition-all duration-300 ease-out"
												style={{ width: `${prediction.probability * 100}%` }}
											></div>
										</div>
									</div>

									<div
										className={`flex items-center gap-2 p-3 rounded-lg ${
											prediction.probability >= CONFIDENCE_THRESHOLD
												? "bg-green-50 text-green-700 border border-green-200"
												: "bg-yellow-50 text-yellow-700 border border-yellow-200"
										}`}
									>
										<div
											className={`w-2 h-2 rounded-full ${
												prediction.probability >= CONFIDENCE_THRESHOLD
													? "bg-green-500"
													: "bg-yellow-500"
											}`}
										></div>
										<span className="text-sm font-medium">
											{prediction.probability >= CONFIDENCE_THRESHOLD
												? "High Confidence"
												: "Low Confidence"}
										</span>
									</div>
								</div>
							)}

							{detectedText && (
								<div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
									<h3 className="text-sm font-medium text-blue-800 mb-2">
										Accumulated Text
									</h3>
									<p className="text-blue-700">{detectedText}</p>
									<p className="text-xs text-blue-600 mt-2">
										Show "STOP" gesture to translate
									</p>
								</div>
							)}

							{isTranslating && (
								<div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
									<div className="flex items-center space-x-2">
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
										<p className="text-yellow-700 font-medium">
											Translating...
										</p>
									</div>
								</div>
							)}

							{translationResult && (
								<div className="bg-green-50 border border-green-200 rounded-xl p-6">
									<div className="flex justify-between items-start mb-4">
										<h3 className="text-lg font-semibold text-green-800">
											Translation Results
										</h3>
										<button
											onClick={() => setTranslationResult(null)}
											className="text-xs text-green-600 hover:text-green-800 underline"
										>
											Clear
										</button>
									</div>

									<div className="mb-4 p-3 bg-white rounded-lg border border-green-200">
										<p className="text-sm font-medium text-green-800 mb-1">
											Original:
										</p>
										<p className="text-green-700">
											{translationResult.original}
										</p>
									</div>

									<div className="space-y-3">
										{translationResult.translated && (
											<div className="space-y-3">
												{translationResult.translated
													.split("\n")
													.map((line: string, index: number) => {
														if (!line.trim()) return null;

														const match = line.match(/\*\*([^*]+):\*\*\s*(.+)/);
														if (match) {
															const [, language, translation] = match;
															return (
																<div
																	key={index}
																	className="p-3 bg-white rounded-lg border border-green-200"
																>
																	<div className="flex items-center gap-2 mb-2">
																		<div className="w-2 h-2 bg-green-500 rounded-full"></div>
																		<p className="text-sm font-medium text-green-800">
																			{language}:
																		</p>
																	</div>
																	<p className="text-green-700 text-lg">
																		{translation}
																	</p>
																</div>
															);
														}
														return null;
													})}
											</div>
										)}
									</div>

									{translationResult.model && (
										<div className="mt-4 pt-3 border-t border-green-200">
											<p className="text-xs text-green-600">
												Powered by {translationResult.model}
											</p>
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="mt-8 text-center">
					<p className="text-cocoa/60 text-sm">
						Powered by TensorFlow.js • Real-time inference in your browser
					</p>
				</div>
			</div>
		</div>
	);
}
