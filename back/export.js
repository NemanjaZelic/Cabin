const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

mongoose.connect('mongodb://localhost:27017/planinska_vikendica', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const User = require('./src/models/User');
const Cabin = require('./src/models/Cabin');
const Reservation = require('./src/models/Reservation');
const Comment = require('./src/models/Comment');

async function exportData() {
  try {
    console.log('Eksportovanje korisnika...');
    const users = await User.find({}).lean();
    const usersData = users.map(user => {
      delete user._id;
      delete user.__v;
      delete user.createdAt;
      delete user.updatedAt;
      return user;
    });
    fs.writeFileSync(
      path.join(__dirname, 'data', 'users.json'),
      JSON.stringify(usersData, null, 2)
    );
    console.log(`Eksportovano ${usersData.length} korisnika`);

    console.log('Eksportovanje vikendica...');
    const cabins = await Cabin.find({}).populate('owner').lean();
    const cabinsData = cabins.map(cabin => {
      const ownerUsername = cabin.owner ? cabin.owner.username : null;
      delete cabin._id;
      delete cabin.__v;
      delete cabin.owner;
      delete cabin.createdAt;
      delete cabin.updatedAt;
      return {
        ...cabin,
        ownerUsername
      };
    });
    fs.writeFileSync(
      path.join(__dirname, 'data', 'cabins.json'),
      JSON.stringify(cabinsData, null, 2)
    );
    console.log(`Eksportovano ${cabinsData.length} vikendica`);

    console.log('Eksportovanje rezervacija...');
    const reservations = await Reservation.find({})
      .populate('tourist')
      .populate('cabin')
      .lean();
    const reservationsData = reservations.map(reservation => {
      const touristUsername = reservation.tourist ? reservation.tourist.username : null;
      const cabinName = reservation.cabin ? reservation.cabin.name : null;
      delete reservation._id;
      delete reservation.__v;
      delete reservation.tourist;
      delete reservation.cabin;
      delete reservation.createdAt;
      delete reservation.updatedAt;
      return {
        touristUsername,
        cabinName,
        startDate: reservation.startDate.toISOString().split('T')[0],
        endDate: reservation.endDate.toISOString().split('T')[0],
        adults: reservation.adults,
        children: reservation.children,
        totalPrice: reservation.totalPrice,
        status: reservation.status,
        creditCard: reservation.creditCard
      };
    });
    fs.writeFileSync(
      path.join(__dirname, 'data', 'reservations.json'),
      JSON.stringify(reservationsData, null, 2)
    );
    console.log(`Eksportovano ${reservationsData.length} rezervacija`);

    console.log('Eksportovanje komentara...');
    const comments = await Comment.find({})
      .populate('tourist')
      .populate('cabin')
      .lean();
    const commentsData = comments.map(comment => {
      const touristUsername = comment.tourist ? comment.tourist.username : null;
      const cabinName = comment.cabin ? comment.cabin.name : null;
      delete comment._id;
      delete comment.__v;
      delete comment.tourist;
      delete comment.cabin;
      delete comment.updatedAt;
      return {
        touristUsername,
        cabinName,
        rating: comment.rating,
        text: comment.text,
        createdAt: comment.createdAt ? comment.createdAt.toISOString() : new Date().toISOString()
      };
    });
    fs.writeFileSync(
      path.join(__dirname, 'data', 'comments.json'),
      JSON.stringify(commentsData, null, 2)
    );
    console.log(`Eksportovano ${commentsData.length} komentara`);

    console.log('Eksport uspesno zavrsen!');
    process.exit(0);
  } catch (error) {
    console.error('Greska pri eksportu:', error);
    process.exit(1);
  }
}

exportData();
