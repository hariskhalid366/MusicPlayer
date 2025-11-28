import { Linking, PermissionsAndroid, Platform } from 'react-native';
import showToast from '../components/Toast';

export const checkAndRequestStoragePermission = async () => {
  if (Platform.OS !== 'android') {
    return;
  }
  try {
    const readPermission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const writePermission =
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const result = await PermissionsAndroid.requestMultiple([
      readPermission,
      writePermission,
    ]);

    const readGranted =
      result[readPermission] === PermissionsAndroid.RESULTS.GRANTED;
    const writeGranted =
      result[writePermission] === PermissionsAndroid.RESULTS.GRANTED;

    if (readGranted && writeGranted) {
      // showToast('Storage permissions granted');
      return true;
    } else {
      showToast('Storage permission denied');
      Linking.openSettings();
      return false;
    }
  } catch (err) {
    console.warn('Permission Error:', err);
    return false;
  }
};

export const convertMillisecondsToTime = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
