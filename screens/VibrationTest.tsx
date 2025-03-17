import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, Animated, Easing, Text } from "react-native";
import { triggerHapticFeedback } from "../components/Breathing/HapticsHelper";

const BreathingExercise = () => {
	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		if (isActive) {
			triggerHapticFeedback("light");
		} else {
			console.log("Haptic stopped");
		}
	}, [isActive]);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Vibration Test</Text>
			<TouchableOpacity
				onPress={() => setIsActive((prev) => !prev)}
				style={[
					styles.button,
					{ backgroundColor: isActive ? "red" : "green" },
				]}
			>
				<Text style={styles.buttonText}>
					{isActive ? "Stop" : "Start"}
				</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = {
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#F0F8FF",
	},
	title: {
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 20,
		color: "#333",
	},
	blockContainer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},
	block: {
		width: 30,
		height: 30,
		margin: 5,
		backgroundColor: "blue",
	},
	button: {
		marginTop: 40,
		padding: 15,
		borderRadius: 10,
	},
	buttonText: {
		fontSize: 18,
		color: "white",
	},
};

export default BreathingExercise;
