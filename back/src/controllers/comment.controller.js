const Comment = require('../models/Comment');
const Reservation = require('../models/Reservation');
exports.getCommentsByCabin = async (req, res) => {
  try {
    const comments = await Comment.find({ cabin: req.params.cabinId })
      .populate('tourist', 'firstName lastName profileImage')
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Greška pri učitavanju komentara',
      error: error.message
    });
  }
};
exports.createComment = async (req, res) => {
  try {
    const { cabinId, reservationId, text, rating } = req.body;
    const reservation = await Reservation.findOne({
      _id: reservationId,
      tourist: req.user.id,
      cabin: cabinId
    });
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Rezervacija nije pronađena'
      });
    }
    const now = new Date();
    if (reservation.endDate > now) {
      return res.status(400).json({
        success: false,
        message: 'Možete ostaviti komentar samo nakon završetka boravka'
      });
    }
    const existingComment = await Comment.findOne({ reservation: reservationId });
    if (existingComment) {
      return res.status(400).json({
        success: false,
        message: 'Već ste ostavili komentar za ovu rezervaciju'
      });
    }
    const comment = await Comment.create({
      cabin: cabinId,
      tourist: req.user.id,
      reservation: reservationId,
      text,
      rating
    });
    await comment.populate('tourist', 'firstName lastName profileImage');
    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Greška pri kreiranju komentara',
      error: error.message
    });
  }
};
