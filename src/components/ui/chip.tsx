interface Props {
	text: string;
}

export const Chip = ({ text }: Props) => (
	<span
		className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
		style={{
			backgroundColor: "var(--color-brand-100)",
			color: "var(--color-ink)",
		}}
	>
		{text}
	</span>
);
