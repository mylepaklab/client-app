import type { FC } from "react";

export const TutorialDemo: FC = () => {
	return (
		<header className="w-full max-w-6xl mx-auto mb-8">
			<div className="grid md:grid-cols-2 gap-8 items-center">
				<div className="flex justify-center">
					<img
						src="/assets/images/bim-sign.webp"
						alt="BIM Sign Language"
						className="w-40 h-40 md:w-[360px] md:h-[360px] object-contain"
					/>
				</div>

				<div>
					<h1
						className="text-3xl md:text-4xl font-bold"
						style={{ color: "var(--color-ink)" }}
					>
						BIM Sign Language Translator
					</h1>

					<p
						className="mt-3 text-sm md:text-base max-w-prose"
						style={{ color: "var(--color-cocoa)" }}
					>
						Use hand gestures to communicate in Bahasa Isyarat Malaysia. Show a
						sign to the camera or pick a phrase to preview its animation.
					</p>

					<ol
						className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3"
						aria-label="Tutorial steps"
					>
						<li
							className="rounded-lg p-3 border"
							style={{
								borderColor: "var(--color-brand-200)",
								background: "white",
							}}
						>
							<div className="text-xs" style={{ color: "var(--color-cocoa)" }}>
								Step 1
							</div>
							<div
								className="font-medium"
								style={{ color: "var(--color-ink)" }}
							>
								Allow camera access
							</div>
						</li>
						<li
							className="rounded-lg p-3 border"
							style={{
								borderColor: "var(--color-brand-200)",
								background: "white",
							}}
						>
							<div className="text-xs" style={{ color: "var(--color-cocoa)" }}>
								Step 2
							</div>
							<div
								className="font-medium"
								style={{ color: "var(--color-ink)" }}
							>
								Hold your hand steady
							</div>
						</li>
						<li
							className="rounded-lg p-3 border"
							style={{
								borderColor: "var(--color-brand-200)",
								background: "white",
							}}
						>
							<div className="text-xs" style={{ color: "var(--color-cocoa)" }}>
								Step 3
							</div>
							<div
								className="font-medium"
								style={{ color: "var(--color-ink)" }}
							>
								Translate or play a phrase
							</div>
						</li>
					</ol>
				</div>
			</div>
		</header>
	);
};
