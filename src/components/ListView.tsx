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
import TrackPlayer, {
  useActiveTrack,
  useIsPlaying,
} from 'react-native-track-player';
import LoaderKit from 'react-native-loader-kit';
import TrackShortcutMenu from './Actions/TrackShortcutMenu';

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
}

export const convertMillisecondsToTime = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const ListView = ({item, handleTrack}: ListItemProps) => {
  const activeTrack = useActiveTrack();
  const isActive = activeTrack?.url === item?.url;
  const {playing} = useIsPlaying();

  const onPress = () => {
    if (isActive) {
      if (playing) {
        TrackPlayer.pause();
      } else {
        TrackPlayer.play();
      }
    } else {
      handleTrack(item);
    }
  };

  return (
    <TouchableHighlight
      underlayColor={'#ffffff11'}
      activeOpacity={0.4}
      onPress={onPress}
      style={[styles.container, isActive && styles.activeContainer]}>
      <>
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
        <TrackShortcutMenu track={item} itemUrl={item.url}>
          <TouchableOpacity style={styles.moreButton}>
            <Icon.EllipsisHorizontalIcon color="#fff" size={22} />
          </TouchableOpacity>
        </TrackShortcutMenu>
      </>
    </TouchableHighlight>
  );
};

export default ListView;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 12,
    marginHorizontal: 8,
    alignItems: 'center',
    borderRadius: 16,
  },
  activeContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.4)',
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
    zIndex: 20,
    marginHorizontal: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.13)',
    borderRadius: 20,
  },
});
