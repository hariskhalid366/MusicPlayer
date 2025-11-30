import { Text, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import React, { memo, useCallback, useMemo } from 'react';
import ListView from './ListView';
import { handleTrackPlayerSong } from '../utility/handleTrackChange';
import { MusicFile } from '../constants/type';
import { useActiveTrack, useIsPlaying } from 'react-native-track-player';

interface FlatlistItemProps {
  id: string;
  items: MusicFile[];
  setLoading: (value: boolean) => void;
  ListHeaderComponent?: React.ReactElement | null; // Optional header component
}

const FlatlistComponent = ({
  id,
  items,
  setLoading,
  ListHeaderComponent,
}: FlatlistItemProps) => {
  const activeTrack = useActiveTrack();
  const { playing } = useIsPlaying();

  const onHandleTrackPlayerSong = useCallback(
    async (selectedTrack: MusicFile) => {
      return await handleTrackPlayerSong(selectedTrack, items, id, setLoading);
    },
    [id, items, setLoading],
  );

  const renderItem = useCallback(
    ({ item, index }: any) =>
      item.header && ListHeaderComponent ? (
        <View>{ListHeaderComponent}</View>
      ) : (
        <ListView
          isActive={activeTrack?.url === item?.url}
          isPlaying={playing}
          item={item}
          index={index}
          handleTrack={onHandleTrackPlayerSong}
        />
      ),
    [playing, activeTrack?.url, onHandleTrackPlayerSong, ListHeaderComponent],
  );

  const combinedData = useMemo(
    () => (ListHeaderComponent ? [{ header: true }, ...items] : items),
    [items, ListHeaderComponent],
  );

  return (
    <FlashList
      data={combinedData}
      keyExtractor={(item: any, index: number) =>
        item?.url ? item.url : `header-${index}`
      }
      renderItem={renderItem}
      stickyHeaderIndices={ListHeaderComponent ? [0] : undefined}
      ListEmptyComponent={() => (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 5,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>
            No songs added
          </Text>
        </View>
      )}
      showsVerticalScrollIndicator={false}
      maintainVisibleContentPosition={{
        autoscrollToTopThreshold: 10,
      }}
      removeClippedSubviews={true}
      decelerationRate={0.2}
      scrollEventThrottle={16}
      contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 150 }}
    />
  );
};

export default memo(FlatlistComponent);
