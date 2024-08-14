import {ScrollView, View} from 'react-native';
import React, {memo, useEffect, useRef, useState} from 'react';
import ListView, {MusicFile} from '../components/ListView';
import {Storage} from '../constants/Store';
import {useMMKVObject} from 'react-native-mmkv';
import {useQueue} from '../constants/QueueStore';
import LoadingTrack from '../components/loading';
import {handleTrackPlayerSong} from '../utility/handleTrackChange';

const Favourite = () => {
  const id = 'favourite';
  const queueOffset = useRef(0);
  const [loading, setLoading] = useState(false);
  const [like, setLike] = useMMKVObject<MusicFile[]>('liked', Storage);
  const [search, setSearch] = useState('');
  const {activeQueueId, setActiveQueueId} = useQueue();
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
      activeQueueId,
      setActiveQueueId,
      queueOffset.current,
      setLoading, // Pass the current ref value
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
      {loading && <LoadingTrack />}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingBottom: 150,
        }}>
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

export default memo(Favourite);
