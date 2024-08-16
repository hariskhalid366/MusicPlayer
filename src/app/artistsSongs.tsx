import {FlatList, View} from 'react-native';
import React, {useCallback, useLayoutEffect, useRef, useState} from 'react';
import ListView, {MusicFile} from '../components/ListView';
import {handleTrackPlayerSong} from '../utility/handleTrackChange';
import LoadingTrack from '../components/loading';
import {useMMKVString} from 'react-native-mmkv';
import {Storage} from '../constants/Store';

const ArtistsSongs = ({route, navigation}: any) => {
  const name: string = route?.params?.name;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: name,
    });
  }, [navigation, name]);

  const queueOffset = useRef(0);
  const songs: MusicFile[] = route?.params?.songs;
  const id = songs[0].artist;
  const [loading, setLoading] = useState(false);
  const [queueId, setQueueId] = useMMKVString('queueId', Storage);

  const onHandleTrackPlayerSong = useCallback(
    async (selectedTrack: MusicFile) => {
      await handleTrackPlayerSong(
        selectedTrack,
        songs,
        id,
        queueId,
        setQueueId,
        queueOffset.current,
        setLoading,
      );
    },
    [id, songs, queueId, setQueueId, queueOffset],
  );

  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
      {loading && <LoadingTrack />}
      <FlatList
        decelerationRate={0.7}
        scrollEventThrottle={17}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingBottom: 150,
        }}
        data={songs}
        renderItem={({item, index}) => (
          <ListView
            key={index}
            index={index}
            item={item}
            handleTrack={onHandleTrackPlayerSong}
          />
        )}
      />
    </View>
  );
};

export default ArtistsSongs;
