const express = require('express');
const router = express.Router();
const axios = require('axios');
const { ensureAuth, ensureUser } = require('../middleware/auth');
const { ensureAdmin } = require('../middleware/auth');

const BACKEND_URL = 'https://parcel-tracker-wc6q.onrender.com';

// Show Create Parcel Form
router.get('/create', ensureAuth, (req, res) => {
  res.render('parcels/create', { user: req.session.user, error: null });
});

// Handle Create Parcel POST
router.post('/create', ensureAuth, async (req, res) => {
  const { sender, receiver, description, destination } = req.body;

  try {
    const response = await axios.post(`${BACKEND_URL}`, {
      sender,
      receiver,
      description,
      destination
    }, {
      headers: {
        Authorization: req.session.token
      }
    });

    // ✅ Redirect only if backend responds successfully
    if (response.status === 201) {
      return res.redirect('/parcels/my');
    } else {
      return res.render('parcels/create', { user: req.session.user, error: "Parcel creation failed" });
    }

  } catch (err) {
    console.error("❌ Parcel creation error (frontend):", err.message);
    const errorMsg = err.response?.data?.msg || 'Parcel creation failed';
    res.render('parcels/create', { user: req.session.user, error: errorMsg });
  }
});


// Show My Parcels (Simple Page for Now)
router.get('/my', ensureAuth, ensureUser, async (req, res) => {
  try {
    const response = await axios.get(`https://parcel-tracker-wc6q.onrender.com/api/parcels/my`, {
      headers: {
        Authorization: req.session.token
      }
    });

    console.log("Fetched Parcels: ", response.data); 
    res.render('parcels/my', {
      parcels: response.data,
      user: req.session.user,
      token: req.session.token 
    });

  } catch (err) {
    console.error("❌ Error fetching my parcels:", err.message);
    res.send('Failed to fetch parcels.');
  }
});


// View All Parcels (Admin)
router.get('/all', ensureAuth, ensureAdmin, async (req, res) => {
  try {
    const response = await axios.get('https://parcel-tracker-wc6q.onrender.com/api/parcels', {
      headers: { Authorization: req.session.token }
    });

    res.render('parcels/all', {
      parcels: response.data,
      user: req.session.user,
      token: req.session.token 
    });
  } catch (err) {
    console.log("❌ Error fetching all parcels:", err.response?.data || err.message);
    res.send('Failed to load all parcels');
  }
});


// Update Parcel Status (Admin)
router.post('/update/:id', ensureAuth, ensureAdmin, async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    await axios.patch(`https://parcel-tracker-wc6q.onrender.com/api/parcels/${id}`, {
      status
    }, {
      headers: { Authorization: req.session.token }
    });

    res.redirect('/parcels/all');
  } catch (err) {
    res.send('Update failed');
  }
});

// Show tracking form (public)
router.get('/track', (req, res) => {
  res.render('parcels/track', { parcel: null, error: null });
});

// Handle tracking form submission
router.post('/track', async (req, res) => {
  const { trackingId } = req.body;

  try {
    const response = await axios.get(`https://parcel-tracker-wc6q.onrender.com/api/parcels/track/${trackingId}`);
    const parcel = response.data;

    res.render('parcels/track', { parcel, error: null });

  } catch (err) {
    res.render('parcels/track', { parcel: null, error: 'Tracking ID not found or invalid.' });
  }
});
//analytics page route
router.get('/dashboard', ensureAuth, ensureAdmin, async (req, res) => {
  try {
    const response = await axios.get('https://parcel-tracker-wc6q.onrender.com/api/admin/analytics', {
      headers: { Authorization: req.session.token }
    });

    res.render('admin/dashboard', {
      data: response.data,
      user: req.session.user
    });

  } catch (err) {
    console.log("Dashboard error:", err.message);
    res.send("Failed to load dashboard");
  }
});

module.exports = router;
