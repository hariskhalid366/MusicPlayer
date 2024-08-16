import {View, Text, Platform} from 'react-native';
import React from 'react';
import {MenuView} from '@react-native-menu/menu';
import {useMMKVObject} from 'react-native-mmkv';
import {MusicFile} from '../ListView';
import {Storage} from '../../constants/Store';

type Props = {
  itemUrl: string;
  track: MusicFile;
  children: any;
};

const TrackShortcutMenu = ({itemUrl, track, children}: Props) => {
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
      ToggleLike(track);
    }
  };

  return (
    <MenuView
      onPressAction={({nativeEvent: {event}}) => handlePresses(event)}
      isAnchoredToRight={true}
      actions={[
        {
          id: 'add-to-playlist',
          title: 'Add to playlist',
          image: Platform.select({
            ios: 'plus',
            android: 'ic_menu_add',
          }),
          imageColor: '#fff',
        },
        {
          id: 'add-to-favourite',
          title: isLiked(itemUrl)
            ? 'Remove from favourite'
            : 'Add to favourite',
          image: Platform.select({
            android: isLiked(itemUrl) ? 'ic_favorite' : 'ic_favorite_border',
            ios: isLiked(itemUrl) ? 'heart.fill' : 'heart',
          }),
          imageColor: '#e74444',
        },
      ]}>
      {children}
    </MenuView>
  );
};

export default TrackShortcutMenu;
