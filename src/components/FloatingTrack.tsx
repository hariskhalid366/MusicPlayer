import React from 'react'; // Removed useState, useEffect
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import TrackPlayer, {
  useActiveTrack,
  // RepeatMode removed as it's handled in RepeatButton
} from 'react-native-track-player';
// Import RepeatButton along with others
import PlayPause, {Forward, MusicSlider, RepeatButton} from './PlayerControls';
import {useNavigation} from '@react-navigation/native';

const FloatingTrack = () => {
  const navigation: any = useNavigation();
  const track = useActiveTrack();

  // Removed repeatMode state and related logic (useEffect, toggleRepeatMode, getRepeatIcon, getRepeatIconStyle)

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
        {/* Replaced TouchableOpacity/Image with RepeatButton component */}
        <RepeatButton size={23} color="#fff" />
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
    fontSize: 15, // Slightly smaller to fit controls
  },
  slider: {
    width: 180, // Adjusted width to make space for repeat button
    height: 25, // Increased height slightly
    marginLeft: -12,
  },
  // Removed controlButton, icon, iconDisabled styles as they are handled within RepeatButton
});

export default FloatingTrack;
