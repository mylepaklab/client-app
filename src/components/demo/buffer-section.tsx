interface BufferSectionProps {
	buffer: string;
	onTranslate: () => void;
	isTranslating?: boolean;
}

export function BufferSection({
	buffer,
	onTranslate,
	isTranslating = false,
}: BufferSectionProps) {
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
					className="px-3 py-2 text-white rounded font-semibold focus:outline-none focus:ring-2 disabled:opacity-50 tour-translate flex items-center gap-2"
					disabled={!buffer.trim() || isTranslating}
					style={{ backgroundColor: "var(--color-charcoal)" }}
					aria-label="Translate buffer"
				>
					{isTranslating && (
						<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
					)}
					{isTranslating ? "Translating..." : "Translate"}
				</button>
			</div>
		</div>
	);
}
