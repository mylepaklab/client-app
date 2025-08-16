import { useRef, useEffect, useState, useCallback } from "react";
import Webcam from "react-webcam";
import * as tmImage from "@teachablemachine/image";

type TmModel = {
	predict: (
		img: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
		flipHorizontal?: boolean
	) => Promise<Array<{ className: string; probability: number }>>;
};

const MAP: Record<string, string> = {
	A: "Letter A",
	N: "Letter N",
	Stop: "Stop",
	Ya: "Ya",
	none: "",
};

const MODEL_BASE = "/model/";
const CONFIDENCE_THRESHOLD = 0.8;

export function HandPOC() {
	const webcamRef = useRef<Webcam>(null);

	const [tmModel, setTmModel] = useState<TmModel | null>(null);
	const [labels, setLabels] = useState<string[]>([]);

	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [camReady, setCamReady] = useState(false);
	const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
	const [deviceId, setDeviceId] = useState<string | undefined>(undefined);

	const [currentGesture, setCurrentGesture] = useState("none");
	const [gestureConfidence, setGestureConfidence] = useState(0);
	const [gestureMeaning, setGestureMeaning] = useState("");
	const rafRef = useRef<number>();

	// Ask for camera permission, enumerate devices
	useEffect(() => {
		const ask = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: true,
					audio: false,
				});
				setCamReady(true);
				const list = await navigator.mediaDevices.enumerateDevices();
				const cams = list.filter((d) => d.kind === "videoinput");
				setDevices(cams);
				if (cams.length > 0) setDeviceId((prev) => prev || cams[0].deviceId);
				stream.getTracks().forEach((t) => t.stop());
			} catch (e: any) {
				setError(
					`Camera access failed. ${e?.name || ""} ${e?.message || ""}`.trim()
				);
			}
		};
		ask();
	}, []);

	// Load TM model and metadata
	useEffect(() => {
		const load = async () => {
			try {
				setIsLoading(true);
				setError(null);

				const [model, metaRes] = await Promise.all([
					tmImage.load(MODEL_BASE + "model.json", MODEL_BASE + "metadata.json"),
					fetch(MODEL_BASE + "metadata.json"),
				]);

				if (!metaRes.ok) throw new Error("metadata.json not found");
				const meta = await metaRes.json();

				setTmModel(model as unknown as TmModel);
				setLabels(meta.labels || []);
			} catch (e: any) {
				setError(`Failed to load model. ${e?.message || e}`);
			} finally {
				setIsLoading(false);
			}
		};
		load();
	}, []);

	// Predict per frame
	const predict = useCallback(async () => {
		if (!tmModel) return;
		const video = webcamRef.current?.video as HTMLVideoElement | undefined;
		if (!video || video.readyState !== 4) return;

		try {
			// Second argument flips input horizontally for selfie view
			const preds = await tmModel.predict(video, true);
			// Pick top prediction
			let top = preds[0];
			for (const p of preds) if (p.probability > top.probability) top = p;

			if (top.probability >= CONFIDENCE_THRESHOLD) {
				setCurrentGesture(top.className);
				setGestureMeaning(MAP[top.className] || "");
			} else {
				setCurrentGesture("none");
				setGestureMeaning("");
			}
			setGestureConfidence(top.probability);
		} catch (e) {
			// Keep UI alive
			console.error("Prediction error", e);
		}
	}, [tmModel]);

	// Start loop when ready
	useEffect(() => {
		const loop = () => {
			predict();
			rafRef.current = requestAnimationFrame(loop);
		};
		if (camReady && tmModel && labels.length > 0) {
			rafRef.current = requestAnimationFrame(loop);
		}
		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, [camReady, tmModel, labels, predict]);

	const refreshDevices = async () => {
		try {
			const list = await navigator.mediaDevices.enumerateDevices();
			const cams = list.filter((d) => d.kind === "videoinput");
			setDevices(cams);
			if (cams.length > 0) setDeviceId(cams[0].deviceId);
			else setError("No camera found");
		} catch (e: any) {
			setError(`Enumerate devices failed. ${e?.message || e}`);
		}
	};

	const videoConstraints = deviceId
		? { deviceId: { exact: deviceId } }
		: { width: 640, height: 480 };

	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
			<div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
				<h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
					Hand Gesture Recognition
				</h1>

				{error && (
					<div className="p-4 bg-red-50 border border-red-200 rounded mb-6">
						<h3 className="font-semibold text-red-800 mb-2">Error</h3>
						<p className="text-red-700 mb-3">{error}</p>
						<ul className="text-sm text-red-700 space-y-1">
							<li>Use https or localhost so the browser can request camera</li>
							<li>Allow camera for this site in the browser settings</li>
							<li>Close other apps that may lock the camera</li>
							<li>On Windows or macOS check system privacy camera settings</li>
						</ul>
						<div className="mt-3 flex gap-2">
							<button
								onClick={async () => {
									try {
										const s = await navigator.mediaDevices.getUserMedia({
											video: true,
											audio: false,
										});
										setCamReady(true);
										s.getTracks().forEach((t) => t.stop());
										await refreshDevices();
									} catch (e: any) {
										setError(`Camera request failed. ${e?.message || e}`);
									}
								}}
								className="px-3 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
							>
								Enable camera
							</button>
							<button
								onClick={refreshDevices}
								className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
							>
								Refresh devices
							</button>
						</div>
					</div>
				)}

				<div className="space-y-6">
					{devices.length > 0 && (
						<div className="mb-2">
							<label className="mr-2 font-medium">Camera</label>
							<select
								value={deviceId}
								onChange={(e) => setDeviceId(e.target.value)}
								className="border rounded px-2 py-1"
							>
								{devices.map((d) => (
									<option key={d.deviceId} value={d.deviceId}>
										{d.label || `Camera ${d.deviceId.slice(0, 6)}`}
									</option>
								))}
							</select>
						</div>
					)}

					<div className="flex justify-center">
						<div className="relative">
							<Webcam
								ref={webcamRef}
								audio={false}
								style={{ width: 640, height: 480 }}
								videoConstraints={videoConstraints}
								className="rounded-lg border-2 border-gray-300"
								onUserMedia={() => setCamReady(true)}
								onUserMediaError={(e) => setError(`Camera error. ${String(e)}`)}
							/>
						</div>
					</div>

					{isLoading && (
						<div className="text-center p-8">
							<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
							<p className="mt-4 text-gray-600">
								Loading Teachable Machine model
							</p>
						</div>
					)}

					{!isLoading && (
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

								{gestureMeaning && (
									<div className="text-xl text-gray-700 mb-2">
										Meaning: {gestureMeaning}
									</div>
								)}

								<div className="text-sm text-gray-600">
									Confidence: {(gestureConfidence * 100).toFixed(1)}%
									{gestureConfidence < CONFIDENCE_THRESHOLD &&
										gestureConfidence > 0 && (
											<span className="text-orange-600 ml-2">
												Below threshold {Math.round(CONFIDENCE_THRESHOLD * 100)}
												%
											</span>
										)}
								</div>
							</div>
						</div>
					)}

					{!isLoading && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="p-4 bg-gray-50 rounded-lg">
								<h4 className="font-semibold text-gray-800 mb-3">
									Available Gestures
								</h4>
								<div className="space-y-2">
									{labels.map((label, i) => (
										<div key={i} className="flex justify-between items-center">
											<span className="font-medium">{label}</span>
											<span className="text-gray-600 text-sm">
												{MAP[label] || label}
											</span>
										</div>
									))}
								</div>
							</div>

							<div className="p-4 bg-gray-50 rounded-lg">
								<h4 className="font-semibold text-gray-800 mb-3">Model Info</h4>
								<div className="space-y-2 text-sm text-gray-700">
									<div>
										<strong>Classes:</strong> {labels.length}
									</div>
									<div>
										<strong>Input Size:</strong> 224x224
									</div>
									<div>
										<strong>Confidence Threshold:</strong>{" "}
										{Math.round(CONFIDENCE_THRESHOLD * 100)}%
									</div>
								</div>
							</div>
						</div>
					)}

					{!camReady && (
						<div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
							<p className="text-yellow-800">
								If the site does not prompt, allow camera in the browser
								settings then reload
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
