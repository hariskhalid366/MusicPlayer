import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import React, { memo } from 'react';
import * as Icon from 'lucide-react-native';

import { MusicFile } from '../constants/type';

type ContainerProps = {
  title: string;
  search: string;
  setSearch: (item: string) => void;
  track?: MusicFile[];
};

const HeaderSearchBar = ({ search, setSearch, title }: ContainerProps) => {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          autoFocus={false}
          value={search}
          onChangeText={setSearch}
          placeholder="Search"
          placeholderTextColor="#ffffff99"
          style={styles.textInput}
        />
        {search.length > 0 && (
          <TouchableOpacity
            style={{ justifyContent: 'center', paddingHorizontal: 2 }}
            onPress={() => {
              setSearch('');
            }}
          >
            <Icon.X size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default memo(HeaderSearchBar);

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 14,
    height: 120,
    borderBottomWidth: 0.6,
    borderBottomColor: '#ffffff11',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 60,
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
    fontSize: 28,
    color: '#fff',
    letterSpacing: 0.8,
  },
  searchContainer: {
    backgroundColor: '#ffffff1A',
    borderRadius: 10,
    overflow: 'hidden',
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#fff',
    paddingRight: 6,
  },
});
