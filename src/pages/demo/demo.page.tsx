import { HandSignPlayer } from "~/components/demo/hand-sign.demo";
import { TutorialDemo } from "~/components/demo/tutorial.demo";

export function DemoPage() {
	return (
		<section
			className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8"
			style={{ backgroundColor: "var(--color-surface)" }}
		>
			<TutorialDemo />
			<HandSignPlayer />
		</section>
	);
}
