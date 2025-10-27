const User = require('../models/User');
const Cabin = require('../models/Cabin');
const Reservation = require('../models/Reservation');
exports.getGeneralStats = async (req, res) => {
  try {
    const totalCabins = await Cabin.countDocuments();
    const totalOwners = await User.countDocuments({ role: 'vlasnik', status: 'active' });
    const totalTourists = await User.countDocuments({ role: 'turista', status: 'active' });
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const reservations24h = await Reservation.countDocuments({
      createdAt: { $gte: last24h }
    });
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const reservations7d = await Reservation.countDocuments({
      createdAt: { $gte: last7d }
    });
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const reservations30d = await Reservation.countDocuments({
      createdAt: { $gte: last30d }
    });
    res.json({
      success: true,
      data: {
        totalCabins,
        totalOwners,
        totalTourists,
        reservations24h,
        reservations7d,
        reservations30d
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Greška pri učitavanju statistike',
      error: error.message
    });
  }
};
exports.getOwnerStats = async (req, res) => {
  try {
    const cabins = await Cabin.find({ owner: req.params.ownerId });
    const cabinIds = cabins.map(cabin => cabin._id);
    const reservationsByMonth = await Reservation.aggregate([
      {
        $match: {
          cabin: { $in: cabinIds },
          status: 'confirmed'
        }
      },
      {
        $group: {
          _id: {
            cabin: '$cabin',
            month: { $month: '$startDate' },
            year: { $year: '$startDate' }
          },
          count: { $sum: 1 }
        }
      }
    ]);
    const reservationsByType = await Reservation.aggregate([
      {
        $match: {
          cabin: { $in: cabinIds },
          status: 'confirmed'
        }
      },
      {
        $group: {
          _id: {
            cabin: '$cabin',
            isWeekend: {
              $or: [
                { $eq: [{ $dayOfWeek: '$startDate' }, 1] },
                { $eq: [{ $dayOfWeek: '$startDate' }, 7] }
              ]
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);
    res.json({
      success: true,
      data: {
        cabins,
        reservationsByMonth,
        reservationsByType
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Greška pri učitavanju statistike',
      error: error.message
    });
  }
};
