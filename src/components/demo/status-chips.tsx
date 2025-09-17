import { Chip } from "~/components/ui/chip";

interface StatusChipsProps {
	isModelReady: boolean;
	isDetecting: boolean;
	onShowTutorial: () => void;
}

export function StatusChips({
	isModelReady,
	isDetecting,
	onShowTutorial,
}: StatusChipsProps) {
	return (
		<div className="flex items-center gap-2 tour-status">
			{isModelReady ? (
				<Chip text="Model ready" />
			) : (
				<Chip text="Loading model" />
			)}
			{isDetecting ? (
				<Chip text="Detecting on" />
			) : (
				<Chip text="Detecting off" />
			)}
			<button
				type="button"
				onClick={onShowTutorial}
				className="px-3 py-1.5 rounded text-sm font-semibold focus:outline-none focus:ring-2"
				style={{
					backgroundColor: "var(--color-brand-200)",
					color: "var(--color-ink)",
				}}
				aria-label="Show tutorial"
			>
				Show tutorial
			</button>
		</div>
	);
}
