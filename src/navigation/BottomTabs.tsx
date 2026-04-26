import React, { memo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as Icon from 'lucide-react-native';

import Main from '../app/music';
import Album from '../app/album';
import Favourite from '../app/favourite';
import Playlist from '../app/playlist';

const Tab = createMaterialTopTabNavigator();

// const LazyPlaceholder = memo(() => (
//   <View style={styles.placeholder}>
//     <ActivityIndicator color="#fff" size="large" />
//   </View>
// ));

const TABS = [
  {
    name: 'Songs',
    component: Main,
    icon: Icon.Music,
  },
  {
    name: 'Favourite',
    component: Favourite,
    icon: Icon.HeartIcon,
  },
  {
    name: 'Playlist',
    component: Playlist,
    icon: Icon.ListMusic,
  },
  {
    name: 'Artists',
    component: Album,
    icon: Icon.Users,
  },
];

const BottomTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Songs"
      tabBarPosition="bottom"
      keyboardDismissMode="on-drag"
      key={'BottomTabs'}
      screenOptions={({ route }) => ({
        sceneStyle: styles.scene,
        lazy: true,
        lazyPreloadDistance: 1,
        swipeEnabled: false,
        animationEnabled: true,

        tabBarLabel: ({ focused, children }) => (
          <Text
            style={[
              styles.tabLabel,
              { color: focused ? styles.active.color : styles.inactive.color },
            ]}
          >
            {children}
          </Text>
        ),
      })}
    >
      {TABS.map(tab => {
        const TabIcon = tab.icon;

        return (
          <Tab.Screen
            key={tab.name}
            name={tab.name}
            component={tab.component}
            options={{
              tabBarIcon: ({ focused }) => (
                <TabIcon
                  color={focused ? 'rgba(255,0,0,0.9)' : '#ffffff88'}
                  size={23}
                  strokeWidth={2}
                />
              ),
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

export default memo(BottomTabs);

const styles = StyleSheet.create({
  scene: {
    backgroundColor: '#000',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  active: {
    color: 'rgba(255, 0, 0, 0.7)',
  },
  inactive: {
    color: '#ffffff88',
  },
});
