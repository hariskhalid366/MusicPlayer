import {FlatList, ScrollView, View} from 'react-native';
import React, {memo, useRef, useState} from 'react';
import ListView, {MusicFile} from '../components/ListView';
import {Storage} from '../constants/Store';
import {useMMKVObject, useMMKVString} from 'react-native-mmkv';
import LoadingTrack from '../components/loading';
import {handleTrackPlayerSong} from '../utility/handleTrackChange';
import FlatlistComponent from '../components/FlatlistComponent';

const Favourite = () => {
  const id = 'favourite';
  const [loading, setLoading] = useState(false);
  const [queueId, setQueueId] = useMMKVString('queueId', Storage);
  const [like, setLike] = useMMKVObject<MusicFile[]>('liked', Storage);
  const musicArray = Array.isArray(like) ? like : [];

  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
      {loading && <LoadingTrack />}
      <FlatlistComponent
        items={musicArray}
        id={id}
        queueId={queueId}
        setLoading={setLoading}
        setQueueId={setQueueId}
      />
    </View>
  );
};

export default memo(Favourite);
