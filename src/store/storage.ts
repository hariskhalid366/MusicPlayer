import { createMMKV } from 'react-native-mmkv';

export const Storage = createMMKV({
  id: 'com.musicplayer.storage',
  mode:"multi-process",
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
    Storage.remove(key);
  },
};
