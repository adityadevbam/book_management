import axios from 'axios';
import { setBooks, setLoading, clearLoading,setError, addBook, updateBook, removeBook } from './booksSlice';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/books`;

// Get all books
export const fetchBooks = () => async (dispatch) => {
  try {
    dispatch(setLoading());
    const token = localStorage.getItem('authToken');
    const response = await axios.get(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    dispatch(setBooks(response.data.books));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || error.message));
  }finally {
    dispatch(clearLoading()); // Stop loading regardless of success/failure
  }
};

// Add new book
// booksActions.js
export const createBook = (bookData) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const token = localStorage.getItem('authToken');
    const response = await axios.post(API_URL, bookData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    dispatch(addBook(response.data.book));
    return response.data; 
  } catch (error) {
    dispatch(setError(error.response?.data?.message || error.message));
    throw error; 
  }finally {
    dispatch(clearLoading()); // Stop loading regardless of success/failure
  }
};

// Update book
export const editBook = (id, bookData) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const token = localStorage.getItem('authToken');
    const response = await axios.put(`${API_URL}/${id}`, bookData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    dispatch(updateBook(response.data.book));
    return response.data;
  } catch (error) {
    dispatch(setError(error.response?.data?.message || error.message));
    throw error;
  }finally {
    dispatch(clearLoading()); // Stop loading regardless of success/failure
  }
};

// Delete book
export const deleteBook = (id) => async (dispatch) => {
  try {
    dispatch(setLoading());
    const token = localStorage.getItem('authToken');
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    dispatch(removeBook(id));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || error.message));
    throw error;
  }finally {
    dispatch(clearLoading()); // Stop loading regardless of success/failure
  }
};