import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const modules = [
  {
    title: "Breathing",
    icon: <Ionicons name="heart" size={28} color="#fff" />,
    route: "BreathingSelector",
  },
  {
    title: "Guitar Hero Breathing",
    icon: <Ionicons name="musical-notes" size={28} color="#fff" />,
    route: "BreathingHero",
  },
  {
    title: "Grounding Exercise",
    icon: <MaterialCommunityIcons name="tree-outline" size={28} color="#fff" />,
    route: "Grounding54321",
  },
  {
    title: "Aim Trainer",
    icon: <MaterialCommunityIcons name="bullseye" size={28} color="#fff" />,
    route: "AimTrainer",
  },
  {
    title: "Fidget Button",
    icon: <MaterialCommunityIcons name="gesture-tap" size={28} color="#fff" />,
    route: "FidgetButton",
  },
];

export const Home = ({ navigation }: any) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>🧘 Somethings</Text>
      {modules.map((mod, i) => (
        <TouchableOpacity
          key={i}
          style={styles.card}
          onPress={() => navigation.navigate(mod.route)}
        >
          <View style={styles.icon}>{mod.icon}</View>
          <Text style={styles.title}>{mod.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#111",
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  header: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 30,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#222",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  icon: {
    marginRight: 16,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
