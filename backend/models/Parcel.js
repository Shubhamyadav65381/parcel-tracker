const mongoose = require('mongoose');

const ParcelSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  description: String,
  destination: String,
  trackingId: String,
  
  status: {
    type: String,
    default: 'Created'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    
  },
  logs: [{
    status: String,
    location: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Parcel', ParcelSchema);
