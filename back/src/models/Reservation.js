const mongoose = require('mongoose');
const reservationSchema = new mongoose.Schema({
  cabin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cabin',
    required: true
  },
  tourist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  adults: {
    type: Number,
    required: true,
    min: 1
  },
  children: {
    type: Number,
    default: 0,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true
  },
  creditCard: {
    type: String,
    required: true
  },
  specialRequests: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'rejected', 'cancelled', 'completed'],
    default: 'pending'
  },
  rejectionReason: {
    type: String
  }
}, {
  timestamps: true
});
reservationSchema.statics.checkAvailability = async function(cabinId, startDate, endDate, excludeId = null) {
  const query = {
    cabin: cabinId,
    status: { $in: ['pending', 'confirmed'] },
    $or: [
      { startDate: { $lte: startDate }, endDate: { $gte: startDate } },
      { startDate: { $lte: endDate }, endDate: { $gte: endDate } },
      { startDate: { $gte: startDate }, endDate: { $lte: endDate } }
    ]
  };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  const overlapping = await this.find(query);
  return overlapping.length === 0;
};
module.exports = mongoose.model('Reservation', reservationSchema);
