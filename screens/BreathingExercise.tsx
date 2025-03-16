import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, Animated, Easing, Text } from "react-native";
import * as Haptics from "expo-haptics";

const BREATH_DURATION = 3000; // Controls fall duration, breathing time, and vibration intensity
const BLOCK_COUNT = 5;
const VIBRATION_INTENSITY =
  BREATH_DURATION > 3000
    ? Haptics.ImpactFeedbackStyle.Heavy
    : Haptics.ImpactFeedbackStyle.Light;
const REPEAT_MAP = {
  [Haptics.ImpactFeedbackStyle.Light]: 100,
  [Haptics.ImpactFeedbackStyle.Medium]: 50,
  [Haptics.ImpactFeedbackStyle.Heavy]: 10,
};

const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const blocks = useRef(
    Array.from({ length: BLOCK_COUNT }, () => new Animated.Value(-200))
  ).current;
  const hapticTimeout = useRef(null);

  const startVibrationDuringFall = () => {
    const vibrate = () => {
      if (!isActive) return;
      Haptics.impactAsync(VIBRATION_INTENSITY);
      hapticTimeout.current = setTimeout(
        vibrate,
        REPEAT_MAP[VIBRATION_INTENSITY]
      );
    };
    vibrate();

    setTimeout(() => {
      clearTimeout(hapticTimeout.current);
    }, BREATH_DURATION);
  };

  const startAnimation = () => {
    startVibrationDuringFall();
    blocks.forEach((block, index) => {
      Animated.timing(block, {
        toValue: 0,
        duration: BREATH_DURATION,
        easing: Easing.out(Easing.bounce),
        delay: index * 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const startBreathing = () => {
    let inhale = true;

    const animateBreathing = () => {
      if (!isActive) return;

      clearTimeout(hapticTimeout.current);
      const repeatHaptic = () => {
        if (!isActive) return;
        Haptics.impactAsync(inhale ? VIBRATION_INTENSITY : null);
        if (inhale) {
          hapticTimeout.current = setTimeout(
            repeatHaptic,
            REPEAT_MAP[VIBRATION_INTENSITY]
          );
        }
      };
      repeatHaptic();

      Animated.timing(scale, {
        toValue: inhale ? 1.3 : 1, // Inhale -> Expand, Exhale -> Contract
        duration: BREATH_DURATION,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        inhale = !inhale;
        hapticTimeout.current = setTimeout(animateBreathing, BREATH_DURATION);
      });
    };
    animateBreathing();
  };

  useEffect(() => {
    if (isActive) {
      startAnimation();
      setTimeout(startBreathing, BREATH_DURATION + 500);
    } else {
      blocks.forEach((block) => block.setValue(-200));
      scale.setValue(1);
      clearTimeout(hapticTimeout.current);
    }
  }, [isActive]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Breathing Exercise</Text>
      <View style={styles.blockContainer}>
        {blocks.map((block, index) => (
          <Animated.View
            key={index}
            style={[
              styles.block,
              { transform: [{ translateY: block }, { scale }] },
            ]}
          />
        ))}
      </View>
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
