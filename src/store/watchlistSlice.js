// src/store/watchlistSlice.js
import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WATCHLIST_KEY = '@movieapp_watchlist';

const initialState = {
  movies: [],
};

const slice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    setWatchlist(state, action) {
      state.movies = action.payload;
    },
    addMovie(state, action) {
      const movie = action.payload;
      if (!state.movies.find((m) => m.id === movie.id)) {
        state.movies.push(movie);
      }
    },
    removeMovie(state, action) {
      const id = action.payload;
      state.movies = state.movies.filter((m) => m.id !== id);
    },
    clear(state) {
      state.movies = [];
    },
  },
});

export const { setWatchlist, addMovie, removeMovie, clear } = slice.actions;
export default slice.reducer;

// Thunks
export const loadWatchlist = () => async (dispatch) => {
  const raw = await AsyncStorage.getItem(WATCHLIST_KEY);
  if (raw) {
    dispatch(setWatchlist(JSON.parse(raw)));
  }
};

export const persistWatchlist = () => async (dispatch, getState) => {
  const state = getState();
  await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(state.watchlist.movies));
};

export const addMovieAndPersist = (movie) => async (dispatch) => {
  dispatch(addMovie(movie));
  const raw = await AsyncStorage.getItem(WATCHLIST_KEY);
  const existing = raw ? JSON.parse(raw) : [];
  const merged = existing.find((m) => m.id === movie.id) ? existing : existing.concat(movie);
  await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(merged));
};

export const removeMovieAndPersist = (id) => async (dispatch, getState) => {
  dispatch(removeMovie(id));
  const state = getState();
  await AsyncStorage.setItem(WATCHLIST_KEY, JSON.stringify(state.watchlist.movies));
};
