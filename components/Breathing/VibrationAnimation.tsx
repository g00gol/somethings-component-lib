import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, Animated, Easing, Text } from "react-native";
import * as Haptics from "expo-haptics";

const HAPTIC_PATTERN = [
  { delay: 0, intensity: Haptics.ImpactFeedbackStyle.Light },
  { delay: 300, intensity: Haptics.ImpactFeedbackStyle.Medium },
  { delay: 300, intensity: Haptics.ImpactFeedbackStyle.Heavy },
  { delay: 300, intensity: Haptics.ImpactFeedbackStyle.Medium },
  { delay: 300, intensity: Haptics.ImpactFeedbackStyle.Light },
];

const VibrationAnimation = () => {
  const [isActive, setIsActive] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  let vibrationTimeout = useRef(null);

  // Function to start vibration loop
  const startVibration = () => {
    let index = 0;

    const vibrate = () => {
      if (!isActive) return; // Stop if button is toggled off

      let { delay, intensity } = HAPTIC_PATTERN[index];
      Haptics.impactAsync(intensity);

      index = (index + 1) % HAPTIC_PATTERN.length;
      vibrationTimeout.current = setTimeout(vibrate, delay);
    };

    vibrate();
  };

  // Function to start animation loop
  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // Handle button press
  const toggleHapticEffect = () => {
    setIsActive((prev) => !prev);
  };

  // Effect to start/stop animation and vibration
  useEffect(() => {
    if (isActive) {
      startAnimation();
      startVibration();
    } else {
      scale.setValue(1); // Reset animation
      Animated.timing(scale).stop();
      clearTimeout(vibrationTimeout.current);
    }
  }, [isActive]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity
        onPress={toggleHapticEffect}
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <Animated.View
          style={{
            width: 100,
            height: 100,
            backgroundColor: isActive ? "blue" : "gray",
            borderRadius: 50,
            transform: [{ scale }],
          }}
        />
        <Text style={{ marginTop: 20, fontSize: 16, color: "black" }}>
          {isActive ? "Stop" : "Start"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default VibrationAnimation;
