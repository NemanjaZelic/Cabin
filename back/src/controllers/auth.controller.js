const jwt = require('jsonwebtoken');
const User = require('../models/User');
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production-2025';
  const expire = process.env.JWT_EXPIRE || '30d';
  return jwt.sign({ id }, secret, {
    expiresIn: expire
  });
};
exports.register = async (req, res) => {
  try {
    const {
      username,
      password,
      firstName,
      lastName,
      gender,
      address,
      phone,
      email,
      creditCard,
      role
    } = req.body;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z].*[a-z].*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z][A-Za-z\d@$!%*?&#]{5,9}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Lozinka mora imati 6-10 karaktera, početi slovom, sadržati bar jedno veliko slovo, tri mala, jedan broj i jedan specijalni karakter'
      });
    }
    if (!creditCard) {
      return res.status(400).json({
        success: false,
        message: 'Broj kreditne kartice je obavezan'
      });
    }
    if (!validateCreditCard(creditCard)) {
      return res.status(400).json({
        success: false,
        message: 'Nevažeći broj kreditne kartice'
      });
    }
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Korisničko ime već postoji'
      });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email već postoji'
      });
    }
    const rejectedUser = await User.findOne({
      $or: [
        { username, rejectedUsername: true },
        { email, rejectedEmail: true }
      ]
    });
    if (rejectedUser) {
      return res.status(400).json({
        success: false,
        message: 'Korisničko ime ili email su odbijeni u prethodnoj registraciji'
      });
    }
    let profileImage = null;
    if (req.file) {
      profileImage = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }
    const user = await User.create({
      username,
      password,
      firstName,
      lastName,
      gender,
      address,
      phone,
      email,
      profileImage,
      creditCard,
      role: role || 'turista',
      status: 'pending'
    });
    res.status(201).json({
      success: true,
      message: 'Zahtev za registraciju je poslat. Čeka se odobrenje administratora.',
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Greška pri registraciji',
      error: error.message
    });
  }
};
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Molimo unesite korisničko ime i lozinku'
      });
    }
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Neispravni kredencijali'
      });
    }
    if (user.status === 'pending') {
      return res.status(403).json({
        success: false,
        message: 'Vaš nalog čeka odobrenje administratora'
      });
    }
    if (user.status === 'rejected') {
      return res.status(403).json({
        success: false,
        message: 'Vaša registracija je odbijena'
      });
    }
    if (user.status === 'deactivated') {
      return res.status(403).json({
        success: false,
        message: 'Vaš nalog je deaktiviran'
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Neispravni kredencijali'
      });
    }
    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Greška pri prijavljivanju',
      error: error.message
    });
  }
};
exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Molimo unesite korisničko ime i lozinku'
      });
    }
    const user = await User.findOne({ username, role: 'admin' }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Neispravni kredencijali'
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Neispravni kredencijali'
      });
    }
    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Greška pri prijavljivanju',
      error: error.message
    });
  }
};
function validateCreditCard(cardNumber) {
  cardNumber = cardNumber.replace(/\s/g, '');
  if (/^(300|301|302|303|36|38)\d{12,13}$/.test(cardNumber) && cardNumber.length === 15) {
    return true;
  }
  if (/^(51|52|53|54|55)\d{14}$/.test(cardNumber) && cardNumber.length === 16) {
    return true;
  }
  if (/^(4539|4556|4916|4532|4929|4485|4716)\d{12}$/.test(cardNumber) && cardNumber.length === 16) {
    return true;
  }
  return false;
}
