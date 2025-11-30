import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FlashList, useMappingHelper } from '@shopify/flash-list';
import FastImage from 'react-native-fast-image';
import React, { useEffect, useState } from 'react';
import * as Icon from 'lucide-react-native';
import Header from '../components/Header';
import { MusicFile } from '../constants/type';
import { useAudioStore } from '../store/useAudioStore';

const Album = ({ navigation }: any) => {
  const [artist, setArtist] = useState<Record<string, MusicFile[]>>();

  const { audios } = useAudioStore();
  const { getMappingKey } = useMappingHelper();

  useEffect(() => {
    if (Array.isArray(audios)) {
      const grouped = audios.reduce<Record<string, MusicFile[]>>(
        (acc: Record<string, MusicFile[]>, track: MusicFile) => {
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
  }, [audios]);

  return (
    <FlashList
      data={Object.entries(artist ?? {})}
      keyExtractor={(item: [string, any]) => item[0]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingVertical: 10,
        paddingBottom: 100,
      }}
      ListHeaderComponent={<Header title="Artists" />}
      renderItem={({ item, index }: any) => {
        const [artistKey, songs] = item;
        const name =
          artistKey.length > 25 ? artistKey.slice(0, 25) + '...' : artistKey;

        return (
          <TouchableOpacity
            key={getMappingKey(item?.duration, index)}
            onPress={() =>
              navigation.navigate('ArtistSongs', {
                songs,
                name,
              })
            }
            activeOpacity={0.7}
            style={styles.artistContainer}
          >
            <View style={styles.imageContainer}>
              <Icon.UserRound
                color={'#fff'}
                size={42}
                strokeWidth={1.5}
                style={{ position: 'absolute' }}
              />
              {songs[0]?.cover && (
                <FastImage
                  source={{ uri: songs[0].cover }}
                  style={styles.image}
                  resizeMode={FastImage.resizeMode.cover}
                />
              )}
            </View>
            <Text style={styles.artistText}>{artistKey}</Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 80,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  artistContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
    gap: 16,
  },
  image: {
    flex: 1,
    aspectRatio: 1,
  },
  artistText: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    width: 55,
    height: 55,
    overflow: 'hidden',
    backgroundColor: '#ffffff11',
  },
});

export default Album;
