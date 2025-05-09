import {
    Pressable,
    View,
    StyleSheet
  } from "react-native";
import {MotiView, useAnimationState} from "moti"
import { CIRCLE_SIZE, FidgetButtonProps } from "./types";
import * as Haptics from "expo-haptics";
export const FidgetButton = ({size=CIRCLE_SIZE, color="#043bfb"}) => {
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
    const onPress = () => {
        console.log("pressed");
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    return(
        <View style={styles.container}>
            <Pressable onPress={onPress}>
                {({ pressed }) => (
                    <MotiView
                    animate={{
                        opacity: pressed ? 0.5 : 1,
                        scale: pressed ? 1.5 : 1,
                    }}
                    transition={{
                        type: 'spring',
                        damping: 3,
                        mass: 0.3,
                    }}
                    style={styles.circle}
                    />
                )}
            </Pressable>    
        </View>
    );
};

