import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BootSplash from 'react-native-bootsplash';

import BottomTabs from './BottomTabs';
import FloatingScreen from '../app/floatingscreen';
import ArtistsSongs from '../app/artistsSongs';
import PlaylistSongs from '../app/playlistSongs';
import FloatingTrack from '../components/FloatingTrack';

import { useSetupTrackPlayer } from '../service/setupTrackPlayer';
import { useLogTrackPlayerState } from '../service/trackPayerEvents';
import { useAudioStore } from '../store/useAudioStore';
import { mmkvStorage } from '../store/storage';

const Stack = createNativeStackNavigator();

const darkTheme = {
  dark: true,
  colors: {
    background: '#000',
    border: '#000',
    card: '#000',
    text: '#fff',
    notification: '#000',
    primary: '#000',
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' as const },
    medium: { fontFamily: 'System', fontWeight: '500' as const },
    heavy: { fontFamily: 'System', fontWeight: '800' as const },
    bold: { fontFamily: 'System', fontWeight: 'bold' as const },
  },
};

const modalOptions = {
  headerShown: false,
  animation: 'slide_from_bottom' as const,
};

const Route = () => {
  const audios = useAudioStore(state => state.audios);
  const [routeState, setRouteState] = useState('index');
  const initialized = useRef(false);

  useEffect(() => {
    mmkvStorage.setItem('queueId', 'songs');
  }, []);

  const init = useCallback(async () => {
    if (!initialized.current) {
      initialized.current = true;
      await BootSplash.hide({ fade: true });
    }
  }, []);

  const handleStateChange = useCallback((state: any) => {
    const name = state?.routes?.[state.index]?.name;
    if (name) setRouteState(name);
  }, []);

  useSetupTrackPlayer({
    onLoad: init,
    Track: audios,
  });

  useLogTrackPlayerState();

  return (
    <NavigationContainer
      onReady={init}
      onStateChange={handleStateChange}
      theme={darkTheme}
    >
      <Stack.Navigator
        screenOptions={{
          navigationBarColor: '#000',
        }}
      >
        <Stack.Screen
          name="index"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="screen"
          component={FloatingScreen}
          options={modalOptions}
        />
        <Stack.Screen
          name="ArtistSongs"
          component={ArtistsSongs}
          options={modalOptions}
        />
        <Stack.Screen
          name="PlaylistSongs"
          component={PlaylistSongs}
          options={modalOptions}
        />
      </Stack.Navigator>

      <FloatingTrack floatName={routeState} />
    </NavigationContainer>
  );
};

export default memo(Route);
