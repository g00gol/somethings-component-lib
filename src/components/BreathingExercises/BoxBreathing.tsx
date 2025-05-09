import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Animated,
  Easing,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { BreathingProps } from "./types";
import { useHapticPattern } from "../../hooks/useHapticPattern";

const BOX_PHASES = ["Inhale", "Hold", "Exhale", "Hold"] as const;
const DURATION = 4000;

export const BoxBreathing: React.FC<BreathingProps> = ({
  size = 120,
  color = "skyblue",
  onCycleEnd,
}) => {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [active, setActive] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const { play, stop } = useHapticPattern();

  const phase = BOX_PHASES[phaseIndex];

  const nextPhase = () => {
    const isLast = phaseIndex === BOX_PHASES.length - 1;
    setPhaseIndex((prev) => (prev + 1) % BOX_PHASES.length);
    if (isLast) onCycleEnd?.();
  };

  useEffect(() => {
    if (!active) return;

    const duration = DURATION;

    if (phase === "Inhale") {
      Animated.timing(scale, {
        toValue: 1.3,
        duration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
      play("in", duration);
    } else if (phase === "Exhale") {
      Animated.timing(scale, {
        toValue: 1,
        duration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
      play("out", duration);
    } else {
      play("hold", duration);
    }

    const timer = setTimeout(nextPhase, duration);
    return () => {
      clearTimeout(timer);
      stop();
    };
  }, [phase, active]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            backgroundColor: color,
            transform: [{ scale }],
          },
        ]}
      />
      <Text style={styles.label}>{phase}</Text>
      <TouchableOpacity
        onPress={() => setActive(!active)}
        style={[styles.button, { backgroundColor: active ? "#333" : "#aaa" }]}
      >
        <Text style={styles.buttonText}>{active ? "Stop" : "Start"}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center", flex: 1 },
  circle: { borderRadius: 9999 },
  label: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
  },
  button: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
