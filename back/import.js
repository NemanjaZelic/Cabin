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

async function importData() {
  try {
    console.log('Brisanje postojecih podataka...');
    await User.deleteMany({});
    await Cabin.deleteMany({});
    await Reservation.deleteMany({});
    await Comment.deleteMany({});

    console.log('Ucitavanje JSON fajlova...');
    const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'users.json'), 'utf-8'));
    const cabinsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'cabins.json'), 'utf-8'));
    const reservationsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'reservations.json'), 'utf-8'));
    const commentsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'comments.json'), 'utf-8'));

    console.log('Importovanje korisnika...');
    const users = await User.insertMany(usersData);
    console.log(`Importovano ${users.length} korisnika`);

    console.log('Mapiranje vlasnika sa vikendica...');
    const userMap = {};
    users.forEach(user => {
      userMap[user.username] = user._id;
    });

    const cabinsWithOwners = cabinsData.map(cabin => {
      const ownerUsername = cabin.ownerUsername;
      delete cabin.ownerUsername;
      return {
        ...cabin,
        owner: userMap[ownerUsername]
      };
    });

    console.log('Importovanje vikendica...');
    const cabins = await Cabin.insertMany(cabinsWithOwners);
    console.log(`Importovano ${cabins.length} vikendica`);

    const cabinMap = {};
    cabins.forEach(cabin => {
      cabinMap[cabin.name] = cabin._id;
    });

    if (reservationsData.length > 0) {
      const reservationsWithRefs = reservationsData.map(reservation => {
        const touristUsername = reservation.touristUsername;
        const cabinName = reservation.cabinName;
        delete reservation.touristUsername;
        delete reservation.cabinName;
        return {
          ...reservation,
          tourist: userMap[touristUsername],
          cabin: cabinMap[cabinName],
          startDate: new Date(reservation.startDate),
          endDate: new Date(reservation.endDate)
        };
      });

      console.log('Importovanje rezervacija...');
      const reservations = await Reservation.insertMany(reservationsWithRefs);
      console.log(`Importovano ${reservations.length} rezervacija`);
    }

    if (commentsData.length > 0) {
      const commentsWithRefs = commentsData.map(comment => {
        const touristUsername = comment.touristUsername;
        const cabinName = comment.cabinName;
        delete comment.touristUsername;
        delete comment.cabinName;
        return {
          ...comment,
          tourist: userMap[touristUsername],
          cabin: cabinMap[cabinName],
          createdAt: comment.createdAt ? new Date(comment.createdAt) : new Date()
        };
      });

      console.log('Importovanje komentara...');
      const comments = await Comment.insertMany(commentsWithRefs);
      console.log(`Importovano ${comments.length} komentara`);
    }

    console.log('Import uspesno zavrsen!');
    process.exit(0);
  } catch (error) {
    console.error('Greska pri importu:', error);
    process.exit(1);
  }
}

importData();
