import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, Animated, Easing, Text } from "react-native";
import * as Haptics from "expo-haptics";

const BREATHING_PATTERN = [
  { duration: 1000, intensity: Haptics.ImpactFeedbackStyle.Light, scale: 1.1 },
  { duration: 2000, intensity: Haptics.ImpactFeedbackStyle.Medium, scale: 1.2 },
  { duration: 3000, intensity: Haptics.ImpactFeedbackStyle.Heavy, scale: 1.4 },
  { duration: 2000, intensity: Haptics.ImpactFeedbackStyle.Medium, scale: 1.2 },
  { duration: 1000, intensity: Haptics.ImpactFeedbackStyle.Light, scale: 1.1 },
];

const REPEAT_MAP = {
  [Haptics.ImpactFeedbackStyle.Light]: 250,
  [Haptics.ImpactFeedbackStyle.Medium]: 100,
  [Haptics.ImpactFeedbackStyle.Heavy]: 25,
};

const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const timeouts = useRef([]);
  const hapticInterval = useRef(null);

  const clearAllTimeouts = () => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    clearTimeout(hapticInterval.current);
  };

  const startAnimation = () => {
    let index = 0;

    const animate = () => {
      if (!isActive) return;

      const { duration, scale: targetScale } = BREATHING_PATTERN[index];
      Animated.timing(scale, {
        toValue: targetScale,
        duration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();

      index = (index + 1) % BREATHING_PATTERN.length;
      timeouts.current.push(setTimeout(animate, duration));
    };
    animate();
  };

  const startHaptics = () => {
    let index = 0;

    const vibrate = () => {
      if (!isActive) return;

      const { duration, intensity } = BREATHING_PATTERN[index];
      clearTimeout(hapticInterval.current);

      const repeatHaptic = () => {
        if (!isActive) return;
        Haptics.impactAsync(intensity);
        hapticInterval.current = setTimeout(
          repeatHaptic,
          REPEAT_MAP[intensity]
        );
      };
      repeatHaptic();

      index = (index + 1) % BREATHING_PATTERN.length;
      timeouts.current.push(setTimeout(vibrate, duration));
    };
    vibrate();
  };

  useEffect(() => {
    if (isActive) {
      startAnimation();
      startHaptics();
    } else {
      clearAllTimeouts();
      scale.setValue(1);
    }
  }, [isActive]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Breathing Exercise</Text>
      <Animated.View style={[styles.circle, { transform: [{ scale }] }]} />
      <TouchableOpacity
        onPress={() => setIsActive((prev) => !prev)}
        style={[styles.button, { backgroundColor: isActive ? "red" : "green" }]}
      >
        <Text style={styles.buttonText}>{isActive ? "Stop" : "Start"}</Text>
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
  circle: {
    width: 150,
    height: 150,
    backgroundColor: "blue",
    borderRadius: 75,
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
