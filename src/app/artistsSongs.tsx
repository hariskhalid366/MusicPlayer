import {View} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import LoadingTrack from '../components/loading';
import {useMMKVString} from 'react-native-mmkv';
import {Storage} from '../service/Store';
import FlatlistComponent from '../components/FlatlistComponent';
import { MusicFile } from '../constants/type';

const ArtistsSongs = ({route, navigation}: any) => {
  const name: string = route?.params?.name;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: name,
    });
  }, [navigation, name]);

  const songs: MusicFile[] = route?.params?.songs;
  const id = songs[0].artist;
  const [loading, setLoading] = useState(false);
  const [queueId, setQueueId] = useMMKVString('queueId', Storage);

  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
      {loading && <LoadingTrack />}
      <FlatlistComponent
        items={songs}
        id={id}
        queueId={queueId}
        setLoading={setLoading}
        setQueueId={setQueueId}
      />
    </View>
  );
};

export default ArtistsSongs;
