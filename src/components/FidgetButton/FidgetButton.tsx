import {
    Pressable,
    View,
    StyleSheet
  } from "react-native";
import {MotiView} from "moti"
import { CIRCLE_SIZE, FidgetButtonProps } from "./types";
import * as Haptics from "expo-haptics";
import { useState } from "react";
export const FidgetButton = ({size=CIRCLE_SIZE, color="#eb4034"}) => {
    const [isPressed, setIsPressed] = useState(false);
    const styles = StyleSheet.create({
        container: {
            justifyContent: "center",
            alignItems: "center",
            height:"100%",
            backgroundColor: "#111",
        },
        circle: {
            width: size,
            height: size,
            borderRadius: size/2,
            backgroundColor: color,
            overflow: "hidden",
          }
    });

    const handlePressIn = () => {
        setIsPressed(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    };

    const handlePressOut = () => {
        setIsPressed(false);
    };
    return(
        <View style={styles.container}>
            <Pressable 
                // onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                <MotiView
                    animate={{
                        opacity: isPressed ? 0.5 : 1,
                        scale: isPressed ? 1.5 : 1,
                    }}
                    transition={{
                        type: 'spring',
                        damping: 3,
                        mass: 0.3,
                    }}
                    style={styles.circle}
                    />
            </Pressable>    
        </View>
    );
};

