import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Dimensions, Pressable, Text } from "react-native";
import { MotiView } from "moti";
import {
  HapticDirection,
  useHapticPattern,
} from "../../hooks/useHapticPattern";

const { width, height } = Dimensions.get("window");

// Lane configuration
const LANE_COUNT = 3;
const LANE_WIDTH = width / LANE_COUNT;
const LANE_NAMES: HapticDirection[] = ["in", "hold", "out"];

// Game configuration
const TRIGGER_LINE_Y = height - 100; // Position of the horizontal trigger line
const SCROLL_SPEED = 100; // Pixels per second
const VALIDATION_MARGIN = 30; // Pixels of margin for hit validation

// Breath pattern configuration (in seconds)
const DEFAULT_PATTERN = [
  { lane: 0, duration: 4 }, // inhale for 4 seconds
  { lane: 1, duration: 2 }, // hold for 2 seconds
  { lane: 2, duration: 4 }, // exhale for 4 seconds
  { lane: 1, duration: 2 }, // hold for 2 seconds
];

interface BreathingBar {
  id: string;
  lane: number;
  duration: number;
  startTime: number;
  hit: boolean;
  missed: boolean;
}

interface LaneProps {
  index: number;
  active: boolean;
  onPress: () => void;
}

// Individual lane component
const Lane: React.FC<LaneProps> = ({ index, active, onPress }) => {
  return (
    <Pressable
      style={[
        styles.lane,
        {
          backgroundColor: active
            ? LANE_COLORS[index]
            : LANE_COLORS_DIMMED[index],
        },
      ]}
      onPress={onPress}
    >
      <Text style={styles.laneText}>{LANE_NAMES[index].toUpperCase()}</Text>
    </Pressable>
  );
};

// Individual bar component
interface BarProps {
  bar: BreathingBar;
  currentTime: number;
}

const BreathingBarComponent: React.FC<BarProps> = ({ bar, currentTime }) => {
  const elapsed = currentTime - bar.startTime;
  const barHeight = bar.duration * SCROLL_SPEED; // Height based on duration

  // Calculate position based on elapsed time and speed
  const position = -barHeight + elapsed * SCROLL_SPEED;

  // Calculate if the bar is visible
  const isVisible = position < height && position + barHeight > 0;

  if (!isVisible) return null;

  return (
    <MotiView
      style={[
        styles.bar,
        {
          height: barHeight,
          backgroundColor: bar.hit
            ? "#6AE368" // Success color
            : bar.missed
            ? "#FF6B6B" // Missed color
            : LANE_COLORS[bar.lane],
          left: bar.lane * LANE_WIDTH,
          top: position,
        },
      ]}
      animate={{
        opacity: bar.hit || bar.missed ? 0.7 : 1,
      }}
      transition={{
        type: "timing",
        duration: 300,
      }}
    />
  );
};

// Lane colors
const LANE_COLORS = ["#4A90E2", "#9B59B6", "#E67E22"];
const LANE_COLORS_DIMMED = [
  "rgba(74, 144, 226, 0.3)",
  "rgba(155, 89, 182, 0.3)",
  "rgba(230, 126, 34, 0.3)",
];

