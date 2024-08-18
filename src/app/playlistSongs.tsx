import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useLayoutEffect, useRef, useState} from 'react';
import ListView, {MusicFile} from '../components/ListView';
import {handleTrackPlayerSong} from '../utility/handleTrackChange';
import {useMMKVString} from 'react-native-mmkv';
import {Storage} from '../constants/Store';
import {PlaylistProps} from './playlist';
import LoadingTrack from '../components/loading';
import FlatlistComponent from '../components/FlatlistComponent';

const PlaylistSongs = ({navigation, route}: any) => {
  const items: PlaylistProps = route.params.item;
  useLayoutEffect(() => {
    navigation.setOptions({
      title: items?.id,
    });
  }, [navigation, items]);

  const id = items?.id;
  const [loading, setLoading] = useState(false);
  const [queueId, setQueueId] = useMMKVString('queueId', Storage);

  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
      {loading && <LoadingTrack />}
      <FlatlistComponent
        items={items.songs}
        id={id}
        queueId={queueId}
        setLoading={setLoading}
        setQueueId={setQueueId}
      />
    </View>
  );
};

export default PlaylistSongs;

const styles = StyleSheet.create({});
