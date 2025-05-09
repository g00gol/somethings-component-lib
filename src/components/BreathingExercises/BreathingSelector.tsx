import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  BoxBreathing,
  OceanWaveBreathing,
  TacticalBreathing,
  DiamondBreathing,
} from "./";

const MODES = ["Box", "Ocean", "Tactical", "Diamond"] as const;

export type BreathingMode = (typeof MODES)[number];

export const BreathingSelector = () => {
  const [mode, setMode] = useState<BreathingMode>("Box");

  const renderExercise = () => {
    switch (mode) {
      case "Box":
        return <BoxBreathing />;
      case "Ocean":
        return <OceanWaveBreathing />;
      case "Tactical":
        return <TacticalBreathing />;
      case "Diamond":
        return <DiamondBreathing />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.nav}>
        {MODES.map((m) => (
          <TouchableOpacity
            key={m}
            onPress={() => setMode(m)}
            style={[styles.button, mode === m && styles.activeButton]}
          >
            <Text style={[styles.text, mode === m && styles.activeText]}>
              {m}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {renderExercise()}
    </View>
  );
};

const styles = StyleSheet.create({
  nav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#eee",
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activeButton: {
    backgroundColor: "#333",
  },
  text: {
    color: "#333",
    fontSize: 16,
  },
  activeText: {
    color: "#fff",
  },
});
