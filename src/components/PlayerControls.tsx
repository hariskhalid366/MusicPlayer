import React, { memo, useCallback, useState } from 'react';
import {
  StyleProp,
  TouchableOpacity,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import * as Icon from 'lucide-react-native';
import TrackPlayer, {
  useIsPlaying,
  useProgress,
  RepeatMode,
} from 'react-native-track-player';
import Slider from '@react-native-community/slider';

interface IconProps {
  size: number;
  color: string;
}

interface SliderStyleProps {
  style?: StyleProp<ViewStyle>;
}

const styles = StyleSheet.create({
  touchable: {
    padding: 10,
    backgroundColor: '#ffffff33',
    margin: 4,
    borderRadius: 50,
  },
});

const ControlButton = memo(({ onPress, IconComponent, size, color }: any) => (
  <TouchableOpacity style={styles.touchable} onPress={onPress}>
    <IconComponent size={size} color={color} strokeWidth={2} />
  </TouchableOpacity>
));

export const Forward = memo(({ size, color }: IconProps) => (
  <ControlButton
    onPress={async () => {
      await TrackPlayer.skipToNext();
      await TrackPlayer.play();
    }}
    IconComponent={Icon.StepForward}
    size={size}
    color={color}
  />
));

export const Backward = memo(({ size, color }: IconProps) => (
  <ControlButton
    onPress={async () => {
      await TrackPlayer.skipToPrevious();
      await TrackPlayer.play();
    }}
    IconComponent={Icon.StepBack}
    size={size}
    color={color}
  />
));

export const RepeatButton = memo(({ size, color }: IconProps) => {
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(RepeatMode.Off);

  // Fetch initial mode once on mount
  React.useEffect(() => {
    TrackPlayer.getRepeatMode().then(setRepeatMode);
  }, []);

  const toggleRepeatMode = useCallback(() => {
    setRepeatMode(prev => {
      const newMode =
        prev === RepeatMode.Off
          ? RepeatMode.Track
          : prev === RepeatMode.Track
          ? RepeatMode.Queue
          : RepeatMode.Off;
      TrackPlayer.setRepeatMode(newMode);
      return newMode;
    });
  }, []);

  // Compute once — stable reference per render avoids ControlButton memo invalidation
  const RepeatIcon =
    repeatMode === RepeatMode.Track ? Icon.Repeat1 : Icon.Repeat;

  return (
    <ControlButton
      IconComponent={RepeatIcon}
      onPress={toggleRepeatMode}
      color={repeatMode === RepeatMode.Off ? '#ffffff99' : '#fff'}
      size={size}
    />
  );
});

export const PlayPause = memo(({ size, color }: IconProps) => {
  const { playing } = useIsPlaying();
  const [optimistic, setOptimistic] = useState<boolean | undefined>(undefined);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear any pending timer on unmount to avoid setState on dead component
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const displayPlaying = optimistic ?? playing;

  const togglePlayPause = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const next = !displayPlaying;
    setOptimistic(next);
    timerRef.current = setTimeout(() => {
      setOptimistic(undefined);
      timerRef.current = null;
    }, 300);
    next ? TrackPlayer.play() : TrackPlayer.pause();
  }, [displayPlaying]);

  return (
    <ControlButton
      onPress={togglePlayPause}
      IconComponent={displayPlaying ? Icon.PauseIcon : Icon.PlayIcon}
      size={size}
      color={color}
    />
  );
});

export default PlayPause;

export const MusicSlider = memo(({ style }: SliderStyleProps) => {
  const { position, duration } = useProgress();

  return (
    <Slider
      value={position}
      thumbTintColor={'transparent'}
      style={style}
      minimumValue={0}
      maximumValue={duration || 1}
      minimumTrackTintColor="#FFFFFF"
      maximumTrackTintColor="#ffffff99"
      onSlidingComplete={TrackPlayer.seekTo}
    />
  );
});
