const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
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
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
}, {
  timestamps: true
});
commentSchema.post('save', async function() {
  const Cabin = mongoose.model('Cabin');
  const cabin = await Cabin.findById(this.cabin);
  if (cabin) {
    await cabin.calculateAverageRating();
  }
});
module.exports = mongoose.model('Comment', commentSchema);
