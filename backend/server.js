const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection failed:',err));

// Import Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/parcels', require('./routes/parcelRoutes'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
