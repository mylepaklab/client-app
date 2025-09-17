import {
	Camera,
	Brain,
	Monitor,
	Shield,
	Globe,
	Github,
	Play,
	Users,
	Zap,
	Eye,
	Lock,
	Code,
	Lightbulb,
	Target,
	Heart,
	Presentation,
	Menu,
	X,
} from "lucide-react";

export const getIcon = (iconName: string) => {
	const icons = {
		Camera,
		Brain,
		Monitor,
		Zap,
		Eye,
		Shield,
		Lock,
		Globe,
		Code,
		Users,
		Lightbulb,
		Target,
		Heart,
		Play,
		Github,
		Presentation,
		Menu,
		X,
	};
	const IconComponent = icons[iconName as keyof typeof icons];
	return IconComponent || Camera;
};
