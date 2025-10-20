import {
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import * as Icon from 'react-native-heroicons/outline';
import { useMMKVObject } from 'react-native-mmkv';
import { Storage } from '../service/Store';
import PlayLIstItemView from '../components/PlayLIstItemView';
import PlaylistModal from '../components/modal/PlaylistModal';
import Header from '../components/Header';
import { MusicFile } from '../constants/type';

export interface PlaylistProps {
  id: string;
  songs: MusicFile[];
}

const Playlist = () => {
  // Initialize playlistSongs as an empty array if undefined
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
      ToastAndroid.showWithGravity(
        'Playlist Already Exists',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }

    // Update playlistSongs with the new playlist
    setPlaylistSongs(prev => [...(prev || []), newPlaylist]);
    setText('');
    setModal(false);
  };

  const deletePlaylist = (playlistName: string) => {
    const updatePlaylist = playlistSongs?.filter(
      playlist => playlist.id !== playlistName,
    );
    setPlaylistSongs(updatePlaylist);

    ToastAndroid.showWithGravity(
      'Playlist removed',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };



  const validPlaylistSongs = playlistSongs || [];

  return (
    <>
      <ScrollView
        stickyHeaderIndices={[0]}
        decelerationRate={0.6}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingBottom: 150,
        }}>
        <Header title="Playlist" playlist={true} onPress={() => setModal(true)} />
        {validPlaylistSongs.length === 0 && 
        < View
          style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 5,
        }}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#fff' }}>
          Add Playlist 
        </Text>
    </View>}
{
  validPlaylistSongs?.map((item, index) => (
    <PlayLIstItemView key={index} {...{ index, item, deletePlaylist }} />
  ))
}
        </ScrollView >

  <PlaylistModal {...{ modal, setModal, text, setText, createPlaylist }} />
    </ >
  );
};

export default Playlist;
