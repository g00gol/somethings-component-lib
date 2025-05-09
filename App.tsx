import React from "react";
import 'react-native-reanimated'
import 'react-native-gesture-handler'
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "./src/components/Home";
import { BreathingSelector } from "./src/components/BreathingExercises";
import { Grounding54321 } from "./src/components/Grounding";
import { AimTrainer } from "./src/components/AimTrainer/AimTrainer";
import { FidgetButton } from "./src/components/FidgetButton/FidgetButton";
import { BreathingHero } from "./src/components/BreathingExercises/BreathingHero";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true, // or true for back buttons
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="BreathingSelector" component={BreathingSelector} />
        <Stack.Screen name="BreathingHero" component={BreathingHero} />
        <Stack.Screen name="Grounding54321" component={Grounding54321} />
        <Stack.Screen name="AimTrainer" component={AimTrainer} />
        <Stack.Screen name="FidgetButton" component={FidgetButton} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
