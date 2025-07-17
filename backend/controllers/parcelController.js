const Parcel = require('../models/Parcel');
const { v4: uuidv4 } = require('uuid');
const sendEmail = require('../utils/sendEmail');

// Create Parcel
exports.createParcel = async (req, res) => {
  try {
    console.log("Creating parcel with data:", req.body);

    const { sender, receiver, description, destination } = req.body;
    const trackingId = uuidv4();

    const newParcel = new Parcel({
      sender,
      receiver,
      description,
      destination,
      trackingId,
      user:req.user.id
    });

    await newParcel.save();

    
      console.log("✅ Logged-in user in createParcel:", req.user);

    const emailContent = `
      <h3>Parcel Created Successfully</h3>
      <p><strong>Tracking ID:</strong> ${trackingId}</p>
      <p><strong>Sender:</strong> ${sender}</p>
      <p><strong>Receiver:</strong> ${receiver}</p>
      <p><strong>Destination:</strong> ${destination}</p>
      <p><strong>Status:</strong> Created</p>
      <p><strong>Created At:</strong> ${new Date().toLocaleString()}</p>
    `;

    await sendEmail(req.user.email, 'Parcel Confirmation', emailContent);

    //res.redirect('/parcels/my');
    //res.status(201).json(newParcel);
    res.status(201).json({ msg: 'Parcel created successfully' });


  } catch (err) {
    console.error("❌ Parcel creation failed:", err.message);
    //facing issue in parcel creation on admin interface 
    //res.status(500).json({ msg: 'Parcel creation failed', error: err.message });
    res.render('parcels/create', {user: req.user || null,
    error: 'Parcel creation failed. Please try again.'});
  }
};


// Get User's Parcels
exports.getUserParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find({ user: req.user.id }); // ❌ user field is never set
    res.json(parcels);
  } catch (err) {
    console.error("GetUserParcels error:", err.message);
    res.status(500).json({ msg: 'Error fetching parcels' });
  }
};


// Get All Parcels (Admin)
exports.getAllParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find().sort({ createdAt: -1 });
    res.json(parcels);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch parcels' });
  }
};


// Update Parcel Status (Admin)
exports.updateParcelStatus = async (req, res) => {
  const { id } = req.params;
  const { status, location } = req.body;

  try {
    const parcel = await Parcel.findById(id);
    if (!parcel) return res.status(404).json({ msg: 'Parcel not found' });

    parcel.status = status;
    parcel.logs.push({ status, location: location||'N/A',timestamp : new Date() });
    await parcel.save();

    res.json(parcel);
  } catch (err) {
    console.error("❌ Error updating parcel:", err.message);
    res.status(500).json({ msg: 'Error updating parcel' });
  }
};

// GET /api/parcels/track/:trackingId
exports.trackParcel = async (req, res) => {
  try {
    const parcel = await Parcel.findOne({ trackingId: req.params.trackingId });
    if (!parcel) return res.status(404).json({ msg: 'Tracking ID not found' });

    res.json(parcel); // ✅ Full parcel object
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
