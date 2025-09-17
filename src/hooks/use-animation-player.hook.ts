import { useState, useCallback } from "react";
import { api } from "~/lib/axios";
import { sleep } from "~/helper/utils";
import { BONES } from "~/constants/contents/demo.content";
import type { MatchResp, FrameRow } from "~/types/responses/animation.response";

interface UseAnimationPlayerReturn {
	matched: string | null;
	confidence: number | null;
	loading: boolean;
	playing: boolean;
	playAnimation: (phrase: string, canvas: HTMLCanvasElement) => Promise<void>;
}

export function useAnimationPlayer(): UseAnimationPlayerReturn {
	const [matched, setMatched] = useState<string | null>(null);
	const [confidence, setConfidence] = useState<number | null>(null);
	const [loading, setLoading] = useState(false);
	const [playing, setPlaying] = useState(false);

	function rowToPoints(row: FrameRow) {
		const pts: { x: number; y: number }[] = [];
		for (let i = 1; i <= 21; i++) {
			const x = Number(row[`x${i}`]);
			const y = Number(row[`y${i}`]);
			if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
			pts.push({ x, y });
		}
		return pts;
	}

	function drawRowFit(
		ctx: CanvasRenderingContext2D,
		row: FrameRow,
		W: number,
		H: number,
		opts: { pad?: number; mirror?: boolean } = {}
	) {
		const pts = rowToPoints(row);
		if (!pts) return;

		let minX = Infinity,
			minY = Infinity,
			maxX = -Infinity,
			maxY = -Infinity;
		for (const p of pts) {
			if (p.x < minX) minX = p.x;
			if (p.y < minY) minY = p.y;
			if (p.x > maxX) maxX = p.x;
			if (p.y > maxY) maxY = p.y;
		}
		const srcW = Math.max(1e-6, maxX - minX);
		const srcH = Math.max(1e-6, maxY - minY);

		const pad = opts.pad ?? 0.1;
		const targetW = W * (1 - pad * 2);
		const targetH = H * (1 - pad * 2);
		const scale = Math.min(targetW / srcW, targetH / srcH);

		const offsetX = W * pad + (targetW - srcW * scale) / 2;
		const offsetY = H * pad + (targetH - srcH * scale) / 2;

		const mapX = (x: number) => offsetX + (x - minX) * scale;
		const mapY = (y: number) => offsetY + (y - minY) * scale;

		const color = row.HandLabel === "LeftHand" ? "#2b6cb0" : "#c53030";

		ctx.save();
		if (opts.mirror) {
			ctx.translate(W, 0);
			ctx.scale(-1, 1);
		}

		ctx.lineWidth = 2;
		ctx.strokeStyle = color;
		for (const [a, b] of BONES) {
			const p = pts[a],
				q = pts[b];
			const x1 = mapX(p.x),
				y1 = mapY(p.y);
			const x2 = mapX(q.x),
				y2 = mapY(q.y);
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.stroke();
		}

		ctx.fillStyle = color;
		for (const p of pts) {
			const x = mapX(p.x),
				y = mapY(p.y);
			ctx.beginPath();
			ctx.arc(x, y, 3, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.restore();
	}

	async function playClip(
		frames: FrameRow[],
		canvas: HTMLCanvasElement,
		opts: { fps?: number; mirror?: boolean } = {}
	) {
		const ctx = canvas.getContext("2d")!;
		const css = canvas.getBoundingClientRect();
		const dpr = window.devicePixelRatio || 1;
		const needW = Math.round(css.width * dpr);
		const needH = Math.round(css.height * dpr);
		if (canvas.width !== needW || canvas.height !== needH) {
			canvas.width = needW;
			canvas.height = needH;
		}
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

		const W = css.width,
			H = css.height;
		const fps = Math.max(1, Math.min(opts.fps ?? 8, 60));
		const frameMs = Math.round(1000 / fps);

		for (let i = 0; i < frames.length; i++) {
			ctx.clearRect(0, 0, W, H);
			drawRowFit(ctx, frames[i], W, H, { mirror: !!opts.mirror });
			await new Promise((r) => setTimeout(r, frameMs));
		}
	}

	const playAnimation = useCallback(
		async (phrase: string, canvas: HTMLCanvasElement) => {
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
					throw new Error("No animation found for that phrase");
				}

				const ctx = canvas.getContext("2d")!;
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				setPlaying(true);
				for (const f of files) {
					const frames = seq[f] || [];
					if (!Array.isArray(frames) || frames.length === 0) {
						console.warn("Empty clip for", f, frames);
						continue;
					}
					await playClip(frames, canvas, { fps: 8, mirror: true });
					await sleep(300);
				}
				setPlaying(false);
			} catch (e: any) {
				throw new Error(
					e?.response?.data?.message || e.message || "Request failed"
				);
			} finally {
				setLoading(false);
				setPlaying(false);
			}
		},
		[]
	);

	return {
		matched,
		confidence,
		loading,
		playing,
		playAnimation,
	};
}
