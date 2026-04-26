import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, { FC, memo } from 'react';
import { PlaylistModalProps } from '../../constants/type';

const PlaylistModal: FC<PlaylistModalProps> = ({
  modal,
  setModal,
  text,
  setText,
  createPlaylist,
}) => {
  return (
    <Modal transparent animationType='fade' visible={modal}>
      <Pressable
        onPress={() => setModal(false)}
        style={styles.backdrop}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>
            Create a playlist
          </Text>
          <View style={styles.inputSection}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              value={text}
              onChangeText={e => setText(e)}
              maxLength={160}
              cursorColor={'#ffffff'}
              style={styles.input}
            />
            <Text style={styles.characterCount}>{text.length}/160</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => setModal(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => createPlaylist(text)}>
              <Text style={styles.buttonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000099',
  },
  modalContainer: {
    width: '66.67%',
    zIndex: 20,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    backgroundColor: '#27272a',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputSection: {
    marginVertical: 8,
  },
  label: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  input: {
    borderBottomWidth: 2,
    paddingVertical: 0,
    borderBottomColor: '#fff',
    color: '#fff',
    fontWeight: '700',
  },
  characterCount: {
    textAlign: 'right',
    color: '#fff',
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 16,
    marginBottom: 4,
    gap: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default memo(PlaylistModal);
