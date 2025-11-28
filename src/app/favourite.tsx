import { Text, View } from 'react-native';
import React, { memo, useState } from 'react';

import LoadingTrack from '../components/loading';
import FlatlistComponent from '../components/FlatlistComponent';
import Header from '../components/Header';
import { useAudioStore } from '../store/useAudioStore';

const Favourite = () => {
  const id = 'favourite';
  const [loading, setLoading] = useState(false);
  const { favourite } = useAudioStore();

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {loading && <LoadingTrack />}
      <FlatlistComponent
        ListHeaderComponent={<Header title="Favourite" />}
        items={favourite}
        id={id}
        setLoading={setLoading}
      />
    </View>
  );
};

export default memo(Favourite);
