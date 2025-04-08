import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBooks,
  deleteBook
} from '../../redux/books/booksActions';
import {
  selectAllBooks,
  selectBooksLoading,
  selectBooksError,
} from '../../redux/books/booksSlice';
import {
  FiSearch, FiFilter, FiBook, FiSettings, FiEdit,
  FiEye, FiTrash2, FiStar, FiCalendar
} from 'react-icons/fi';
import { FaFire, FaChevronDown } from 'react-icons/fa';
import { FiPlus } from "react-icons/fi";

import '../../styles/Collection.css';

const Collection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const books = useSelector(selectAllBooks);
  const loading = useSelector(selectBooksLoading);
  const error = useSelector(selectBooksError);

  const [activePopup, setActivePopup] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchBooks());
  }, [dispatch]);

  const togglePopup = (bookId) => {
    setActivePopup(activePopup === bookId ? null : bookId);
  };

  const handleDelete = async (bookId) => {
    try {
      await dispatch(deleteBook(bookId));
      setActivePopup(null);
    } catch (err) {
      console.error('Error deleting book:', err);
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || book.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const categories = ['all', ...new Set(books.map(book => book.category))];

  if (loading) {
    return <div className="loading-container-t">Loading books...</div>;
  }

  if (error) {
    return <div className="error-container-t">Error: {error}</div>;
  }

  return (
    <div className="collection-container-t">
      <header className="collection-header-t">
        <div className="header-content-t">
          <div className="title-section-t">
            <div className="header-icon-wrapper-t">
              <FiBook className="book-icon-t" />
            </div>
            <h1>My Book Collection</h1>
          </div>

          <div className="search-filter-container-t">
            <div className="search-bar-t">
              <FiSearch className="search-icon-t" />
              <input
                type="text"
                placeholder="Search books or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className={`filter-dropdown-t ${isFilterOpen ? 'open-t' : ''}`}>
              <button
                className="filter-toggle-t"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <FiFilter className="filter-icon-t" />
                <span>{selectedFilter === 'all' ? 'All Categories' : selectedFilter}</span>
                <FaChevronDown className={`chevron-icon-t ${isFilterOpen ? 'open-t' : ''}`} />
              </button>

              {isFilterOpen && (
                <div className="filter-options-t">
                  {categories.map(category => (
                    <button
                      key={category}
                      className={`filter-option-t ${selectedFilter === category ? 'active-t' : ''}`}
                      onClick={() => {
                        setSelectedFilter(category);
                        setIsFilterOpen(false);
                      }}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="collection-main-t">
        {filteredBooks.length === 0 ? (
          <div className="no-books-t">
            <p>Start building your ultimate book squad now!</p>
            <button onClick={() => navigate('/add')} className="add-book-btn-t">
              <FiPlus className="btn-icon" />
              Add New Book
            </button>
          </div>
        ) : (
          <div className="books-grid-t">
            {filteredBooks.map((book) => (
              <div key={book._id} className={`book-card-t ${book.featured ? 'featured-t' : ''}`}>
                {book.featured && (
                  <div className="featured-badge-t">
                    <FiStar className="badge-icon-t" /> Featured
                  </div>
                )}

                {book.trending && (
                  <div className="trending-badge-t">
                    <FaFire className="badge-icon-t" /> Trending
                  </div>
                )}

                <button
                  className="settings-btn-t"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePopup(book._id);
                  }}
                >
                  <FiSettings />
                </button>

                {activePopup === book._id && (
                  <div className="action-popup-t">
                    <button onClick={() => navigate(`/view-book/${book._id}`)}>
                      <FiEye /> View Details
                    </button>
                    <button onClick={() => navigate(`/edit-book/${book._id}`)}>
                      <FiEdit /> Edit Book
                    </button>
                    <button
                      className="delete-btn-t"
                      onClick={() => handleDelete(book._id)}
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                )}

                <div className="book-cover-t">
                  {book.cover ? (
                    <img src={book.cover} alt={book.title} />
                  ) : (
                    <div className="default-cover-t">
                      <FiBook className="default-cover-icon-t" />
                    </div>
                  )}
                  <div className="book-rating-t">
                    <FiStar className="star-icon-t" /> {book.rating || '0.0'}
                  </div>
                </div>

                <div className="book-info-t">
                  <h3>{book.title}</h3>
                  <p className="author-t">{book.author}</p>
                  <div className="book-meta-t">
                    <span className="year-t"><FiCalendar /> {book.year}</span>
                    <div className="action-buttons-t" onClick={() => navigate(`/view-book/${book._id}`)}>
                      <button className="quick-view-btn-t">Quick View</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Collection;
