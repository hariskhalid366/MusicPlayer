import React, {
  memo,
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
} from 'react';
import { View, Text, RefreshControl, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
const AnyFlashList: any = FlashList as unknown as any;
import TrackPlayer, {
  useActiveTrack,
  useIsPlaying,
} from 'react-native-track-player';
import HeaderSearchBar from '../components/HeaderSearchBar';
import ListView from '../components/ListView';
import LoadingTrack from '../components/loading';
import showToast from '../components/Toast';
import { useAudioStore } from '../store/useAudioStore';
import { NativeModules } from 'react-native';
import { handleTrackPlayerSong } from '../utility/handleTrackChange';
import { MusicFile } from '../constants/type';
import Swipable from '../components/Swipable';
import { checkAndRequestStoragePermission } from '../constants/Permission';
import FastImage from 'react-native-fast-image';
import { InteractionManager } from 'react-native';

const { MusicFiles } = NativeModules;

const Main = () => {
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const debounceRef = useRef<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const activeTrack = useActiveTrack();
  const { playing } = useIsPlaying();

  const id = 'songs';
  const { loadAudios, audios, isLoading, searchAudios } = useAudioStore();

  const fetchMusicList = useCallback(
    async (forceRefresh = false) => {
      try {
        const permission = await checkAndRequestStoragePermission();
        if (!permission) return;

        if (!forceRefresh && audios.length > 0) {
          return;
        }

        setLoading(true);

        const files = await MusicFiles.getAllAudioFiles();
        if (!files?.length) {
          showToast('No music files found');
          return;
        }

        await TrackPlayer.reset();

        // avoid blocking UI with TrackPlayer.add for large lists — do it after interactions
        InteractionManager.runAfterInteractions(async () => {
          try {
            await TrackPlayer.add(files);
          } catch (err) {
            console.warn('TrackPlayer.add failed:', err);
          }
        });

        // update app state first so we can render quickly; TrackPlayer queue is populated shortly after
        loadAudios(files);

        // warm image cache for album covers to reduce jank while scrolling
        InteractionManager.runAfterInteractions(() => {
          try {
            const covers = files
              .map((f: any) => f?.cover)
              .filter(Boolean)
              .slice(0, 50) // preload a small subset to avoid memory blow-up
              .map((uri: string) => ({ uri }));

            if (covers.length) FastImage.preload(covers);
          } catch (err) {
            console.warn('FastImage preload failed:', err);
          }
        });
      } catch (error) {
        console.log('Error fetching music:', error);
      } finally {
        setRefreshing(false);
        setLoading(false);
      }
    },
    [audios.length, loadAudios],
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMusicList(true);
  };

  const onHandleTrackPlayerSong = useCallback(
    async (item: MusicFile) => {
      // handleTrackPlayerSong is an imported util — keep parent stable
      handleTrackPlayerSong(item, audios, id, setLoading);
    },
    [audios, id],
  );

  const renderItem = useCallback(
    ({ item, index }: any) => (
      <Swipable>
        <ListView
          isActive={activeTrack?.url === item?.url}
          isPlaying={playing}
          item={item}
          index={index}
          handleTrack={onHandleTrackPlayerSong}
        />
      </Swipable>
    ),
    // keep dependencies minimal so renderItem identity is stable
    [onHandleTrackPlayerSong, playing, activeTrack?.url, audios],
  );

  const EmptyComponent = useMemo(
    () =>
      !audios.length && !loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No songs found</Text>
        </View>
      ) : null,
    [audios.length, loading],
  );

  useEffect(() => {
    // clear previous timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // debounce to 200ms — reduces re-filtering while typing
    // @ts-ignore
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 200);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [search]);

  const sList = useMemo(
    () => searchAudios(debouncedSearch),
    [searchAudios, debouncedSearch],
  );

  return (
    <View style={styles.container}>
      {(loading || isLoading) && !refreshing && <LoadingTrack />}

      <HeaderSearchBar
        title="Songs"
        search={search}
        setSearch={setSearch}
        track={audios}
      />

      <AnyFlashList
        data={sList.length > 0 ? sList : audios}
        renderItem={renderItem}
        keyExtractor={(item: MusicFile) => item.url}
        estimatedItemSize={82}
        maintainVisibleContentPosition={{
          autoscrollToTopThreshold: 10,
        }}
        decelerationRate={0.6}
        scrollEventThrottle={16}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={EmptyComponent}
      />
    </View>
  );
};

export default memo(Main);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#fff', fontSize: 16, marginTop: 20 },
  listContent: { paddingBottom: 100 },
});
