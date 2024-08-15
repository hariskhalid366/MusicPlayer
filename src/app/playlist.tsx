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

  // Ensure playlistSongs is always an array
  const validPlaylistSongs = playlistSongs || [];

  return (
    <View className="flex-1">
      {validPlaylistSongs.length > 0 ? (
        <ScrollView
          decelerationRate={0.7}
          scrollEventThrottle={17}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingBottom: 150,
          }}>
          {validPlaylistSongs?.map((item, index) => (
            <PlayLIstItemView {...{index, item}} />
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

      <Modal transparent animationType="slide" visible={modal}>
        <Pressable
          onPress={() => setModal(false)}
          className="flex-1 justify-center z-0 items-center bg-[#00000088]">
          <View className="w-2/3 z-20 rounded-xl p-3 justify-between bg-zinc-800">
            <Text className="text-white text-xl font-bold">
              Create a playlist
            </Text>
            <View className="my-2 space-y-1">
              <Text className="text-white font-semibold text-sm">Title</Text>
              <TextInput
                autoFocus
                value={text}
                onChangeText={e => setText(e)}
                maxLength={160}
                cursorColor={'#ffffff'}
                style={{
                  borderBottomWidth: 2,
                  padding: 0,
                  borderBottomColor: '#fff',
                }}
              />
              <Text className="text-right">{text.length}/160</Text>
            </View>
            <View className="flex-row items-center justify-end space-x-8 mt-4 mb-1">
              <TouchableOpacity onPress={() => setModal(false)}>
                <Text className="text-white font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => createPlaylist(text)}>
                <Text className="text-white font-semibold">Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Playlist;

const styles = StyleSheet.create({});
