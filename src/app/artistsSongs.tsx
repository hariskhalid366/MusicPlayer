import {ScrollView, View} from 'react-native';
import React, {memo, useCallback, useRef, useState} from 'react';
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
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingBottom: 150,
        }}>
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

export default memo(ArtistsSongs);
