import React, {memo, useState, useEffect} from 'react'; // Added useState, useEffect
import {
  StyleProp,
  TouchableOpacity,
  ViewStyle,
  StyleSheet,
  Image,
} from 'react-native'; // Added Image
import * as Icon from 'react-native-heroicons/outline';
import TrackPlayer, {
  useIsPlaying,
  useProgress,
  RepeatMode, // Added RepeatMode
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

const ControlButton = memo(({onPress, IconComponent, size, color}: any) => (
  <TouchableOpacity style={styles.touchable} onPress={onPress}>
    <IconComponent size={size} color={color} strokeWidth={2} />
  </TouchableOpacity>
));

export const Forward = ({size, color}: IconProps) => (
  <ControlButton
    onPress={async () => {
      await TrackPlayer.skipToNext();
      await TrackPlayer.play();
    }}
    IconComponent={Icon.ForwardIcon}
    size={size}
    color={color}
  />
);

export const Backward = ({size, color}: IconProps) => (
  <ControlButton
    onPress={async () => {
      await TrackPlayer.skipToPrevious();
      await TrackPlayer.play();
    }}
    IconComponent={Icon.BackwardIcon}
    size={size}
    color={color}
  />
);

export const RepeatButton = ({size, color}: IconProps) => {
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(RepeatMode.Off);

  useEffect(() => {
    // Fetch initial repeat mode
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
        return require('../../assets/repeat-once.png'); // Use repeat-once icon
      case RepeatMode.Queue:
        return require('../../assets/repeat.png'); // Use repeat icon (for queue)
      default:
        return require('../../assets/repeat.png'); // Use repeat icon (for off, maybe dimmed)
    }
  };

  return (
    <TouchableOpacity style={styles.touchable} onPress={toggleRepeatMode}>
      <Image
        source={getRepeatIcon()}
        style={{
          width: size,
          height: size,
          tintColor: repeatMode !== RepeatMode.Off ? color : '#ffffff80', // Dim if off
        }}
      />
    </TouchableOpacity>
  );
};

const PlayPause = ({size, color}: IconProps) => {
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

export const MusicSlider = ({style}: SliderStyleProps) => {
  const {position, duration} = useProgress();

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
