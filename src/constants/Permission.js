import {useCallback} from 'react';
import {PermissionsAndroid, ToastAndroid} from 'react-native';

export const checkAndRequestStoragePermission = useCallback(async () => {
  if (Platform.OS !== 'android') {
    fetchMusicList();
    return;
  }

  try {
    // ✅ Android 13+ (API 33 and above) uses new media permissions
    const readPermission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const writePermission =
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    // Step 1: Request both permissions together
    const result = await PermissionsAndroid.requestMultiple([
      readPermission,
      writePermission,
    ]);

    // Step 2: Check if both permissions were granted
    const readGranted =
      result[readPermission] === PermissionsAndroid.RESULTS.GRANTED;
    const writeGranted =
      result[writePermission] === PermissionsAndroid.RESULTS.GRANTED;

    if (readGranted && writeGranted) {
      ToastAndroid.show('Storage permissions granted', ToastAndroid.SHORT);
      fetchMusicList();
      return true;
    } else {
      ToastAndroid.show('Storage permission denied', ToastAndroid.SHORT);
      return false;
    }
  } catch (err) {
    console.warn('Permission Error:', err);
    return false;
  }
}, [fetchMusicList]);
