import { View } from 'react-native';
import React, { memo, useLayoutEffect, useState } from 'react';

import LoadingTrack from '../components/loading';
import FlatlistComponent from '../components/FlatlistComponent';

import { useAudioStore } from '../store/useAudioStore';

const PlaylistSongs = ({ navigation, route }: any) => {
  const { id } = route.params;
  const playlist = useAudioStore(state => 
    state.playlists.find(p => p.id === id)
  );
  
  useLayoutEffect(() => {
    navigation.setOptions({
      title: id,
    });
  }, [navigation, id]);

  const [loading, setLoading] = useState(false);

  if (!playlist) return null;

  return (
    <View style={{ flex: 1 }}>
      {loading && <LoadingTrack />}
      <FlatlistComponent items={playlist.songs} id={id} setLoading={setLoading} />
    </View>
  );
};

export default memo(PlaylistSongs);
