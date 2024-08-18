import {FlatList, Text, View} from 'react-native';
import React, {memo, useCallback} from 'react';
import ListView, {MusicFile} from './ListView';
import {handleTrackPlayerSong} from '../utility/handleTrackChange';

interface FlatlistItemProps {
  id: string;
  items: MusicFile[];
  queueId: string | undefined;
  setLoading: (value: boolean) => void;
  setQueueId: (text: string) => void;
  ListHeaderComponent?: React.ReactElement | null; // Optional header component
}

const FlatlistComponent = ({
  id,
  items,
  queueId,
  setLoading,
  setQueueId,
  ListHeaderComponent, // Destructure the optional header component
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

  // Combine the header component with the list data if the header is provided
  const combinedData = ListHeaderComponent ? [{header: true}, ...items] : items;

  return (
    <FlatList
      data={combinedData}
      keyExtractor={(item: any, index) =>
        item?.url ? item.url : `header-${index}`
      }
      renderItem={({item, index}) =>
        item.header && ListHeaderComponent ? (
          <View>{ListHeaderComponent}</View> // Wrap the header in a View
        ) : (
          <ListView
            key={item.url}
            index={index}
            item={item}
            playlist={true}
            handleTrack={onHandleTrackPlayerSong}
          />
        )
      }
      stickyHeaderIndices={ListHeaderComponent ? [0] : undefined} // Make the first index sticky if there's a header
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
