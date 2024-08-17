import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import React from 'react';
import * as Icon from 'react-native-heroicons/solid';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {MusicFile} from './ListView';

type ContainerProps = {
  title: string;
  search: string;
  setSearch: (item: string) => void;
  track?: MusicFile[] | string;
};

const HeaderSearchBar = ({search, setSearch, title}: ContainerProps) => {
  const searchVal = useSharedValue(0);
  const ATouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

  const animatedSearchStyle = useAnimatedStyle(() => {
    const height = interpolate(
      searchVal.value,
      [0, 1],
      [1, 45],
      Extrapolation.CLAMP,
    );

    return {
      height,
    };
  });

  const opacityStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      searchVal.value,
      [0, 1],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      opacity: withTiming(opacity, {duration: 200}),
    };
  });

  const searchValue = () => {
    if (searchVal.value === 0) {
      searchVal.value = withSpring(1, {
        damping: 30,
      });
    } else {
      searchVal.value = withSpring(0, {
        damping: 10,
      });
    }
    setSearch('');
  };

  return (
    <View className="px-2.5 mx-[10px]">
      <View className="flex-row justify-between z-10 items-center">
        <Text className="font-semibold text-3xl items-center text-white tracking-wide">
          {title}
        </Text>
        <TouchableOpacity onPress={searchValue}>
          <Icon.MagnifyingGlassIcon size={23} strokeWidth={2} color={'#fff'} />
        </TouchableOpacity>
      </View>
      <Animated.View
        style={animatedSearchStyle}
        className="rounded-xl my-3 overflow-hidden bg-[#ffffff33] px-2 items-center flex-row">
        <TextInput
          value={search}
          onChangeText={e => setSearch(e)}
          placeholder="Search songs"
          placeholderTextColor={'#ffffff99'}
          className="flex-1 text-[15px] text-white"
        />

        <ATouchableOpacity
          style={opacityStyle}
          onPress={() => {
            if (search.length > 0) {
              setSearch('');
            } else {
              searchValue();
            }
          }}>
          <Icon.XMarkIcon size={25} strokeWidth={2} color={'#fff'} />
        </ATouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default HeaderSearchBar;
