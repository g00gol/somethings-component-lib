import React, { useState, useEffect, useRef } from "react";
import { View, Animated, Easing, TouchableOpacity, Text } from "react-native";
import * as Haptics from "expo-haptics";

export const BreathingCircle = () => {
  const [isActive, setIsActive] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const hapticIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const startHaptics = () => {
    if (hapticIntervalRef.current) return;
    hapticIntervalRef.current = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 50);
  };

  const stopHaptics = () => {
    if (hapticIntervalRef.current) {
      clearInterval(hapticIntervalRef.current);
      hapticIntervalRef.current = null;
    }
  };

  const startAnimation = () => {
    animationRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.3,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    animationRef.current.start();
  };

  const stopAnimation = () => {
    animationRef.current?.stop();
    scale.setValue(1);
  };

  const toggleBreathing = () => {
    setIsActive((prev) => !prev);
  };

  useEffect(() => {
    if (isActive) {
      startAnimation();
      startHaptics();
    } else {
      stopAnimation();
      stopHaptics();
    }

    return () => {
      stopAnimation();
      stopHaptics();
    };
  }, [isActive]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Animated.View
        style={{
          width: 100,
          height: 100,
          backgroundColor: isActive ? "skyblue" : "gray",
          borderRadius: 50,
          transform: [{ scale }],
          marginBottom: 20,
        }}
      />
      <TouchableOpacity
        onPress={toggleBreathing}
        style={{
          paddingVertical: 10,
          paddingHorizontal: 20,
          backgroundColor: "#333",
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>
          {isActive ? "Stop" : "Start"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
