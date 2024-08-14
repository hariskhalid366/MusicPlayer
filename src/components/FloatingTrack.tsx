import {Image, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useActiveTrack} from 'react-native-track-player';
import PlayPause, {Forward, MusicSlider} from './PlayerControls';
import {useNavigation} from '@react-navigation/native';

const FloatingTrack = () => {
  const navigation = useNavigation<any>();

  const track = useActiveTrack();
  if (!track) return null;

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('screen');
      }}
      activeOpacity={0.8}
      className=" items-center w-full absolute bottom-[60px]  ">
      <View
        style={{
          borderWidth: 1.2,
          borderColor: '#ffffff22',
        }}
        className="bg-red-500/90 flex-row p-1 items-center mx-3 rounded-2xl">
        <Image
          source={
            track?.cover
              ? {uri: track?.cover}
              : require('../../assets/tile.jpeg')
          }
          style={{width: 60, height: 60, borderRadius: 50}}
        />
        <View className="flex-1">
          <Text
            className=" mx-2 text-white font-semibold"
            lineBreakMode="tail"
            numberOfLines={1}>
            {track?.title?.slice(0, 29)}
          </Text>
          <MusicSlider
            style={{width: 220, height: 20, marginLeft: -7, padding: 0}}
          />
        </View>
        <PlayPause size={23} color="#fff" />
        <Forward size={23} color="#fff" />
      </View>
    </TouchableOpacity>
  );
};

export default FloatingTrack;
