import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, { FC } from 'react';
import { PlaylistModalProps } from '../../constants/type';

const PlaylistModal: FC<PlaylistModalProps> = ({
  modal,
  setModal,
  text,
  setText,
  createPlaylist,
}) => {
  return (
    <Modal transparent animationType="slide" visible={modal}>
      <Pressable
        onPress={() => setModal(false)}
        className="flex-1 justify-center z-0 items-center bg-[#00000099]">
        <View className="w-2/3 z-20 rounded-xl p-3 justify-between bg-zinc-800">
          <Text className="text-white text-xl font-bold">
            Create a playlist
          </Text>
          <View className="my-2 space-y-1">
            <Text className="text-white font-semibold text-sm">Title</Text>
            <TextInput
              autoFocus
              value={text}
              onChangeText={e => setText(e)}
              maxLength={160}
              
              cursorColor={'#ffffff'}
              style={{
                borderBottomWidth: 2,
                padding: 0,
                borderBottomColor: '#fff',
                color:"#fff",
                fontWeight:"700"
              }}
            />
            <Text className="text-right text-white top-2">{text.length}/160</Text>
          </View>
          <View className="flex-row items-center justify-end space-x-8 mt-4 mb-1 gap-4">
            <TouchableOpacity onPress={() => setModal(false)}>
              <Text className="text-white font-semibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => createPlaylist(text)}>
              <Text className="text-white font-semibold">Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default PlaylistModal;
