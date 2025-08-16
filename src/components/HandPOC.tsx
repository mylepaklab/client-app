import { useRef, useEffect, useState, useCallback } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";

const MAP = {
	A: "Letter A",
	N: "Letter N",
	Stop: "Stop",
	Ya: "Ya",
	none: "",
};

const CONFIDENCE_THRESHOLD = 0.8;

export function HandPOC() {
	const webcamRef = useRef<Webcam>(null);
	const [model, setModel] = useState<tf.LayersModel | null>(null);
	const [labels, setLabels] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentGesture, setCurrentGesture] = useState<string>("none");
	const [gestureConfidence, setGestureConfidence] = useState<number>(0);
	const [gestureMeaning, setGestureMeaning] = useState<string>("");
	const animationFrameRef = useRef<number>();

	const predict = useCallback(async () => {
		if (
			!model ||
			!webcamRef.current?.video ||
			webcamRef.current.video.readyState !== 4
		) {
			return;
		}

		try {
			const video = webcamRef.current.video;

			const img = tf.browser
				.fromPixels(video)
				.resizeBilinear([224, 224])
				.expandDims(0)
				.toFloat()
				.div(255.0);

			let predictions: tf.Tensor;
			if (model instanceof tf.GraphModel) {
				predictions = model.predict(img) as tf.Tensor;
			} else {
				predictions = model.predict(img) as tf.Tensor;
			}

			const predictionData = await predictions.data();

			const maxProbability = Math.max(...Array.from(predictionData));
			const predictedClassIndex =
				Array.from(predictionData).indexOf(maxProbability);
			const predictedLabel = labels[predictedClassIndex] || "unknown";

			if (maxProbability >= CONFIDENCE_THRESHOLD) {
				setCurrentGesture(predictedLabel);
				setGestureConfidence(maxProbability);
				setGestureMeaning(MAP[predictedLabel as keyof typeof MAP] || "");
			} else {
				setCurrentGesture("none");
				setGestureConfidence(maxProbability);
				setGestureMeaning("");
			}

			img.dispose();
			predictions.dispose();
		} catch (err: any) {
			console.error("Prediction error:", err);
		}
	}, [model, labels]);

	useEffect(() => {
		const runPrediction = () => {
			predict();
			animationFrameRef.current = requestAnimationFrame(runPrediction);
		};

		if (model && labels.length > 0) {
			animationFrameRef.current = requestAnimationFrame(runPrediction);
		}

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [model, labels, predict]);

	useEffect(() => {
		const loadModel = async () => {
			try {
				setIsLoading(true);
				setError(null);

				await tf.ready();
				// Optional, pick one you prefer: 'webgl' or 'wasm'
				// await tf.setBackend('webgl');

				const [loadedModel, metadataResponse] = await Promise.all([
					tf.loadLayersModel("/model/model.json"),
					fetch("/model/metadata.json"),
				]);
				const metadata = await metadataResponse.json();

				setModel(loadedModel);
				setLabels(metadata.labels || []);
				setIsLoading(false);

				console.log("Loaded as LayersModel", {
					inputs: loadedModel.inputs,
					outputs: loadedModel.outputs,
					labels: metadata.labels,
				});
			} catch (err: any) {
				setError(`Failed to load model: ${err.message}`);
				setIsLoading(false);
				console.error("Model loading error:", err);
			}
		};
		loadModel();
	}, []);

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

				{isLoading && (
					<div className="text-center p-8">
						<div
							className="inline-block animate-spin rounded-full h-8 w-8 border-b-2"
							style={{ borderColor: "var(--color-brand-600)" }}
						></div>
						<p className="mt-4" style={{ color: "var(--color-charcoal)" }}>
							Loading Teachable Machine model...
						</p>
					</div>
				)}

				{error && (
					<div
						className="p-4 border rounded-lg mb-6"
						style={{
							backgroundColor: "var(--color-brand-50)",
							borderColor: "var(--color-brand-300)",
						}}
					>
						<h3
							className="font-semibold mb-2"
							style={{ color: "var(--color-ink)" }}
						>
							Error:
						</h3>
						<p className="mb-4" style={{ color: "var(--color-charcoal)" }}>
							{error}
						</p>
						<div
							className="mt-4 p-3 border rounded"
							style={{
								backgroundColor: "var(--color-brand-100)",
								borderColor: "var(--color-brand-400)",
							}}
						>
							<h4
								className="font-semibold mb-2"
								style={{ color: "var(--color-ink)" }}
							>
								Troubleshooting:
							</h4>
							<ul
								className="text-sm space-y-1"
								style={{ color: "var(--color-charcoal)" }}
							>
								<li>
									• Ensure model files (model.json, metadata.json, weights.bin)
									are in /public/model/
								</li>
								<li>• Check browser console for detailed error messages</li>
								<li>
									• Verify model was exported from Teachable Machine in
									TensorFlow.js format
								</li>
							</ul>
							<button
								onClick={() => window.location.reload()}
								className="mt-3 px-4 py-2 text-white rounded transition-colors"
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
							>
								Refresh Page
							</button>
						</div>
					</div>
				)}

				{!isLoading && !error && (
					<div className="space-y-6">
						<div className="flex justify-center">
							<div className="relative">
								<Webcam
									ref={webcamRef}
									style={{ width: 640, height: 480 }}
									videoConstraints={{
										width: 640,
										height: 480,
										facingMode: "user",
									}}
									className="rounded-lg border-2"
									// style={{ borderColor: 'var(--color-brand-300)' }}
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
									{currentGesture === "none"
										? "No Gesture Detected"
										: currentGesture}
								</div>

								{gestureMeaning && (
									<div
										className="text-xl mb-2"
										style={{ color: "var(--color-charcoal)" }}
									>
										Meaning: {gestureMeaning}
									</div>
								)}

								<div
									className="text-sm"
									style={{ color: "var(--color-charcoal)" }}
								>
									Confidence: {(gestureConfidence * 100).toFixed(1)}%
									{gestureConfidence < CONFIDENCE_THRESHOLD &&
										gestureConfidence > 0 && (
											<span
												className="ml-2"
												style={{ color: "var(--color-cocoa)" }}
											>
												(Below threshold:{" "}
												{(CONFIDENCE_THRESHOLD * 100).toFixed(0)}%)
											</span>
										)}
								</div>
							</div>
						</div>

						{/* Model Information */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{/* Available Gestures */}
							<div
								className="p-4 rounded-lg"
								style={{ backgroundColor: "var(--color-brand-100)" }}
							>
								<h4
									className="font-semibold mb-3"
									style={{ color: "var(--color-ink)" }}
								>
									Available Gestures:
								</h4>
								<div className="space-y-2">
									{labels.map((label, index) => (
										<div
											key={index}
											className="flex justify-between items-center"
										>
											<span
												className="font-medium"
												style={{ color: "var(--color-ink)" }}
											>
												{label}
											</span>
											<span
												className="text-sm"
												style={{ color: "var(--color-charcoal)" }}
											>
												{MAP[label as keyof typeof MAP] || label}
											</span>
										</div>
									))}
								</div>
							</div>

							{/* Model Stats */}
							<div
								className="p-4 rounded-lg"
								style={{ backgroundColor: "var(--color-brand-100)" }}
							>
								<h4
									className="font-semibold mb-3"
									style={{ color: "var(--color-ink)" }}
								>
									Model Info:
								</h4>
								<div
									className="space-y-2 text-sm"
									style={{ color: "var(--color-charcoal)" }}
								>
									<div>
										<strong>Classes:</strong> {labels.length}
									</div>
									<div>
										<strong>Input Size:</strong> 224x224
									</div>
									<div>
										<strong>Confidence Threshold:</strong>{" "}
										{(CONFIDENCE_THRESHOLD * 100).toFixed(0)}%
									</div>
									<div>
										<strong>Prediction Rate:</strong> ~60 FPS
									</div>
								</div>
							</div>
						</div>

						{/* Usage Instructions */}
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
								<li>• Make one of the trained gestures: A, N, YA, or STOP</li>
								<li>• Hold the gesture steady for better recognition</li>
								<li>• Ensure good lighting for optimal performance</li>
								<li>
									• Predictions below {(CONFIDENCE_THRESHOLD * 100).toFixed(0)}%
									confidence will show "No Gesture Detected"
								</li>
							</ul>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
