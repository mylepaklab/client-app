interface ErrorDisplayProps {
	error: string;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
	if (!error) return null;

	return (
		<div
			role="alert"
			className="rounded-lg p-3 text-sm"
			style={{ backgroundColor: "#fee2e2", color: "#7f1d1d" }}
		>
			{error}
		</div>
	);
}
