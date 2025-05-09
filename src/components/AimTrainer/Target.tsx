import React, { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  View,
  StyleSheet,
  Dimensions,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Position, TargetProps, TARGET_SIZE } from "./types";

const { width, height } = Dimensions.get("window");

export const getRandomPosition = (): Position => ({
  x: Math.random() * (width - TARGET_SIZE),
  y: Math.random() * (height - 200),
});

export const Target: React.FC<TargetProps> = ({
  position,
  onHit,
  duration = 1500,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const timerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: false,
    }).start();

    Animated.timing(timerAnim, {
      toValue: 1,
      duration,
      useNativeDriver: false,
    }).start();

    const timeout = setTimeout(() => {
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => onHit());
    }, duration);

    return () => clearTimeout(timeout);
  }, []);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onHit();
  };

  const borderAnim = timerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#00ff00", "#ff0000"],
  });

  return (
    <Animated.View
      style={[
        styles.target,
        {
          transform: [{ scale: scaleAnim }],
          left: position.x,
          top: position.y,
          borderColor: borderAnim,
        },
      ]}
    >
      <Pressable style={styles.hitArea} onPress={handlePress} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  target: {
    position: "absolute",
    width: TARGET_SIZE,
    height: TARGET_SIZE,
    borderRadius: TARGET_SIZE / 2,
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  hitArea: {
    width: "100%",
    height: "100%",
    borderRadius: TARGET_SIZE / 2,
    backgroundColor: "#F5F0E1",
  },
});
