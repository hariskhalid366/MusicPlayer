import {ActivityIndicator, View, StyleSheet} from 'react-native';
import React from 'react';

const LoadingTrack = () => {
  return (
    <View style={styles.container}>
     <ActivityIndicator color={"#fff"} size={"large"}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: '#00000099',
    position: 'absolute',
    zIndex: 40,
  },
});

export default LoadingTrack;
