import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React, { useEffect } from 'react';
import * as Icon from 'react-native-heroicons/solid';
import { Storage } from '../service/Store';
import { useMMKVObject } from 'react-native-mmkv';
import Header from '../components/Header';
import { MusicFile } from '../constants/type';

const Album = ({ navigation }: any) => {
  const [music, setMusic] = useMMKVObject<string | MusicFile[]>(
    'musicList',
    Storage,
  );

  const [artist, setArtist] = useMMKVObject<Record<string, MusicFile[]>>(
    'artistList',
    Storage,
  );

  useEffect(() => {
    if (artist === undefined) {
      if (Array.isArray(music)) {
        // Group songs by artist
        const grouped = music.reduce<Record<string, MusicFile[]>>(
          (acc, track) => {
            const artistKey = track.artist || 'Unknown Artist';

            if (!acc[artistKey]) {
              acc[artistKey] = [];
            }

            acc[artistKey].push(track);

            return acc;
          },
          {},
        );

        setArtist(grouped);
      }
    }
  }, [music, artist, setArtist]);

  return (
      <ScrollView
        stickyHeaderIndices={[0]}
        showsVerticalScrollIndicator={false}
        decelerationRate={0.6}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingVertical: 10,
          paddingBottom: 100,
        }}
      >
        <Header title="Artists" />

        {Object.entries(artist || {}).map(([artistKey, songs]) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ArtistSongs', {
                songs: songs,
                name: artistKey.slice(0, 25) + '...',
              });
            }}
            activeOpacity={0.7}
            key={artistKey}
            style={styles.artistContainer}
          >
            {songs[0].cover ? (
              <Image source={{ uri: songs[0].cover }} style={styles.image} />
            ) : (
              <Icon.UserIcon
                color={'#fff'}
                size={50}
                style={styles.defaultIcon}
              />
            )}
            <Text style={styles.artistText}>{artistKey}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 80, // Adjust as needed
    backgroundColor: '#000', // Ensure visibility
    justifyContent: 'center',
    alignItems: 'center',
  },
  artistContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,

  },
  image: {
    width: 55,
    height: 55,
    borderRadius: 30,
    marginRight: 16,
    backgroundColor:"#ffffff55"
  },
  defaultIcon: {
    marginRight: 16,
    backgroundColor: '#1F1F1F',
    borderRadius: 25,
  },
  artistText: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Album;
