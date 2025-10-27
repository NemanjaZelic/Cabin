const mongoose = require('mongoose');
const cabinSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Naziv vikendice je obavezan'],
    trim: true
  },
  place: {
    type: String,
    required: [true, 'Mesto je obavezno'],
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  services: {
    type: String,
    required: true
  },
  pricing: {
    summer: {
      type: Number,
      required: true
    },
    winter: {
      type: Number,
      required: true
    }
  },
  phone: {
    type: String,
    required: true
  },
  coordinates: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  mainImage: {
    type: String,
    required: false
  },
  images: [{
    type: String
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  lastThreeRatings: [{
    type: Number,
    min: 1,
    max: 5
  }],
  isBlocked: {
    type: Boolean,
    default: false
  },
  blockedUntil: {
    type: Date
  }
}, {
  timestamps: true
});
cabinSchema.methods.calculateAverageRating = async function() {
  const Comment = mongoose.model('Comment');
  const comments = await Comment.find({ cabin: this._id, rating: { $exists: true } });
  if (comments.length === 0) {
    this.averageRating = 0;
    this.lastThreeRatings = [];
  } else {
    const sum = comments.reduce((acc, comment) => acc + comment.rating, 0);
    this.averageRating = sum / comments.length;
    this.lastThreeRatings = comments
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 3)
      .map(comment => comment.rating);
  }
  await this.save();
};
module.exports = mongoose.model('Cabin', cabinSchema);
