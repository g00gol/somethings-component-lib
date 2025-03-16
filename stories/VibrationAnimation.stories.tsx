import VibrationAnimation from "../components/Breathing/VibrationAnimation";
import type { Meta, StoryObj } from "@storybook/react";

const VibrationAnimationMeta: Meta<typeof VibrationAnimation> = {
  title: "VibrationAnimation",
  component: VibrationAnimation,
};

export default VibrationAnimationMeta;

export const Default: StoryObj<typeof VibrationAnimation> = {};
