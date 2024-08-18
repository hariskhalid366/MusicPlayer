import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {memo, useCallback} from 'react';
import ListView, {MusicFile} from './ListView';
import {handleTrackPlayerSong} from '../utility/handleTrackChange';

interface FlatlistItemProps {
  id: string;
  items: MusicFile[];
  queueId: string | undefined;
  setLoading: (value: boolean) => void;
  setQueueId: (text: string) => void;
}

const FlatlistComponent = ({
  id,
  items,
  queueId,
  setLoading,
  setQueueId,
}: FlatlistItemProps) => {
  const onHandleTrackPlayerSong = useCallback(
    async (selectedTrack: MusicFile) => {
      return await handleTrackPlayerSong(
        selectedTrack,
        items,
        id,
        queueId,
        setQueueId,
        setLoading,
      );
    },
    [id, items, queueId, setQueueId],
  );
  return (
    <FlatList
      data={items}
      keyExtractor={(item: MusicFile) => item?.url} // Ensure item.id is unique
      renderItem={({item, index}) => (
        <ListView
          key={item.url}
          index={index}
          item={item}
          playlist={true}
          handleTrack={onHandleTrackPlayerSong}
        />
      )}
      ListEmptyComponent={() => (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 5,
          }}>
          <Text style={{fontSize: 16, fontWeight: 'bold', color: '#fff'}}>
            No songs added
          </Text>
        </View>
      )}
      showsVerticalScrollIndicator={false}
      maintainVisibleContentPosition={{
        autoscrollToTopThreshold: 10,
        minIndexForVisible: 20,
      }}
      maxToRenderPerBatch={10}
      decelerationRate={0.6}
      scrollEventThrottle={16}
      contentContainerStyle={{
        paddingHorizontal: 10,
        paddingBottom: 150,
      }}
    />
  );
};

export default memo(FlatlistComponent);

const styles = StyleSheet.create({});
