import React, {memo} from 'react';
import Main from '../app/music';
import * as Icon from 'react-native-heroicons/outline';
import {ActivityIndicator, Text, View} from 'react-native';
import Album from '../app/album';

import Favourite from '../app/favourite';
import Playlist from '../app/playlist';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const BottomTabs = () => {
  const Tab = createMaterialTopTabNavigator();
  return (
    <>
      <Tab.Navigator
        initialRouteName="Songs"
        tabBarPosition="bottom"
        keyboardDismissMode="on-drag"
        key={"BottomTabs"}
        screenOptions={({route}) => ({
          sceneStyle: {
            backgroundColor: '#000000',
          },

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
          lazyPlaceholder: () => (
            <View style={{flex:1,justifyContent:"center",alignItems:"center"}} >
             <ActivityIndicator color={"#fff"} size={"large"}/>
            </View>
          ),
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
      {/* <FloatingTrack /> */}
    </>
  );
};

export default memo(BottomTabs);
