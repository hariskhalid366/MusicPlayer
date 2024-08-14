import {StyleProp, TouchableOpacity, ViewStyle} from 'react-native';
import React from 'react';
import * as Icon from 'react-native-heroicons/outline';
import TrackPlayer, {
  useIsPlaying,
  useProgress,
} from 'react-native-track-player';
import Slider from '@react-native-community/slider';

interface IconProps {
  size: number;
  color: string;
}

interface SliderStyleProps {
  style?: StyleProp<ViewStyle>;
}

const style = 'p-2 bg-[#ffffff21] m-1 rounded-full';

export const Forward = ({size, color}: IconProps) => {
  return (
    <TouchableOpacity
      className={style}
      onPress={() => {
        TrackPlayer.skipToNext();
      }}>
      <Icon.ForwardIcon size={size} color={color} strokeWidth={2} />
    </TouchableOpacity>
  );
};

export const Backword = ({size, color}: IconProps) => {
  return (
    <TouchableOpacity
      className={style}
      onPress={() => {
        TrackPlayer.skipToPrevious();
      }}>
      <Icon.BackwardIcon size={size} color={color} strokeWidth={2} />
    </TouchableOpacity>
  );
};

const PlayPause = ({size, color}: IconProps) => {
  const play = useIsPlaying();
  return (
    <TouchableOpacity
      className={style}
      onPress={() => {
        if (play.playing === !true) {
          TrackPlayer.play();
        } else {
          TrackPlayer.pause();
        }
      }}>
      {play.playing === true ? (
        <Icon.PauseIcon size={size} color={color} strokeWidth={2} />
      ) : (
        <Icon.PlayIcon size={size} color={color} strokeWidth={2} />
      )}
    </TouchableOpacity>
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
      maximumTrackTintColor="#ffffff77"
      onValueChange={async value => {
        await TrackPlayer.seekTo(value);
      }}
    />
  );
};
