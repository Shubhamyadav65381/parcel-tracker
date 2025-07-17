const express = require('express');
const generateParcelPDF = require('../utils/pdfGenerator');
const jwt = require('jsonwebtoken');
const Parcel = require('../models/Parcel');
const router = express.Router();
const {
  createParcel,
  getUserParcels,
  getAllParcels,
  updateParcelStatus,
  trackParcel
} = require('../controllers/parcelController');

const auth = require('../middleware/auth');

// Create Parcel
router.post('/', auth, createParcel);

// Get My Parcels
router.get('/my', auth, getUserParcels);

// Get All Parcels (Admin Only)
router.get('/', auth, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access Denied' });
  next();
}, getAllParcels);


// Update Status (Admin Only)
router.patch('/:id', auth, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Access Denied' });
  next();
}, updateParcelStatus);

// Track Publicly by Tracking ID
router.get('/track/:trackingId', trackParcel);

//pdf download 
router.get('/:id/download-receipt', async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) return res.status(401).json({ msg: 'Token required' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const role = decoded.role;

    const parcel = await Parcel.findById(req.params.id);
    if (!parcel) return res.status(404).json({ msg: 'Parcel not found' });

    if (parcel.user && parcel.user.toString() !== userId && role !== 'admin') {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    generateParcelPDF(parcel, res);
  } catch (err) {
    console.error("PDF generation error:", err.message);
    return res.status(500).json({ msg: 'Failed to generate PDF' });
  }
});


module.exports = router;
