import VibrationTest from "../screens/VibrationTest";
import type { Meta, StoryObj } from "@storybook/react";

const VibrationTestMeta: Meta<typeof VibrationTest> = {
	title: "VibrationTest",
	component: VibrationTest,
};

export default VibrationTestMeta;

export const Default: StoryObj<typeof VibrationTest> = {};
