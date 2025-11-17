// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = '@movieapp_auth';

const initialState = {
  user: null,
  loading: true,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.loading = false;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    logoutState(state) {
      state.user = null;
    },
  },
});

export const { setUser, setLoading, logoutState } = slice.actions;
export default slice.reducer;

// Thunks
export const restoreAuth = () => async (dispatch) => {
  try {
    const raw = await AsyncStorage.getItem(AUTH_KEY);
    if (raw) {
      const user = JSON.parse(raw);
      dispatch(setUser(user));
    } else {
      dispatch(setUser(null));
    }
  } catch (e) {
    dispatch(setUser(null));
  }
};

export const login = (user) => async (dispatch) => {
  await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
  dispatch(setUser(user));
};

export const logout = () => async (dispatch) => {
  await AsyncStorage.removeItem(AUTH_KEY);
  await AsyncStorage.removeItem('@movieapp_watchlist');
  dispatch(logoutState());
};
