import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Target, getRandomPosition } from "./Target";

export const AimTrainer = () => {
  const [targetKey, setTargetKey] = useState(0);
  const [position, setPosition] = useState(getRandomPosition());

  const handleNextTarget = () => {
    setPosition(getRandomPosition());
    setTargetKey((prev) => prev + 1); // force re-render of target
  };

  return (
    <View style={styles.container}>
      <Target key={targetKey} position={position} onHit={handleNextTarget} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
  },
});
