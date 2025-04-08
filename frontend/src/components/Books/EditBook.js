import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { editBook, deleteBook, fetchBooks } from '../../redux/books/booksActions';
import { selectAllBooks, selectBooksLoading, selectBooksError } from '../../redux/books/booksSlice';
import { FiBook, FiUpload, FiSave, FiX, FiCheckCircle, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import '../../styles/EditBook.css';

const EditBookPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const books = useSelector(selectAllBooks);
    const loading = useSelector(selectBooksLoading);
    const error = useSelector(selectBooksError);

    const [formData, setFormData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Fetch books if not loaded
    useEffect(() => {
        if (books.length === 0) {
            dispatch(fetchBooks());
        }
    }, [dispatch, books]);

    // Set form data once books are loaded
    useEffect(() => {
        const book = books.find(b => b._id === id);
        if (book) setFormData(book);
    }, [books, id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, cover: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, cover: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const form = new FormData();
            Object.keys(formData).forEach(key => {
                form.append(key, formData[key]);
            });

            await dispatch(editBook(id, form));
            showNotification('Book updated successfully!', 'success');
        } catch (err) {
            showNotification('Failed to update book.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        setShowDeleteConfirm(false);
        try {
            await dispatch(deleteBook(id));
            showNotification('Book deleted successfully!', 'success');
            setTimeout(() => navigate(-1), 1500);
        } catch (err) {
            showNotification('Failed to delete book.', 'error');
        }
    };

    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 4000);
    };

    const categories = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Biography', 'History', 'Self-Help', 'Business', 'Technology', 'Science', 'Art', 'Cookbook'];

    if (loading || !formData) return <div className="loading-p">Loading book details...</div>;
    if (error) return <div className="error-p">Error: {error}</div>;

    // Continue rendering form as you already have it — just use formData state.


    return (
        <div className="edit-book-page-container-p">


            {showDeleteConfirm && (
                <div className="delete-modal-v">
                    <div className="modal-content-v">
                        <h3>Delete this book?</h3>
                        <p>Are you sure you want to delete "{formData.title}" from your collection?</p>
                        <div className="modal-buttons-v">
                            <button className="cancel-button-v" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                            <button className="confirm-delete-button-v" onClick={handleDeleteConfirm}>Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}


            {/* Notification */}
            <div className={`notification-p ${notification.show ? 'show-p' : ''} ${notification.type}-p`}>
                <FiCheckCircle className="notification-icon-p" />
                <span>{notification.message}</span>
            </div>

            <div className="edit-book-header-p">
                <button className="back-btn-p" onClick={() => navigate(-1)}>
                    <FiArrowLeft className="back-icon-p" />
                </button>
                <div className="header-content-p">
                    <FiBook className="book-icon-p" />
                    <h1>Edit Book Details</h1>
                </div>
            </div>

            <div className="edit-book-content-p">
                <form onSubmit={handleSubmit} className="edit-book-form-p">
                    <div className="form-grid-p">
                        {/* Left Column */}
                        <div className="form-column-p">
                            <div className="form-group-p">
                                <label htmlFor="title">Book Title*</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="input-field-p"
                                />
                            </div>

                            <div className="form-group-p">
                                <label htmlFor="author">Author*</label>
                                <input
                                    type="text"
                                    id="author"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleChange}
                                    required
                                    className="input-field-p"
                                />
                            </div>

                            <div className="form-group-p">
                                <label htmlFor="isbn">ISBN</label>
                                <input
                                    type="text"
                                    id="isbn"
                                    name="isbn"
                                    value={formData.isbn}
                                    onChange={handleChange}
                                    className="input-field-p"
                                />
                            </div>

                            <div className="form-group-p">
                                <label htmlFor="year">Publication Year</label>
                                <input
                                    type="number"
                                    id="year"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    min="1900"
                                    max={new Date().getFullYear()}
                                    className="input-field-p"
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="form-column-p">
                            <div className="form-group-p">
                                <label htmlFor="publisher">Publisher</label>
                                <input
                                    type="text"
                                    id="publisher"
                                    name="publisher"
                                    value={formData.publisher}
                                    onChange={handleChange}
                                    className="input-field-p"
                                />
                            </div>

                            <div className="form-group-p">
                                <label htmlFor="category">Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="select-field-p"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group-p">
                                <label htmlFor="rating">Rating</label>
                                <select
                                    id="rating"
                                    name="rating"
                                    value={formData.rating}
                                    onChange={handleChange}
                                    className="select-field-p"
                                >
                                    <option value="">Select rating</option>
                                    <option value="5">5/5 - Excellent</option>
                                    <option value="4">4/5 - Very Good</option>
                                    <option value="3">3/5 - Good</option>
                                    <option value="2">2/5 - Fair</option>
                                    <option value="1">1/5 - Poor</option>
                                </select>
                            </div>

                            <div className="form-group-p checkbox-group-p">
                                <label className="checkbox-label-p">
                                    <input
                                        type="checkbox"
                                        id="featured"
                                        name="featured"
                                        checked={formData.featured}
                                        onChange={handleChange}
                                        className="checkbox-input-p"
                                    />
                                    <span className="checkbox-custom-p"></span>
                                    <span className="checkbox-text-p">Mark as Featured</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="form-group-p full-width-p">
                        <label>Book Cover</label>
                        <div className="image-upload-container-p">
                            {formData.cover ? (
                                <div className="image-preview-p">
                                    <img src={formData.cover} alt="Book cover preview" />
                                    <button
                                        type="button"
                                        className="remove-image-btn-p"
                                        onClick={removeImage}
                                    >
                                        <FiX />
                                    </button>
                                </div>
                            ) : (
                                <label className="upload-label-p">
                                    <div className="upload-content-p">
                                        <FiUpload className="upload-icon-p" />
                                        <span>Drag & drop cover image or click to browse</span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden-input-p"
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="form-group-p full-width-p">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="5"
                            className="textarea-field-p"
                        ></textarea>
                    </div>

                    <div className="form-actions-p">
                        <button
                            type="button"
                            className="delete-btn-p"
                            onClick={handleDeleteClick}
                        >
                            <FiTrash2 className="icon-p" />
                            Delete Book
                        </button>
                        <div className="action-buttons-p">
                            <button
                                type="button"
                                className="cancel-btn-p"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="save-btn-p"
                                disabled={isSubmitting}
                            >
                                <FiSave className="icon-p" />
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBookPage;