import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import * as tmImage from "@teachablemachine/image";
import { api } from "../lib/axios";

const MODEL_URL = "/model/";
const TRANSLATION_API_URL =
	"https://backend-api-fm4g.onrender.com/translate_string";

export function HandPOC() {
	const [inputText, setInputText] = useState("AAYANNNYAAAASTOP");
	const [responseText, setResponseText] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [predictionLabel, setPredictionLabel] = useState("");
	const [capturedSequence, setCapturedSequence] = useState("");
	const [isStopped, setIsStopped] = useState(false);

	const webcamRef = useRef<Webcam>(null);
	const modelRef = useRef<tmImage.CustomMobileNet | null>(null);

	useEffect(() => {
		const loadModel = async () => {
			try {
				const model = await tmImage.load(
					MODEL_URL + "model.json",
					MODEL_URL + "metadata.json"
				);
				modelRef.current = model;
				console.log("Model loaded");
			} catch (err) {
				console.error("Error loading model", err);
			}
		};
		loadModel();
	}, []);

	useEffect(() => {
		setInputText(capturedSequence);
	}, [capturedSequence]);

	useEffect(() => {
		let lastCategory: string | null = null;
		let lastAppendTime = 0;

		const runPrediction = async () => {
			if (isStopped) return;

			if (
				modelRef.current &&
				webcamRef.current &&
				webcamRef.current.video &&
				webcamRef.current.video.readyState === 4
			) {
				const predictions = await modelRef.current.predict(
					webcamRef.current.video
				);
				const topPrediction = predictions.reduce((a: any, b: any) =>
					a.probability > b.probability ? a : b
				);

				if (topPrediction.probability > 0.7) {
					const label = topPrediction.className.toLowerCase();
					setPredictionLabel(
						`${label} (${(topPrediction.probability * 100).toFixed(2)}%)`
					);

					if (label === "stop") {
						setCapturedSequence((prev) => prev + "stop");
						setIsStopped(true);
						return;
					}

					const now = Date.now();

					if (label !== lastCategory && now - lastAppendTime > 3000) {
						setCapturedSequence((prev) => prev + label);
						lastCategory = label;
						lastAppendTime = now;
					}
				} else {
					setPredictionLabel("No confident match");
				}
			}
		};

		const intervalId = setInterval(runPrediction, 1000);
		return () => clearInterval(intervalId);
	}, [isStopped]);

	const handleApiCall = async () => {
		setLoading(true);
		setError("");
		setResponseText("");
		try {
			const response = await api.get(
				`${TRANSLATION_API_URL}?text_to_translate=${encodeURIComponent(
					inputText
				)}`
			);

			setResponseText(
				typeof response === "string" ? response : JSON.stringify(response)
			);
		} catch (err: any) {
			console.error("API call failed:", err);
			setError(
				err.response?.data?.message || err.message || "Error calling API"
			);
		} finally {
			setLoading(false);
		}
	};

	const resetCapture = () => {
		setCapturedSequence("");
		setInputText("");
		setIsStopped(false);
		setPredictionLabel("");
		setResponseText("");
		setError("");
	};

	return (
		<div
			className="flex flex-col items-center justify-center min-h-screen p-8"
			style={{ backgroundColor: "var(--color-surface)" }}
		>
			<div
				className="max-w-4xl w-full rounded-lg shadow-lg p-8"
				style={{ backgroundColor: "var(--color-brand-50)" }}
			>
				<h1
					className="text-3xl font-bold text-center mb-8"
					style={{ color: "var(--color-ink)" }}
				>
					Hand Gesture Recognition
				</h1>

				<div className="space-y-6">
					<div className="flex justify-center">
						<div className="relative">
							<Webcam
								ref={webcamRef}
								videoConstraints={{
									width: 640,
									height: 480,
									facingMode: "user",
								}}
								className="rounded-lg border-2"
								style={{
									width: 640,
									height: 480,
									borderColor: "var(--color-brand-300)",
								}}
							/>
						</div>
					</div>

					<div className="text-center">
						<div
							className="p-6 rounded-lg border"
							style={{
								backgroundColor: "var(--color-brand-100)",
								borderColor: "var(--color-brand-300)",
							}}
						>
							<h3
								className="text-lg font-semibold mb-2"
								style={{ color: "var(--color-ink)" }}
							>
								Current Gesture
							</h3>

							<div
								className="text-3xl font-bold mb-2"
								style={{ color: "var(--color-brand-600)" }}
							>
								{predictionLabel || "No Gesture Detected"}
							</div>

							<div
								className="text-xl mb-2"
								style={{ color: "var(--color-charcoal)" }}
							>
								Captured Sequence: {capturedSequence}
							</div>
						</div>
					</div>

					<div
						className="p-4 border rounded-lg"
						style={{
							backgroundColor: "var(--color-brand-50)",
							borderColor: "var(--color-brand-300)",
						}}
					>
						<h4
							className="font-semibold mb-4"
							style={{ color: "var(--color-ink)" }}
						>
							BIM Translator:
						</h4>

						<div className="space-y-4">
							<input
								type="text"
								value={inputText}
								onChange={(e) => setInputText(e.target.value)}
								className="w-full p-3 border rounded-lg"
								style={{
									borderColor: "var(--color-brand-300)",
									backgroundColor: "var(--color-surface)",
									color: "var(--color-ink)",
								}}
								placeholder="Enter Text Sequence"
								disabled={isStopped}
							/>

							<div className="flex gap-3">
								<button
									onClick={handleApiCall}
									className="flex-1 px-6 py-3 text-white rounded-lg transition-colors font-semibold"
									style={{
										backgroundColor: "var(--color-brand-600)",
									}}
									onMouseEnter={(e) =>
										(e.currentTarget.style.backgroundColor =
											"var(--color-brand-700)")
									}
									onMouseLeave={(e) =>
										(e.currentTarget.style.backgroundColor =
											"var(--color-brand-600)")
									}
									disabled={loading}
								>
									{loading ? "Translating..." : "Translate"}
								</button>

								<button
									onClick={resetCapture}
									className="px-6 py-3 text-white rounded-lg transition-colors font-semibold"
									style={{
										backgroundColor: "var(--color-charcoal)",
									}}
									onMouseEnter={(e) =>
										(e.currentTarget.style.backgroundColor =
											"var(--color-cocoa)")
									}
									onMouseLeave={(e) =>
										(e.currentTarget.style.backgroundColor =
											"var(--color-charcoal)")
									}
								>
									Reset
								</button>
							</div>
						</div>

						{error && (
							<div
								className="mt-4 p-3 border rounded"
								style={{
									backgroundColor: "var(--color-brand-100)",
									borderColor: "var(--color-brand-400)",
									color: "var(--color-cocoa)",
								}}
							>
								<strong>Error:</strong> {error}
							</div>
						)}

						{responseText && !error && (
							<div
								className="mt-4 p-3 border rounded"
								style={{
									backgroundColor: "var(--color-brand-100)",
									borderColor: "var(--color-brand-400)",
									color: "var(--color-ink)",
								}}
							>
								<strong>Translation:</strong>
								<p className="mt-2">{responseText}</p>
							</div>
						)}
					</div>

					<div
						className="p-4 border rounded-lg"
						style={{
							backgroundColor: "var(--color-brand-50)",
							borderColor: "var(--color-brand-300)",
						}}
					>
						<h4
							className="font-semibold mb-2"
							style={{ color: "var(--color-ink)" }}
						>
							Usage Instructions:
						</h4>
						<ul
							className="text-sm space-y-1"
							style={{ color: "var(--color-charcoal)" }}
						>
							<li>• Position your hand clearly in front of the camera</li>
							<li>• Make the trained gestures: A, N, YA, or STOP</li>
							<li>• Hold gestures steady for 3 seconds to register</li>
							<li>• Make "STOP" gesture to finish sequence capture</li>
							<li>• Use the translate button to convert sequence to text</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
