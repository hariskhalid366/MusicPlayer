import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import * as Icon from 'lucide-react-native';
import TrackPlayer from 'react-native-track-player';

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    marginHorizontal: 4,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.5,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    width: 128,
    margin: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
});

export const PlayAll = ({ track }: any) => {
  return (
    <TouchableOpacity
      style={styles.controls}
      onPress={() => {
        TrackPlayer.setQueue(track);
        TrackPlayer.play();
      }}
    >
      <Icon.PlayIcon size={23} color={'#fff'} />
      <Text style={styles.text}>Play</Text>
    </TouchableOpacity>
  );
};

// export const ShuffleQueue = ({ track }: any) => {
//   return (
//     <TouchableOpacity style={styles.controls}>
//       <Icon.ArrowPathRoundedSquareIcon size={23} color={'#fff'} />
//       <Text style={styles.text}>Shuffle</Text>
//     </TouchableOpacity>
//   );
// };
