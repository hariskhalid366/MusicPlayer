import React, { memo } from 'react';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';
import { useAudioStore } from '../store/useAudioStore';
import { ListMusic, Trash2 } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

const SWIPE_LEFT_THRESHOLD = -100;
const SWIPE_RIGHT_THRESHOLD = 100;

const Swipable = ({
  item,
  index,
  children,
  setIsVisible,
  setCurrentTrack,
}: any) => {
  const { deleteAudio } = useAudioStore();

  const translateX = useSharedValue(0);

  const onDelete = () => item && deleteAudio(item);
  const onQueue = () => {
    setCurrentTrack(item);
    setIsVisible(true);
  };
  const reset = () => {
    setTimeout(() => {
      translateX.value = withTiming(0);
    }, 1500);
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-5, 5])
    .onUpdate(e => {
      translateX.value = e.translationX;
    })
    .onEnd(() => {
      const endValue = translateX.value;

      if (endValue < SWIPE_LEFT_THRESHOLD) {
        translateX.value = withTiming(-200, { duration: 200 }, finished => {
          if (finished) scheduleOnRN(onDelete);
        });
      } else if (endValue > SWIPE_RIGHT_THRESHOLD) {
        translateX.value = withTiming(200, { duration: 200 }, fin => {
          if (fin) scheduleOnRN(onQueue);
        });
      } else {
        translateX.value = withTiming(0);
      }
      scheduleOnRN(reset);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const queueIconStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, 70],
      [0, 1],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      translateX.value,
      [0, 70],
      [0.6, 1],
      Extrapolation.CLAMP,
    );
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const trashIconStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-70, 0],
      [1, 0],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      translateX.value,
      [-70, 0],
      [1, 0.6],
      Extrapolation.CLAMP,
    );
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View key={item?._id ?? index}>
        <Animated.View style={[styles.leftIcon, queueIconStyle]}>
          <ListMusic color="#fff" size={22} />
        </Animated.View>

        <Animated.View style={[styles.rightIcon, trashIconStyle]}>
          <Trash2 color="#fff" size={22} />
        </Animated.View>

        <Animated.View style={animatedStyle}>{children}</Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

export default memo(Swipable);

const styles = StyleSheet.create({
  leftIcon: { position: 'absolute', top: '45%', left: '12%' },
  rightIcon: { position: 'absolute', top: '45%', right: '12%' },
});
