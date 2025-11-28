import React, { memo, useCallback, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import BootSplash from 'react-native-bootsplash';
import { useSetupTrackPlayer } from '../service/setupTrackPlayer';
import { useLogTrackPlayerState } from '../service/trackPayerEvents';
import FloatingScreen from '../app/floatingscreen';
import * as Icon from 'lucide-react-native';
import ArtistsSongs from '../app/artistsSongs';
import PlaylistSongs from '../app/playlistSongs';
import FloatingTrack from '../components/FloatingTrack';
import { useAudioStore } from '../store/useAudioStore';
import { mmkvStorage } from '../store/storage';

const Stack = createNativeStackNavigator();
const Route = () => {
  const { audios } = useAudioStore();
  const [routeState, setRouteState] = useState<any>('index');

  const [isInitialized, setIsInitialized] = React.useState(false);
  mmkvStorage.setItem('queueId', 'songs');

  const init = useCallback(async () => {
    if (!isInitialized) {
      await BootSplash.hide({ fade: true });
      setIsInitialized(true);
    }
  }, [isInitialized]);

  useSetupTrackPlayer({
    onLoad: init,
    Track: audios,
  });

  useLogTrackPlayerState();

  return (
    <NavigationContainer
      onStateChange={state => {
        setRouteState(state?.routes[state.index].name);
      }}
      onReady={() => {
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
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.pop();
                }}
                style={{
                  padding: 2,
                  borderRadius: 200,
                  backgroundColor: '#ffffff21',
                }}
              >
                <Icon.ChevronDown size={23} color={'#fff'} strokeWidth={2} />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="ArtistSongs"
          component={ArtistsSongs}
          options={({ navigation, route }) => ({
            headerShown: true,
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: '800',
            },
            headerTitleAlign: 'center',
            presentation: 'fullScreenModal',
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.pop();
                }}
                style={{
                  padding: 2,
                  borderRadius: 200,
                  backgroundColor: '#ffffff21',
                }}
              >
                <Icon.ChevronDown size={23} color={'#fff'} strokeWidth={2} />
              </TouchableOpacity>
            ),
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
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.pop();
                }}
                style={{
                  padding: 2,
                  borderRadius: 200,
                  backgroundColor: '#ffffff21',
                }}
              >
                <Icon.ChevronDown size={23} color={'#fff'} strokeWidth={2} />
              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Navigator>
      <FloatingTrack floatName={routeState} />
    </NavigationContainer>
  );
};

export default memo(Route);
