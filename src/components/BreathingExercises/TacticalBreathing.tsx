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

const PHASES = [
  { name: "Inhale", to: 1.3, duration: 4000 },
  { name: "Exhale", to: 1, duration: 4000 },
] as const;

export const TacticalBreathing: React.FC<BreathingProps> = ({
  size = 120,
  color = "skyblue",
  onCycleEnd,
}) => {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [active, setActive] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const { play, stop } = useHapticPattern();

  const phase = PHASES[phaseIndex];

  const nextPhase = () => {
    const isLast = phaseIndex === PHASES.length - 1;
    setPhaseIndex((prev) => (prev + 1) % PHASES.length);
    if (isLast) onCycleEnd?.();
  };

  useEffect(() => {
    if (!active) return;

    Animated.timing(scale, {
      toValue: phase.to,
      duration: phase.duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();

    if (phase.name.includes("Inhale")) {
      play("in", phase.duration);
    } else if (phase.name === "Exhale") {
      play("out", phase.duration);
    } else {
      play("hold", phase.duration);
    }

    const timer = setTimeout(nextPhase, phase.duration);
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
      <Text style={styles.label}>{phase.name}</Text>
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
  label: { marginTop: 20, fontSize: 20, fontWeight: "500", color: "#333" },
  button: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: { color: "white", fontSize: 16 },
});
