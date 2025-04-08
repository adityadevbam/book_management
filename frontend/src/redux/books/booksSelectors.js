export const selectAllBooks = (state) => state.books.books;
export const selectBooksLoading = (state) => state.books.loading;
export const selectBooksError = (state) => state.books.error;
export const selectCurrentBook = (state) => state.books.currentBook;
export const selectFeaturedBooks = (state) => 
  state.books.books.filter(book => book.featured);