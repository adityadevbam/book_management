import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBook,
  FiArrowUpRight,
  FiSettings,
  FiEdit,
  FiEye,
  FiTrash2,
  FiStar,
  FiCalendar,
  FiPlus
} from 'react-icons/fi';
import { FaFire, FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks, deleteBook } from '../../redux/books/booksActions';
import { selectAllBooks, selectBooksLoading, selectBooksError } from '../../redux/books/booksSelectors';
import '../../styles/BooksList.css';

const BooksList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activePopup, setActivePopup] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [savedBooks, setSavedBooks] = useState([]);

  // Get books data from Redux store
  const books = useSelector(selectAllBooks);
  const loading = useSelector(selectBooksLoading);
  const error = useSelector(selectBooksError);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const handleViewAll = () => {
    navigate('/collection');
  };

  const togglePopup = (bookId) => {
    setActivePopup(activePopup === bookId ? null : bookId);
  };

  const confirmDelete = (bookId) => {
    setBookToDelete(bookId);
    setShowDeleteConfirm(true);
    setActivePopup(null);
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteBook(bookToDelete)).unwrap();
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error('Error deleting book:', err);
      setShowDeleteConfirm(false);
    }
  };

  const toggleSaveBook = (bookId) => {
    setSavedBooks(prev => 
      prev.includes(bookId) 
        ? prev.filter(id => id !== bookId) 
        : [...prev, bookId]
    );
  };

  if (loading) {
    return (
      <div className="loading-container-b">
        <div className="loading-spinner"></div>
        <p>Loading your books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container-b">
        <div className="error-icon">⚠️</div>
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button 
          className="retry-btn"
          onClick={() => dispatch(fetchBooks())}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="books-cards-container-b">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="delete-confirm-modal-b">
          <div className="delete-confirm-content-b">
            <div className="delete-icon">
              <FiTrash2 />
            </div>
            <h3>Delete Book</h3>
            <p>This action cannot be undone. Are you sure you want to delete this book?</p>
            <div className="delete-confirm-buttons-b">
              <button
                className="cancel-btn-b"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="confirm-delete-btn-b"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="section-header-b">
        <div className="header-content">
          <div className="header-icon-wrapper-b">
            <FiBook className="book-icon-b" />
          </div>
          <div>
            <h2>Your Book Collection</h2>
            <p className="subheader">Browse and manage your reading list</p>
          </div>
        </div>
        <div className="header-actions">
          <span className="view-all-text-b" onClick={handleViewAll}>
            View All <FiArrowUpRight />
          </span>
          
        </div>
      </div>

      {books.length === 0 ? (
        <div className="empty-state-container">
          <div className="empty-state-content">
            <div className="empty-state-icon">📚</div>
            <h3>Your Library is Empty</h3>
            <p>Start building your personal book collection by adding your first book</p>
            <button
              className="primary-btn"
              onClick={() => navigate('/add')}
            >
              <FiPlus /> Add Your First Book
            </button>
          </div>
        </div>
      ) : (
        <div className="books-grid-b">
          {books.slice(0, 4).map((book) => (
            <div key={book._id} className={`book-card-b ${book.featured ? 'featured-b' : ''}`}>
              {/* Book Badges */}
              <div className="badges-container">
                {book.featured && (
                  <div className="featured-badge-b">
                    <FiStar className="badge-icon-b" /> Featured
                  </div>
                )}
                {book.trending && (
                  <div className="trending-badge-b">
                    <FaFire className="badge-icon-b" /> Trending
                  </div>
                )}
              </div>

              {/* Save Button
              <button 
                className={`save-btn ${savedBooks.includes(book._id) ? 'saved' : ''}`}
                onClick={() => toggleSaveBook(book._id)}
              >
                {savedBooks.includes(book._id) ? <FaBookmark /> : <FaRegBookmark />}
              </button> */}

              {/* Settings Dropdown */}
              <button
                className="settings-btn-b"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePopup(book._id);
                }}
              >
                <FiSettings />
              </button>

              {activePopup === book._id && (
                <div className="action-popup-b">
                  <button onClick={() => navigate(`/view-book/${book._id}`)}>
                    <FiEye /> View Details
                  </button>
                  <button onClick={() => navigate(`/edit-book/${book._id}`)}>
                    <FiEdit /> Edit Book
                  </button>
                  <button
                    className="delete-btn-b"
                    onClick={() => confirmDelete(book._id)}
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              )}

              {/* Book Cover */}
              <div className="book-cover-b" onClick={() => navigate(`/view-book/${book._id}`)}>
                {book.cover ? (
                  <img src={book.cover} alt={book.title} />
                ) : (
                  <div className="default-cover-b">
                    <FiBook className="default-cover-icon-b" />
                  </div>
                )}
                <div className="book-rating-b">
                  <FiStar className="star-icon-b" /> {book.rating || '0.0'}
                </div>
              </div>

              {/* Book Info */}
              <div className="book-info-b">
                <h3 onClick={() => navigate(`/view-book/${book._id}`)}>{book.title}</h3>
                <p className="author-b">{book.author}</p>
                <div className="book-meta-b">
                  <span className="year-b"><FiCalendar /> {book.year}</span>
                  <div className="action-buttons-b">
                    <button 
                      className="quick-view-btn-b"
                      onClick={() => navigate(`/view-book/${book._id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksList;