import {Text, View} from 'react-native';
import React, {memo, useState} from 'react';
import {MusicFile} from '../components/ListView';
import {Storage} from '../constants/Store';
import {useMMKVObject, useMMKVString} from 'react-native-mmkv';
import LoadingTrack from '../components/loading';
import FlatlistComponent from '../components/FlatlistComponent';
import Header from '../components/Header';

const Favourite = () => {
  const id = 'favourite';
  const [loading, setLoading] = useState(false);
  const [queueId, setQueueId] = useMMKVString('queueId', Storage);
  const [like, setLike] = useMMKVObject<MusicFile[]>('liked', Storage);
  const musicArray = Array.isArray(like) ? like : [];

  if (musicArray?.length === 0) {
    return (
      <>
        <Header title="Favourite" />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 5,
          }}>
          <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff'}}>
            No songs added
          </Text>
        </View>
      </>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
      {loading && <LoadingTrack />}
      <FlatlistComponent
        ListHeaderComponent={<Header title="Favourite" />}
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
