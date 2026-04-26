import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { memo } from 'react';
import * as Outline from 'lucide-react-native';

interface HeaderProps {
  title: string;
  playlist?: boolean;
  onPress?: () => void;
}

const Header = ({ title, playlist, onPress }: HeaderProps) => {
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
      {playlist && (
        <TouchableOpacity onPress={onPress} style={styles.plusButton}>
          <Outline.PlusIcon color={'#fff'} size={23} />
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    alignItems: 'center',
    backgroundColor: '#00000099',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 23,
    fontWeight: 'bold',
  },
  plusButton: {
    position: 'absolute',
    right: 10,
    alignSelf: 'center',
    top: 20,
  },
});

export default memo(Header);
