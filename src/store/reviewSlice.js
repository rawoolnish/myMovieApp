// src/store/reviewSlice.js
import { createSlice } from '@reduxjs/toolkit';

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {},
  reducers: {
    addReview: (state, action) => {
      const { movieId, text } = action.payload;

      if (!state[movieId]) state[movieId] = [];

      state[movieId].push({
        text,
        user: 'You', // static; can map real user
        date: new Date().toISOString(),
      });
    },
  },
});

export const { addReview } = reviewSlice.actions;
export default reviewSlice.reducer;
