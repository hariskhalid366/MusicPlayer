import {  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { memo, useCallback, useMemo } from 'react';
import * as Icon from 'lucide-react-native';
import Header from '../components/Header';
import { MusicFile } from '../constants/type';
import { useAudioStore } from '../store/useAudioStore';

const Album = ({ navigation }: any) => {
  const audios = useAudioStore(state => state.audios);

  const artistData = useMemo(() => {
    if (!Array.isArray(audios)) return [];
    const grouped = audios.reduce<Record<string, MusicFile[]>>(
      (acc, track) => {
        const key = track.artist || 'Unknown Artist';
        if (!acc[key]) acc[key] = [];
        acc[key].push(track);
        return acc;
      },
      {},
    );
    return Object.entries(grouped);
  }, [audios]);

  const renderItem = useCallback(
    ({ item }: { item: [string, MusicFile[]] }) => {
      const [artistKey, songs] = item;
      const name =
        artistKey.length > 25 ? artistKey.slice(0, 25) + '...' : artistKey;

      return (
        <TouchableOpacity
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
              <Image
                source={{ uri: songs[0].cover }}
                style={styles.image}
                resizeMode="cover"
              />
            )}
          </View>
          <Text style={styles.artistText}>{artistKey}</Text>
        </TouchableOpacity>
      );
    },
    [navigation],
  );

  const keyExtractor = useCallback(
    (item: [string, MusicFile[]]) => item[0],
    [],
  );

  return (
    <FlatList
      data={artistData}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingVertical: 10,
        paddingBottom: 100,
      }}
      initialNumToRender={20}
      removeClippedSubviews={true}
      ListHeaderComponent={<Header title="Artists" />}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
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

export default memo(Album);
