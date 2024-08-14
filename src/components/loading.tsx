import {View} from 'react-native';
import React from 'react';
import LoaderKit from 'react-native-loader-kit';

const LoadingTrack = () => {
  return (
    <View className="justify-center items-center h-full w-full bg-[#00000099]  absolute z-40">
      <LoaderKit
        name="BallGridPulse"
        color="#fff"
        style={{width: 40, height: 40}}
      />
    </View>
  );
};

export default LoadingTrack;
