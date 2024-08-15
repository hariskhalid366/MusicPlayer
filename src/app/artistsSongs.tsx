import {ScrollView, Text, View} from 'react-native';
import React, {memo, useCallback, useRef, useState} from 'react';
import * as Icon from 'react-native-heroicons/solid';
import ListView, {MusicFile} from '../components/ListView';
import {useQueue} from '../constants/QueueStore';
import {handleTrackPlayerSong} from '../utility/handleTrackChange';
import LoadingTrack from '../components/loading';

const ArtistsSongs = ({route}: any) => {
  const queueOffset = useRef(0);
  const songs: MusicFile[] = route?.params?.songs;
  const id = songs[0].artist;
  const [loading, setLoading] = useState(false);
  const {activeQueueId, setActiveQueueId} = useQueue();

  const onHandleTrackPlayerSong = useCallback(
    async (selectedTrack: MusicFile) => {
      await handleTrackPlayerSong(
        selectedTrack,
        songs,
        id,
        activeQueueId,
        setActiveQueueId,
        queueOffset.current, // Pass the current ref value
        setLoading,
      );
    },
    [id, songs, activeQueueId, setActiveQueueId, queueOffset],
  );

  return (
    <View style={{flex: 1, backgroundColor: '#000'}}>
      {loading && <LoadingTrack />}
      <ScrollView
        decelerationRate={0.7}
        scrollEventThrottle={17}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingBottom: 150,
        }}>
        <View className="justify-center my-2 items-center">
          <Text className="font-bold px-4 text-center tracking-wide text-white text-xl">
            {songs[0].artist}
          </Text>
        </View>
        {songs.map((item, index) => (
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

export default ArtistsSongs;
