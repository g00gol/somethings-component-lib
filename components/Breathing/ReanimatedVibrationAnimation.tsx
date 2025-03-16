import React from 'react';
import {StyleSheet,View} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withTiming, 
    withRepeat, 
    withSequence, 
    Easing 
  } from "react-native-reanimated";

const ReanimatedVibrationAnimation = () =>{
    const translateY = useSharedValue(0);

    React.useEffect(() => {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-100, { duration: 500, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 500, easing: Easing.inOut(Easing.quad) })
        ),
        -1, // Infinite loop
        true // Reverse the animation each cycle
      );
    }, []);
  
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
    }));
  
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Animated.View
          style={[{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: "blue",
          }, animatedStyle]}
        />
      </View>
    );
  };

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
      }
});

export default ReanimatedVibrationAnimation;