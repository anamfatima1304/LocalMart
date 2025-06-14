const Order = require('../models/orders');

const createOrder = async (req, res) => {
  try {
    // Create new order with all data from request body
    // orderNumber will be auto-generated in schema pre-save hook
    const order = new Order(req.body);

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

module.exports = {
  createOrder
};
