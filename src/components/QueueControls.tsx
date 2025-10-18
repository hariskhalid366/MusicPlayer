import {Text, TouchableOpacity} from 'react-native';
import React from 'react';
import * as Icon from 'react-native-heroicons/solid';
import TrackPlayer from 'react-native-track-player';

const text = 'text-sm mx-1 font-semibold text-white tracking-wide';
const controls =
  'flex-row justify-center items-center bg-red-500 w-32  m-3 py-2 rounded-xl';

export const PlayAll = ({track}: any) => {
  return (
    <TouchableOpacity
      className={controls}
      onPress={() => {
        TrackPlayer.setQueue(track);
        TrackPlayer.play();
      }}>
      <Icon.PlayIcon size={23} color={'#fff'} />
      <Text className={text}>Play</Text>
    </TouchableOpacity>
  );
};

export const ShuffleQueue = ({track}: any) => {
  return (
    <TouchableOpacity className={controls}>
      <Icon.ArrowPathRoundedSquareIcon size={23} color={'#fff'} />
      <Text className={text}>Shuffle</Text>
    </TouchableOpacity>
  );
};
