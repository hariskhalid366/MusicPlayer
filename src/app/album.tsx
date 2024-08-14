import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import * as Icon from 'react-native-heroicons/solid';
import {MusicFile} from '../components/ListView';
import {Storage} from '../constants/Store';
import {useMMKVObject} from 'react-native-mmkv';

const Album = ({navigation}: any) => {
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
    <View className="justify-center items-center flex-1 ">
      <ScrollView
        contentContainerStyle={{
          gap: 15,
          paddingHorizontal: 10,
          paddingVertical: 10,
          paddingBottom: 150,
        }}>
        {Object.entries(artist || {}).map(([artistKey, songs]) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ArtistSongs', {songs});
            }}
            activeOpacity={0.7}
            key={artistKey}
            className="flex-row items-center ">
            <Icon.UserIcon
              color={'#fff'}
              size={50}
              className="mr-4 rounded-full bg-red-500"
            />
            <Text className="w-4/5 text-white font-semibold tracking-wide">
              {artistKey}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  coverImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default Album;
