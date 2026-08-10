const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Shipment = require('../models/Shipment');

// POST /api/orders and /api/shipping/orders - Create Order
router.post(['/', '/orders'], async (req, res) => {
  try {
    const { userId, items, totalAmount, status } = req.body;

    if (!userId || !items || totalAmount === undefined) {
      return res.status(400).json({ error: 'userId, items, and totalAmount are required' });
    }

    const order = await Order.create({
      userId,
      items,
      totalAmount,
      status: status || 'PENDING',
    });

    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/shipping/orders/user/:userId - Get all orders for a user sorted by most recent
router.get(['/user/:userId', '/orders/user/:userId'], async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.findAll({
      where: { userId },
      include: [{ model: Shipment, as: 'shipment' }],
      order: [['createdAt', 'DESC']],
    });

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/orders/:id and /api/shipping/orders/:id - Get Order by ID
router.get(['/:id', '/orders/:id'], async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: [{ model: Shipment, as: 'shipment' }],
    });

    if (!order) {
      return res.status(404).json({ error: `Order with ID ${id} not found` });
    }

    return res.json(order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// PUT/PATCH /api/orders/:id/status and /api/shipping/orders/:id/status - Update Order Status
const updateOrderStatusHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: `Order with ID ${id} not found` });
    }

    order.status = status;
    await order.save();

    return res.json(order);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

router.put(['/:id/status', '/orders/:id/status'], updateOrderStatusHandler);
router.patch(['/:id/status', '/orders/:id/status'], updateOrderStatusHandler);

module.exports = router;
