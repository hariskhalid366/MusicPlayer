import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import { View, Text, StyleSheet, NativeModules, FlatList } from 'react-native';
import TrackPlayer, {
  useActiveTrack,
  useIsPlaying,
} from 'react-native-track-player';
import HeaderSearchBar from '../components/HeaderSearchBar';
import ListView from '../components/ListView';
import LoadingTrack from '../components/loading';
import showToast from '../components/Toast';
import { useAudioStore } from '../store/useAudioStore';
import { handleTrackPlayerSong } from '../utility/handleTrackChange';
import { MusicFile } from '../constants/type';
import Swipable from '../components/Swipable';
import { checkAndRequestStoragePermission } from '../constants/Permission';
import AddSongModal from '../components/modal/AddToPlaylistModal';
import Input from '../components/Input';
import { LucideMail } from 'lucide-react-native';

const { MusicFiles } = NativeModules;
const PLAYLIST_ID = 'songs';
const DEBOUNCE_MS = 200;

const EmptyList = memo(() => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>No songs found</Text>
  </View>
));

type RowProps = {
  item: MusicFile;
  index: number;
  isActive: boolean;
  isPlaying: boolean;
  onTrack: (item: MusicFile) => void;
  setIsVisible: (v: boolean) => void;
  setCurrentTrack: (t: MusicFile) => void;
};

const SongRow = memo(
  ({
    item,
    index,
    isActive,
    isPlaying,
    onTrack,
    setIsVisible,
    setCurrentTrack,
  }: RowProps) => {
    return (
      <Swipable
        item={item}
        index={index}
        setIsVisible={setIsVisible}
        setCurrentTrack={setCurrentTrack}
      >
        <ListView
          item={item}
          index={index}
          isActive={isActive}
          isPlaying={isPlaying}
          handleTrack={onTrack}
        />
      </Swipable>
    );
  },
  (prev, next) => {
    return (
      prev.item.url === next.item.url &&
      prev.item.liked === next.item.liked &&
      prev.isActive === next.isActive &&
      prev.isPlaying === next.isPlaying &&
      prev.index === next.index
    );
  },
);

const Main = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicFile | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeTrack = useActiveTrack();
  const { playing } = useIsPlaying();

  const { loadAudios, audios, isLoading, searchAudios } = useAudioStore();

  const fetchMusicList = useCallback(
    async (forceRefresh = false) => {
      try {
        const hasPermission = await checkAndRequestStoragePermission();
        if (!hasPermission) return;

        if (!forceRefresh && audios.length > 0) return;

        setLoading(true);

        const files: MusicFile[] = await MusicFiles.getAllAudioFiles();

        if (!files?.length) {
          showToast('No music files found');
          return;
        }

        await TrackPlayer.add(files);
        loadAudios(files);
      } catch (error) {
        console.warn('Error fetching music:', error);
        showToast('Failed to load music files');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [audios.length, loadAudios],
  );

  useEffect(() => {
    fetchMusicList();
  }, [fetchMusicList]);

  const activeTrackRef = useRef<string | null>(activeTrack?.url ?? null);
  activeTrackRef.current = activeTrack?.url ?? null;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMusicList(true);
  }, [fetchMusicList]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(
      () => setDebouncedSearch(search),
      DEBOUNCE_MS,
    );
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search]);

  const filteredList = useMemo(
    () => (debouncedSearch ? searchAudios(debouncedSearch) : audios),
    [audios, debouncedSearch, searchAudios],
  );

  const onHandleTrackPlayerSong = useCallback(
    (item: MusicFile) => {
      handleTrackPlayerSong(item, audios, PLAYLIST_ID, setLoading);
    },
    [audios],
  );

  const playingRef = useRef<boolean>(!!playing);
  playingRef.current = !!playing;

  const renderItem = useCallback(
    ({ item, index }: { item: MusicFile; index: number }) => {
      const isActive = activeTrackRef.current === item.url;

      return (
        <SongRow
          item={item}
          index={index}
          isActive={isActive}
          isPlaying={isActive && playingRef.current}
          onTrack={onHandleTrackPlayerSong}
          setIsVisible={setIsVisible}
          setCurrentTrack={setCurrentTrack}
        />
      );
    },
    [onHandleTrackPlayerSong],
  );

  const showEmptyComponent =
    !filteredList.length && !loading && !isLoading ? EmptyList : undefined;

  const Header = useMemo(
    () => (
      <>
      <HeaderSearchBar
        title="Songs"
        search={search}
        setSearch={setSearch}
        track={audios}
      />
      <Input  secureTextEntry={true} leftIcon={LucideMail} iconSize={24} placeholder='Email' placeholderTextColor={"green"} iconColor='red'/>
      </>
    ),
    [search, audios],
  );

  return (
    <View style={styles.container}>
      {(loading || isLoading) && !refreshing && <LoadingTrack />}

      <FlatList
        ListHeaderComponent={Header}
        stickyHeaderIndices={[0]}
        data={filteredList}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={showEmptyComponent}
        scrollEventThrottle={0.4}
        removeClippedSubviews={true}
        initialNumToRender={20}
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

const keyExtractor = (item: MusicFile) => item.url;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  listContent: { paddingBottom: 100 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#fff', fontSize: 16, marginTop: 20 },
});
