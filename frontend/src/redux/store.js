import { configureStore } from '@reduxjs/toolkit';
import booksReducer from './books/booksSlice';

export const store = configureStore({
  reducer: {
    books: booksReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store;