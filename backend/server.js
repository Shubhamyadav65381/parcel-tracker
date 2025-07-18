const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const parcelRoutes = require('./routes/parcelRoutes');

dotenv.config();

const app = express();

//  Middleware for parsing JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// CORS configuration for frontend access
app.use(cors({
  origin: 'https://parcel-tracker-frontend-eber.onrender.com',
  credentials: true,
}));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/parcels', parcelRoutes);

//  Root route (optional health check)
app.get('/', (req, res) => {
  res.send('Parcel Tracker API is running...');
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
