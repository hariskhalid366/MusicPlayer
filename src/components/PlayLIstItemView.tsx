import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import React, { memo } from 'react';
import * as Icon from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { MusicFile } from '../constants/type';

interface ItemProps {
  item: {
    id: string;
    songs: MusicFile[];
  };
  index: number;
  deletePlaylist: (value: string) => void;
}

const PlayLIstItemView = ({ item, index, deletePlaylist }: ItemProps) => {
  const nav: any = useNavigation();

  const dropDown = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    const height = interpolate(
      dropDown.value,
      [0, 1],
      [0, 45],
      Extrapolation.CLAMP,
    );

    return {
      height,
      opacity: dropDown.value,
    };
  });

  const toggleDropdown = () => {
    if (dropDown.value === 0) {
      dropDown.value = withTiming(1, { duration: 200 });

      setTimeout(() => {
        dropDown.value = withTiming(0, { duration: 200 });
      }, 5000);
    } else {
      dropDown.value = withTiming(0, { duration: 200 });
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => nav.navigate('PlaylistSongs', { item })}
        key={index}
        activeOpacity={0.8}
        style={styles.container}
      >
        <FastImage
          style={styles.image}
          source={require('../../assets/playlist.jpeg')}
          resizeMode={FastImage.resizeMode.cover}
        />

        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {item.id}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {item.songs.length}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => toggleDropdown()}
          style={styles.moreButton}
        >
          <Icon.Ellipsis color="#fff" size={22} />
        </TouchableOpacity>
      </TouchableOpacity>
      <Animated.View style={[animatedStyles, styles.dropdownContainer]}>
        <TouchableOpacity
          onPress={() => {
            // setIsVisible(true);
            // setCurrentTrack(item);
          }}
          style={styles.dropdownItem}
        >
          <Icon.PlayIcon size={22} color={'#fff'} />
          <Text style={styles.dropdownText}>Play All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deletePlaylist(item.id)}
          style={styles.dropdownItem}
        >
          <Icon.TrashIcon size={22} color={'#fff'} />
          <Text style={styles.dropdownText}>Delete Playlist</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

// avoid rerenders unless playlist id or songs length change
const areEqual = (
  prev: Readonly<React.ComponentProps<typeof PlayLIstItemView>>,
  next: Readonly<React.ComponentProps<typeof PlayLIstItemView>>,
) => {
  return (
    prev.item.id === next.item.id &&
    prev.item.songs.length === next.item.songs.length
  );
};

export default memo(PlayLIstItemView, areEqual);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 12,
    marginHorizontal: 8,
    alignItems: 'center',
    borderRadius: 16,
  },
  image: {
    width: 120,
    height: 120,
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
  infoContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  title: {
    fontWeight: '600',
    color: '#fff',
    fontSize: 18,
  },
  artist: {
    color: '#fff',
    fontSize: 14,
  },
  moreButton: {
    padding: 4,
    marginHorizontal: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.13)',
    borderRadius: 20,
  },
  touchable: {
    alignSelf: 'flex-end',
    padding: 8,
    backgroundColor: '#ffffff33',
    margin: 4,
    borderRadius: 50,
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
