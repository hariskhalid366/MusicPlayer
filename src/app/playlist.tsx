import { Text, ToastAndroid, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
const AnyFlashList: any = FlashList as unknown as any;
import React, { useState } from 'react';
import { useMMKVObject } from 'react-native-mmkv';
import { Storage } from '../store/storage';
import PlayLIstItemView from '../components/PlayLIstItemView';
import PlaylistModal from '../components/modal/PlaylistModal';
import Header from '../components/Header';
import { MusicFile } from '../constants/type';
import showToast from '../components/Toast';

export interface PlaylistProps {
  id: string;
  songs: MusicFile[];
}

const Playlist = () => {
  const [playlistSongs, setPlaylistSongs] =
    useMMKVObject<PlaylistProps[]>('playlist', Storage) || [];
  const [modal, setModal] = useState(false);
  const [text, setText] = useState<string>('');

  const createPlaylist = async (item: string) => {
    const newPlaylist: PlaylistProps = {
      id: item.trim(),
      songs: [],
    };

    if (newPlaylist.id.length === 0) {
      ToastAndroid.showWithGravity(
        'Playlist title cannot be empty',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }

    const playlistExists = playlistSongs?.some(
      playlist => playlist.id === newPlaylist.id,
    );

    if (playlistExists) {
      showToast('Playlist Already Exists');
      return;
    }

    setPlaylistSongs(prev => [...(prev || []), newPlaylist]);
    setText('');
    setModal(false);
  };

  const deletePlaylist = (playlistName: string) => {
    const updatePlaylist = playlistSongs?.filter(
      playlist => playlist.id !== playlistName,
    );
    setPlaylistSongs(updatePlaylist);
    showToast('Playlist removed');
  };

  const validPlaylistSongs = playlistSongs || [];

  return (
    <>
      <AnyFlashList
        stickyHeaderIndices={[0]}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingBottom: 150,
        }}
        data={validPlaylistSongs}
        renderItem={({
          item,
          index,
        }: {
          item: PlaylistProps;
          index: number;
        }) => <PlayLIstItemView {...{ index, item, deletePlaylist }} />}
        keyExtractor={(item: any) => item.id}
        estimatedItemSize={132}
        removeClippedSubviews={true}
        ListHeaderComponent={
          <Header
            title="Playlist"
            playlist={true}
            onPress={() => setModal(true)}
          />
        }
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff' }}>Hello</Text>
          </View>
        }
      />

      <PlaylistModal {...{ modal, setModal, text, setText, createPlaylist }} />
    </>
  );
};

export default Playlist;
