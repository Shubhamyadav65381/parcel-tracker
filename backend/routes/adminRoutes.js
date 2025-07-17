const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Parcel = require('../models/Parcel');

// Admin Analytics
router.get('/analytics', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access Denied' });

  try {
    const totalParcels = await Parcel.countDocuments();
    const created = await Parcel.countDocuments({ status: 'Created' });
    const transit = await Parcel.countDocuments({ status: 'In Transit' });
    const delivered = await Parcel.countDocuments({ status: 'Delivered' });

    const topDestinations = await Parcel.aggregate([
      { $group: { _id: "$destination", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      totalParcels,
      statusCount: { created, transit, delivered },
      topDestinations
    });

  } catch (err) {
    console.error('Analytics error:', err.message);
    res.status(500).json({ msg: 'Failed to load analytics' });
  }
});

module.exports = router;
