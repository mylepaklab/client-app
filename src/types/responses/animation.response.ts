export type FrameRow = {
	HandLabel: "LeftHand" | "RightHand";
	Movement: string;
	[k: `x${number}`]: string;
	[k: `y${number}`]: string;
};

export type MatchResp = {
	input: string;
	matched_phrase: string | null;
	confidence: number;
	animation_sequence: Record<string, FrameRow[]>;
};
