import React, { memo } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useAudioStore } from '../store/useAudioStore';

const SWIPE_LEFT_THRESHOLD = -150;
const SWIPE_RIGHT_THRESHOLD = 150;

const Swipable = ({
  item,
  index,
  children,
  setIsVisible,
  setCurrentTrack,
}: any) => {
  const { deleteAudio } = useAudioStore();

  const translateX = useSharedValue(0);
  const height = useSharedValue(0);

  const handleLeftSwipe = () => {
    if (!item) return;
    deleteAudio(item);
  };

  const handleRightSwipe = () => {
    setCurrentTrack(item);
    setIsVisible(true);
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .onUpdate(e => {
      translateX.value = e.translationX;
    })
    .onEnd(() => {
      if (translateX.value < SWIPE_LEFT_THRESHOLD) {
        translateX.value = withTiming(0, { duration: 200 }, finished => {
          if (finished) {
            scheduleOnRN(handleLeftSwipe);
          }
        });
      } else if (translateX.value > SWIPE_RIGHT_THRESHOLD) {
        translateX.value = withTiming(150, { duration: 200 }, fin => {
          if (fin) {
            scheduleOnRN(handleRightSwipe);
          }
        });
      } else {
        translateX.value = withTiming(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    height: height.value === 0 ? 'auto' : height.value,
  }));

  return (
    <GestureDetector gesture={pan} key={item?._id ?? index}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </GestureDetector>
  );
};

export default memo(Swipable);
