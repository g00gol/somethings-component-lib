import { Platform } from "react-native";

let Haptics: any = null;
let RNHapticFeedback: any = null;

try {
  Haptics = require("expo-haptics");
} catch (error) {
  console.log(
    "expo-haptics not found, falling back to react-native-haptic-feedback"
  );
}

try {
  RNHapticFeedback = require("react-native-haptic-feedback").default;
} catch (error) {
  console.log("react-native-haptic-feedback not found");
}

export const triggerHapticFeedback = (
  intensity: "light" | "medium" | "heavy"
) => {
  if (Haptics) {
    const styles = {
      light: Haptics.ImpactFeedbackStyle.Light,
      medium: Haptics.ImpactFeedbackStyle.Medium,
      heavy: Haptics.ImpactFeedbackStyle.Heavy,
    };
    Haptics.impactAsync(styles[intensity]);
  } else if (RNHapticFeedback) {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    };
    const styles = {
      light: "impactLight",
      medium: "impactMedium",
      heavy: "impactHeavy",
    };
    RNHapticFeedback.trigger(styles[intensity], options);
  } else {
    console.warn("No haptic feedback module found.");
  }
};
