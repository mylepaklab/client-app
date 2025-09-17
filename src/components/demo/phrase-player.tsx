import { forwardRef } from "react";
import { PHRASES } from "~/constants/contents/demo.content";

interface PhrasePlayerProps {
	selectedPhrase: string;
	loading: boolean;
	playing: boolean;
	matched: string | null;
	confidence: number | null;
	onPhraseChange: (phrase: string) => void;
	onPlayAnimation: () => void;
}

export const PhrasePlayer = forwardRef<HTMLCanvasElement, PhrasePlayerProps>(
	(
		{
			selectedPhrase,
			loading,
			playing,
			matched,
			confidence,
			onPhraseChange,
			onPlayAnimation,
		},
		ref
	) => {
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
						Phrase player
					</h2>
					<p className="text-sm mt-1" style={{ color: "var(--color-cocoa)" }}>
						Pick a phrase, then play the animation to learn the motion.
					</p>
				</div>

				<div className="p-4 space-y-4">
					<div className="tour-phrase-select">
						<label
							className="block text-sm font-medium mb-2"
							style={{ color: "var(--color-ink)" }}
						>
							Select a phrase
						</label>
						<select
							value={selectedPhrase}
							onChange={(e) => onPhraseChange(e.target.value)}
							className="w-full px-3 py-2 rounded border focus:outline-none focus:ring-2"
							style={{
								borderColor: "var(--color-brand-300)",
								backgroundColor: "white",
								color: "var(--color-ink)",
							}}
							aria-label="Phrase selector"
						>
							{PHRASES.map((phrase) => (
								<option key={phrase.key} value={phrase.key}>
									{phrase.label}
								</option>
							))}
						</select>
					</div>

					<button
						onClick={onPlayAnimation}
						disabled={loading || playing}
						className="w-full px-4 py-3 text-white rounded font-semibold focus:outline-none focus:ring-2 disabled:opacity-50 tour-play"
						style={{ backgroundColor: "var(--color-brand-500)" }}
						aria-busy={loading || playing}
					>
						{loading ? "Loading" : playing ? "Playing" : "Play animation"}
					</button>

					<div className="w-full">
						<canvas
							ref={ref}
							width={256}
							height={256}
							className="rounded-lg border w-full max-w-md aspect-square bg-white mx-auto tour-canvas"
							style={{ borderColor: "var(--color-brand-300)" }}
							aria-label="Animation canvas"
						/>
					</div>

					{(matched || confidence !== null) && (
						<div
							className="p-3 rounded-lg"
							style={{
								backgroundColor: "var(--color-brand-100)",
								color: "var(--color-ink)",
							}}
						>
							{matched && (
								<div className="text-sm">
									<strong>Matched:</strong> {matched}
								</div>
							)}
							{confidence !== null && (
								<div className="text-sm">
									<strong>Confidence:</strong> {(confidence * 100).toFixed(2)}%
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		);
	}
);

PhrasePlayer.displayName = "PhrasePlayer";
