const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment');
const Order = require('../models/Order');

// POST /api/shipments and /api/shipping/shipments - Create Shipment
router.post(['/', '/shipments'], async (req, res) => {
  try {
    const { orderId, address, carrier, trackingNumber, status } = req.body;

    if (!orderId || !address) {
      return res.status(400).json({ error: 'orderId and address are required' });
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: `Order with ID ${orderId} not found` });
    }

    const shipment = await Shipment.create({
      orderId,
      address,
      carrier: carrier || 'STANDARD_EXPRESS',
      trackingNumber: trackingNumber || `TRK-${Date.now()}`,
      status: status || 'PROCESSING',
    });

    return res.status(201).json(shipment);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/shipments/:id and /api/shipping/shipments/:id - Get Shipment by ID
router.get(['/:id', '/shipments/:id'], async (req, res) => {
  try {
    const { id } = req.params;
    const shipment = await Shipment.findByPk(id, {
      include: [{ model: Order, as: 'order' }],
    });

    if (!shipment) {
      return res.status(404).json({ error: `Shipment with ID ${id} not found` });
    }

    return res.json(shipment);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// PUT/PATCH /api/shipments/:id/status and /api/shipping/shipments/:id/status - Update Shipment Status
const updateShipmentStatusHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'status is required' });
    }

    const shipment = await Shipment.findByPk(id);
    if (!shipment) {
      return res.status(404).json({ error: `Shipment with ID ${id} not found` });
    }

    shipment.status = status;
    if (trackingNumber) {
      shipment.trackingNumber = trackingNumber;
    }
    await shipment.save();

    return res.json(shipment);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

router.put(['/:id/status', '/shipments/:id/status'], updateShipmentStatusHandler);
router.patch(['/:id/status', '/shipments/:id/status'], updateShipmentStatusHandler);

module.exports = router;
