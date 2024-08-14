import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import React from 'react';
import * as Icon from 'react-native-heroicons/outline';
import * as IconSolid from 'react-native-heroicons/solid';
import {
  Track,
  useActiveTrack,
  useIsPlaying,
  useProgress,
} from 'react-native-track-player';
import PlayPause, {
  Backword,
  Forward,
  MusicSlider,
} from '../components/PlayerControls';
import LoaderKit from 'react-native-loader-kit';
import {useMMKVObject} from 'react-native-mmkv';
import {Storage} from '../constants/Store';

const {width} = Dimensions.get('screen');
const size = width - 50;
interface MusicFile extends Track {
  cover?: string;
}

const FloatingScreen = () => {
  const [like, setLike] = useMMKVObject<MusicFile[]>('liked', Storage);
  const {playing} = useIsPlaying();
  const track = useActiveTrack();
  const {position, duration} = useProgress();

  const convertSecondsToTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')
      .split('.')[0]
      .trim()}`;
  };

  const isLiked = (itemUrl: string) =>
    like?.some(likedItem => likedItem.url === itemUrl);

  if (!track) return null;

  const ToggleLike = (track: MusicFile) => {
    setLike(prevLikedItems => {
      if (!prevLikedItems) {
        return [track];
      }
      if (prevLikedItems.some(likedItem => likedItem.url === track.url)) {
        return prevLikedItems.filter(likedItem => likedItem.url !== track.url);
      } else {
        return [...prevLikedItems, track];
      }
    });
  };

  return (
    <View className=" flex-1 items-center mx-6 mt-10 ">
      <Image
        style={{
          width: size,
          height: size,
          borderRadius: 30,
          marginBottom: 60,
        }}
        source={
          track?.cover ? {uri: track?.cover} : require('../../assets/tile.jpeg')
        }
      />
      {playing ? (
        <View style={styles.icon}>
          <LoaderKit
            name="LineScaleParty"
            color="#fff"
            style={{
              width: 40,
              height: 40,
            }}
          />
        </View>
      ) : (
        <View style={styles.icon}>
          <Icon.PlayIcon size={40} color={'#fff'} />
        </View>
      )}
      <View className="flex-row w-full items-center">
        <View className="flex-1 ">
          <Text>{track?.title}</Text>
          <Text>{track?.artist}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            ToggleLike(track);
          }}
          className="bg-[#ffffff33] p-2 rounded-full">
          {isLiked(track.url) ? (
            <IconSolid.HeartIcon size={23} color={'red'} />
          ) : (
            <Icon.HeartIcon size={23} color={'#fff'} />
          )}
        </TouchableOpacity>
      </View>
      <MusicSlider style={{width: size, height: 50, marginTop: 20}} />
      <View className="-mt-4 flex-row justify-between w-11/12">
        <Text>{convertSecondsToTime(position)}</Text>
        <Text>{convertSecondsToTime(duration)}</Text>
      </View>
      <View className="flex-row mt-8 justify-between w-4/5">
        <Backword size={30} color={'#fff'} />
        <PlayPause size={30} color={'#fff'} />
        <Forward size={30} color={'#fff'} />
      </View>
    </View>
  );
};

export default FloatingScreen;

const styles = StyleSheet.create({
  icon: {
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    borderRadius: 15,
    backgroundColor: '#00000033',
    width: size,
    height: size,
  },
});
