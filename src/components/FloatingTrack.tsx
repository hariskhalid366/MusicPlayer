import React, { FC, useEffect, memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useActiveTrack } from 'react-native-track-player';
import PlayPause, {
  Forward,
  MusicSlider,
  RepeatButton,
} from './PlayerControls';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  Easing,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Created at module scope — was re-created on every render causing
// the animation system to receive a new component class each cycle.
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const FloatingTrack: FC<any> = ({ floatName = 'index' }) => {
  const navigation: any = useNavigation();
  const { bottom: BOTTOM } = useSafeAreaInsets();
  const track = useActiveTrack();

  const bottomValue = useSharedValue(0);
  const scaleValue = useSharedValue(0);

  const bottomOffset = BOTTOM + 60;
  const initialBottom = BOTTOM - 100;

  const animatedStyles = useAnimatedStyle(() => {
    const bottom = interpolate(
      bottomValue.value,
      [0, 1, 2],
      [bottomOffset, 5, initialBottom],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      scaleValue.value,
      [0, 1],
      [1, 0.6],
      Extrapolation.CLAMP,
    );
    return {
      bottom,
      transform: [{ scale }],
    };
  }, []);

  useEffect(() => {
    if (floatName !== 'index') {
      bottomValue.value = withTiming(1, { duration: 100, easing: Easing.exp });
      if (floatName === 'screen') {
        bottomValue.value = withTiming(2, {
          duration: 100,
          easing: Easing.exp,
        });
        scaleValue.value = withSpring(1, { duration: 200 });
      }
    } else {
      bottomValue.value = withTiming(0, {
        duration: 100,
        easing: Easing.out(Easing.ease),
      });
      scaleValue.value = withSpring(0, { duration: 200 });
    }
  }, [floatName]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!track) return null;

  return (
    <AnimatedTouchable
      onPress={() => navigation.navigate('screen')}
      activeOpacity={0.8}
      style={[styles.container, animatedStyles]}
    >
      <View style={styles.innerContainer}>
        <Animated.Image
          sharedTransitionTag="tile"
          source={
            track?.cover
              ? { uri: track.cover }
              : require('../../assets/tile.jpeg')
          }
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.trackInfo}>
          <Text
            style={styles.trackTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {track.title?.slice(0, 29)}
          </Text>
          <MusicSlider style={styles.slider} />
        </View>
        <RepeatButton size={20} color="#fff" />
        <PlayPause size={20} color="#fff" />
        <Forward size={20} color="#fff" />
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '92%',
    position: 'absolute',
    alignItems: 'center',
    alignSelf: 'center',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 1,
    height: 66,
    marginHorizontal: 3,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    borderWidth: 1.2,
    borderColor: '#ffffff22',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#00000099',
  },
  trackInfo: {
    flex: 1,
    marginLeft: 8,
  },
  trackTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  slider: {
    width: 180,
    height: 25,
    marginLeft: -12,
  },
});

export default memo(FloatingTrack);
