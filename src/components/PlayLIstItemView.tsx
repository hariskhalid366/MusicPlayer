import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import * as Icon from 'react-native-heroicons/outline';
import {MusicFile} from './ListView';
import {useNavigation} from '@react-navigation/native';

interface ItemProps {
  item: {
    id: string;
    songs: MusicFile[];
  };
  index: number;
}

const PlayLIstItemView = ({item, index}: ItemProps) => {
  const nav: any = useNavigation();
  return (
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
      <TouchableOpacity style={styles.moreButton}>
        <Icon.EllipsisHorizontalIcon color="#fff" size={22} />
      </TouchableOpacity>
    </TouchableOpacity>
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
});
