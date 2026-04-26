import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  Image,
} from 'react-native';
import React, { FC, memo, useCallback } from 'react';
import * as Icon from 'lucide-react-native';
import { MusicFile } from '../../constants/type';
import Header from '../Header';
import { useAudioStore } from '../../store/useAudioStore';

interface AddSongModalProps {
  isVisible: boolean;
  currentTrack: MusicFile | null;
  setIsVisible: (value: boolean) => void;
  setCurrentTrack: (value: MusicFile | null) => void;
}

const AddSongModal: FC<AddSongModalProps> = ({
  isVisible,
  setIsVisible,
  setCurrentTrack,
  currentTrack,
}) => {
  const playlists = useAudioStore(state => state.playlists);
  const addtoPlaylist = useAudioStore(state => state.addtoPlaylist);

  const onAddSong = useCallback(
    (playlistId: string) => {
      if (!currentTrack) return;
      addtoPlaylist(playlistId, currentTrack);
      setIsVisible(false);
      setCurrentTrack(null);
      ToastAndroid.showWithGravity(
        'Song added to playlist',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    },
    [currentTrack, addtoPlaylist, setIsVisible, setCurrentTrack],
  );

  const onClose = () => {
    setIsVisible(false);
    setCurrentTrack(null);
  };

  return (
    <Modal
      transparent
      animationType="slide"
      onRequestClose={onClose}
      visible={isVisible}
    >
      <View style={styles.outerContainer}>
        <View style={styles.innerContainer}>
          <TouchableOpacity onPress={onClose} style={styles.touchable}>
            <Icon.X color={'#fff'} size={23} />
          </TouchableOpacity>
          <ScrollView
            decelerationRate={0.6}
            scrollEventThrottle={16}
            stickyHeaderIndices={[0]}
            contentContainerStyle={{
              paddingHorizontal: 10,
            }}
          >
            <Header title="Add to Playlist" />
            {playlists.map((item, index) => (
              <TouchableOpacity
                onPress={() => onAddSong(item.id)}
              key={item.id}
                activeOpacity={0.8}
                style={styles.container}
              >
                <Image
                  style={styles.image}
                  source={require('../../../assets/playlist.jpeg')}
                  resizeMode="cover"
                />
                <View style={styles.infoContainer}>
                  <Text
                    style={styles.title}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
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

export default memo(AddSongModal);

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#FF00003C',
  },
  innerContainer: {
    height: '100%',
    backgroundColor: '#000',
    width: '100%',
  },
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
