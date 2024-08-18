import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useActiveTrack} from 'react-native-track-player';
import PlayPause, {Forward, MusicSlider} from './PlayerControls';
import {useNavigation} from '@react-navigation/native';

const FloatingTrack = () => {
  const navigation: any = useNavigation();
  const track = useActiveTrack();

  if (!track) return null;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('screen')}
      activeOpacity={0.8}
      style={styles.container}>
      <View style={styles.innerContainer}>
        <Image
          source={
            track?.cover
              ? {uri: track.cover}
              : require('../../assets/tile.jpeg')
          }
          style={styles.image}
        />
        <View style={styles.trackInfo}>
          <Text
            style={styles.trackTitle}
            numberOfLines={1}
            ellipsizeMode="tail">
            {track.title?.slice(0, 29)}
          </Text>
          <MusicSlider style={styles.slider} />
        </View>
        <PlayPause size={23} color="#fff" />
        <Forward size={23} color="#fff" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '95%',
    position: 'absolute',
    alignItems: 'center',
    alignSelf: 'center',
    bottom: 59,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 1,
    height: 66,
    marginHorizontal: 3,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    borderWidth: 1.2,
    borderColor: '#ffffff22',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 15,
  },
  trackInfo: {
    flex: 1,
    marginLeft: 8,
  },
  trackTitle: {
    color: '#fff',
    fontWeight: '600',
  },
  slider: {
    width: 220,
    height: 20,
    marginLeft: -12,
  },
});

export default FloatingTrack;
