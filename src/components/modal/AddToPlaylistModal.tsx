import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ToastAndroid,
} from 'react-native';
import React, { FC } from 'react';
import * as Icon from 'react-native-heroicons/solid';
import {useMMKVObject} from 'react-native-mmkv';
import {Storage} from '../../service/Store';
import {PlaylistProps} from '../../app/playlist';
import { MusicFile } from '../../constants/type';
import Header from '../Header';

interface AddSongModalProps{
  isVisible: boolean,
  currentTrack: MusicFile | null,
  setIsVisible: (value: boolean) => void,
  setCurrentTrack: (value: MusicFile | null) => void

}

const AddSongModal:FC<AddSongModalProps> = ({isVisible,setIsVisible,setCurrentTrack,currentTrack}) => {
  const [playlistSongs, setPlaylistSongs] =
    useMMKVObject<PlaylistProps[]>('playlist', Storage) || [];



  const validPlaylistSongs = playlistSongs || [];

  const addSongToPlaylist = (playlistId: string, song: MusicFile) => {
    const updatedPlaylists = playlistSongs?.map(playlist => {
      if (playlist.id === playlistId) {
        const songExists = playlist.songs.some(
          existingSong => existingSong.url === song.url,
        );

        if (songExists) {
          ToastAndroid.showWithGravity(
            'Song already exists in the playlist',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
          return playlist;
        }

        return {
          ...playlist,
          songs: [...playlist.songs, song],
        };
      }

      return playlist;
    });

    setPlaylistSongs(updatedPlaylists);
    ToastAndroid.showWithGravity(
      'Song added to playlist',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  const onClose=()=>{
     setIsVisible(false);
     setCurrentTrack(null);
  }

  return (
    <Modal
      transparent
      statusBarTranslucent
      animationType='slide'
      onRequestClose={onClose}
      visible={isVisible}>
      <View className="flex-1 justify-end items-center bg-red-500/30">
        <View className="h-screen bg-black w-full rounded-t-3xl">
          <TouchableOpacity
            onPress={onClose}
            style={styles.touchable}>
            <Icon.XMarkIcon color={'#fff'} size={23} />
          </TouchableOpacity>
          <ScrollView
            decelerationRate={0.6}
            scrollEventThrottle={16}
            stickyHeaderIndices={[0]}
          
            contentContainerStyle={{
              paddingHorizontal: 10,
            }}>
              <Header title="Add to Playlist" />
            {validPlaylistSongs.map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  if (currentTrack) {
                    addSongToPlaylist(item.id, currentTrack);
                  }
                  setIsVisible(false);
                }}
                key={index}
                activeOpacity={0.8}
                style={styles.container}>
                <Image
                  style={styles.image}
                  source={require('../../../assets/playlist.jpeg')}
                />
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.title}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {item.id}
                  </Text>
                  <Text style={styles.artist} numberOfLines={1}>
                    {item.songs.length} songs
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AddSongModal;

const styles = StyleSheet.create({
  touchable: {
    alignSelf: 'flex-end',
    padding: 8,
    backgroundColor: '#ffffff33',
    margin: 4,
    borderRadius: 50,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 12,
    marginHorizontal: 8,
    alignItems: 'center',
    borderRadius: 16,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 15,
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  title: {
    fontWeight: '600',
    color: '#fff',
    fontSize: 18,
  },
  artist: {
    color: '#fff',
    fontSize: 14,
  },
});
