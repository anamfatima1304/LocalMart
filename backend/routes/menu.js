const express = require('express');
const router = express.Router();
const MenuItem = require('../models/Menu');
const { authenticate, isSeller } = require('../middleware/auth'); // Fixed import

// @route   GET /api/menu
// @desc    Get all menu items for a seller
// @access  Private (Seller only)
router.get('/', authenticate, isSeller, async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ seller: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @route   POST /api/menu
// @desc    Create a new menu item
// @access  Private (Seller only)
router.post('/', authenticate, isSeller, async (req, res) => {
  try {
    const { itemName, price, category, description, availability } = req.body;

    // Create new menu item
    const menuItem = new MenuItem({
      itemName,
      price,
      category,
      description,
      availability: availability !== undefined ? availability : true,
      seller: req.user.id
    });

    const savedMenuItem = await menuItem.save();

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: savedMenuItem
    });
  } catch (error) {
    console.error('Error creating menu item:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => ({
        field: e.path,
        message: e.message
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @route   PUT /api/menu/:id
// @desc    Update a menu item
// @access  Private (Seller only)
router.put('/:id', authenticate, isSeller, async (req, res) => {
  try {
    const { itemName, price, category, description, availability } = req.body;

    // Find menu item and ensure it belongs to the logged-in seller
    let menuItem = await MenuItem.findOne({ 
      _id: req.params.id, 
      seller: req.user.id 
    });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    // Update fields
    menuItem.itemName = itemName || menuItem.itemName;
    menuItem.price = price !== undefined ? price : menuItem.price;
    menuItem.category = category || menuItem.category;
    menuItem.description = description !== undefined ? description : menuItem.description;
    menuItem.availability = availability !== undefined ? availability : menuItem.availability;

    const updatedMenuItem = await menuItem.save();

    res.json({
      success: true,
      message: 'Menu item updated successfully',
      data: updatedMenuItem
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => ({
        field: e.path,
        message: e.message
      }));
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @route   DELETE /api/menu/:id
// @desc    Delete a menu item
// @access  Private (Seller only)
router.delete('/:id', authenticate, isSeller, async (req, res) => {
  try {
    // Find menu item and ensure it belongs to the logged-in seller
    const menuItem = await MenuItem.findOne({ 
      _id: req.params.id, 
      seller: req.user.id 
    });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    await MenuItem.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @route   GET /api/menu/public/:sellerId
// @desc    Get public menu for buyers (optional - for displaying seller's menu to buyers)
// @access  Public
router.get('/public/:sellerId', async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ 
      seller: req.params.sellerId,
      availability: true 
    })
    .select('-seller') // Don't send seller info to public
    .sort({ category: 1, itemName: 1 });
    
    res.json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    console.error('Error fetching public menu:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

module.exports = router;