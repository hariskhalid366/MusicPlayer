import React, {
  memo,
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
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
import AddSongModal from '../components/modal/AddToPlaylistModal';
import { FlatList } from 'react-native-gesture-handler';

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

  const [isVisible, setIsVisible] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicFile | null>(null);
  useEffect(() => {
    fetchMusicList();
  }, []);

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

        try {
          await TrackPlayer.add(files);
        } catch (err) {
          console.warn('TrackPlayer.add failed:', err);
        }

        loadAudios(files);
        try {
          const covers = files
            .map((f: any) => f?.cover)
            .filter(Boolean)
            .slice(0, 50)
            .map((uri: string) => ({ uri }));

          if (covers.length) FastImage.preload(covers);
        } catch (err) {
          console.warn('FastImage preload failed:', err);
        }
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
      handleTrackPlayerSong(item, audios, id, setLoading);
    },
    [audios, id],
  );

  const renderItem = useCallback(
    ({ item, index }: any) => (
      <Swipable
        item={item}
        index={index}
        setIsVisible={setIsVisible}
        setCurrentTrack={setCurrentTrack}
      >
        <ListView
          isActive={activeTrack?.url === item?.url}
          isPlaying={playing}
          item={item}
          index={index}
          handleTrack={onHandleTrackPlayerSong}
        />
      </Swipable>
    ),
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
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
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

      <FlashList
        data={sList.length > 0 ? sList : audios}
        renderItem={renderItem}
        keyExtractor={(item: MusicFile) => item.url}
        maintainVisibleContentPosition={{
          autoscrollToTopThreshold: 50,
        }}
        renderToHardwareTextureAndroid={true}
        refreshing={refreshing}
        onRefresh={onRefresh}
        // minIndexForVisible: 0,
        // maxToRenderPerBatch={30}
        // windowSize={15}
        // estimatedItemSize={82}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={EmptyComponent}
        showsVerticalScrollIndicator={false}
        optimizeItemArrangement={true}
        decelerationRate={0.2}
      />
      <AddSongModal
        {...{ isVisible, setCurrentTrack, setIsVisible, currentTrack }}
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
