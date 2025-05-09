import { useRef } from "react";
import * as Haptics from "expo-haptics";

export type HapticDirection = "in" | "out" | "hold";

const INTENSITY_STEPS = [
  Haptics.ImpactFeedbackStyle.Light,
  Haptics.ImpactFeedbackStyle.Medium,
  Haptics.ImpactFeedbackStyle.Heavy,
];

export const useHapticPattern = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const play = (direction: HapticDirection, duration: number) => {
    stop();

    const interval = direction === "hold" ? 300 : 100;
    const totalSteps = Math.floor(duration / interval);
    let currentStep = 0;

    intervalRef.current = setInterval(() => {
      if (currentStep >= totalSteps) {
        stop();
        return;
      }

      if (direction === "hold") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } else {
        const progress = currentStep / totalSteps;
        const index =
          direction === "in"
            ? Math.floor(progress * INTENSITY_STEPS.length)
            : INTENSITY_STEPS.length -
              1 -
              Math.floor(progress * INTENSITY_STEPS.length);

        const intensity = INTENSITY_STEPS[Math.max(0, Math.min(index, 2))];
        Haptics.impactAsync(intensity);
      }

      currentStep++;
    }, interval);
  };

  return { play, stop };
};
