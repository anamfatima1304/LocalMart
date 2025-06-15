const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const MenuItem = require('../models/Menu');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private (buyers only)
router.post('/', authenticate, async (req, res) => {
  try {
    const { sellerId, items, deliveryAddress, phoneNumber, orderNotes } = req.body;

    // Validate buyer
    if (req.user.userType !== 'buyer') {
      return res.status(403).json({
        success: false,
        message: 'Only buyers can place orders'
      });
    }

    // Validate seller exists
    const seller = await User.findById(sellerId);
    if (!seller || seller.userType !== 'seller') {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    // Validate and calculate order items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem || !menuItem.availability) {
        return res.status(400).json({
          success: false,
          message: `Menu item ${item.menuItemId} is not available`
        });
      }

      const subtotal = menuItem.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        menuItem: menuItem._id,
        itemName: menuItem.itemName,
        price: menuItem.price,
        quantity: item.quantity,
        subtotal: subtotal
      });
    }

    // Create order
    const order = new Order({
      buyer: req.user.id,
      seller: sellerId,
      items: orderItems,
      totalAmount: totalAmount,
      deliveryAddress: deliveryAddress,
      phoneNumber: phoneNumber,
      orderNotes: orderNotes,
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
    });

    await order.save();

    // Populate the order with details
    const populatedOrder = await Order.findById(order._id)
      .populate('buyer', 'name email')
      .populate('seller', 'businessName businessAddress')
      .populate('items.menuItem', 'itemName description');

    res.status(201).json({
      success: true,
      data: populatedOrder,
      message: 'Order placed successfully'
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error placing order',
      error: error.message
    });
  }
});

// @route   GET /api/orders/buyer
// @desc    Get buyer's orders
// @access  Private (buyers only)
router.get('/buyer', authenticate, async (req, res) => {
  try {
    if (req.user.userType !== 'buyer') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const orders = await Order.find({ buyer: req.user.id })
      .populate('seller', 'businessName businessAddress')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error('Error fetching buyer orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// @route   GET /api/orders/seller
// @desc    Get seller's orders, optionally filtered by status
// @access  Private (sellers only)
router.get('/seller', authenticate, async (req, res) => {
  try {
    if (req.user.userType !== 'seller') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { status } = req.query;

    const query = { seller: req.user.id };

    if (status) {
      const validStatuses = ['pending', 'confirmed', 'delivered'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status filter. Must be one of: ${validStatuses.join(', ')}`
        });
      }
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('buyer', 'name email phoneNumber')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// @route   PATCH /api/orders/:orderId
// @desc    Update order status
// @access  Private (seller only)
router.patch('/:orderId', authenticate, async (req, res) => {
  try {
    if (req.user.userType !== 'seller') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const { orderId } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'delivered'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    // Find order, must belong to this seller
    const order = await Order.findOne({ _id: orderId, seller: req.user.id });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
