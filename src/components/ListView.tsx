import React, { memo, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import * as Icon from 'lucide-react-native';
import { convertMillisecondsToTime } from '../constants/Permission';
import { ListItemProps } from '../constants/type';
import { useAudioStore } from '../store/useAudioStore';

import TrackPlayer from 'react-native-track-player';

const ListViewComponent = ({
  item,
  isPlaying,
  isActive,
  handleTrack,
}: ListItemProps) => {
  const { toggleLike } = useAudioStore();

  const containerStyle = useMemo(
    () => [styles.container, isActive && styles.activeContainer],
    [isActive],
  );

  const onPress = useCallback(() => {
    if (isActive) {
      isPlaying ? TrackPlayer.pause() : TrackPlayer.play();
    } else {
      handleTrack(item);
    }
  }, [isActive, isPlaying, handleTrack, item]);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={containerStyle}
      activeOpacity={0.7}
    >
      <FastImage
        source={
          item?.cover ? { uri: item.cover } : require('../../assets/tile.jpeg')
        }
        style={styles.image}
        resizeMode={FastImage.resizeMode.cover}
      />

      <View style={styles.icon}>
        {isActive ? (
          isPlaying ? (
            <Icon.PauseIcon size={23} color="#fff" />
          ) : (
            <Icon.PlayIcon size={23} color="#fff" />
          )
        ) : (
          <Icon.AudioLines size={23} color="#fff" />
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {item.artist || 'Unknown Artist'} •{' '}
          {convertMillisecondsToTime(item.duration)}
        </Text>
      </View>

      <Pressable
        hitSlop={10}
        style={styles.likeButton}
        onPress={() => {
          toggleLike(item);
        }}
      >
        <Icon.Heart
          color={'#fff'}
          size={22}
          fill={item?.liked ? '#fff' : 'transparent'}
        />
      </Pressable>
    </TouchableOpacity>
  );
};

const areEqual = (
  prev: Readonly<React.ComponentProps<typeof ListViewComponent>>,
  next: Readonly<React.ComponentProps<typeof ListViewComponent>>,
) => {
  const prevItem = prev.item || {};
  const nextItem = next.item || {};

  const sameUrl = prevItem.url === nextItem.url;
  const sameLiked = prevItem.liked === nextItem.liked;
  const sameActive = prev.isActive === next.isActive;
  const samePlaying = prev.isPlaying === next.isPlaying;

  return sameUrl && sameLiked && sameActive && samePlaying;
};

export default memo(ListViewComponent, areEqual);

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginHorizontal: 10,
    borderRadius: 15,
    padding: 4,
    borderWidth: 1,
    borderColor: '#ffffff33',
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
    overflow: 'hidden',
  },
  activeContainer: {
    borderColor: '#ff0000b3',
    backgroundColor: 'rgba(255,0,0,0.3)',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 15,
  },
  icon: {
    position: 'absolute',
    width: 60,
    height: 60,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff22',
    borderRadius: 12,
  },
  infoContainer: {
    flex: 1,
    paddingLeft: 12,
  },
  title: {
    fontWeight: '600',
    color: '#fff',
    fontSize: 14,
  },
  artist: {
    color: '#bcbcbc',
    fontSize: 12,
    marginTop: 4,
  },
  likeButton: {
    padding: 8,
    borderRadius: 15,
    alignItems: 'center',
  },
});
