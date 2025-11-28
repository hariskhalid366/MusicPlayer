import { View } from 'react-native';
import React, { useLayoutEffect, useState } from 'react';

import { PlaylistProps } from './playlist';
import LoadingTrack from '../components/loading';
import FlatlistComponent from '../components/FlatlistComponent';

const PlaylistSongs = ({ navigation, route }: any) => {
  const items: PlaylistProps = route.params.item;
  useLayoutEffect(() => {
    navigation.setOptions({
      title: items?.id,
    });
  }, [navigation, items]);

  const id = items?.id;
  const [loading, setLoading] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      {loading && <LoadingTrack />}
      <FlatlistComponent items={items.songs} id={id} setLoading={setLoading} />
    </View>
  );
};

export default PlaylistSongs;
