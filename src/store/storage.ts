import { MMKV, Mode } from 'react-native-mmkv';

export const Storage = new MMKV({
  id: 'com.musicplayer.storage',
  mode: Mode.SINGLE_PROCESS,
  encryptionKey: '{*/@#$%^&*^%$#@#$%^YN%^#nig54(!&7jRT6!@#$**&?<&*J778}:P>L::}',
});

export const mmkvStorage = {
  setItem: (key: string, value: any) => {
    Storage.set(key, value);
  },
  getItem: (key: string) => {
    const value = Storage.getString(key);
    return value ?? null;
  },
  removeItem: (key: string) => {
    Storage.delete(key);
  },
};
