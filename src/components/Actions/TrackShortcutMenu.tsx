import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {useMMKVObject} from 'react-native-mmkv';
import * as Icon from 'react-native-heroicons/outline';
import Animated from 'react-native-reanimated';
import {MusicFile} from '../ListView';
import {Storage} from '../../constants/Store';

type Props = {
  itemUrl: string;
  track: MusicFile;
  children: any;
};

const TrackShortcutMenu = ({children, itemUrl, track}: Props) => {
  const [like, setLike] = useMMKVObject<MusicFile[]>('liked', Storage);

  const isLiked = (itemUrl: string) =>
    like?.some(likedItem => likedItem.url === itemUrl);

  const ToggleLike = (track: MusicFile) => {
    setLike(prevLikedItems => {
      if (!prevLikedItems) {
        return [track];
      }
      if (prevLikedItems.some(likedItem => likedItem.url === track.url)) {
        return prevLikedItems.filter(likedItem => likedItem.url !== track.url);
      } else {
        return [...prevLikedItems, track];
      }
    });
  };

  const handlePresses = (id: string) => {
    if (id === 'add-to-playlist') {
      console.log('add to playlist');
    }
    if (id === 'add-to-favourite') {
      // ToggleLike(track);
    }
  };

  const viewStyle = 'space-x-2 flex-row items-center';
  return (
    <View style={{zIndex: 50}}>
      <Animated.View
        style={{
          position: 'absolute',
          zIndex: 50,
          top: 10,
          right: 10,
          width: 150,
          backgroundColor: 'rgba(255, 0, 0, 0.8)',
          borderRadius: 10,
          padding: 10,
        }}>
        <TouchableOpacity
          onPress={() => {
            console.log('Hell');
          }}
          className={viewStyle}>
          <Icon.PlusIcon size={23} color={'#fff'} />
          <Text style={{color: '#fff', marginLeft: 5}}>Add to playlist</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            console.log('Hell');
          }}
          className={viewStyle}>
          <Icon.PlusIcon size={23} color={'#fff'} />
          <Text style={{color: '#fff', marginLeft: 5}}>Add to playlist</Text>
        </TouchableOpacity>
      </Animated.View>
      {children}
    </View>
  );
};

export default TrackShortcutMenu;
