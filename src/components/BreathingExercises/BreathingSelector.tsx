import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  BoxBreathing,
  OceanWaveBreathing,
  TacticalBreathing,
  DiamondBreathing,
} from "./";

const MODES = [
  { label: "Box Breathing", key: "Box" },
  { label: "Ocean Wave", key: "Ocean" },
  { label: "Tactical", key: "Tactical" },
  { label: "Diamond", key: "Diamond" },
] as const;

export type BreathingMode = (typeof MODES)[number]["key"];

export const BreathingSelector = () => {
  const [mode, setMode] = useState<BreathingMode | null>(null);

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
      default:
        return (
          <ScrollView contentContainerStyle={styles.cardContainer}>
            <Text style={styles.header}>🫁 Choose a Breathing Style</Text>
            {MODES.map((m) => (
              <TouchableOpacity
                key={m.key}
                style={styles.card}
                onPress={() => setMode(m.key)}
              >
                <Text style={styles.cardText}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        );
    }
  };

  return <View style={styles.container}>{renderExercise()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 30,
    textAlign: "center",
  },
  cardContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#222",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  cardText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});
