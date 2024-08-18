import React, {memo, useCallback, useEffect} from 'react';
import {AppState, AppStateStatus, TouchableOpacity} from 'react-native';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import BootSplash from 'react-native-bootsplash';
import {useSetupTrackPlayer} from '../constants/setupTrackPlayer';
import {useLogTrackPlayerState} from '../constants/trackPayerEvents';
import {useMMKVObject} from 'react-native-mmkv';
import {MusicFile} from '../components/ListView';
import {Storage} from '../constants/Store';
import FloatingScreen from '../app/floatingscreen';
import * as Icon from 'react-native-heroicons/outline';
import ArtistsSongs from '../app/artistsSongs';
import PlaylistSongs from '../app/playlistSongs';

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
      await BootSplash.hide({fade: true});
      console.log('BootSplash hidden');
      setIsInitialized(true);
    }
  }, [isInitialized, music]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        init();
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    // Cleanup the subscription
    return () => {
      subscription.remove();
    };
  }, [init]);

  useSetupTrackPlayer({
    onLoad: init,
    Track: music,
  });

  useLogTrackPlayerState();

  return (
    <NavigationContainer
      onReady={() => {
        console.log('Navigation ready');
        init();
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
      }}>
      <Stack.Navigator
        screenOptions={{
          animation: 'slide_from_bottom',
          navigationBarColor: '#000',
          statusBarColor: '#000',
        }}>
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
          options={({navigation}) => ({
            headerTitle: 'Songs',
            headerTitleStyle: {
              fontSize: 25,
              fontWeight: '500',
            },
            headerTitleAlign: 'center',
            presentation: 'fullScreenModal',
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.pop();
                }}
                className="p-2 rounded-full bg-[#ffffff21]">
                <Icon.ChevronDownIcon
                  size={23}
                  color={'#fff'}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="ArtistSongs"
          component={ArtistsSongs}
          options={({navigation}) => ({
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: '500',
            },
            headerTitleAlign: 'center',
            presentation: 'fullScreenModal',
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.pop();
                }}
                className="p-2 rounded-full bg-[#ffffff21]">
                <Icon.ChevronDownIcon
                  size={23}
                  color={'#fff'}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="PlaylistSongs"
          component={PlaylistSongs}
          options={({navigation}) => ({
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: '500',
            },
            headerTitleAlign: 'center',
            presentation: 'fullScreenModal',
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.pop();
                }}
                className="p-2 rounded-full bg-[#ffffff21]">
                <Icon.ChevronDownIcon
                  size={23}
                  color={'#fff'}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default memo(Route);
