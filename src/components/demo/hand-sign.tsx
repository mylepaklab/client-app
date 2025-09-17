import { useEffect, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import { api } from "~/lib/axios";

type FrameRow = {
	HandLabel: "LeftHand" | "RightHand";
	Movement: string;
	[k: `x${number}`]: string;
	[k: `y${number}`]: string;
};

type MatchResp = {
	input: string;
	matched_phrase: string | null;
	confidence: number;
	animation_sequence: Record<string, FrameRow[]>;
};

const PHRASES = [
	{ key: "apa nama", label: "Apa nama" },
	{ key: "pekerjaan apa", label: "Pekerjaan apa" },
	{ key: "berapa tinggi", label: "Berapa tinggi" },
];

const MODEL_URL = "/models/tfjs-model/model.json";
const LABELS_URL = "/models/tfjs-model/label_mapping.json";
const PREDICT_MS = 1000;

export function HandSignPlayer() {
	const webcamRef = useRef<Webcam>(null);
	const playerRef = useRef<HTMLCanvasElement | null>(null);

	const [selectedPhrase, setSelectedPhrase] = useState<string>(PHRASES[0].key);
	const [matched, setMatched] = useState<string | null>(null);
	const [confidence, setConfidence] = useState<number | null>(null);
	const [loading, setLoading] = useState(false);
	const [playing, setPlaying] = useState(false);
	const [error, setError] = useState("");

	const [model, setModel] = useState<tf.LayersModel | null>(null);
	const [labelMap, setLabelMap] = useState<Record<number, string>>({});
	const [prediction, setPrediction] = useState<{
		index: number;
		name: string;
		prob: number;
	} | null>(null);

	const [buffer, setBuffer] = useState<string>("");

	const stableRef = useRef<{ idx: number | null; ticks: number }>({
		idx: null,
		ticks: 0,
	});

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				await tf.setBackend("webgl");
				await tf.ready();
				const m = await tf.loadLayersModel(MODEL_URL);
				if (!mounted) return;
				setModel(m);
				tf.tidy(() => m.predict(tf.zeros([1, 256, 256, 3])) as tf.Tensor);
			} catch (e) {
				console.error("Model load failed", e);
				setError("Failed to load TFJS model");
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const res = await fetch(LABELS_URL);
				const mapping = (await res.json()) as Record<string, number>;
				const flipped = Object.entries(mapping).reduce<Record<number, string>>(
					(acc, [label, idx]) => {
						acc[idx] = label;
						return acc;
					},
					{}
				);
				if (mounted) setLabelMap(flipped);
			} catch (e) {
				console.error("Labels load failed", e);
				setLabelMap({});
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);

	const predict = useCallback(async () => {
		const video = webcamRef.current?.video as HTMLVideoElement | undefined;
		if (!video || video.readyState !== 4 || !model) return;

		const { output, probs } = await tf.tidy(() => {
			const input = tf.browser
				.fromPixels(video)
				.resizeBilinear([256, 256])
				.toFloat()
				.expandDims(0);
			const out = model.predict(input) as tf.Tensor;
			return { output: out, probs: (out as any).softmax() };
		});

		const data = await probs.data();
		let topIdx = -1;
		let topVal = -Infinity;
		let secondVal = -Infinity;
		for (let i = 0; i < data.length; i++) {
			const v = data[i];
			if (v > topVal) {
				secondVal = topVal;
				topVal = v;
				topIdx = i;
			} else if (v > secondVal) {
				secondVal = v;
			}
		}

		output.dispose();
		if (probs !== output) probs.dispose();

		const name = labelMap[topIdx] ?? `class_${topIdx}`;
		setPrediction({ index: topIdx, name, prob: topVal });

		const clearMargin = topVal - secondVal >= 0.15;
		if (clearMargin) {
			const last = stableRef.current.idx;
			if (last === topIdx) {
				stableRef.current.ticks += 1;
			} else {
				stableRef.current.idx = topIdx;
				stableRef.current.ticks = 1;
			}
			if (stableRef.current.ticks >= 2) {
				if (!buffer.endsWith(name) && /^[A-Z0-9]+$/.test(name)) {
					setBuffer((b) => b + name);
				}
			}
		} else {
			stableRef.current.idx = null;
			stableRef.current.ticks = 0;
		}
	}, [model, labelMap, buffer]);

	useEffect(() => {
		if (!model) return;
		const id = setInterval(predict, PREDICT_MS);
		return () => clearInterval(id);
	}, [model, predict]);

	async function matchAndPlay(phrase: string) {
		setError("");
		setLoading(true);
		setMatched(null);
		setConfidence(null);
		try {
			const res = await api.get<MatchResp>("/match_animation_sequence", {
				params: { sentence: phrase },
			});
			setMatched(res.data.matched_phrase);
			setConfidence(res.data.confidence);

			const seq = res.data.animation_sequence || {};
			const files = Object.keys(seq);
			if (!files.length) {
				setError("No animation found for that phrase");
				return;
			}

			const canvas = playerRef.current!;
			const ctx = canvas.getContext("2d")!;
			const W = canvas.width,
				H = canvas.height;
			ctx.clearRect(0, 0, W, H);

			setPlaying(true);
			for (const f of files) {
				await playClip(seq[f], canvas);
			}
		} catch (e: any) {
			setError(e?.response?.data?.message || e.message || "Request failed");
		} finally {
			setLoading(false);
			setPlaying(false);
		}
	}

	function drawRow(ctx: CanvasRenderingContext2D, row: FrameRow) {
		const pts: { x: number; y: number }[] = [];
		for (let i = 1; i <= 21; i++) {
			const x = parseFloat(row[`x${i}`]);
			const y = parseFloat(row[`y${i}`]);
			pts.push({ x, y });
		}
		const color = row.HandLabel === "LeftHand" ? "#2b6cb0" : "#c53030";
		ctx.fillStyle = color;
		for (const p of pts) {
			ctx.beginPath();
			ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
			ctx.fill();
		}
		const bones = [
			[0, 1],
			[1, 2],
			[2, 3],
			[3, 4],
			[0, 5],
			[5, 6],
			[6, 7],
			[7, 8],
			[0, 9],
			[9, 10],
			[10, 11],
			[11, 12],
			[0, 13],
			[13, 14],
			[14, 15],
			[15, 16],
			[0, 17],
			[17, 18],
			[18, 19],
			[19, 20],
		];
		ctx.strokeStyle = color;
		ctx.lineWidth = 2;
		for (const [a, b] of bones) {
			const p = pts[a],
				q = pts[b];
			ctx.beginPath();
			ctx.moveTo(p.x, p.y);
			ctx.lineTo(q.x, q.y);
			ctx.stroke();
		}
	}

	async function playClip(frames: FrameRow[], canvas: HTMLCanvasElement) {
		const ctx = canvas.getContext("2d")!;
		const W = canvas.width,
			H = canvas.height;
		for (let i = 0; i < frames.length; i++) {
			ctx.clearRect(0, 0, W, H);
			drawRow(ctx, frames[i]);
			await new Promise((r) => setTimeout(r, 66));
		}
	}

	const onStop = useCallback(async () => {
		const text = buffer.trim();
		if (!text) return;

		const sendText = await api.get("/form_answer", {
			params: { text_to_translate: `${text} STOP` },
		});

		console.log("Form answer response:", sendText.data);
	}, [buffer]);

	const onClear = useCallback(() => {
		setBuffer("");
		stableRef.current.idx = null;
		stableRef.current.ticks = 0;
	}, []);

	return (
		<div
			className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8"
			style={{ backgroundColor: "var(--color-surface)" }}
		>
			<div className="w-full max-w-6xl mb-8 text-center">
				<div className="flex flex-col items-center gap-5">
					<img
						src="/assets/images/bim-sign.webp"
						alt="BIM Sign Language"
						className="w-28 h-28 md:w-40 md:h-40 object-contain"
					/>
					<h1
						className="text-3xl md:text-4xl font-bold"
						style={{ color: "var(--color-ink)" }}
					>
						BIM Sign Language Translator
					</h1>
					<p
						className="text-sm md:text-base max-w-3xl"
						style={{ color: "var(--color-cocoa)" }}
					>
						Use hand gestures to communicate in Bahasa Isyarat Malaysia. Show a
						sign to the camera or pick a phrase to preview its animation.
					</p>
				</div>
			</div>

			<div
				className="w-full max-w-6xl rounded-lg shadow-lg p-4 md:p-8"
				style={{ backgroundColor: "var(--color-brand-50)" }}
			>
				{/* two equal columns on large, stack on small */}
				<div className="grid lg:grid-cols-2 gap-8">
					{/* Left column */}
					<div className="flex flex-col items-center space-y-5">
						<h2
							className="text-xl font-semibold text-center"
							style={{ color: "var(--color-ink)" }}
						>
							Hand Sign Detection
						</h2>

						<Webcam
							ref={webcamRef}
							className="rounded-lg border-2 w-full max-w-md"
							style={{
								borderColor: "var(--color-brand-300)",
								aspectRatio: "1",
							}}
							width={256}
							height={256}
							mirrored
							videoConstraints={{
								width: 1280,
								height: 720,
								facingMode: "user",
							}}
						/>

						<div
							className="text-sm text-center p-3 rounded-lg w-full max-w-md"
							style={{
								backgroundColor: "var(--color-brand-100)",
								color: "var(--color-ink)",
							}}
						>
							{prediction ? (
								<>
									<strong>Detected:</strong> {prediction.name}
									<br />
									<strong>Confidence:</strong>{" "}
									{(prediction.prob * 100).toFixed(2)}%
								</>
							) : (
								<>Show your hand to get prediction</>
							)}
						</div>

						<div className="w-full max-w-md space-y-3">
							<div
								className="flex items-center gap-2 p-3 rounded border bg-white"
								style={{ borderColor: "var(--color-brand-300)" }}
							>
								<span
									className="text-sm font-medium"
									style={{ color: "var(--color-ink)" }}
								>
									Buffer:
								</span>
								<div
									className="flex-1 font-mono text-lg"
									style={{ color: "var(--color-cocoa)" }}
								>
									{buffer || "…"}
								</div>
							</div>

							<div className="flex gap-2">
								<button
									onClick={onClear}
									className="flex-1 px-4 py-2 rounded font-semibold transition-colors"
									style={{
										backgroundColor: "var(--color-brand-200)",
										color: "var(--color-ink)",
									}}
								>
									Clear
								</button>
								<button
									onClick={onStop}
									className="flex-1 px-4 py-2 text-white rounded font-semibold transition-colors"
									style={{ backgroundColor: "var(--color-charcoal)" }}
								>
									Translate
								</button>
							</div>
						</div>
					</div>

					<div className="flex flex-col items-center space-y-5">
						<h2
							className="text-xl font-semibold text-center"
							style={{ color: "var(--color-ink)" }}
						>
							Phrase Animation Player
						</h2>

						<div className="w-full max-w-md space-y-4">
							<div>
								<label
									className="block text-sm font-medium mb-2"
									style={{ color: "var(--color-ink)" }}
								>
									Select a phrase:
								</label>
								<select
									value={selectedPhrase}
									onChange={(e) => setSelectedPhrase(e.target.value)}
									className="w-full px-3 py-2 rounded border"
									style={{
										borderColor: "var(--color-brand-300)",
										backgroundColor: "white",
										color: "var(--color-ink)",
									}}
								>
									{PHRASES.map((phrase) => (
										<option key={phrase.key} value={phrase.key}>
											{phrase.label}
										</option>
									))}
								</select>
							</div>

							<button
								onClick={() => matchAndPlay(selectedPhrase)}
								disabled={loading || playing}
								className="w-full px-4 py-3 text-white rounded font-semibold transition-colors disabled:opacity-50"
								style={{ backgroundColor: "var(--color-brand-500)" }}
							>
								{loading
									? "Loading..."
									: playing
									? "Playing..."
									: "Play Animation"}
							</button>
						</div>

						<canvas
							ref={playerRef}
							width={256}
							height={256}
							className="rounded-lg border-2 w-full max-w-md"
							style={{
								borderColor: "var(--color-brand-300)",
								backgroundColor: "white",
								aspectRatio: "1",
							}}
						/>

						{matched && (
							<div
								className="w-full max-w-md p-3 rounded-lg text-center"
								style={{
									backgroundColor: "var(--color-brand-100)",
									color: "var(--color-ink)",
								}}
							>
								<div className="text-sm">
									<strong>Matched:</strong> {matched}
								</div>
								{confidence !== null && (
									<div className="text-sm">
										<strong>Confidence:</strong> {(confidence * 100).toFixed(2)}
										%
									</div>
								)}
							</div>
						)}

						{error && (
							<div
								className="w-full max-w-md p-3 rounded-lg text-center text-red-700"
								style={{ backgroundColor: "#fee2e2" }}
							>
								{error}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
