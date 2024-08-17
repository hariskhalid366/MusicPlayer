import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
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
        decelerationRate={0.6}
        scrollEventThrottle={17}
        contentContainerStyle={{
          gap: 15,
          paddingHorizontal: 10,
          paddingVertical: 10,
          paddingBottom: 150,
        }}>
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
            className="flex-row items-center ">
            {songs[0].cover ? (
              <Image
                source={
                  {uri: songs[0].cover}
                  // : require('../../assets/tile.jpeg')
                }
                style={styles.image}
              />
            ) : (
              <Icon.UserIcon
                color={'#fff'}
                size={50}
                className="mr-4 rounded-full bg-[#1F1F1F]"
              />
            )}
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
  image: {
    width: 55,
    height: 55,
    borderRadius: 30,
    marginRight: 16,
  },
});

export default Album;
