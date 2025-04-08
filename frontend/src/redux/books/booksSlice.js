import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  books: [],
  loading: false,
  error: null,
  currentBook: null
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    // Reducers for synchronous actions
    setBooks: (state, action) => {
      state.books = action.payload;
      state.loading = false;
    },
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    clearLoading: (state) => {
      state.loading = false;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setCurrentBook: (state, action) => {
      state.currentBook = action.payload;
    },
    addBook: (state, action) => {
      state.books.unshift(action.payload);
    },
    updateBook: (state, action) => {
      const index = state.books.findIndex(book => book._id === action.payload._id);
      if (index !== -1) {
        state.books[index] = action.payload;
      }
    },
    removeBook: (state, action) => {
      state.books = state.books.filter(book => book._id !== action.payload);
    }
  }
});

export const {
  setBooks,
  setLoading,
  clearLoading,
  setError,
  setCurrentBook,
  addBook,
  updateBook,
  removeBook
} = booksSlice.actions;

export default booksSlice.reducer;
export const selectAllBooks = (state) => state.books.books;
export const selectBooksLoading = (state) => state.books.loading;
export const selectBooksError = (state) => state.books.error;