import React, { memo, useCallback, useEffect } from 'react';
import { AppState, AppStateStatus, TouchableOpacity } from 'react-native';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import BootSplash from 'react-native-bootsplash';
import { useSetupTrackPlayer } from '../service/setupTrackPlayer';
import { useLogTrackPlayerState } from '../service/trackPayerEvents';
import { useMMKVObject } from 'react-native-mmkv';
import { Storage } from '../service/Store';
import FloatingScreen from '../app/floatingscreen';
import * as Icon from 'react-native-heroicons/outline';
import ArtistsSongs from '../app/artistsSongs';
import PlaylistSongs from '../app/playlistSongs';
import { MusicFile } from '../constants/type';

const Route = () => {
  const [music, setMusic] = useMMKVObject<string | MusicFile[]>(
    'musicList',
    Storage,
  );

  const Stack = createNativeStackNavigator();

  const [isInitialized, setIsInitialized] = React.useState(false);

  const init = useCallback(async () => {
    if (!isInitialized) {
      console.log('Initializing app...');
      await BootSplash.hide({ fade: true });
      console.log('BootSplash hidden');
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        console.log("state", nextAppState);

        init();
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [init]);

  // useSetupTrackPlayer({
  //   onLoad: init,
  //   Track: music,
  // });

  useLogTrackPlayerState();

  const Touchable = ({ navigation }: any) => (
    <TouchableOpacity
      onPress={() => {
        navigation.pop();
      }}
      style={{ padding: 2, borderRadius: 200, backgroundColor: '#ffffff21' }}
    >
      <Icon.ChevronDownIcon size={23} color={'#fff'} strokeWidth={2} />
    </TouchableOpacity>
  );

  return (
    <NavigationContainer
      onReady={() => {
        console.log('Navigation ready');
      }}
      theme={{
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
          regular: { fontFamily: 'System', fontWeight: '400' },
          medium: { fontFamily: 'System', fontWeight: '500' },
          heavy: { fontFamily: 'System', fontWeight: '800' },
          bold: { fontFamily: 'System', fontWeight: 'bold' },
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          animation: 'slide_from_bottom',
          navigationBarColor: '#000',
          // statusBarColor: '#000',
        }}
      >
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="index"
          component={BottomTabs}
        />
        <Stack.Screen
          name="screen"
          component={FloatingScreen}
          options={({ navigation }: { navigation: any }) => ({
            headerTitle: 'Songs',
            headerTitleStyle: {
              fontSize: 25,
              fontWeight: '500',
            },
            headerTitleAlign: 'center',
            presentation: 'fullScreenModal',
            headerLeft: () =>
              <TouchableOpacity
                onPress={() => {
                  navigation.pop();
                }}
                style={{ padding: 2, borderRadius: 200, backgroundColor: '#ffffff21' }}
              >
                <Icon.ChevronDownIcon size={23} color={'#fff'} strokeWidth={2} />
              </TouchableOpacity>
          })}
        />
        <Stack.Screen
          name="ArtistSongs"
          component={ArtistsSongs}
          options={({ navigation }) => ({
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: '500',
            },
            headerTitleAlign: 'center',
            presentation: 'fullScreenModal',
            headerLeft: () =>
              <TouchableOpacity
                onPress={() => {
                  navigation.pop();
                }}
                style={{ padding: 2, borderRadius: 200, backgroundColor: '#ffffff21' }}
              >
                <Icon.ChevronDownIcon size={23} color={'#fff'} strokeWidth={2} />
              </TouchableOpacity>
          })}
        />
        <Stack.Screen
          name="PlaylistSongs"
          component={PlaylistSongs}
          options={({ navigation }) => ({
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: '500',
            },
            headerTitleAlign: 'center',
            presentation: 'fullScreenModal',
            headerLeft: () =>
              <TouchableOpacity
                onPress={() => {
                  navigation.pop();
                }}
                style={{ padding: 2, borderRadius: 200, backgroundColor: '#ffffff21' }}
              >
                <Icon.ChevronDownIcon size={23} color={'#fff'} strokeWidth={2} />
              </TouchableOpacity>
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default memo(Route);
