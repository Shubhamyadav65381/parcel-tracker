const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require("./routes/userRoutes");
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/admin', require('./routes/adminRoutes'));
app.use("/api/users", userRoutes); 
app.use(cors({
  origin: "https://parcel-tracker-1.onrender.com",
  credentials: true,
}));
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
