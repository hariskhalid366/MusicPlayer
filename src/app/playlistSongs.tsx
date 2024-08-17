import {StyleSheet, Text, View} from 'react-native';
import React, {useLayoutEffect} from 'react';

const PlaylistSongs = ({navigation, route}: any) => {
  const items = route.params.item;
  useLayoutEffect(() => {
    navigation.setOptions({
      title: items?.id,
    });
  }, [navigation, items]);
  return (
    <View className="justify-center items-center flex-1">
      <Text>Track is empty</Text>
    </View>
  );
};

export default PlaylistSongs;

const styles = StyleSheet.create({});
