const Reservation = require('../models/Reservation');
const Cabin = require('../models/Cabin');
const calculatePrice = (cabin, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  let totalPrice = 0;
  const currentDate = new Date(start);
  while (currentDate < end) {
    const month = currentDate.getMonth() + 1;
    if (month >= 5 && month <= 8) {
      totalPrice += cabin.pricing.summer;
    } else {
      totalPrice += cabin.pricing.winter;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return totalPrice;
};
exports.createReservation = async (req, res) => {
  try {
    const {
      cabinId,
      startDate,
      endDate,
      adults,
      children,
      creditCard,
      specialRequests
    } = req.body;
    const cabin = await Cabin.findById(cabinId);
    if (!cabin) {
      return res.status(404).json({
        success: false,
        message: 'Vikendica nije pronađena'
      });
    }
    if (cabin.isBlocked && cabin.blockedUntil > new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Vikendica je trenutno blokirana'
      });
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'Datum kraja mora biti nakon datuma početka'
      });
    }
    if (start < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Ne možete rezervisati u prošlosti'
      });
    }
    const isAvailable = await Reservation.checkAvailability(cabinId, start, end);
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Vikendica nije dostupna za izabrani period'
      });
    }
    const totalPrice = calculatePrice(cabin, start, end);
    const reservation = await Reservation.create({
      cabin: cabinId,
      tourist: req.user.id,
      startDate: start,
      endDate: end,
      adults,
      children: children || 0,
      totalPrice,
      creditCard,
      specialRequests,
      status: 'pending'
    });
    await reservation.populate('cabin', 'name place');
    await reservation.populate('tourist', 'firstName lastName email');
    res.status(201).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Greška pri kreiranju rezervacije',
      error: error.message
    });
  }
};
exports.getCurrentReservations = async (req, res) => {
  try {
    const now = new Date();
    const reservations = await Reservation.find({
      tourist: req.params.userId,
      status: { $in: ['pending', 'confirmed'] },
      startDate: { $gte: now }
    })
    .populate('cabin', 'name place images')
    .sort({ startDate: 1 });
    res.json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Greška pri učitavanju rezervacija',
      error: error.message
    });
  }
};
exports.getArchivedReservations = async (req, res) => {
  try {
    const now = new Date();
    const reservations = await Reservation.find({
      tourist: req.params.userId,
      $or: [
        { status: 'completed' },
        { status: 'confirmed', endDate: { $lt: now } }
      ]
    })
    .populate('cabin', 'name place images')
    .sort({ endDate: -1 });
    res.json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Greška pri učitavanju arhive rezervacija',
      error: error.message
    });
  }
};
exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Rezervacija nije pronađena'
      });
    }
    if (reservation.tourist.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Nemate ovlašćenje da otkažete ovu rezervaciju'
      });
    }
    const now = new Date();
    const oneDayBefore = new Date(reservation.startDate);
    oneDayBefore.setDate(oneDayBefore.getDate() - 1);
    if (now > oneDayBefore) {
      return res.status(400).json({
        success: false,
        message: 'Rezervacija se može otkazati najkasnije 1 dan pre početka'
      });
    }
    reservation.status = 'cancelled';
    await reservation.save();
    res.json({
      success: true,
      message: 'Rezervacija je otkazana',
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Greška pri otkazivanju rezervacije',
      error: error.message
    });
  }
};
exports.getOwnerReservations = async (req, res) => {
  try {
    const cabins = await Cabin.find({ owner: req.params.ownerId });
    const cabinIds = cabins.map(cabin => cabin._id);
    const reservations = await Reservation.find({
      cabin: { $in: cabinIds }
    })
    .populate('cabin', 'name place')
    .populate('tourist', 'firstName lastName email phone')
    .sort({ createdAt: -1 });
    res.json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Greška pri učitavanju rezervacija',
      error: error.message
    });
  }
};

exports.getMyReservations = async (req, res) => {
  try {
    const cabins = await Cabin.find({ owner: req.user.id }).select('_id');
    const cabinIds = cabins.map(cabin => cabin._id);
    
    const reservations = await Reservation.find({
      cabin: { $in: cabinIds }
    })
    .populate('cabin', 'name place images')
    .populate('tourist', 'firstName lastName email phone')
    .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Greška pri učitavanju rezervacija',
      error: error.message
    });
  }
};
exports.updateReservationStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const reservation = await Reservation.findById(req.params.id)
      .populate('cabin');
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Rezervacija nije pronađena'
      });
    }
    if (reservation.cabin.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Nemate ovlašćenje da menjate status ove rezervacije'
      });
    }
    if (status === 'rejected' && !rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Molimo unesite razlog odbijanja'
      });
    }
    reservation.status = status;
    if (status === 'rejected') {
      reservation.rejectionReason = rejectionReason;
    }
    await reservation.save();
    res.json({
      success: true,
      message: `Rezervacija je ${status === 'confirmed' ? 'potvrđena' : 'odbijena'}`,
      data: reservation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Greška pri ažuriranju statusa rezervacije',
      error: error.message
    });
  }
};
