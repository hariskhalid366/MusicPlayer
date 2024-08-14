import {
  PermissionsAndroid,
  Platform,
  ScrollView,
  ToastAndroid,
  View,
} from 'react-native';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {useMMKVObject} from 'react-native-mmkv';
import {Storage} from '../constants/Store';

import {
  getAll,
  SortSongFields,
  SortSongOrder,
} from 'react-native-get-music-files';
import ListView, {MusicFile} from '../components/ListView';
import HeaderSearchBar from '../components/HeaderSearchBar';
import {useQueue} from '../constants/QueueStore';
import LoadingTrack from '../components/loading';
import {handleTrackPlayerSong} from '../utility/handleTrackChange';

const Main = () => {
  const id = 'songs';
  const [loading, setLoading] = useState(false);
  //
  console.log(loading);
  //
  const [search, setSearch] = useState<string>('');
  const {activeQueueId, setActiveQueueId} = useQueue();
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
        activeQueueId,
        setActiveQueueId,
        queueOffset.current,
        setLoading,
      );
    },
    [id, musicArray, activeQueueId, setActiveQueueId, queueOffset],
  );

  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
      {loading && <LoadingTrack />}
      <ScrollView
        decelerationRate={'normal'}
        scrollEventThrottle={17}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingBottom: 150,
        }}>
        <HeaderSearchBar
          title={'Songs'}
          search={search}
          setSearch={setSearch}
          track={musicArray}
        />
        {filteredMusic.map((item, index) => (
          <ListView
            key={index}
            index={index}
            item={item}
            handleTrack={onHandleTrackPlayerSong}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default memo(Main);
