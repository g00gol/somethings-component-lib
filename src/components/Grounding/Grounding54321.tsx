import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import * as Haptics from "expo-haptics";

const prompts = [
  { label: "👁️ 5 things you can see", count: 5 },
  { label: "✋ 4 things you can touch", count: 4 },
  { label: "👂 3 things you can hear", count: 3 },
  { label: "👃 2 things you can smell", count: 2 },
  { label: "👅 1 thing you can taste", count: 1 },
];

export const Grounding54321 = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [entries, setEntries] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [completed, setCompleted] = useState(false);
  const current = prompts[stepIndex];

  const handleSubmit = () => {
    if (!input.trim()) return;
    const next = [...entries, input.trim()];
    setEntries(next);
    setInput("");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (next.length === current.count) {
      if (stepIndex < prompts.length - 1) {
        setStepIndex(stepIndex + 1);
        setEntries([]);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setCompleted(true);
        setTimeout(() => {
          setCompleted(false);
          setStepIndex(0);
          setEntries([]);
          setInput("");
        }, 4000);
      }
    }
  };

  if (completed) {
    return (
      <View style={styles.container}>
        <Animated.View style={styles.completeCard}>
          <Text style={styles.completeText}>🎉 You're grounded.</Text>
          <Text style={[styles.completeText, { fontSize: 16, marginTop: 8 }]}>
            Take a breath and continue when you're ready.
          </Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.label}>{current.label}</Text>
        <View style={styles.entryList}>
          {entries.map((item, i) => (
            <Text key={i} style={styles.entry}>
              • {item}
            </Text>
          ))}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Type something..."
          placeholderTextColor="#aaa"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Enter</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  completeCard: {
    backgroundColor: "#222",
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  completeText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#222",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  label: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 12,
    fontWeight: "600",
  },
  entryList: {
    marginBottom: 10,
  },
  entry: {
    color: "#ccc",
    fontSize: 16,
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#444",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
