const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: [100, 'Item name cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['main', 'appetizer', 'dessert', 'drinks'],
    lowercase: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  availability: {
    type: Boolean,
    default: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming your user model is named 'User'
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
MenuItemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for better performance
MenuItemSchema.index({ seller: 1 });
MenuItemSchema.index({ category: 1 });
MenuItemSchema.index({ availability: 1 });

module.exports = mongoose.model('MenuItem', MenuItemSchema);