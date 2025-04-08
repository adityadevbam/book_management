import { Request, Response } from "express";
import Book from "../models/book.model";
import fs from 'fs';
import path from 'path';

export const addBook = async (req: Request, res: Response) => {
  try {
    // Validate required fields
    if (!req.body.title || !req.body.author) {
      return res.status(400).json({
        message: "Title and Author are required fields",
        receivedData: req.body // For debugging
      });
    }

    // Handle file upload
    const coverPath = req.file ? `/uploads/${req.file.filename}` : null;

    // Create new book with all fields
    const newBook = new Book({
      title: req.body.title,
      author: req.body.author,
      isbn: req.body.isbn || '',
      year: req.body.year || '',
      publisher: req.body.publisher || '',
      category: req.body.category || '',
      rating: parseInt(req.body.rating) || 0,
      description: req.body.description || '',
      featured: req.body.featured === 'true',
      cover: coverPath,
      user: req.user?.userId
    });

    await newBook.save();

    const bookObj = newBook.toObject();
    if (bookObj.cover) {
      bookObj.cover = `${req.protocol}://${req.get('host')}${bookObj.cover}`;
    }

    return res.status(201).json({
      message: "Book added successfully",
      book: bookObj
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error adding book:', error);

      if (req.file) {
        fs.unlinkSync(path.join(__dirname, '..', '..', 'uploads', req.file.filename));
      }

      return res.status(500).json({
        message: "Error adding book",
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    } else {
      return res.status(500).json({
        message: "Error adding book",
        error: 'An unknown error occurred',
      });
    }
  };

}
  export const getAllBooks = async (req: Request, res: Response) => {
    try {
      const books = await Book.find({ user: req.user?.userId });

      const booksWithCoverUrl = books.map(book => {
        const bookObj = book.toObject();
        if (bookObj.cover) {
          bookObj.cover = `${req.protocol}://${req.get('host')}${bookObj.cover}`;
        }
        return bookObj;
      });

      return res.status(200).json({
        message: "Books retrieved successfully",
        books: booksWithCoverUrl
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching books",
        error: error instanceof Error ? error.message : error
      });
    }
  };

  // Controller to edit a book
  export const editBook = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const {
        title,
        author,
        isbn,
        year,
        publisher,
        category,
        rating,
        description,
        featured,
      } = req.body;

      // Check if the book exists
      const book = await Book.findById(id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      // Ensure the user updating the book is the owner
      if (book.user.toString() !== req.user?.userId) {
        return res.status(403).json({ message: "Unauthorized to update this book" });
      }

      // Handle file upload if new file is provided
      let coverPath = book.cover;
      if (req.file) {
        // Delete old file if exists
        if (book.cover) {
          const oldFilePath = path.join(__dirname, '..', '..', book.cover);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
        coverPath = `/uploads/${req.file.filename}`;
      }

      // Update the book details
      book.title = title || book.title;
      book.author = author || book.author;
      book.isbn = isbn || book.isbn;
      book.year = year || book.year;
      book.publisher = publisher || book.publisher;
      book.category = category || book.category;
      book.rating = rating || book.rating;
      book.description = description || book.description;
      book.featured = featured === 'true';
      book.cover = coverPath;

      await book.save();

      // Return book with full cover URL if exists
      const bookObj = book.toObject();
      if (bookObj.cover) {
        bookObj.cover = `${req.protocol}://${req.get('host')}${bookObj.cover}`;
      }

      return res.status(200).json({
        message: "Book updated successfully",
        book: bookObj
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error updating book",
        error: error instanceof Error ? error.message : error
      });
    }
  };

  // Controller to delete a book
  export const deleteBook = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Check if the book exists
      const book = await Book.findById(id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      // Ensure the user deleting the book is the owner
      if (book.user.toString() !== req.user?.userId) {
        return res.status(403).json({ message: "Unauthorized to delete this book" });
      }

      // Delete the cover file if exists
      if (book.cover) {
        const filePath = path.join(__dirname, '..', '..', book.cover);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await book.deleteOne();

      return res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
      return res.status(500).json({
        message: "Error deleting book",
        error: error instanceof Error ? error.message : error
      });
    }
  };

  // Controller to get a single book
  export const getBook = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const book = await Book.findById(id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      // Ensure the user accessing the book is the owner
      if (book.user.toString() !== req.user?.userId) {
        return res.status(403).json({ message: "Unauthorized to access this book" });
      }

      // Return book with full cover URL if exists
      const bookObj = book.toObject();
      if (bookObj.cover) {
        bookObj.cover = `${req.protocol}://${req.get('host')}${bookObj.cover}`;
      }

      return res.status(200).json({
        message: "Book retrieved successfully",
        book: bookObj
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching book",
        error: error instanceof Error ? error.message : error
      });
    }
  };