export const BreathingHero: React.FC = () => {
  const [bars, setBars] = useState<BreathingBar[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeLanes, setActiveLanes] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [score, setScore] = useState(0);

  const haptic = useHapticPattern();
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const gameTimeRef = useRef<number>(0);

  // Generate breathing bars on component mount
  useEffect(() => {
    generateBreathingPattern();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      haptic.stop();
    };
  }, []);

  // Animation loop for the game
  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }

      const deltaTime = timestamp - lastTimeRef.current;
      gameTimeRef.current += deltaTime / 1000; // Convert to seconds

      setCurrentTime(gameTimeRef.current);

      // Update bars status (check for missed bars)
      updateBarsStatus();

      lastTimeRef.current = timestamp;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Generates a repeating breathing pattern
  const generateBreathingPattern = () => {
    let startTime = 0;
    const generatedBars: BreathingBar[] = [];

    // Generate bars for the next 60 seconds (adjust as needed)
    const patternRepetitions = 10;

    for (let i = 0; i < patternRepetitions; i++) {
      DEFAULT_PATTERN.forEach((pattern) => {
        generatedBars.push({
          id: `bar-${startTime}-${pattern.lane}`,
          lane: pattern.lane,
          duration: pattern.duration,
          startTime,
          hit: false,
          missed: false,
        });
        startTime += pattern.duration;
      });
    }

    setBars(generatedBars);
  };

  // Update bars status (check for missed bars)
  const updateBarsStatus = () => {
    setBars((currentBars) => {
      return currentBars.map((bar) => {
        if (bar.hit || bar.missed) return bar;

        // Calculate bar position
        const barStartPosition =
          -bar.duration * SCROLL_SPEED +
          (currentTime - bar.startTime) * SCROLL_SPEED;
        const barEndPosition = barStartPosition + bar.duration * SCROLL_SPEED;

        // Check if bar has passed the trigger line without being hit
        if (barStartPosition > TRIGGER_LINE_Y + VALIDATION_MARGIN) {
          return { ...bar, missed: true };
        }

        return bar;
      });
    });
  };

  // Handle lane press
  const handleLanePress = (laneIndex: number) => {
    // Find bars that are currently crossing the trigger line in this lane
    const barsInTriggerZone = bars.filter((bar) => {
      if (bar.lane !== laneIndex || bar.hit || bar.missed) return false;

      const barStartPosition =
        -bar.duration * SCROLL_SPEED +
        (currentTime - bar.startTime) * SCROLL_SPEED;
      const barEndPosition = barStartPosition + bar.duration * SCROLL_SPEED;

      // Check if bar is crossing the trigger line
      return (
        barStartPosition <= TRIGGER_LINE_Y + VALIDATION_MARGIN &&
        barEndPosition >= TRIGGER_LINE_Y - VALIDATION_MARGIN
      );
    });

    if (barsInTriggerZone.length > 0) {
      // Get the closest bar to the trigger line
      const closestBar = barsInTriggerZone.reduce((closest, bar) => {
        const barMiddlePosition =
          (-bar.duration * SCROLL_SPEED) / 2 +
          (currentTime - bar.startTime) * SCROLL_SPEED;
        const closestMiddlePosition =
          (-closest.duration * SCROLL_SPEED) / 2 +
          (currentTime - closest.startTime) * SCROLL_SPEED;

        const barDistance = Math.abs(barMiddlePosition - TRIGGER_LINE_Y);
        const closestDistance = Math.abs(
          closestMiddlePosition - TRIGGER_LINE_Y
        );

        return barDistance < closestDistance ? bar : closest;
      }, barsInTriggerZone[0]);

      // Update the bar as hit
      setBars((currentBars) =>
        currentBars.map((bar) =>
          bar.id === closestBar.id ? { ...bar, hit: true } : bar
        )
      );

      // Play haptic feedback
      const hapticDirection: HapticDirection = LANE_NAMES[laneIndex];
      haptic.play(hapticDirection, closestBar.duration * 1000);

      // Flash the lane
      setActiveLanes((prev) => {
        const newActiveLanes = [...prev];
        newActiveLanes[laneIndex] = true;
        return newActiveLanes;
      });

      // Reset lane active state after animation
      setTimeout(() => {
        setActiveLanes((prev) => {
          const newActiveLanes = [...prev];
          newActiveLanes[laneIndex] = false;
          return newActiveLanes;
        });
      }, 200);

      // Update score
      setScore((prevScore) => prevScore + 10);
    }
  };

  return (
    <View style={styles.container}>
      {/* Score display */}
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>

      {/* Game area */}
      <View style={styles.gameArea}>
        {/* Render breathing bars */}
        {bars.map((bar) => (
          <BreathingBarComponent
            key={bar.id}
            bar={bar}
            currentTime={currentTime}
          />
        ))}

        {/* Trigger line */}
        <View style={[styles.triggerLine, { top: TRIGGER_LINE_Y }]} />

        {/* Lane dividers */}
        <View style={[styles.laneDivider, { left: LANE_WIDTH }]} />
        <View style={[styles.laneDivider, { left: LANE_WIDTH * 2 }]} />
      </View>

      {/* Lane interaction area */}
      <View style={styles.laneControls}>
        {LANE_NAMES.map((_, index) => (
          <Lane
            key={index}
            index={index}
            active={activeLanes[index]}
            onPress={() => handleLanePress(index)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  scoreContainer: {
    position: "absolute",
    top: 40,
    alignSelf: "center",
    zIndex: 10,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  gameArea: {
    flex: 1,
    position: "relative",
  },
  triggerLine: {
    position: "absolute",
    width: "100%",
    height: 4,
    backgroundColor: "white",
    zIndex: 5,
  },
  laneDivider: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    zIndex: 3,
  },
  laneControls: {
    flexDirection: "row",
    height: 80,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  lane: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 2,
    borderTopColor: "white",
  },
  laneText: {
    color: "white",
    fontWeight: "bold",
  },
  bar: {
    position: "absolute",
    width: LANE_WIDTH - 10, // Slightly smaller than lane width for visual margin
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "white",
    marginLeft: 5, // Center in the lane
  },
});
