import React, {memo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';
import * as Icon from 'react-native-heroicons/outline';
import * as IconSolid from 'react-native-heroicons/solid';
import TrackPlayer, {
  useActiveTrack,
  useIsPlaying,
} from 'react-native-track-player';
import LoaderKit from 'react-native-loader-kit';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {useMMKVObject} from 'react-native-mmkv';
import {Storage} from '../constants/Store';
import {useGlobalState} from '../constants/PlaylistContextState';

export type MusicFile = {
  album: string;
  artist: string;
  cover: string;
  duration: number;
  title: string;
  url: string;
};

interface ListItemProps {
  item: MusicFile;
  index: number;
  handleTrack: (track: MusicFile) => void;
  scroll: boolean;
}

export const convertMillisecondsToTime = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const ListView = ({item, scroll, index, handleTrack}: ListItemProps) => {
  const activeTrack = useActiveTrack();
  const isActive = activeTrack?.url === item?.url;
  const {playing} = useIsPlaying();
  const {setIsVisible, setCurrentTrack} = useGlobalState();

  const onPress = () => {
    if (isActive) {
      playing ? TrackPlayer.pause() : TrackPlayer.play();
    } else {
      handleTrack(item);
    }
  };

  const [like, setLike] = useMMKVObject<MusicFile[]>('liked', Storage);

  const isLiked = (itemUrl: string) =>
    like?.some(likedItem => likedItem.url === itemUrl);

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

  const dropDown = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    const height = interpolate(
      dropDown.value,
      [0, 1],
      [0, 40], // Increased height for better visibility
      Extrapolation.CLAMP,
    );

    return {
      height,
      opacity: dropDown.value, // Adjust opacity for smoother transition
    };
  });

  const toggleDropdown = () => {
    if (dropDown.value === 0) {
      dropDown.value = withSpring(1, {damping: 20});

      setTimeout(() => {
        dropDown.value = withSpring(0, {damping: 20});
      }, 5000);
    } else {
      dropDown.value = withSpring(0, {damping: 20});
    }
  };

  return (
    <TouchableHighlight
      key={index}
      underlayColor={'#ffffff11'}
      activeOpacity={0.4}
      onPress={onPress}
      style={[styles.container, isActive && styles.activeContainer]}>
      <>
        <View style={styles.row}>
          <Image
            source={
              item.cover ? {uri: item.cover} : require('../../assets/tile.jpeg')
            }
            style={styles.image}
          />
          {isActive && (
            <View style={styles.icon}>
              {playing ? (
                <LoaderKit
                  name="LineScaleParty"
                  color="#fff"
                  style={styles.loader}
                />
              ) : (
                <Icon.PlayIcon size={23} color="#fff" />
              )}
            </View>
          )}
          <View style={styles.infoContainer}>
            <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
              {item.title}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
              {item.artist.slice(0, 30) + '...'} •{' '}
              {convertMillisecondsToTime(item.duration)}
            </Text>
          </View>
          <TouchableOpacity onPress={toggleDropdown} style={styles.moreButton}>
            <Icon.EllipsisHorizontalIcon color="#fff" size={22} />
          </TouchableOpacity>
        </View>
        <Animated.View style={[animatedStyles, styles.dropdownContainer]}>
          <TouchableOpacity
            onPress={() => {
              setIsVisible(true);
              setCurrentTrack(item);
            }}
            style={styles.dropdownItem}>
            <Icon.PlusIcon size={22} color={'#fff'} />
            <Text style={styles.dropdownText}>Add to playlist</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => ToggleLike(item)}
            style={styles.dropdownItem}>
            {isLiked(item.url) ? (
              <IconSolid.HeartIcon size={22} color={'#fff'} />
            ) : (
              <Icon.HeartIcon size={22} color={'#fff'} />
            )}
            <Text style={styles.dropdownText}>Add to favourite</Text>
          </TouchableOpacity>
        </Animated.View>
      </>
    </TouchableHighlight>
  );
};

export default memo(ListView);

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginHorizontal: 8,
    borderRadius: 16,
    zIndex: 0, // Ensure this is lower than the menu
  },
  activeContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.4)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 65,
    height: 65,
    borderRadius: 15,
  },
  icon: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.53)',
    width: 65,
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  loader: {
    width: 20,
    height: 20,
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  title: {
    fontWeight: '600',
    color: '#fff',
    fontSize: 14,
  },
  artist: {
    color: '#fff',
    fontSize: 12,
  },
  moreButton: {
    padding: 4,
    marginHorizontal: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.13)',
    borderRadius: 20,
  },
  dropdownContainer: {
    overflow: 'hidden',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    borderRadius: 10,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  dropdownText: {
    color: '#fff',
    marginLeft: 5,
  },
});
