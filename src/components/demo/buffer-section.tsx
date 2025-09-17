interface BufferSectionProps {
	buffer: string;
	onTranslate: () => void;
}

export function BufferSection({ buffer, onTranslate }: BufferSectionProps) {
	return (
		<div className="w-full max-w-md space-y-2 tour-buffer">
			<label
				className="text-sm font-medium"
				style={{ color: "var(--color-ink)" }}
			>
				Buffer
			</label>
			<div
				className="flex items-center gap-2 p-3 rounded border bg-white"
				style={{ borderColor: "var(--color-brand-300)" }}
			>
				<div
					className="flex-1 font-mono text-lg"
					style={{ color: "var(--color-cocoa)" }}
				>
					{buffer || "…"}
				</div>
				<button
					type="button"
					onClick={onTranslate}
					className="px-3 py-2 text-white rounded font-semibold focus:outline-none focus:ring-2 disabled:opacity-50 tour-translate"
					disabled={!buffer.trim()}
					style={{ backgroundColor: "var(--color-charcoal)" }}
					aria-label="Translate buffer"
				>
					Translate
				</button>
			</div>
		</div>
	);
}
