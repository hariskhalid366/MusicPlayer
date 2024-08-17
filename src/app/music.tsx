import {
  FlatList,
  PermissionsAndroid,
  Platform,
  Text,
  ToastAndroid,
  View,
  RefreshControl,
} from 'react-native';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {useMMKVObject, useMMKVString} from 'react-native-mmkv';
import {Storage} from '../constants/Store';

import {
  getAll,
  SortSongFields,
  SortSongOrder,
} from 'react-native-get-music-files';
import ListView, {MusicFile} from '../components/ListView';
import HeaderSearchBar from '../components/HeaderSearchBar';
import LoadingTrack from '../components/loading';
import {handleTrackPlayerSong} from '../utility/handleTrackChange';
import TrackPlayer from 'react-native-track-player';
import AddSongModal from '../components/modal/AddToPlaylistModal';

const Main = () => {
  const id = 'songs';
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [queueId, setQueueId] = useMMKVString('queueId', Storage);
  const [music, setMusic] = useMMKVObject<string | MusicFile[]>(
    'musicList',
    Storage,
  );
  const musicArray = Array.isArray(music) ? music : [];

  const filteredMusic = musicArray.filter(
    (item: MusicFile) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.artist.toLowerCase().includes(search.toLowerCase()),
  );

  const queueOffset = useRef(0);

  const fetchMusicList = async () => {
    setLoading(true);
    try {
      const files = await getAll({
        limit: 500,
        offset: 0,
        coverQuality: 50,
        minSongDuration: 100000,
        sortBy: SortSongFields.TITLE,
        sortOrder: SortSongOrder.ASC,
      });
      setMusic(files);
    } catch (error) {
      console.error('Error while fetching music list:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAndRequestReadStoragePermission = useCallback(async () => {
    try {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      if (hasPermission) {
        fetchMusicList();
        return;
      }

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Read External Storage Permission',
          message:
            'This app needs access to your external storage to read files.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ToastAndroid.show('Permission granted', ToastAndroid.SHORT);
        fetchMusicList();
      } else {
        ToastAndroid.show('File permission denied', ToastAndroid.SHORT);
      }
    } catch (err) {
      console.warn(err);
    }
  }, [fetchMusicList]);

  useEffect(() => {
    if (Platform.OS === 'android' && (!music || music.length === 0)) {
      checkAndRequestReadStoragePermission();
    }
  }, [checkAndRequestReadStoragePermission, music]);

  const onHandleTrackPlayerSong = useCallback(
    async (selectedTrack: MusicFile) => {
      return await handleTrackPlayerSong(
        selectedTrack,
        musicArray,
        id,
        queueId,
        setQueueId,
        queueOffset.current,
        setLoading,
      );
    },
    [id, musicArray, queueId, setQueueId, queueOffset],
  );

  const [refreshing, setRefreshing] = useState(false);
  const [scroll, setScroll] = useState<boolean>(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMusicList().finally(() => setRefreshing(false));
    TrackPlayer.add(musicArray);
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
      {loading && <LoadingTrack />}
      <HeaderSearchBar
        title={'Songs'}
        search={search}
        setSearch={setSearch}
        track={musicArray}
      />
      <FlatList
        data={filteredMusic}
        keyExtractor={(item: MusicFile) => item?.url} // Ensure item.id is unique
        renderItem={({item, index}) => (
          <ListView
            key={item.url}
            index={index}
            item={item}
            scroll={scroll}
            handleTrack={onHandleTrackPlayerSong}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 5,
            }}>
            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff'}}>
              Song not found
            </Text>
          </View>
        )}
        onScroll={() => setScroll(true)}
        maxToRenderPerBatch={10}
        decelerationRate={0.6}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingBottom: 150,
        }}
      />
      <AddSongModal />
    </View>
  );
};

export default memo(Main);
