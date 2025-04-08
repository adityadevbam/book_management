import React, { useState} from 'react';
import { FiBook, FiUpload, FiPlus, FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { createBook } from '../../redux/books/booksActions';
import { setError } from '../../redux/books/booksSlice';
import '../../styles/AddBook.css';

import { useNavigate } from 'react-router-dom';

const AddBookModern = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error } = useSelector(state => state.books);

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        isbn: '',
        year: '',
        publisher: '',
        category: '',
        rating: '',
        description: '',
        featured: false,
        cover: null,
        coverPreview: ''
    });

    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    cover: file,
                    coverPreview: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setFormData(prev => ({
            ...prev,
            cover: null,
            coverPreview: ''
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
    
        if (!formData.title || !formData.author) {
            dispatch(setError('Title and Author are required fields'));
            return;
        }
    
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('author', formData.author);
            formDataToSend.append('isbn', formData.isbn || '');
            formDataToSend.append('year', formData.year || '');
            formDataToSend.append('publisher', formData.publisher || '');
            formDataToSend.append('category', formData.category || '');
            formDataToSend.append('rating', formData.rating || '0');
            formDataToSend.append('description', formData.description || '');
            formDataToSend.append('featured', formData.featured);
            if (formData.cover) {
                formDataToSend.append('cover', formData.cover);
            }
    
            await dispatch(createBook(formDataToSend));
    
            setSuccessMessage('Book added successfully to your collection!');
    
            setFormData({
                title: '',
                author: '',
                isbn: '',
                year: '',
                publisher: '',
                category: '',
                rating: '',
                description: '',
                featured: false,
                cover: null,
                coverPreview: ''
            });


            navigate('/');
            // Optional: show message briefly before navigating
            setTimeout(() => {
                setSuccessMessage('');
               // ✅ Navigate back
            }, 1500);

            
        } catch (error) {
            console.error('Error adding book:', error);
        }
    };

    const categories = [
        'Fiction', 'Non-Fiction', 'Sci-Fi', 'Fantasy',
        'Biography', 'History', 'Self-Help', 'Business',
        'Tech', 'Science', 'Art', 'Cookbook', 'Manga'
    ];

    return (
        <div className="add-book-modern-container">
            <div className="modern-header-section">
                <div className="modern-header-content">
                    <FiBook className="modern-book-icon" />
                    <div>
                        <h1 className="modern-title">Add New Book</h1>
                        <p className="modern-subtitle">Expand your digital library</p>
                    </div>
                </div>
                <div className="modern-header-accent"></div>
            </div>

            <form onSubmit={handleSubmit} className="modern-book-form">
                {error && (
                    <div className="modern-error-message">
                        {error}
                    </div>
                )}


                <div className="modern-form-grid">
                    {/* Left Column */}
                    <div className="modern-form-column">
                        <div className="modern-form-group">
                            <label htmlFor="title" className="modern-input-label">Book Title*</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="Enter book title"
                                className="modern-input-field"
                            />
                        </div>

                        <div className="modern-form-group">
                            <label htmlFor="author" className="modern-input-label">Author*</label>
                            <input
                                type="text"
                                id="author"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                required
                                placeholder="Enter author name"
                                className="modern-input-field"
                            />
                        </div>

                        <div className="modern-form-group">
                            <label htmlFor="isbn" className="modern-input-label">ISBN</label>
                            <input
                                type="text"
                                id="isbn"
                                name="isbn"
                                value={formData.isbn}
                                onChange={handleChange}
                                placeholder="Enter ISBN number"
                                className="modern-input-field"
                            />
                        </div>

                        <div className="modern-form-group">
                            <label htmlFor="year" className="modern-input-label">Publication Year</label>
                            <input
                                type="number"
                                id="year"
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                min="1900"
                                max={new Date().getFullYear()}
                                placeholder="YYYY"
                                className="modern-input-field"
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="modern-form-column">
                        <div className="modern-form-group">
                            <label htmlFor="publisher" className="modern-input-label">Publisher</label>
                            <input
                                type="text"
                                id="publisher"
                                name="publisher"
                                value={formData.publisher}
                                onChange={handleChange}
                                placeholder="Enter publisher name"
                                className="modern-input-field"
                            />
                        </div>

                        <div className="modern-form-group">
                            <label htmlFor="category" className="modern-input-label">Category</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="modern-select-field"
                            >
                                <option value="">Select a category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="modern-form-group">
                            <label htmlFor="rating" className="modern-input-label">Rating</label>
                            <div className="modern-rating-selector">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <React.Fragment key={star}>
                                        <input
                                            type="radio"
                                            id={`rating-${star}`}
                                            name="rating"
                                            value={star}
                                            checked={formData.rating === star.toString()}
                                            onChange={handleChange}
                                            className="modern-rating-input"
                                        />
                                        <label
                                            htmlFor={`rating-${star}`}
                                            className={`modern-rating-star ${formData.rating >= star ? 'selected' : ''}`}
                                        >
                                            ★
                                        </label>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        <div className="modern-form-group modern-checkbox-container">
                            <label className="modern-checkbox-label">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleChange}
                                    className="modern-checkbox-input"
                                />
                                <span className="modern-checkbox-custom"></span>
                                <span className="modern-checkbox-text">Featured Book</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Cover Upload */}
                <div className="modern-form-group">
                    <label className="modern-input-label">Book Cover</label>
                    <div className="modern-upload-container">
                        {formData.coverPreview ? (
                            <div className="modern-image-preview">
                                <img src={formData.coverPreview} alt="Book cover preview" />
                                <button
                                    type="button"
                                    className="modern-remove-image-btn"
                                    onClick={removeImage}
                                >
                                    <FiX />
                                </button>
                            </div>
                        ) : (
                            <label className="modern-upload-label">
                                <div className="modern-upload-content">
                                    <FiUpload className="modern-upload-icon" />
                                    <div>
                                        <p className="modern-upload-text">Drag & drop your cover image</p>
                                        <p className="modern-upload-subtext">or click to browse (JPEG, PNG)</p>
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="modern-hidden-input"
                                />
                            </label>
                        )}
                    </div>
                </div>

                {/* Description */}
                <div className="modern-form-group">
                    <label htmlFor="description" className="modern-input-label">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Tell us about this book..."
                        className="modern-textarea-field"
                    ></textarea>
                </div>

                {/* Submit Button */}
                <div className="modern-form-actions">
                    <button
                        type="submit"
                        className="modern-submit-btn"
                        disabled={loading}
                    >
                        <FiPlus className="modern-btn-icon" />
                        {loading ? 'Adding...' : 'Add to Collection'}
                    </button>
                </div>

                {successMessage && (
                    <div className="modern-success-message">
                        {successMessage}
                    </div>
                )}
            </form>
        </div>
    );
};

export default AddBookModern;