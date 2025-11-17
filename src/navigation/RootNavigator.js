// src/navigation/RootNavigator.js
import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import AuthStack from './auth/AuthStack';
import MainTabs from './main/MainTabs';
import { useSelector, useDispatch } from 'react-redux';
import { restoreAuth } from '../store/authSlice';
import { loadTheme } from '../store/themeSlice';
import { View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const dispatch = useDispatch();
  const auth = useSelector((s) => s.auth);
  const { user, loading } = auth;
  const theme = useSelector((s) => s.theme);
  const isDark = theme.mode === 'dark';

  useEffect(() => {
    dispatch(restoreAuth());
    dispatch(loadTheme());
  }, [dispatch]);

  useEffect(() => {
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content', true);
    StatusBar.setBackgroundColor(theme.colors.background, true);
  }, [isDark, theme.colors.background]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}
