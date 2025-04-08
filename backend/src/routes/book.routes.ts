import { Router } from "express";
import upload from "../middleware/upload.middleware";
import { addBook, getAllBooks, editBook, deleteBook } from "../controllers/book.controller";
import { authenticate } from "../middleware/auth.middleware";
const router = Router();

// Route to add a new book (POST /api/books)
router.get("/", authenticate, getAllBooks); 
router.put("/:id", authenticate,upload.single("cover"), editBook); 
router.delete("/:id", authenticate, deleteBook); 
router.post("/", authenticate, upload.single("cover"), addBook);

export default router;
