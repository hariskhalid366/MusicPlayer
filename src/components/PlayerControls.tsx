import React, { memo, useState, useEffect } from 'react'; // Added useState, useEffect
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
    padding: 8,
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

export const Forward = ({ size, color }: IconProps) => (
  <ControlButton
    onPress={async () => {
      await TrackPlayer.skipToNext().then(async () => await TrackPlayer.play());
    }}
    IconComponent={Icon.StepForward}
    size={size}
    color={color}
  />
);

export const Backward = ({ size, color }: IconProps) => (
  <ControlButton
    onPress={async () => {
      await TrackPlayer.skipToPrevious().then(
        async () => await TrackPlayer.play(),
      );
    }}
    IconComponent={Icon.StepBack}
    size={size}
    color={color}
  />
);

export const RepeatButton = ({ size, color }: IconProps) => {
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(RepeatMode.Off);

  useEffect(() => {
    TrackPlayer.getRepeatMode().then(setRepeatMode);
  }, []);

  const toggleRepeatMode = () => {
    let newMode: RepeatMode;
    if (repeatMode === RepeatMode.Off) {
      newMode = RepeatMode.Track;
    } else if (repeatMode === RepeatMode.Track) {
      newMode = RepeatMode.Queue;
    } else {
      newMode = RepeatMode.Off;
    }
    TrackPlayer.setRepeatMode(newMode);
    setRepeatMode(newMode);
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case RepeatMode.Track:
        return Icon.Repeat1;
      case RepeatMode.Queue:
        return Icon.Repeat;
      default:
        return Icon.Repeat;
    }
  };

  return (
    <ControlButton
      IconComponent={getRepeatIcon()}
      onPress={toggleRepeatMode}
      color={repeatMode === RepeatMode.Off ? '#ffffff99' : '#fff'}
      size={size}
    />
  );
};

const PlayPause = ({ size, color }: IconProps) => {
  const isPlaying = useIsPlaying();
  const togglePlayPause = () => {
    isPlaying.playing ? TrackPlayer.pause() : TrackPlayer.play();
  };

  return (
    <ControlButton
      onPress={togglePlayPause}
      IconComponent={isPlaying.playing ? Icon.PauseIcon : Icon.PlayIcon}
      size={size}
      color={color}
    />
  );
};

export default PlayPause;

export const MusicSlider = ({ style }: SliderStyleProps) => {
  const { position, duration } = useProgress();

  return (
    <Slider
      value={position}
      thumbTintColor={'transparent'}
      style={style}
      minimumValue={0}
      maximumValue={duration}
      minimumTrackTintColor="#FFFFFF"
      maximumTrackTintColor="#ffffff99"
      onSlidingComplete={TrackPlayer.seekTo}
    />
  );
};
