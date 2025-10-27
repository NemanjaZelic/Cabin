const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Korisničko ime je obavezno'],
    unique: true,
    trim: true,
    minlength: [3, 'Korisničko ime mora imati najmanje 3 karaktera']
  },
  password: {
    type: String,
    required: [true, 'Lozinka je obavezna'],
    minlength: 6,
    select: false
  },
  firstName: {
    type: String,
    required: [true, 'Ime je obavezno'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Prezime je obavezno'],
    trim: true
  },
  gender: {
    type: String,
    enum: ['M', 'Ž'],
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: [true, 'Kontakt telefon je obavezan']
  },
  email: {
    type: String,
    required: [true, 'Email je obavezan'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Molimo unesite validan email']
  },
  profileImage: {
    type: String,
    default: null
  },
  creditCard: {
    type: String,
    required: [true, 'Broj kreditne kartice je obavezan']
  },
  role: {
    type: String,
    enum: ['turista', 'vlasnik', 'admin'],
    default: 'turista'
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'rejected', 'deactivated'],
    default: 'pending'
  },
  rejectedUsername: {
    type: Boolean,
    default: false
  },
  rejectedEmail: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model('User', userSchema);
