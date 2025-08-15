import { useRef, useEffect, useState, useCallback } from "react";
import Webcam from "react-webcam";
import {
	HandLandmarker,
	FilesetResolver,
	DrawingUtils,
} from "@mediapipe/tasks-vision";

// Gesture mapping dictionary
const DICT = {
	A: "Letter A",
	N: "Letter N",
	STOP: "Stop",
	YA: "Ya",
};

// Landmark indices
const FINGERTIPS = [4, 8, 12, 16, 20]; // Thumb, Index, Middle, Ring, Pinky
const PIPS = [3, 6, 10, 14, 18]; // PIP joints
const WRIST = 0;

// Configurable threshold for sensitivity
const THRESHOLD = 0.06;

export function HandPOC() {
	const webcamRef = useRef<Webcam>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [handLandmarker, setHandLandmarker] = useState<HandLandmarker | null>(
		null
	);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentGesture, setCurrentGesture] = useState<string>("none");
	const [gestureConfidence, setGestureConfidence] = useState<number>(0);
	const animationFrameRef = useRef<number>();

	useEffect(() => {
		const initializeHandLandmarker = async () => {
			try {
				const vision = await FilesetResolver.forVisionTasks(
					"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
				);

				const landmarker = await HandLandmarker.createFromOptions(vision, {
					baseOptions: {
						modelAssetPath:
							"https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
						delegate: "GPU",
					},
					runningMode: "VIDEO",
					numHands: 1,
				});

				setHandLandmarker(landmarker);
				setIsLoading(false);
			} catch (err: any) {
				setError(`Failed to initialize hand landmarker: ${err.message}`);
				setIsLoading(false);
			}
		};

		initializeHandLandmarker();
	}, []);

	// Calculate distance between two landmarks
	const getDistance = (
		point1: { x: number; y: number },
		point2: { x: number; y: number }
	): number => {
		return Math.sqrt(
			Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
		);
	};

	// Check if a finger is extended
	const isFingerExtended = (landmarks: any[], fingerIndex: number): boolean => {
		if (fingerIndex === 0) {
			// Thumb (special case)
			const thumbTip = landmarks[FINGERTIPS[0]];
			const thumbMcp = landmarks[2]; // Thumb MCP joint
			const wrist = landmarks[WRIST];

			// For thumb, check if tip is further from wrist than MCP
			const tipToWrist = getDistance(thumbTip, wrist);
			const mcpToWrist = getDistance(thumbMcp, wrist);
			return tipToWrist > mcpToWrist + THRESHOLD;
		} else {
			// For other fingers, compare fingertip to PIP joint distance from wrist
			const fingertip = landmarks[FINGERTIPS[fingerIndex]];
			const pip = landmarks[PIPS[fingerIndex]];
			const wrist = landmarks[WRIST];

			const tipToWrist = getDistance(fingertip, wrist);
			const pipToWrist = getDistance(pip, wrist);
			const scale = getDistance(landmarks[9], wrist); // Use middle finger MCP as scale reference

			return tipToWrist > pipToWrist + THRESHOLD * scale;
		}
	};

	// Classify gesture based on extended fingers
	const classifyGesture = (
		landmarks: any[]
	): { gesture: string; confidence: number } => {
		const extendedFingers = FINGERTIPS.map((_, index) =>
			isFingerExtended(landmarks, index)
		);
		const openCount = extendedFingers.filter(Boolean).length;

		// Letter A: Closed fist with thumb up
		if (
			openCount === 1 &&
			extendedFingers[0] &&
			!extendedFingers.slice(1).some(Boolean)
		) {
			return { gesture: "A", confidence: 0.9 };
		}

		// Letter N: Index and middle finger extended, forming "N" shape
		if (
			openCount === 2 &&
			extendedFingers[1] &&
			extendedFingers[2] &&
			!extendedFingers[0] &&
			!extendedFingers[3] &&
			!extendedFingers[4]
		) {
			return { gesture: "N", confidence: 0.85 };
		}

		// STOP: All five fingers extended (open palm)
		if (openCount === 5 && extendedFingers.every(Boolean)) {
			return { gesture: "STOP", confidence: 0.95 };
		}

		// YA: Thumb and pinky extended (hang loose gesture)
		if (
			openCount === 2 &&
			extendedFingers[0] &&
			extendedFingers[4] &&
			!extendedFingers[1] &&
			!extendedFingers[2] &&
			!extendedFingers[3]
		) {
			return { gesture: "YA", confidence: 0.9 };
		}

		return { gesture: "none", confidence: 0 };
	};

	// Process video frame
	const processFrame = useCallback(() => {
		if (!handLandmarker || !webcamRef.current?.video) {
			animationFrameRef.current = requestAnimationFrame(processFrame);
			return;
		}

		const video = webcamRef.current.video;
		if (video.readyState !== 4) {
			animationFrameRef.current = requestAnimationFrame(processFrame);
			return;
		}

		try {
			const results = handLandmarker.detectForVideo(video, performance.now());

			if (results.landmarks && results.landmarks.length > 0) {
				const landmarks = results.landmarks[0];
				const { gesture, confidence } = classifyGesture(landmarks);

				setCurrentGesture(gesture);
				setGestureConfidence(confidence);

				// Draw landmarks on canvas
				if (canvasRef.current) {
					const canvas = canvasRef.current;
					const ctx = canvas.getContext("2d");
					if (ctx) {
						canvas.width = video.videoWidth;
						canvas.height = video.videoHeight;

						ctx.clearRect(0, 0, canvas.width, canvas.height);

						// Draw hand landmarks
						const drawingUtils = new DrawingUtils(ctx);
						drawingUtils.drawLandmarks(landmarks, {
							radius: (data) =>
								DrawingUtils.lerp(data.from!.z!, -0.15, 0.1, 5, 1),
						});
						drawingUtils.drawConnectors(
							landmarks,
							HandLandmarker.HAND_CONNECTIONS
						);
					}
				}
			} else {
				setCurrentGesture("none");
				setGestureConfidence(0);

				// Clear canvas
				if (canvasRef.current) {
					const ctx = canvasRef.current.getContext("2d");
					if (ctx) {
						ctx.clearRect(
							0,
							0,
							canvasRef.current.width,
							canvasRef.current.height
						);
					}
				}
			}
		} catch (err) {
			console.error("Error processing frame:", err);
		}

		animationFrameRef.current = requestAnimationFrame(processFrame);
	}, [handLandmarker]);

	// Start processing when hand landmarker is ready
	useEffect(() => {
		if (handLandmarker) {
			animationFrameRef.current = requestAnimationFrame(processFrame);
		}

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [handLandmarker, processFrame]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
			<div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
				<h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
					Hand Gesture Recognition POC
				</h1>

				{/* Loading State */}
				{isLoading && (
					<div className="text-center p-8">
						<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
						<p className="mt-4 text-gray-600">
							Loading MediaPipe Hand Landmarker...
						</p>
					</div>
				)}

				{/* Error State */}
				{error && (
					<div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
						<h3 className="font-semibold text-red-800 mb-2">Error:</h3>
						<p className="text-red-700">{error}</p>
					</div>
				)}

				{/* Main Interface */}
				{!isLoading && !error && (
					<div className="space-y-6">
						{/* Webcam and Canvas Container */}
						<div className="relative flex justify-center">
							<div className="relative">
								<Webcam
									ref={webcamRef}
									style={{ width: 640, height: 480 }}
									videoConstraints={{
										width: 640,
										height: 480,
										facingMode: "user",
									}}
									className="rounded-lg border-2 border-gray-300"
								/>
								<canvas
									ref={canvasRef}
									className="absolute top-0 left-0 pointer-events-none"
									style={{ width: 640, height: 480 }}
								/>
							</div>
						</div>

						{/* Gesture Display */}
						<div className="text-center">
							<div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
								<h3 className="text-lg font-semibold text-gray-800 mb-2">
									Current Gesture
								</h3>
								<div className="text-3xl font-bold text-blue-600 mb-2">
									{currentGesture === "none"
										? "No Gesture Detected"
										: currentGesture}
								</div>
								{currentGesture !== "none" && (
									<div className="text-xl text-gray-700 mb-2">
										Meaning: {DICT[currentGesture as keyof typeof DICT]}
									</div>
								)}
								<div className="text-sm text-gray-600">
									Confidence: {(gestureConfidence * 100).toFixed(1)}%
								</div>
							</div>
						</div>

						{/* Gesture Guide */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div className="text-center p-4 bg-gray-50 rounded-lg">
								<div className="text-lg font-semibold text-gray-800">A</div>
								<div className="text-sm text-gray-600">Letter A</div>
								<div className="text-xs text-gray-500 mt-1">
									Thumb up, fist closed
								</div>
							</div>
							<div className="text-center p-4 bg-gray-50 rounded-lg">
								<div className="text-lg font-semibold text-gray-800">N</div>
								<div className="text-sm text-gray-600">Letter N</div>
								<div className="text-xs text-gray-500 mt-1">
									Index + Middle finger
								</div>
							</div>
							<div className="text-center p-4 bg-gray-50 rounded-lg">
								<div className="text-lg font-semibold text-gray-800">STOP</div>
								<div className="text-sm text-gray-600">Stop</div>
								<div className="text-xs text-gray-500 mt-1">
									Open palm (all fingers)
								</div>
							</div>
							<div className="text-center p-4 bg-gray-50 rounded-lg">
								<div className="text-lg font-semibold text-gray-800">YA</div>
								<div className="text-sm text-gray-600">Ya</div>
								<div className="text-xs text-gray-500 mt-1">
									Thumb + Pinky (hang loose)
								</div>
							</div>
						</div>

						{/* Testing Instructions */}
						<div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
							<h4 className="font-semibold text-yellow-800 mb-2">
								Quick Testing Instructions:
							</h4>
							<ul className="text-yellow-700 text-sm space-y-1">
								<li>• Show each pose to the camera clearly</li>
								<li>• Hold the gesture steady for best detection</li>
								<li>• Ensure good lighting and camera visibility</li>
								<li>
									• Adjust threshold constant (currently {THRESHOLD}) if
									detection is too sensitive
								</li>
							</ul>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
