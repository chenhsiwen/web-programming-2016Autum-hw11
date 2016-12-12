import mongoose from 'mongoose';

const options = {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};

const articleSchema = mongoose.Schema({
	id : Number,
	_id: Object,
	title: String,
	author: String,
	content: String,
	view: Number
}, options);

export const Article = mongoose.model('Article', articleSchema);
