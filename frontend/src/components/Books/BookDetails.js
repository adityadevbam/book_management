import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  FiArrowLeft, FiEdit, FiTrash2, FiStar,
  FiCalendar, FiBook, FiHash, FiGlobe
} from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';
import { deleteBook, fetchBooks } from '../../redux/books/booksActions'; // ✅ Import async thunk
import { selectAllBooks } from '../../redux/books/booksSlice';
import '../../styles/BookDetails.css';

const BookDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const books = useSelector(selectAllBooks);
  const bookData = books.find(b => b._id === id);

  // ✅ Ensure books are fetched on reload
  useEffect(() => {
    if (books.length === 0) {
      dispatch(fetchBooks());
    }
  }, [dispatch, books]);

  const handleEdit = () => {
    navigate(`/edit-book/${id}`);
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteBook(id));
      navigate(-1); // Back to previous page
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!bookData) return <p className="loading-msg-v">Loading book details...</p>;

  return (
    <div className="book-details-container-v">
      <button className="back-button-v" onClick={handleBack}>
        <FiArrowLeft className="back-icon-v" />
        Back to Collection
      </button>

      <div className="book-details-card-v">
        <div className="book-cover-section-v">
          <div className="book-cover-container-v">
            <img src={bookData.cover} alt={bookData.title} className="book-cover-v" />
            {bookData.featured && (
              <div className="featured-badge-v">
                <FiStar className="badge-icon-v" /> Featured
              </div>
            )}
            {bookData.trending && (
              <div className="trending-badge-v">
                <FaFire className="badge-icon-v" /> Trending
              </div>
            )}
          </div>

          <div className="action-buttons-v">
            <button className="edit-button-v" onClick={handleEdit}>
              <FiEdit className="button-icon-v" /> Edit Book
            </button>
            <button className="delete-button-v" onClick={() => setShowDeleteConfirm(true)}>
              <FiTrash2 className="button-icon-v" /> Delete
            </button>
          </div>
        </div>

        <div className="book-info-section-v">
          <h1 className="book-title-v">{bookData.title}</h1>
          <p className="book-author-v">{bookData.author}</p>

          <div className="rating-container-v">
            <div className="stars-v">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className={`star-v ${i < Math.floor(bookData.rating) ? 'filled-v' : ''}`} />
              ))}
            </div>
            <span className="rating-text-v">{bookData.rating}/5</span>
          </div>

          <div className="book-meta-grid-v">
            <div className="meta-item-v">
              <FiCalendar className="meta-icon-v" />
              <div>
                <span className="meta-label-v">Published</span>
                <span className="meta-value-v">{bookData.year}</span>
              </div>
            </div>
            <div className="meta-item-v">
              <FiGlobe className="meta-icon-v" />
              <div>
                <span className="meta-label-v">Publisher</span>
                <span className="meta-value-v">{bookData.publisher}</span>
              </div>
            </div>
            <div className="meta-item-v">
              <FiBook className="meta-icon-v" />
              <div>
                <span className="meta-label-v">Category</span>
                <span className="meta-value-v">{bookData.category}</span>
              </div>
            </div>
            <div className="meta-item-v">
              <FiHash className="meta-icon-v" />
              <div>
                <span className="meta-label-v">ISBN</span>
                <span className="meta-value-v">{bookData.isbn}</span>
              </div>
            </div>
          </div>

          <div className="book-description-v">
            <h3 className="description-title-v">About This Book</h3>
            <p className="description-text-v">{bookData.description}</p>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="delete-modal-v">
          <div className="modal-content-v">
            <h3>Delete this book?</h3>
            <p>Are you sure you want to delete "{bookData.title}" from your collection?</p>
            <div className="modal-buttons-v">
              <button className="cancel-button-v" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="confirm-delete-button-v" onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetails;
