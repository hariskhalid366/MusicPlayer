import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import * as Icon from 'react-native-heroicons/outline';
import {useMMKVObject} from 'react-native-mmkv';
import {Storage} from '../constants/Store';
import {MusicFile} from '../components/ListView';
import PlayLIstItemView from '../components/PlayLIstItemView';
import PlaylistModal from '../components/modal/PlaylistModal';

interface PlaylistProps {
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
    const playlistExist = playlistSongs?.some(playlist => {
      playlist.id === playlistName.trim();
    });
    if (!playlistExist) {
      ToastAndroid.showWithGravity(
        'No playlist exists of name' + `${playlistName}`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }

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

  // Ensure playlistSongs is always an array
  const validPlaylistSongs = playlistSongs || [];

  return (
    <View className="flex-1">
      {validPlaylistSongs.length > 0 && (
        <TouchableOpacity
          onPress={() => setModal(true)}
          className="absolute rounded-2xl z-10 bottom-[140px] bg-white right-3 gap-x-1 p-2 flex-row">
          <Icon.PlusIcon strokeWidth={3} color={'#000'} size={20} />
          <Text className="text-sm text-black font-bold">Add Playlist</Text>
        </TouchableOpacity>
      )}
      {validPlaylistSongs.length > 0 ? (
        <ScrollView
          decelerationRate={0.7}
          scrollEventThrottle={17}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingBottom: 150,
          }}>
          {validPlaylistSongs?.map((item, index) => (
            <PlayLIstItemView key={index} {...{index, item}} />
          ))}
        </ScrollView>
      ) : (
        <TouchableOpacity
          onPress={() => setModal(true)}
          className="justify-center items-center rounded-2xl p-2 flex-row">
          <Icon.PlusIcon color={'#fff'} size={23} />
          <Text className="text-base text-white font-semibold tracking-wide">
            Add Playlist
          </Text>
        </TouchableOpacity>
      )}

      <PlaylistModal {...{modal, setModal, text, setText, createPlaylist}} />
    </View>
  );
};

export default Playlist;

const styles = StyleSheet.create({});
