// import "../../global.css";

import { TouchableOpacity, Text, StyleSheet } from "react-native";

export type MyButtonProps = {
  onPress: () => void;
  text: string;
};

export const MyButton = ({ onPress, text }: MyButtonProps) => {
  return <Text className="bg-blue-500">Hello Nativewind world!</Text>;
};
