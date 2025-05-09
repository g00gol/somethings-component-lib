import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";

const FINGERS = ["Thumb", "Index", "Middle", "Ring", "Pinky"];

export const FingerTapping = () => {
  const [current, setCurrent] = useState(0);

  const handleTap = (index: number) => {
    if (index === current) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrent((prev) => (prev + 1) % FINGERS.length);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tap: {FINGERS[current]}</Text>
      <View style={styles.row}>
        {FINGERS.map((label, index) => (
          <TouchableOpacity
            key={label}
            onPress={() => handleTap(index)}
            style={[styles.finger, index === current && styles.active]}
          >
            <Text style={styles.fingerText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  title: {
    color: "white",
    fontSize: 24,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
  },
  finger: {
    backgroundColor: "#333",
    padding: 16,
    borderRadius: 50,
  },
  active: {
    backgroundColor: "skyblue",
  },
  fingerText: {
    color: "white",
    fontSize: 14,
  },
});
