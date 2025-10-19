import {ActivityIndicator, View} from 'react-native';
import React from 'react';

const LoadingTrack = () => {
  return (
    <View className="justify-center items-center h-full w-full bg-[#00000099]  absolute z-40">
     <ActivityIndicator color={"#fff"} size={"large"}/>
    </View>
  );
};

export default LoadingTrack;
