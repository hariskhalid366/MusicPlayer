import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import * as Icon from 'react-native-heroicons/outline';
import * as IconSolid from 'react-native-heroicons/solid';
import TrackPlayer, { useActiveTrack, useIsPlaying } from 'react-native-track-player';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useMMKVObject } from 'react-native-mmkv';
import { Storage } from '../service/Store';
import useBearState from '../service/GlobalState';
import type { ListItemProps, MusicFile } from '../constants/type';
import AddSongModal from './modal/AddToPlaylistModal';

export const convertMillisecondsToTime = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};


const ListView = ({
  item,
  index,
  handleTrack,
  playlist,
  isSelected,
  deleteItem,
}: ListItemProps) => {

  const DROPDOWN_HEIGHT = 60;
  const DROPDOWN_OPEN_DURATION = 250;
  const DROPDOWN_AUTO_CLOSE_DELAY = 10000;
  const DROPDOWN_CLOSE_DURATION = 300;


  // active track: re-renders item if it becomes active - expected
  const activeTrack = useActiveTrack();
  const isActive = activeTrack?.url === item?.url;
  const [currentTrack,setCurrentTrack]=useState<MusicFile | null>(null)
  const [isVisible,setIsVisible]=useState<boolean>(false)

  // playing state is global and will update items when changed (expected)
  const isPlaying = useIsPlaying()?.playing ?? false;


  const onPress = useCallback(() => {
    if (isActive) {
      isPlaying ? TrackPlayer.pause() : TrackPlayer.play();
    } else {
      handleTrack(item);
    }
  }, [isActive, isPlaying, handleTrack, item]);

  // MMKV liked list
  const [like, setLike] = useMMKVObject<MusicFile[]>('liked', Storage);

  const isLiked = useCallback(
    (itemUrl: string) => like?.some(likedItem => likedItem.url === itemUrl),
    [like],
  );

  const toggleLike = useCallback(
    (track: MusicFile) => {
      setLike(prev => {
        if (!prev) return [track];
        if (prev.some(l => l.url === track.url)) {
          return prev.filter(l => l.url !== track.url);
        }
        return [...prev, track];
      });
    },
    [setLike],
  );

  const dropDown = useSharedValue(0);

  const toggleDropdown = useCallback(() => {
    console.log(dropDown.value, "toggle");

    if (dropDown.value === 0) {
      dropDown.value = withTiming(1, { duration: DROPDOWN_OPEN_DURATION, easing: Easing.back(1.7) },);
      setTimeout(() => {
        dropDown.value = withTiming(0, { duration: DROPDOWN_CLOSE_DURATION, easing: Easing.inOut(Easing.cubic) });
      }, DROPDOWN_AUTO_CLOSE_DELAY)
    } else {
      dropDown.value = withTiming(0, { duration: DROPDOWN_CLOSE_DURATION, easing: Easing.inOut(Easing.cubic) });
    }
  }, []);

  const animatedStyles = useAnimatedStyle(() => {
    const height = interpolate(dropDown.value, [0, 1], [0, DROPDOWN_HEIGHT], Extrapolation.CLAMP);
    const scale = interpolate(dropDown.value, [0, 1], [0.58, 1], Extrapolation.CLAMP);
    return {
      height,
      opacity: dropDown.value,
      transform: [{ scale }],
    };
  }, []);

  const containerStyle = useMemo(
    () => [
      styles.container,
      isActive && !isSelected ? styles.activeContainer : null,
      isSelected ? styles.selectedContainer : null,
    ],
    [isActive, isSelected],
  );

  const PlaybackIndicator = useMemo(
    () => (
      <View style={styles.icon}>
        {isPlaying ? <ActivityIndicator size="small" color="#fff" /> : <Icon.PlayIcon size={23} color="#fff" />}
      </View>
    ),
    [isPlaying],
  );

  const handleDelete = useCallback(() => {
    deleteItem && deleteItem(item);
  }, [deleteItem, item]);

  return (
    <>
    <TouchableOpacity activeOpacity={0.85} key={item.duration + index} onPress={onPress} style={containerStyle}>
      <View style={styles.row}>
        {isSelected && (
          <View style={styles.selectionIndicator}>
            <IconSolid.CheckCircleIcon size={20} color="#34D399" />
          </View>
        )}

        <Image
          source={item.cover ? { uri: item.cover } : require('../../assets/tile.jpeg')}
          style={styles.image}
          resizeMode="cover"
        />

        {isActive && !isSelected && PlaybackIndicator}

        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">{item.title}</Text>
          <Text style={styles.artist} numberOfLines={1}>
            {item.artist ? `${item.artist.slice(0, 30)}...` : 'Unknown Artist'} • {convertMillisecondsToTime(item.duration)}
          </Text>
        </View>

        <TouchableOpacity onPress={toggleDropdown} style={styles.moreButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon.EllipsisHorizontalIcon color="#fff" size={22} />
        </TouchableOpacity>
      </View>

      <Animated.View style={[animatedStyles, styles.dropdownContainer]}>
        {!playlist && (
          <TouchableOpacity
            onPress={() => {
              setIsVisible(true);
              setCurrentTrack(item);
              dropDown.value = withTiming(0, { duration: 120 });
            }}
            style={styles.dropdownItem}
          >
            <Icon.PlusIcon size={18} color="#fff" />
            <Text style={styles.dropdownText}>Add to playlist</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => { toggleLike(item); dropDown.value = withTiming(0, { duration: 120 }); }}
          style={styles.dropdownItem}
        >
          {isLiked(item.url) ? <IconSolid.HeartIcon size={18} color="#fff" /> : <Icon.HeartIcon size={18} color="#fff" />}
          <Text style={styles.dropdownText}>{isLiked(item.url) ? 'Remove from favourite' : 'Add to favourite'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDelete} style={styles.dropdownItem}>
          <Icon.TrashIcon size={18} color="#fff" />
          <Text style={styles.dropdownText}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>
    </TouchableOpacity>
    <AddSongModal
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      currentTrack={currentTrack}
      setCurrentTrack={setCurrentTrack}
    />
    </>
  );
};

function areEqual(prev: ListItemProps, next: ListItemProps) {
  if (prev.item.url !== next.item.url) return false;
  if (prev.isSelected !== next.isSelected) return false;
  if (prev.selectionModeActive !== next.selectionModeActive) return false;
  if (prev.playlist !== next.playlist) return false;
  if (prev.handleTrack !== next.handleTrack) return false;
  if (prev.deleteItem !== next.deleteItem) return false;
  return true;
}

export default memo(ListView, areEqual);

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginHorizontal: 8,
    borderRadius: 16,
    zIndex: 0,
  },
  activeContainer: {
    backgroundColor: 'rgba(255,0,0,0.12)',
  },
  selectedContainer: {
    backgroundColor: 'rgba(0,100,255,0.08)',
    borderColor: 'rgba(0,100,255,0.6)',
    borderWidth: 1,
  },
  selectionIndicator: {
    position: 'absolute',
    left: -6,
    top: -6,
    zIndex: 2,
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  image: {
    width: 65,
    height: 65,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#222',
  },
  icon: {
    position: 'absolute',
    left: 5,
    top: 5,
    backgroundColor: 'rgba(0,0,0,0.55)',
    width: 65,
    height: 65,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
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
    color: '#d1d5db',
    fontSize: 12,
  },
  moreButton: {
    padding: 6,
    marginHorizontal: 2,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 18,
  },
  dropdownContainer: {
    overflow: 'hidden',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.22)',
    marginTop: -4,
  },
  dropdownItem: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  dropdownText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 6,
  },
});
