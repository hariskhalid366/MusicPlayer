import React, {memo, useMemo, useCallback} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Icon from 'react-native-heroicons/outline';
import * as IconSolid from 'react-native-heroicons/solid';
import {
  Track,
  useActiveTrack,
  useIsPlaying,
  useProgress,
} from 'react-native-track-player';
import PlayPause, {
  Backward,
  Forward,
  MusicSlider,
} from '../components/PlayerControls';
import LoaderKit from 'react-native-loader-kit';
import {useMMKVObject} from 'react-native-mmkv';
import {Storage} from '../constants/Store';

const {width} = Dimensions.get('screen');
const size = width - 60;

interface MusicFile extends Track {
  cover?: string;
}

const FloatingScreen = () => {
  const [like, setLike] = useMMKVObject<MusicFile[]>('liked', Storage);
  const {playing} = useIsPlaying();
  const track = useActiveTrack();
  const {position, duration} = useProgress();

  const convertSecondsToTime = useCallback((totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')
      .split('.')[0]
      .trim()}`;
  }, []);

  const isLiked = useMemo(
    () => (itemUrl: string) =>
      like?.some(likedItem => likedItem.url === itemUrl),
    [like],
  );

  const ToggleLike = useCallback(
    (track: MusicFile) => {
      setLike(prevLikedItems => {
        if (!prevLikedItems) {
          return [track];
        }
        if (prevLikedItems.some(likedItem => likedItem.url === track.url)) {
          return prevLikedItems.filter(
            likedItem => likedItem.url !== track.url,
          );
        } else {
          return [...prevLikedItems, track];
        }
      });
    },
    [setLike],
  );

  if (!track) return null;

  return (
    <View style={styles.container}>
      <Image
        style={styles.trackImage}
        source={
          track?.cover ? {uri: track?.cover} : require('../../assets/tile.jpeg')
        }
      />
      {playing ? (
        <View style={styles.icon}>
          <LoaderKit
            name="LineScaleParty"
            color="#fff"
            style={styles.loaderKit}
          />
        </View>
      ) : (
        <View style={styles.icon}>
          <Icon.PlayIcon size={40} color={'#fff'} />
        </View>
      )}
      <View style={styles.trackInfoContainer}>
        <View style={styles.trackTextContainer}>
          <Text>{track?.title}</Text>
          <Text>{track?.artist}</Text>
        </View>
        <TouchableOpacity
          onPress={() => ToggleLike(track)}
          style={styles.likeButton}>
          {isLiked(track.url) ? (
            <IconSolid.HeartIcon size={23} color={'red'} />
          ) : (
            <Icon.HeartIcon size={23} color={'#fff'} />
          )}
        </TouchableOpacity>
      </View>
      <MusicSlider style={styles.musicSlider} />
      <View style={styles.timeContainer}>
        <Text>{convertSecondsToTime(position)}</Text>
        <Text>{convertSecondsToTime(duration)}</Text>
      </View>
      <View style={styles.controlsContainer}>
        <Backward size={30} color={'#fff'} />
        <PlayPause size={30} color={'#fff'} />
        <Forward size={30} color={'#fff'} />
      </View>
    </View>
  );
};

export default memo(FloatingScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 6,
    marginTop: 30,
  },
  trackImage: {
    width: size,
    height: size,
    borderRadius: 30,
    marginBottom: 60,
  },
  icon: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#00000033',
    width: size,
    height: size,
  },
  loaderKit: {
    width: 40,
    height: 40,
  },
  trackInfoContainer: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
  },
  trackTextContainer: {
    flex: 1,
  },
  likeButton: {
    backgroundColor: '#ffffff33',
    padding: 5,
    borderRadius: 50,
  },
  musicSlider: {
    width: size,
    height: 50,
    marginTop: 20,
  },
  timeContainer: {
    marginTop: -4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  controlsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    width: '80%',
  },
});
