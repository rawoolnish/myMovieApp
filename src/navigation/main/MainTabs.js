// src/navigation/main/MainTabs.js
import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import { loadTheme } from '../../store/themeSlice';

import DiscoverScreen from '../../screens/DiscoverScreen';
import WatchlistScreen from '../../screens/WatchlistScreen';
import ProfileScreen from '../../screens/ProfileScreen';
import MovieDetailScreen from '../../screens/MovieDetailScreen';

import Svg, { Path } from 'react-native-svg';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// COMMON SVG ICON COMPONENT
function TabIcon({ focused, d, theme }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      <Path d={d} fill={focused ? theme.primary : theme.textTertiary} />
    </Svg>
  );
}

function TabScreens() {
  const dispatch = useDispatch();
  const theme = useSelector((s) => s.theme.colors);

  useEffect(() => {
    dispatch(loadTheme());
  }, [dispatch]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textTertiary,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.tabBarBorder,
          height: 58,
          paddingBottom: 6,
        },
      }}
    >
      {/* Discover */}
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              theme={theme}
              d="M10.5 3a7.5 7.5 0 016.18 11.94l3.69 3.68-1.06 1.06-3.68-3.69A7.5 7.5 0 1110.5 3zm0 2a5.5 5.5 0 100 11 5.5 5.5 0 000-11z"
            />
          ),
        }}
      />

      {/* Watchlist */}
      <Tab.Screen
        name="Watchlist"
        component={WatchlistScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              theme={theme}
              d="M4 3h16v2H4V3zm0 4h10v2H4V7zm0 4h16v2H4v-2zm0 4h10v2H4v-2z"
            />
          ),
        }}
      />

      {/* Profile */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              theme={theme}
              d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function MainTabs() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={TabScreens}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MovieDetail"
        component={MovieDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
