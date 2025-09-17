import { forwardRef } from "react";
import Webcam from "react-webcam";

interface PredictionDisplayProps {
	prediction: {
		index: number;
		name: string;
		prob: number;
	} | null;
}

function PredictionDisplay({ prediction }: PredictionDisplayProps) {
	return (
		<div
			className="text-sm text-center p-3 rounded-lg w-full max-w-md"
			style={{
				backgroundColor: "var(--color-brand-100)",
				color: "var(--color-ink)",
			}}
			aria-live="polite"
		>
			{prediction ? (
				<>
					<strong>Detected:</strong> {prediction.name}
					<br />
					<strong>Confidence:</strong> {(prediction.prob * 100).toFixed(2)}%
				</>
			) : (
				<p>Show your hand to get prediction</p>
			)}
		</div>
	);
}

interface WebcamControlsProps {
	detecting: boolean;
	onToggleDetection: () => void;
	onClearBuffer: () => void;
}

function WebcamControls({
	detecting,
	onToggleDetection,
	onClearBuffer,
}: WebcamControlsProps) {
	return (
		<div className="w-full max-w-md grid grid-cols-2 gap-2">
			<button
				type="button"
				onClick={onToggleDetection}
				aria-pressed={detecting}
				className="px-4 py-2 rounded font-semibold focus:outline-none focus:ring-2 tour-detect-toggle"
				style={{
					backgroundColor: "var(--color-brand-200)",
					color: "var(--color-ink)",
				}}
			>
				{detecting ? "Pause detection" : "Resume detection"}
			</button>
			<button
				type="button"
				onClick={onClearBuffer}
				className="px-4 py-2 rounded font-semibold focus:outline-none focus:ring-2"
				style={{
					backgroundColor: "var(--color-brand-200)",
					color: "var(--color-ink)",
				}}
			>
				Clear buffer
			</button>
		</div>
	);
}

interface WebcamSectionProps {
	detecting: boolean;
	prediction: {
		index: number;
		name: string;
		prob: number;
	} | null;
	onToggleDetection: () => void;
	onClearBuffer: () => void;
}

export const WebcamSection = forwardRef<Webcam, WebcamSectionProps>(
	({ detecting, prediction, onToggleDetection, onClearBuffer }, ref) => {
		return (
			<div
				className="rounded-xl shadow-sm border"
				style={{
					borderColor: "var(--color-brand-200)",
					background: "white",
				}}
			>
				<div
					className="p-4 border-b"
					style={{ borderColor: "var(--color-brand-200)" }}
				>
					<h2
						className="text-lg font-medium"
						style={{ color: "var(--color-ink)" }}
					>
						Live detection
					</h2>
					<p className="text-sm mt-1" style={{ color: "var(--color-cocoa)" }}>
						Place your hand in frame, keep steady for a clear prediction.
					</p>
				</div>

				<div className="p-4 flex flex-col items-center gap-4">
					<Webcam
						ref={ref}
						className="rounded-lg border w-full max-w-md aspect-square object-cover tour-webcam"
						style={{ borderColor: "var(--color-brand-300)" }}
						width={256}
						height={256}
						mirrored
						videoConstraints={{
							width: 1280,
							height: 720,
							facingMode: "user",
						}}
						aria-label="Webcam preview"
					/>

					<WebcamControls
						detecting={detecting}
						onToggleDetection={onToggleDetection}
						onClearBuffer={onClearBuffer}
					/>

					<PredictionDisplay prediction={prediction} />
				</div>
			</div>
		);
	}
);

WebcamSection.displayName = "WebcamSection";
