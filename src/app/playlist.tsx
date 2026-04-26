import { Text, ToastAndroid, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import React, { memo, useCallback, useMemo, useState } from 'react';
import PlayLIstItemView from '../components/PlayLIstItemView';
import PlaylistModal from '../components/modal/PlaylistModal';
import Header from '../components/Header';
import { MusicFile } from '../constants/type';
import showToast from '../components/Toast';
import { useAudioStore } from '../store/useAudioStore';

export interface PlaylistProps {
  id: string;
  songs: MusicFile[];
}

const Playlist = () => {
  const playlists = useAudioStore(state => state.playlists);
  const createPlaylistInStore = useAudioStore(state => state.createPlaylist);

  const [modal, setModal] = useState(false);
  const [text, setText] = useState<string>('');

  const openModal = useCallback(() => setModal(true), []);
  const closeModal = useCallback(() => setModal(false), []);

  const createPlaylist = useCallback(
    (name: string) => {
      const trimmed = name.trim();

      if (trimmed.length === 0) {
        ToastAndroid.showWithGravity(
          'Playlist title cannot be empty',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        return;
      }

      const exists = playlists?.some(p => p.id === trimmed);
      if (exists) {
        showToast('Playlist Already Exists');
        return;
      }

      createPlaylistInStore(trimmed);
      setText('');
      closeModal();
    },
    [playlists, createPlaylistInStore, closeModal],
  );

  const validplaylists = useMemo(() => playlists ?? [], [playlists]);

  const renderItem = useCallback(
    ({ item, index }: { item: PlaylistProps; index: number }) => (
      <PlayLIstItemView item={item} index={index} />
    ),
    [], // PlayLIstItemView is memo'd — no deps needed here
  );

  const keyExtractor = useCallback((item: PlaylistProps) => item.id, []);

  const ListHeader = useMemo(
    () => <Header title="Playlist" playlist={true} onPress={openModal} />,
    [openModal],
  );

  return (
    <>
      <FlashList
        stickyHeaderIndices={[0]}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingBottom: 150,
        }}
        data={validplaylists}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        // estimatedItemSize={132}
        removeClippedSubviews={true}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff' }}>No data found</Text>
          </View>
        }
      />

      <PlaylistModal
        modal={modal}
        setModal={setModal}
        text={text}
        setText={setText}
        createPlaylist={createPlaylist}
      />
    </>
  );
};

export default memo(Playlist);
