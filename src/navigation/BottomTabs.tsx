import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Main from '../app/music';
import * as Icon from 'react-native-heroicons/outline';
import {StyleSheet, Text} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import Album from '../app/album';
import Favourite from '../app/favourite';
import Playlist from '../app/playlist';
import FloatingTrack from '../components/FloatingTrack';

const BottomTabs = () => {
  const Tab = createBottomTabNavigator();
  return (
    <>
      <Tab.Navigator
        sceneContainerStyle={{backgroundColor: '#000'}}
        initialRouteName="Songs"
        screenOptions={({route}) => ({
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: focused ? '#ef4444' : '#ffffff88',
              }}>
              {route.name}
            </Text>
          ),

          tabBarBackground: () => (
            <BlurView
              overlayColor="transparent"
              blurAmount={90}
              blurType="light"
              style={[StyleSheet.absoluteFill, {backgroundColor: '#00000099'}]}
            />
          ),
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 25,
            fontWeight: '600',
          },
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            height: 60,
            paddingBottom: 6,
          },
        })}>
        <Tab.Screen
          name="Songs"
          component={Main}
          options={{
            headerShown: false,
            tabBarIcon: ({focused}) => (
              <Icon.MusicalNoteIcon
                color={focused ? '#ef4444' : '#ffffff88'}
                size={23}
                strokeWidth={2}
              />
            ),
          }}
        />
        <Tab.Screen
          options={{
            tabBarIcon: ({focused}) => (
              <Icon.HeartIcon
                color={focused ? '#ef4444' : '#ffffff88'}
                size={23}
                strokeWidth={2}
              />
            ),
          }}
          name="Favourite"
          component={Favourite}
        />
        <Tab.Screen
          options={{
            tabBarIcon: ({focused}) => (
              <Icon.QueueListIcon
                color={focused ? '#ef4444' : '#ffffff88'}
                size={23}
                strokeWidth={2}
              />
            ),
          }}
          name="Playlist"
          component={Playlist}
        />

        <Tab.Screen
          options={{
            tabBarIcon: ({focused}) => (
              <Icon.UserGroupIcon
                color={focused ? '#ef4444' : '#ffffff88'}
                size={23}
                strokeWidth={2}
              />
            ),
          }}
          name="Artists"
          component={Album}
        />
      </Tab.Navigator>
      <FloatingTrack />
    </>
  );
};

export default BottomTabs;
