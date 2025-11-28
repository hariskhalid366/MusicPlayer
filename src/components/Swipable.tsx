import React, { memo } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const Swipable = (props: any) => {
  const translateX = useSharedValue(0);
  const scaleX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onUpdate(e => {
      translateX.value = e.translationX;
    })
    .onEnd(() => {
      translateX.value = withTiming(0, { duration: 100 });
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    };
  });

  const height = useAnimatedStyle(() => {
    return {
      height: scaleX.value,
    };
  });

  const composeGesture = Gesture.Simultaneous(panGesture, Gesture.Native());

  return (
    <GestureDetector gesture={composeGesture}>
      <Animated.View style={[animatedStyle]}>{props.children}</Animated.View>
    </GestureDetector>
  );
};

export default memo(Swipable);
