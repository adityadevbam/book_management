import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  isbn: string;
  year: string;
  publisher: string;
  category: string;
  rating: number;
  description: string;
  featured: boolean;
  cover: string | null;
  user: mongoose.Types.ObjectId;
}

const BookSchema: Schema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, default: '' },
  year: { type: String, default: '' },
  publisher: { type: String, default: '' },
  category: { type: String, default: '' },
  rating: { type: Number, default: 0 },
  description: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  cover: { type: String, default: null },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

export default mongoose.model<IBook>('Book', BookSchema);