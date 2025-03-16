import { Platform } from "react-native";

let RNHapticFeedback: any = null;

try {
	RNHapticFeedback = require("react-native-haptic-feedback").default;
} catch (error) {
	console.log("react-native-haptic-feedback not found");
}

export const triggerHapticFeedback = (
	intensity: "light" | "medium" | "heavy"
) => {
	if (RNHapticFeedback) {
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
