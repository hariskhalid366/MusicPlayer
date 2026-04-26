import React, { memo, useMemo, useCallback } from 'react';
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Icon from 'lucide-react-native';
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
  RepeatButton,
} from '../components/PlayerControls';
import { useMMKVObject } from 'react-native-mmkv';
import { Storage } from '../store/storage';
import Animated from 'react-native-reanimated';

const { width } = Dimensions.get('screen');
const size = width - 60;

interface MusicFile extends Track {
  cover?: string;
}

/**
 * Converts total seconds to MM:SS string.
 * Extracted outside the component so it's a stable pure function —
 * no need for useCallback.
 */
const secondsToTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
    2,
    '0',
  )}`;
};

/**
 * Isolated component that subscribes to useProgress().
 * useProgress fires every ~1 second — isolating here means the parent
 * FloatingScreen does NOT re-render on every progress tick.
 */
const TimeDisplay = memo(() => {
  const { position, duration } = useProgress();
  return (
    <View>
      <MusicSlider style={styles.musicSlider} />
      <View style={styles.timeContainer}>
        <Text style={styles.counterText}>{secondsToTime(position)}</Text>
        <Text style={styles.counterText}>{secondsToTime(duration)}</Text>
      </View>
    </View>
  );
});

const FloatingScreen = () => {
  const [like, setLike] = useMMKVObject<MusicFile[]>('liked', Storage);
  const { playing } = useIsPlaying();
  const track = useActiveTrack();

  const likedState = useMemo(() => {
    if (!track || !like) return false;
    return like.some(likedItem => likedItem.url === track.url);
  }, [like, track]);

  const ToggleLike = useCallback(
    (currentTrack: MusicFile) => {
      setLike(prev => {
        if (!prev) return [currentTrack];
        const idx = prev.findIndex(l => l.url === currentTrack.url);
        return idx !== -1
          ? prev.filter((_, i) => i !== idx)
          : [...prev, currentTrack];
      });
    },
    [setLike],
  );

  if (!track) return null;

  return (
    <View style={styles.container}>
      <View style={styles.secContainer}>
        <Animated.Image
          sharedTransitionTag="tile"
          style={styles.trackImage}
          source={
            track?.cover
              ? { uri: track?.cover }
              : require('../../assets/tile.jpeg')
          }
          resizeMode="cover"
        />
        <View style={styles.icon}>
          {playing ? (
            <Icon.PauseIcon size={30} color={'#fff'} />
          ) : (
            <Icon.PlayIcon size={30} color={'#fff'} />
          )}
        </View>
      </View>
      <View style={styles.trackInfoContainer}>
        <View style={styles.trackTextContainer}>
          <Text style={styles.titleText}>{track?.title}</Text>
          <Text style={styles.titleText}>{track?.artist}</Text>
        </View>
        <TouchableOpacity
          onPress={() => ToggleLike(track)}
          style={styles.likeButton}
        >
          {likedState ? (
            <Icon.HeartIcon size={23} color={'#e60028'} fill={'#e60028'} />
          ) : (
            <Icon.HeartIcon size={23} color={'#fff'} />
          )}
        </TouchableOpacity>
        <RepeatButton size={20} color="#fff" />
      </View>

      {/* TimeDisplay is isolated — only THIS sub-tree re-renders per tick */}
      <TimeDisplay />
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
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
    experimental_backgroundImage:
      'linear-gradient(180deg, rgba(115,0,0,0.2) 0%, rgba(110,0,0,0.2) 50%, rgba(221,0,0,0.2) 100%)',
  },
  secContainer: { alignItems: 'center', justifyContent: 'center' },
  trackImage: {
    width: size,
    height: size,
    borderRadius: 30,
    backgroundColor: '#ffffff33',
    boxShadow: '0px 0px 50px rgba(255, 0, 0, 0.23)',
  },
  icon: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: '#00000088',
    padding: 20,
  },
  loaderKit: {
    width: 40,
    height: 40,
  },
  trackInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
  },
  trackTextContainer: {
    flex: 1,
  },
  likeButton: {
    backgroundColor: '#ffffff33',
    padding: 8,
    borderRadius: 50,
  },
  musicSlider: {
    width: size,
    height: 50,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  counterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  titleText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
