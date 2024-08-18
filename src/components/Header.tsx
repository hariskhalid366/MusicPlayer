import {View, Text} from 'react-native';
import React from 'react';

interface HeaderProps {
  title: string;
}

const Header = ({title}: HeaderProps) => {
  return (
    <View className="h-[60px] items-center bg-black/80 justify-center">
      <Text style={{color: '#fff', fontSize: 23, fontWeight: 'bold'}}>
        {title}
      </Text>
    </View>
  );
};

export default Header;
