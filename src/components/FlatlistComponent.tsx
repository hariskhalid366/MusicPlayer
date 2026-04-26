import { Text, View, FlatList } from 'react-native';
import React, { memo, useCallback, useMemo, useRef } from 'react';
import ListView from './ListView';
import { handleTrackPlayerSong } from '../utility/handleTrackChange';
import { MusicFile } from '../constants/type';
import { useActiveTrack, useIsPlaying } from 'react-native-track-player';

interface FlatlistItemProps {
  id: string;
  items: MusicFile[];
  setLoading: (value: boolean) => void;
  ListHeaderComponent?: React.ReactElement | null;
}

const EmptyPlaylist = memo(() => (
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
));

const FlatlistComponent = ({
  id,
  items,
  setLoading,
  ListHeaderComponent,
}: FlatlistItemProps) => {
  // Subscribe to only the url string — avoids whole-object re-subscription
  const activeTrack = useActiveTrack();
  const activeUrl = activeTrack?.url ?? null;
  const { playing } = useIsPlaying();

  // Keep latest values in refs so renderItem closure never goes stale
  const activeUrlRef = useRef<string | null>(activeUrl);
  const playingRef = useRef<boolean>(!!playing);
  activeUrlRef.current = activeUrl;
  playingRef.current = !!playing;

  const onHandleTrackPlayerSong = useCallback(
    async (selectedTrack: MusicFile) =>
      handleTrackPlayerSong(selectedTrack, items, id, setLoading),
    [id, items, setLoading],
  );

  // renderItem reads only refs → no closure re-creation on play/pause
  const renderItem = useCallback(
    ({ item, index }: { item: MusicFile; index: number }) => {
      const isActive = activeUrlRef.current === item.url;
      return (
        <ListView
          isActive={isActive}
          isPlaying={isActive && playingRef.current}
          item={item}
          index={index}
          handleTrack={onHandleTrackPlayerSong}
        />
      );
    },
    // Only re-create when handler itself changes (items/id)
    // play/pause changes are handled via refs + ListView memo
    [onHandleTrackPlayerSong],
  );

  const keyExtractor = useCallback((item: MusicFile) => item.url, []);

  return (
    <FlatList
      data={items}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={ListHeaderComponent}
      stickyHeaderIndices={ListHeaderComponent ? [0] : undefined}
      ListEmptyComponent={EmptyPlaylist}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      decelerationRate={0.2}
      scrollEventThrottle={16}
      initialNumToRender={15}
      contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 150 }}
    />
  );
};

export default memo(FlatlistComponent);
