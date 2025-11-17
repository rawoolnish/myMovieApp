// src/store/themeSlice.js
import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = '@movieapp_theme';

const lightTheme = {
  background: '#ffffff',
  surface: '#f5f5f5',
  card: '#ffffff',
  text: '#000000',
  textSecondary: '#666666',
  textTertiary: '#999999',
  border: '#e0e0e0',
  primary: '#4f8cff',
  error: '#ff4444',
  tabBar: '#ffffff',
  tabBarBorder: '#e0e0e0',
};

const darkTheme = {
  background: '#000000',
  surface: '#111111',
  card: '#1a1a1a',
  text: '#ffffff',
  textSecondary: '#aaaaaa',
  textTertiary: '#777777',
  border: '#333333',
  primary: '#4f8cff',
  error: '#ff4444',
  tabBar: '#000000',
  tabBarBorder: '#111111',
};

const initialState = {
  mode: 'dark',
  colors: darkTheme,
};

const slice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action) {
      state.mode = action.payload;
      state.colors = action.payload === 'dark' ? darkTheme : lightTheme;
    },
  },
});

export const { setTheme } = slice.actions;
export default slice.reducer;

export const loadTheme = () => async (dispatch) => {
  try {
    const saved = await AsyncStorage.getItem(THEME_KEY);
    if (saved) {
      dispatch(setTheme(saved));
    }
  } catch (e) {
    console.warn('Failed to load theme:', e);
  }
};

export const toggleTheme = () => async (dispatch, getState) => {
  const currentMode = getState().theme.mode;
  const newMode = currentMode === 'dark' ? 'light' : 'dark';
  await AsyncStorage.setItem(THEME_KEY, newMode);
  dispatch(setTheme(newMode));
};
