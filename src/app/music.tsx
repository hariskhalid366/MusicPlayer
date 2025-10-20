import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Alert,
  ToastAndroid,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  PermissionsAndroid,
  Platform,
  Linking,
  LayoutAnimation,
  StyleSheet,
  NativeModules,
  LogBox,
} from 'react-native';
import { useMMKVObject, useMMKVString } from 'react-native-mmkv';
import RNFS from 'react-native-fs';
import TrackPlayer from 'react-native-track-player';
import { Storage } from '../service/Store';
import HeaderSearchBar from '../components/HeaderSearchBar';
import ListView from '../components/ListView';
import LoadingTrack from '../components/loading';
import { handleTrackPlayerSong } from '../utility/handleTrackChange';
import { MusicFile } from '../constants/type';
import { FlatList } from 'react-native-gesture-handler';
import showToast from '../components/Toast';

const { MusicFiles } = NativeModules;

const Main = () => {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [music, setMusic] = useMMKVObject<MusicFile[]>('musicList', Storage);
  const [queueId, setQueueId] = useMMKVString('queueId', Storage);

  const id = 'songs';
  const musicArray = Array.isArray(music) ? music : [];

  const filteredMusic = useMemo(() => {
    const query = search.toLowerCase();
    return musicArray.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.artist.toLowerCase().includes(query),
    );
  }, [musicArray, search]);

  const fetchMusicList = useCallback(async () => {
    if (musicArray.length > 0 && !refreshing) return;

    setLoading(true);
    try {
      const files = await MusicFiles.getAllAudioFiles();
      const filtered = files.filter((m: MusicFile) => !m.title?.startsWith('AUD'));
      
      await TrackPlayer.add(files)
      if (filtered.length === 0) {
        ToastAndroid.showWithGravity(
          'No music files found',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        return;
      }
      setMusic(filtered);
    } catch (error) {
      console.log('Error fetching music:', error);
    } finally {
      setLoading(false);
    }
  }, [musicArray.length, refreshing, setMusic]);

  const checkPermissions = useCallback(async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      if (
        granted['android.permission.READ_EXTERNAL_STORAGE'] === 'granted' &&
        granted['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
      ) {
        fetchMusicList();
      } else {
        Linking.openSettings();
        showToast("Need permission to play music")
      }
    } catch (err) {
      console.log('Permission error:', err);
    }
  }, [fetchMusicList]);

  useEffect(() => {
    if (Platform.OS === 'android') checkPermissions();
  }, [checkPermissions]);


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMusicList().finally(() => setRefreshing(false));
  }, [fetchMusicList]);


  const onHandleTrackPlayerSong = useCallback(
    async (selectedTrack: MusicFile) => {
      await handleTrackPlayerSong(
        selectedTrack,
        musicArray,
        id,
        queueId,
        setQueueId,
        setLoading,
      );
    },
    [musicArray, id, queueId, setQueueId],
  );

  const deleteItem = useCallback(
    (item: MusicFile) => {
      Alert.alert(
        'Confirm Deletion',
        `Are you sure you want to delete "${item.title}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                const exists = await RNFS.exists(item.url);
                if (exists) {
                  await RNFS.unlink(item.url);
                } else {
                  console.warn('File not found:', item.url);
                }
                const updatedList = musicArray.filter((m) => m.url !== item.url);
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setMusic(updatedList);
                await TrackPlayer.reset();
              } catch (error) {
                console.log('Error deleting file:', error);
              }
            },
          },
        ],
      );
    },
    [musicArray, setMusic],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: MusicFile; index: number }) => (
      <ListView
        index={index}
        item={item}
        handleTrack={onHandleTrackPlayerSong}
        deleteItem={deleteItem}
      />
    ),
    [onHandleTrackPlayerSong, deleteItem],
  );


  const EmptyComponent = useMemo(
    () =>
      filteredMusic.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Song not found</Text>
        </View>
      ) : (
        <View style={styles.loadContainer}>
          <TouchableOpacity onPress={fetchMusicList} style={styles.loadButton}>
            <Text style={styles.loadButtonText}>Load Music</Text>
          </TouchableOpacity>
        </View>
      ),
    [filteredMusic.length, fetchMusicList],
  );


  return (
    <View style={styles.container}>
      {loading && <LoadingTrack />}

      <HeaderSearchBar
        title="Songs"
        search={search}
        setSearch={setSearch}
        track={musicArray}
      />

      <FlatList
        data={filteredMusic}
        keyExtractor={(item) => item.url}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={EmptyComponent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={20}
        maxToRenderPerBatch={25}
        windowSize={50}
        decelerationRate={0.6}
        removeClippedSubviews
        scrollEventThrottle={16}
        contentContainerStyle={styles.listContent}
      />

      {/* <AddSongModal /> */}
    </View>
  );
};

export default memo(Main);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  loadContainer: {
    marginTop: Dimensions.get('screen').height / 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadButton: {
    backgroundColor: 'red',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  loadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 150,
  },
});
