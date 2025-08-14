import { motion } from "framer-motion";
import { Camera, Play, AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";

interface LivePreviewSectionProps {
	fadeInUp: any;
}

export function LivePreviewSection({ fadeInUp }: LivePreviewSectionProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const streamRef = useRef<MediaStream | null>(null);
	const [isStreaming, setIsStreaming] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [hasUserInteracted, setHasUserInteracted] = useState(false);

	const stopStream = useCallback(() => {
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => {
				track.stop();
			});
			streamRef.current = null;
		}
		if (videoRef.current) {
			videoRef.current.srcObject = null;
		}
		setIsStreaming(false);
	}, []);

	const startWebcam = useCallback(async () => {
		if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
			setError("Your browser doesn't support webcam access");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			stopStream();

			const constraints = {
				video: {
					width: { ideal: 640, max: 1280 },
					height: { ideal: 480, max: 720 },
					facingMode: "user",
				},
				audio: false,
			};

			const stream = await navigator.mediaDevices.getUserMedia(constraints);
			streamRef.current = stream;

			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				videoRef.current.onloadedmetadata = () => {
					setIsStreaming(true);
					setIsLoading(false);
				};

				videoRef.current.onerror = () => {
					setError("Failed to load video stream");
					setIsLoading(false);
					stopStream();
				};
			}
		} catch (err: any) {
			setIsLoading(false);
			console.error("Error accessing webcam:", err);

			let errorMessage = "Camera access failed";
			if (err.name === "NotAllowedError") {
				errorMessage =
					"Camera access denied. Please allow camera permissions and try again.";
			} else if (err.name === "NotFoundError") {
				errorMessage =
					"No camera found. Please connect a camera and try again.";
			} else if (err.name === "NotReadableError") {
				errorMessage = "Camera is being used by another application.";
			} else if (err.name === "OverconstrainedError") {
				errorMessage = "Camera doesn't support the required settings.";
			}

			setError(errorMessage);
		}
	}, [stopStream]);

	const handleStartCamera = () => {
		setHasUserInteracted(true);
		startWebcam();
	};

	useEffect(() => {
		return () => {
			stopStream();
		};
	}, [stopStream]);

	return (
		<section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
			<div className="max-w-4xl mx-auto">
				<motion.div
					initial="initial"
					whileInView="animate"
					viewport={{ once: true }}
					variants={fadeInUp}
					className="text-center"
				>
					<h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-8">
						Try it now
					</h2>
					<div className="bg-brand-100 rounded-2xl p-8 mb-6 border-2 border-dashed border-brand-300">
						<div className="aspect-video bg-brand-200 rounded-xl flex items-center justify-center mb-6 overflow-hidden">
							{error ? (
								<div className="text-center">
									<AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
									<p className="text-red-700 mb-4">{error}</p>
									<motion.button
										onClick={handleStartCamera}
										className="inline-flex items-center space-x-2 bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700 transition-colors"
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										<RefreshCw className="w-4 h-4" />
										<span>Try Again</span>
									</motion.button>
								</div>
							) : isStreaming ? (
								<video
									ref={videoRef}
									autoPlay
									playsInline
									muted
									className="w-full h-full object-cover rounded-xl"
								/>
							) : isLoading ? (
								<div className="text-center">
									<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
									<p className="text-brand-700">Connecting to camera...</p>
								</div>
							) : !hasUserInteracted ? (
								<div className="text-center">
									<Camera className="w-12 h-12 text-brand-600 mx-auto mb-4" />
									<p className="text-brand-700 mb-4">
										Ready to start your preview
									</p>
									<motion.button
										onClick={handleStartCamera}
										className="inline-flex items-center space-x-2 bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700 transition-colors"
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										<Camera className="w-4 h-4" />
										<span>Enable Camera</span>
									</motion.button>
								</div>
							) : (
								<div className="text-center">
									<Camera className="w-12 h-12 text-brand-600 mx-auto mb-4" />
									<p className="text-brand-700">Starting webcam...</p>
								</div>
							)}
						</div>
						<motion.a
							href="/chat"
							className={`inline-flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold text-lg transition-colors ${
								isStreaming
									? "bg-brand-700 text-white hover:bg-brand-800 focus:ring-4 focus:ring-brand-600"
									: "bg-gray-400 text-gray-600 cursor-not-allowed"
							}`}
							whileHover={isStreaming ? { scale: 1.02 } : {}}
							whileTap={isStreaming ? { scale: 0.98 } : {}}
							style={{ pointerEvents: isStreaming ? "auto" : "none" }}
						>
							<Play className="w-5 h-5" />
							<span>{isStreaming ? "Start chat" : "Enable camera first"}</span>
						</motion.a>
					</div>
					<p className="text-sm text-brand-600">
						{isStreaming
							? "Webcam is active. No media is stored or transmitted."
							: "Webcam stays in the browser during the demo. No media is stored."}
					</p>
				</motion.div>
			</div>
		</section>
	);
}
