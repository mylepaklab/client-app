import { motion } from "framer-motion";
import { Camera, Play, AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface LivePreviewSectionProps {
	fadeInUp: any;
}

export function LivePreviewSection({ fadeInUp }: LivePreviewSectionProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isStreaming, setIsStreaming] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const startWebcam = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: { width: 640, height: 480 },
				});

				if (videoRef.current) {
					videoRef.current.srcObject = stream;
					setIsStreaming(true);
				}
			} catch (err) {
				setError("Camera access denied or not available");
				console.error("Error accessing webcam:", err);
			}
		};

		startWebcam();

		return () => {
			if (videoRef.current?.srcObject) {
				const stream = videoRef.current.srcObject as MediaStream;
				stream.getTracks().forEach((track) => track.stop());
			}
		};
	}, []);

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
									<p className="text-red-700">{error}</p>
									<p className="text-sm text-brand-600 mt-2">
										Please allow camera access to see the preview
									</p>
								</div>
							) : isStreaming ? (
								<video
									ref={videoRef}
									autoPlay
									playsInline
									muted
									className="w-full h-full object-cover rounded-xl"
								/>
							) : (
								<div className="text-center">
									<Camera className="w-12 h-12 text-brand-600 mx-auto mb-4" />
									<p className="text-brand-700">Starting webcam...</p>
								</div>
							)}
						</div>
						<motion.a
							href="/chat"
							className="inline-flex items-center space-x-2 bg-brand-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-brand-800 focus:ring-4 focus:ring-brand-600 transition-colors"
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
						>
							<Play className="w-5 h-5" />
							<span>Start chat</span>
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
