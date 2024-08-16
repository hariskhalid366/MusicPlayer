import {FlatList, ScrollView, View} from 'react-native';
import React, {memo, useRef, useState} from 'react';
import ListView, {MusicFile} from '../components/ListView';
import {Storage} from '../constants/Store';
import {useMMKVObject, useMMKVString} from 'react-native-mmkv';
import LoadingTrack from '../components/loading';
import {handleTrackPlayerSong} from '../utility/handleTrackChange';

const Favourite = () => {
  const id = 'favourite';
  const queueOffset = useRef(0);
  const [loading, setLoading] = useState(false);
  const [queueId, setQueueId] = useMMKVString('queueId', Storage);
  const [like, setLike] = useMMKVObject<MusicFile[]>('liked', Storage);
  const [search, setSearch] = useState('');
  const musicArray = Array.isArray(like) ? like : [];
  const filteredMusic = musicArray.filter(
    (item: MusicFile) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.artist.toLowerCase().includes(search.toLowerCase()),
  );

  const onHandleTrackPlayerSong = async (selectedTrack: MusicFile) => {
    await handleTrackPlayerSong(
      selectedTrack,
      musicArray,
      id,
      queueId,
      setQueueId,
      queueOffset.current,
      setLoading,
    );
  };

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
        data={filteredMusic}
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

export default memo(Favourite);
