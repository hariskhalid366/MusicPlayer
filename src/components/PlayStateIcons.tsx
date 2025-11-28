import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useIsPlaying } from 'react-native-track-player';
import * as Icon from 'lucide-react-native';

const PlayStateIcons = ({ isActive }: any) => {
  const { playing } = useIsPlaying();
  return (
    <View style={styles.icon}>
      {isActive ? (
        playing ? (
          <Icon.PauseIcon size={23} color="#fff" />
        ) : (
          <Icon.PlayIcon size={23} color="#fff" />
        )
      ) : (
        <Icon.AudioLines size={23} color="#fff" />
      )}
    </View>
  );
};

export default PlayStateIcons;

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
    width: 60,
    height: 60,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff22',
    borderRadius: 12,
  },
});
