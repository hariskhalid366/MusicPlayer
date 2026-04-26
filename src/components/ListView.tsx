import React, { memo, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Animated,
  Image,
} from 'react-native';
import * as Icon from 'lucide-react-native';
import { convertMillisecondsToTime } from '../constants/Permission';
import { ListItemProps } from '../constants/type';
import { useAudioStore } from '../store/useAudioStore';
import TrackPlayer from 'react-native-track-player';
import PlayStateIcons from './PlayStateIcons';

const FALLBACK_IMAGE = require('../../assets/tile.jpeg');

const ListViewComponent = ({
  item,
  isPlaying,
  isActive,
  handleTrack,
}: ListItemProps) => {
  const toggleLike = useAudioStore(state => state.toggleLike);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const containerStyle = useMemo(
    () => [styles.container, isActive && styles.activeContainer],
    [isActive],
  );

  const imageSource = useMemo(
    () => (item?.cover ? { uri: item.cover } : FALLBACK_IMAGE),
    [item?.cover],
  );

  const onPress = useCallback(() => {
    if (isActive) {
      isPlaying ? TrackPlayer.pause() : TrackPlayer.play();
    } else {
      handleTrack(item);
    }
  }, [isActive, isPlaying, handleTrack, item]);

  const duration = useMemo(
    () => convertMillisecondsToTime(item.duration),
    [item.duration],
  );

  const onLikePress = useCallback(() => {
    toggleLike(item);

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.4,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [toggleLike, item, scaleAnim]);

  const heartFill = item?.liked ? '#fff' : 'transparent';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={containerStyle}
      activeOpacity={0.7}
    >
      <Image
        source={imageSource}
        style={styles.image}
        resizeMode="cover"
      />

      <PlayStateIcons isActive={isActive} isPlaying={isPlaying} />

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.artist} numberOfLines={1}>
          {item.artist || 'Unknown Artist'} • {duration}
        </Text>
      </View>
      <Pressable hitSlop={10} style={styles.likeButton} onPress={onLikePress}>
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
          }}
        >
          <Icon.Heart color="#fff" size={22} fill={heartFill} />
        </Animated.View>
      </Pressable>
    </TouchableOpacity>
  );
};

const areEqual = (prev: any, next: any) => {
  const p = prev.item;
  const n = next.item;

  return (
    p?.url === n?.url &&
    p?.liked === n?.liked &&
    p?.title === n?.title &&
    p?.artist === n?.artist &&
    p?.duration === n?.duration &&
    prev.isActive === next.isActive &&
    prev.isPlaying === next.isPlaying
  );
};

export default memo(ListViewComponent, areEqual);

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginHorizontal: 14,
    borderRadius: 15,
    padding: 4,
    borderWidth: 0.5,
    borderColor: '#ffffff33',
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
    overflow: 'hidden',
  },
  activeContainer: {
    borderColor: '#ff0000b3',
    backgroundColor: 'rgba(255,0,0,0.3)',
    boxShadow: '0px 12px 40px rgba(255, 0, 0, 0.5)',
    transform: [{ scale: 1.04 }],
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 15,
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
