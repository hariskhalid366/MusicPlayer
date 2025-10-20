import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import * as Outline from "react-native-heroicons/outline"

interface HeaderProps {
  title: string;
  playlist?: boolean
  onPress?: () => void
}

const Header = ({ title, playlist, onPress }: HeaderProps) => {
  return (
    <>
      <View className="h-[60px] items-center bg-black/80 justify-center">
        <Text style={{ color: '#fff', fontSize: 23, fontWeight: 'bold' }}>
          {title}
        </Text>
      </View>
      {playlist &&
        <TouchableOpacity onPress={onPress} style={{ position: "absolute", right: 10, alignSelf: "center", top: 20 }}>
          <Outline.PlusIcon color={"#fff"} size={23} />
        </TouchableOpacity>}
    </>
  );
};

export default Header;
