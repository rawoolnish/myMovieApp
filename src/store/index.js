// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import watchlistReducer from './watchlistSlice';
import reviewReducer from './reviewSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    watchlist: watchlistReducer,
    reviews: reviewReducer,
    theme: themeReducer,
  },
});

export const selectRoot = (state) => state;
