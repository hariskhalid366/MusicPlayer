import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
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

  // Fetch music files
  useEffect(() => {
    fetchMusicList();
  }, []);

  const fetchMusicList = useCallback(
    async (forceRefresh = false) => {
      try {
        const permission = await checkAndRequestStoragePermission();
        if (!permission) return;

        if (!forceRefresh && audios.length > 0) return;

        setLoading(true);
        const files = await MusicFiles.getAllAudioFiles();

        if (!files?.length) {
          showToast('No music files found');
          return;
        }

        await TrackPlayer.reset();
        await TrackPlayer.add(files);

        loadAudios(files);

        // Preload covers for smooth scrolling
        const covers = files
          .map((f: any) => f?.cover)
          .filter(Boolean)
          .slice(0, 50)
          .map((uri: string) => ({ uri }));

        if (covers.length) FastImage.preload(covers);
      } catch (error) {
        console.warn('Error fetching music:', error);
      } finally {
        setRefreshing(false);
        setLoading(false);
      }
    },
    [audios.length, loadAudios],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMusicList(true);
  }, [fetchMusicList]);

  // Debounce search input
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 200);
    return () => {
      if (debounceRef.current !== null) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [search]);

  const filteredList = useMemo(
    () => (debouncedSearch ? searchAudios(debouncedSearch) : audios),
    [audios, debouncedSearch, searchAudios],
  );

  const onHandleTrackPlayerSong = useCallback(
    async (item: MusicFile) => {
      handleTrackPlayerSong(item, audios, id, setLoading);
    },
    [audios, id],
  );

  // Render each item, memoized for performance
  const renderItem = useCallback(
    ({ item, index }: { item: MusicFile; index: number }) => (
      <Swipable
        item={item}
        index={index}
        setIsVisible={setIsVisible}
        setCurrentTrack={setCurrentTrack}
      >
        <ListView
          item={item}
          index={index}
          isActive={activeTrack?.url === item.url}
          isPlaying={playing}
          handleTrack={onHandleTrackPlayerSong}
        />
      </Swipable>
    ),
    [activeTrack?.url, playing, onHandleTrackPlayerSong],
  );

  const EmptyComponent = useMemo(
    () =>
      !filteredList.length && !loading ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No songs found</Text>
        </View>
      ) : null,
    [filteredList.length, loading],
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
        data={filteredList}
        renderItem={renderItem}
        keyExtractor={item => item.url}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={EmptyComponent}
        maintainVisibleContentPosition={{ autoscrollToTopThreshold: 50 }}
      />

      <AddSongModal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        currentTrack={currentTrack}
        setCurrentTrack={setCurrentTrack}
      />
    </View>
  );
};

export default memo(Main);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  listContent: { paddingBottom: 100 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#fff', fontSize: 16, marginTop: 20 },
});
