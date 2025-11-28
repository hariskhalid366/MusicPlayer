import React, { FC, useEffect } from 'react'; // Removed useState, useEffect
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
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

const FloatingTrack: FC<any> = ({ floatName = 'index' }) => {
  const navigation: any = useNavigation();
  const track = useActiveTrack();

  const bottomValue = useSharedValue(0);
  const scaleValue = useSharedValue(0);
  const Touchable = Animated.createAnimatedComponent(TouchableOpacity);

  const animatedStyles = useAnimatedStyle(() => {
    const bottom = interpolate(
      bottomValue.value,
      [0, 1, 2],
      [60, 5, -100],
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
  }, [floatName]);

  if (!track) return null;

  return (
    <Touchable
      onPress={() => navigation.navigate('screen')}
      activeOpacity={0.8}
      style={[styles.container, animatedStyles]}
    >
      <View style={styles.innerContainer}>
        <FastImage
          source={
            track?.cover
              ? { uri: track.cover }
              : require('../../assets/tile.jpeg')
          }
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
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
    </Touchable>
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
    fontSize: 15, // Slightly smaller to fit controls
  },
  slider: {
    width: 180, // Adjusted width to make space for repeat button
    height: 25, // Increased height slightly
    marginLeft: -12,
  },
  // Removed controlButton, icon, iconDisabled styles as they are handled within RepeatButton
});

export default FloatingTrack;
