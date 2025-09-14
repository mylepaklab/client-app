import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

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

export function HandPOC() {
	const webcamRef = useRef<Webcam>(null);
	const overlayRef = useRef<HTMLCanvasElement | null>(null);
	const playerRef = useRef<HTMLCanvasElement | null>(null);

	const modelRef = useRef<HandLandmarker | null>(null);
	const prevLeftRef = useRef<{ x: number; y: number }[] | null>(null);
	const prevRightRef = useRef<{ x: number; y: number }[] | null>(null);
	const rafRef = useRef<number | null>(null);

	const [loading, setLoading] = useState(false);
	const [playing, setPlaying] = useState(false);
	const [error, setError] = useState("");
	const [matched, setMatched] = useState<string | null>(null);
	const [confidence, setConfidence] = useState<number | null>(null);
	const [lastMovement, setLastMovement] = useState<{
		left: number;
		right: number;
	}>({ left: 0, right: 0 });

	useEffect(() => {
		let cancelled = false;
		async function init() {
			try {
				const vision = await FilesetResolver.forVisionTasks(
					"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
				);
				if (cancelled) return;
				modelRef.current = await HandLandmarker.createFromOptions(vision, {
					baseOptions: {
						modelAssetPath:
							"https://storage.googleapis.com/mediapipe-assets/hand_landmarker.task",
					},
					numHands: 2,
					runningMode: "VIDEO",
				});
			} catch (e) {
				console.error(e);
				setError("Failed to load hand model");
			}
		}
		init();
		return () => {
			cancelled = true;
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, []);

	useEffect(() => {
		const loop = () => {
			const model = modelRef.current;
			const video = webcamRef.current?.video as HTMLVideoElement | undefined;
			const canvas = overlayRef.current;
			if (!model || !video || video.readyState !== 4 || !canvas) {
				rafRef.current = requestAnimationFrame(loop);
				return;
			}

			const w = video.videoWidth || 640;
			const h = video.videoHeight || 480;
			if (canvas.width !== w) canvas.width = w;
			if (canvas.height !== h) canvas.height = h;
			const ctx = canvas.getContext("2d")!;
			ctx.clearRect(0, 0, w, h);

			const now = performance.now();
			const out = model.detectForVideo(video, now);
			const hands = out.landmarks || [];
			const handed = out.handedness || [];

			let leftPts: { x: number; y: number }[] | null = null;
			let rightPts: { x: number; y: number }[] | null = null;

			for (let i = 0; i < hands.length; i++) {
				const pts = hands[i].map((p: any) => ({ x: p.x * w, y: p.y * h }));
				const label = handed[i]?.[0]?.categoryName?.toLowerCase() || "right";
				if (label === "left") leftPts = pts;
				else rightPts = pts;

				// draw
				ctx.fillStyle = label === "left" ? "#2b6cb0" : "#c53030";
				for (const p of pts) {
					ctx.beginPath();
					ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
					ctx.fill();
				}
			}

			const avgMove = (
				curr: { x: number; y: number }[] | null,
				prev: { x: number; y: number }[] | null
			) => {
				if (!curr || !prev || curr.length !== 21 || prev.length !== 21)
					return 0;
				let sum = 0;
				for (let i = 0; i < 21; i++)
					sum += Math.hypot(curr[i].x - prev[i].x, curr[i].y - prev[i].y);
				return sum / 21;
			};
			const mvLeft = avgMove(leftPts, prevLeftRef.current);
			const mvRight = avgMove(rightPts, prevRightRef.current);
			setLastMovement({ left: mvLeft, right: mvRight });

			prevLeftRef.current = leftPts;
			prevRightRef.current = rightPts;

			rafRef.current = requestAnimationFrame(loop);
		};

		rafRef.current = requestAnimationFrame(loop);
		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, []);

	async function matchAndPlay(phrase: string) {
		setError("");
		if (!phrase.trim()) {
			setError("No phrase provided");
			return;
		}
		setLoading(true);
		try {
			const res = await api.get<MatchResp>("/match_animation_sequence", {
				params: { sentence: phrase.trim() },
			});

			console.log("Match response", res);

			setMatched(res.data.matched_phrase);
			setConfidence(res.data.confidence);

			const seq = res.data.animation_sequence || {};
			const files = Object.keys(seq);
			if (!files.length) {
				setError("No animation found");
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
			pts.push({ x: parseFloat(row[`x${i}`]), y: parseFloat(row[`y${i}`]) });
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

			const mv = Math.max(0, parseFloat(frames[i].Movement) || 0);
			const delay = Math.min(80, 33 + Math.max(0, 40 - Math.min(40, mv * 0.1)));
			await new Promise((r) => setTimeout(r, delay));
		}
	}

	const triggerApaNama = () => matchAndPlay("apa nama");
	const triggerPekerjaanApa = () => matchAndPlay("pekerjaan apa");
	const triggerBerapaTinggi = () => matchAndPlay("berapa tinggi");

	return (
		<div
			className="flex flex-col items-center justify-center min-h-screen p-8"
			style={{ backgroundColor: "var(--color-surface)" }}
		>
			<div
				className="max-w-5xl w-full rounded-lg shadow-lg p-8"
				style={{ backgroundColor: "var(--color-brand-50)" }}
			>
				<h1
					className="text-3xl font-bold text-center mb-8"
					style={{ color: "var(--color-ink)" }}
				>
					Demo Hand Pose Recognition and Animation Playback
				</h1>

				<div className="grid md:grid-cols-2 gap-6">
					<div className="relative">
						<Webcam
							ref={webcamRef}
							videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
							className="rounded-lg border-2"
							style={{
								width: 640,
								height: 480,
								borderColor: "var(--color-brand-300)",
								transform: "scaleX(-1)",
							}}
						/>
						<canvas
							ref={overlayRef}
							width={640}
							height={480}
							className="absolute top-0 left-0 rounded-lg pointer-events-none"
							style={{ width: 640, height: 480, transform: "scaleX(-1)" }}
						/>
						<div
							className="mt-2 text-sm"
							style={{ color: "var(--color-charcoal)" }}
						>
							Movement L: {lastMovement.left.toFixed(2)}, R:{" "}
							{lastMovement.right.toFixed(2)}
						</div>
					</div>

					<div className="flex flex-col gap-4">
						<div
							className="p-4 rounded border"
							style={{
								backgroundColor: "var(--color-brand-100)",
								borderColor: "var(--color-brand-300)",
							}}
						>
							<div className="text-sm" style={{ color: "var(--color-ink)" }}>
								Matched: {matched ?? "-"}
							</div>
							<div className="text-sm" style={{ color: "var(--color-ink)" }}>
								Confidence: {confidence !== null ? confidence.toFixed(4) : "-"}
							</div>
							{error && (
								<div
									className="mt-3 p-3 rounded border"
									style={{
										backgroundColor: "var(--color-brand-100)",
										borderColor: "var(--color-brand-400)",
										color: "var(--color-cocoa)",
									}}
								>
									<strong>Error:</strong> {error}
								</div>
							)}
						</div>

						<div className="relative">
							<canvas
								ref={playerRef}
								width={470}
								height={480}
								className="rounded-lg border"
								style={{
									borderColor: "var(--color-brand-300)",
									backgroundColor: "var(--color-brand-50)",
								}}
							/>
						</div>

						<div className="flex flex-wrap gap-2">
							<button
								onClick={triggerApaNama}
								disabled={loading || playing}
								className="px-4 py-2 text-white rounded font-semibold"
								style={{ backgroundColor: "var(--color-charcoal)" }}
							>
								Play "apa nama"
							</button>
							<button
								onClick={triggerPekerjaanApa}
								disabled={loading || playing}
								className="px-4 py-2 text-white rounded font-semibold"
								style={{ backgroundColor: "var(--color-charcoal)" }}
							>
								Play "pekerjaan apa"
							</button>
							<button
								onClick={triggerBerapaTinggi}
								disabled={loading || playing}
								className="px-4 py-2 text-white rounded font-semibold"
								style={{ backgroundColor: "var(--color-charcoal)" }}
							>
								Play "berapa tinggi"
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
