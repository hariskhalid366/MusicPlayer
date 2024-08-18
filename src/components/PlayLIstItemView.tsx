import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import * as Icon from 'react-native-heroicons/outline';
import {MusicFile} from './ListView';
import {useNavigation} from '@react-navigation/native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface ItemProps {
  item: {
    id: string;
    songs: MusicFile[];
  };
  index: number;
  deletePlaylist: (value: string) => void;
}

const PlayLIstItemView = ({item, index, deletePlaylist}: ItemProps) => {
  const nav: any = useNavigation();

  const dropDown = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    const height = interpolate(
      dropDown.value,
      [0, 1],
      [0, 45], // Increased height for better visibility
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
    <>
      <TouchableOpacity
        onPress={() => nav.navigate('PlaylistSongs', {item})}
        key={index}
        activeOpacity={0.8}
        style={styles.container}>
        <Image
          style={styles.image}
          source={require('../../assets/playlist.jpeg')}
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
          style={styles.moreButton}>
          <Icon.EllipsisHorizontalIcon color="#fff" size={22} />
        </TouchableOpacity>
      </TouchableOpacity>
      <Animated.View style={[animatedStyles, styles.dropdownContainer]}>
        <TouchableOpacity
          onPress={() => {
            // setIsVisible(true);
            // setCurrentTrack(item);
          }}
          style={styles.dropdownItem}>
          <Icon.PlayIcon size={22} color={'#fff'} />
          <Text style={styles.dropdownText}>Play All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deletePlaylist(item.id)}
          style={styles.dropdownItem}>
          <Icon.TrashIcon size={22} color={'#fff'} />
          <Text style={styles.dropdownText}>Delete Playlist</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

export default PlayLIstItemView;

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
