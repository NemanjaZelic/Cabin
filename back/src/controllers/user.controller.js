const User = require('../models/User');
const bcrypt = require('bcryptjs');
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Greška pri učitavanju profila',
      error: error.message
    });
  }
};
exports.updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      address: req.body.address,
      phone: req.body.phone,
      email: req.body.email,
      creditCard: req.body.creditCard
    };
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );
    if (req.file) {
      fieldsToUpdate.profileImage = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Greška pri ažuriranju profila',
      error: error.message
    });
  }
};
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Molimo unesite sve podatke'
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Nova lozinka i potvrda lozinke se ne poklapaju'
      });
    }
    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Nova lozinka mora biti različita od stare'
      });
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z].*[a-z].*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z][A-Za-z\d@$!%*?&#]{5,9}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Nova lozinka mora imati 6-10 karaktera, početi slovom, sadržati bar jedno veliko slovo, tri mala, jedan broj i jedan specijalni karakter'
      });
    }
    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Stara lozinka nije ispravna'
      });
    }
    user.password = newPassword;
    await user.save();
    res.json({
      success: true,
      message: 'Lozinka je uspešno promenjena'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Greška pri promeni lozinke',
      error: error.message
    });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
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
      message: 'Greška pri učitavanju korisnika',
      error: error.message
    });
  }
};
