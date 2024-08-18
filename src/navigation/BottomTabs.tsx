import React, {memo} from 'react';
import Main from '../app/music';
import * as Icon from 'react-native-heroicons/outline';
import {Text} from 'react-native';
import Album from '../app/album';
import Favourite from '../app/favourite';
import Playlist from '../app/playlist';
import FloatingTrack from '../components/FloatingTrack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const BottomTabs = () => {
  const Tab = createMaterialTopTabNavigator();
  return (
    <>
      <Tab.Navigator
        sceneContainerStyle={{backgroundColor: '#000'}}
        initialRouteName="Songs"
        tabBarPosition="bottom"
        screenOptions={({route}) => ({
          tabBarLabel: ({focused}) => (
            <Text
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: focused ? 'rgba(255, 0, 0, 0.7)' : '#ffffff88',
              }}>
              {route.name}
            </Text>
          ),
          swipeEnabled: false,
          animationEnabled: true,
          lazy: true,
        })}>
        <Tab.Screen
          name="Songs"
          component={Main}
          options={{
            tabBarIcon: ({focused}) => (
              <Icon.MusicalNoteIcon
                color={focused ? 'rgba(255,0,0,0.9)' : '#ffffff88'}
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
                color={focused ? 'rgba(255,0,0,0.9)' : '#ffffff88'}
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
                color={focused ? 'rgba(255,0,0,0.9)' : '#ffffff88'}
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
                color={focused ? 'rgba(255,0,0,0.9)' : '#ffffff88'}
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

export default memo(BottomTabs);
