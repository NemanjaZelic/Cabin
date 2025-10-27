const User = require('../models/User');
const Cabin = require('../models/Cabin');
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } })
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Greška pri učitavanju korisnika',
      error: error.message
    });
  }
};
exports.getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({ status: 'pending' })
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      count: pendingUsers.length,
      data: pendingUsers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Greška pri učitavanju zahteva',
      error: error.message
    });
  }
};
exports.approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Korisnik nije pronađen'
      });
    }
    if (user.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Ovaj zahtev je već obrađen'
      });
    }
    user.status = 'active';
    await user.save();
    res.json({
      success: true,
      message: 'Korisnik je odobren',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Greška pri odobravanju korisnika',
      error: error.message
    });
  }
};
exports.rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Korisnik nije pronađen'
      });
    }
    if (user.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Ovaj zahtev je već obrađen'
      });
    }
    user.status = 'rejected';
    user.rejectedUsername = true;
    user.rejectedEmail = true;
    await user.save();
    res.json({
      success: true,
      message: 'Korisnik je odbijen',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Greška pri odbijanju korisnika',
      error: error.message
    });
  }
};
exports.deactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Korisnik nije pronađen'
      });
    }
    user.status = 'deactivated';
    await user.save();
    res.json({
      success: true,
      message: 'Korisnik je deaktiviran',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Greška pri deaktiviranju korisnika',
      error: error.message
    });
  }
};
exports.activateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Korisnik nije pronađen'
      });
    }
    user.status = 'active';
    await user.save();
    res.json({
      success: true,
      message: 'Korisnik je aktiviran',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Greška pri aktiviranju korisnika',
      error: error.message
    });
  }
};
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Korisnik nije pronađen'
      });
    }
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Greška pri ažuriranju korisnika',
      error: error.message
    });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Korisnik nije pronađen'
      });
    }
    await user.deleteOne();
    res.json({
      success: true,
      message: 'Korisnik je obrisan'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Greška pri brisanju korisnika',
      error: error.message
    });
  }
};
exports.getAllCabinsAdmin = async (req, res) => {
  try {
    const cabins = await Cabin.find()
      .populate('owner', 'firstName lastName email');
    res.json({
      success: true,
      count: cabins.length,
      data: cabins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Greška pri učitavanju vikendica',
      error: error.message
    });
  }
};
exports.blockCabin = async (req, res) => {
  try {
    const cabin = await Cabin.findById(req.params.id);
    if (!cabin) {
      return res.status(404).json({
        success: false,
        message: 'Vikendica nije pronađena'
      });
    }
    if (cabin.lastThreeRatings.length === 3) {
      const allBelowTwo = cabin.lastThreeRatings.every(rating => rating < 2);
      if (!allBelowTwo) {
        return res.status(400).json({
          success: false,
          message: 'Vikendica ne ispunjava uslove za blokiranje (poslednje 3 ocene nisu sve ispod 2)'
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Vikendica nema dovoljno ocena za blokiranje'
      });
    }
    const blockedUntil = new Date();
    blockedUntil.setHours(blockedUntil.getHours() + 48);
    cabin.isBlocked = true;
    cabin.blockedUntil = blockedUntil;
    await cabin.save();
    res.json({
      success: true,
      message: 'Vikendica je blokirana na 48 sati',
      data: cabin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Greška pri blokiranju vikendice',
      error: error.message
    });
  }
};
