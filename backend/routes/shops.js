
// 1. First, create a new route file: routes/shops.js
const express = require('express');
const router = express.Router();
const MenuItem = require('../models/Menu');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET /api/shops
// @desc    Get all shops with their menu items
// @access  Public (buyers need to see shops)
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    
    // Build query for sellers
    let userQuery = { userType: 'seller', isActive: true };
    
    // If search term provided, search in business name
    if (search) {
      userQuery.businessName = { $regex: search, $options: 'i' };
    }
    
    // Get all active sellers
    const sellers = await User.find(userQuery).select('name businessName businessAddress profileImage');
    
    if (sellers.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: 'No shops found'
      });
    }
    
    // Get menu items for each seller
    const shopsWithMenus = await Promise.all(
      sellers.map(async (seller) => {
        let menuQuery = { seller: seller._id, availability: true };
        
        // Filter by category if provided
        if (category && category !== 'All') {
          menuQuery.category = category.toLowerCase();
        }
        
        const menuItems = await MenuItem.find(menuQuery);
        
        // Calculate average rating (you can implement this later)
        const avgRating = 4.0 + Math.random() * 1; // Temporary random rating
        const reviewCount = Math.floor(Math.random() * 50) + 10; // Temporary random reviews
        
        return {
          id: seller._id,
          name: seller.name || 'Shop Name',
          businessAddress: seller.businessAddress || 'Ban Hafiz G',
          profileImage: seller.profileImage || '/api/placeholder/200/150',
          rating: Math.round(avgRating * 10) / 10,
          reviews: reviewCount,
          menuItems: menuItems,
          totalItems: menuItems.length,
          // Determine main category based on menu items
          mainCategory: menuItems.length > 0 ? 
            menuItems.reduce((acc, item) => {
              acc[item.category] = (acc[item.category] || 0) + 1;
              return acc;
            }, {}) : {},
          deliveryTime: '15-30 min' // You can make this dynamic later
        };
      })
    );
    
    // Filter out shops with no menu items if category filter is applied
    const filteredShops = category && category !== 'All' ? 
      shopsWithMenus.filter(shop => shop.menuItems.length > 0) : 
      shopsWithMenus;
    
    res.json({
      success: true,
      data: filteredShops,
      count: filteredShops.length
    });
    
  } catch (error) {
    console.error('Error fetching shops:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching shops',
      error: error.message
    });
  }
});

// @route   GET /api/shops/:id
// @desc    Get single shop with detailed menu
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const seller = await User.findById(req.params.id).select('businessName businessAddress profileImage');
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Shop not found'
      });
    }
    
    const menuItems = await MenuItem.find({ seller: req.params.id, availability: true });
    
    res.json({
      success: true,
      data: {
        id: seller._id,
        name: seller.businessName,
        businessAddress: seller.businessAddress,
        profileImage: seller.profileImage,
        menuItems: menuItems
      }
    });
    
  } catch (error) {
    console.error('Error fetching shop details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching shop details',
      error: error.message
    });
  }
});

// @route   GET /api/shops/categories/stats
// @desc    Get category statistics for filtering
// @access  Public
router.get('/categories/stats', async (req, res) => {
  try {
    const categoryStats = await MenuItem.aggregate([
      { $match: { availability: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    // Get total count
    const totalCount = await MenuItem.countDocuments({ availability: true });
    
    // Format the response
    const categories = [
      { name: 'All', count: totalCount }
    ];
    
    categoryStats.forEach(stat => {
      categories.push({
        name: stat._id.charAt(0).toUpperCase() + stat._id.slice(1),
        count: stat.count
      });
    });
    
    res.json({
      success: true,
      data: categories
    });
    
  } catch (error) {
    console.error('Error fetching category stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category statistics',
      error: error.message
    });
  }
});

module.exports = router;