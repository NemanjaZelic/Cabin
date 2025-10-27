const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/planinska_vikendica', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const User = require('./src/models/User');
const Cabin = require('./src/models/Cabin');
const Reservation = require('./src/models/Reservation');
const Comment = require('./src/models/Comment');

const sampleBase64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

async function seedDatabase() {
  try {
    await User.deleteMany({});
    await Cabin.deleteMany({});
    await Reservation.deleteMany({});
    await Comment.deleteMany({});

    const admin = await User.create({
      username: 'admin',
      password: 'Admin123!',
      firstName: 'Petar',
      lastName: 'Petrović',
      gender: 'M',
      email: 'admin@example.com',
      phone: '+381601234567',
      address: 'Beograd, Srbija',
      creditCard: '4532111122223333',
      profileImage: sampleBase64Image,
      role: 'admin',
      status: 'active'
    });

    const turista1 = await User.create({
      username: 'marko',
      password: 'Marko123!',
      firstName: 'Marko',
      lastName: 'Marković',
      gender: 'M',
      email: 'marko@example.com',
      phone: '+381601111111',
      address: 'Novi Sad, Srbija',
      creditCard: '4532444455556666',
      profileImage: sampleBase64Image,
      role: 'turista',
      status: 'active'
    });

    const turista2 = await User.create({
      username: 'ana',
      password: 'Ana12345!',
      firstName: 'Ana',
      lastName: 'Anić',
      gender: 'Ž',
      email: 'ana@example.com',
      phone: '+381602222222',
      address: 'Niš, Srbija',
      creditCard: '5412777788889999',
      role: 'turista',
      status: 'active'
    });

    const vlasnik1 = await User.create({
      username: 'jovan',
      password: 'Jovan123!',
      firstName: 'Jovan',
      lastName: 'Jovanović',
      gender: 'M',
      email: 'jovan@example.com',
      phone: '+381603333333',
      address: 'Kopaonik, Srbija',
      creditCard: '4532123456789012',
      role: 'vlasnik',
      status: 'active'
    });

    const vlasnik2 = await User.create({
      username: 'milica',
      password: 'Milica123!',
      firstName: 'Milica',
      lastName: 'Milić',
      gender: 'Ž',
      email: 'milica@example.com',
      phone: '+381604444444',
      address: 'Zlatibor, Srbija',
      creditCard: '5412345678901234',
      role: 'vlasnik',
      status: 'active'
    });

    const vlasnikPending = await User.create({
      username: 'stefan',
      password: 'Stefan123!',
      firstName: 'Stefan',
      lastName: 'Stefanović',
      gender: 'M',
      email: 'stefan@example.com',
      phone: '+381605555555',
      address: 'Tara, Srbija',
      creditCard: '4916123456789012',
      role: 'vlasnik',
      status: 'pending'
    });

    const vikendice = await Cabin.create([
      {
        name: 'Planinska kuća Kopaonik',
        place: 'Kopaonik',
        services: 'wifi,parking,klima,kuhinja,tv',
        pricing: { summer: 8000, winter: 10000 },
        phone: '+381603333333',
        coordinates: { latitude: 43.2897, longitude: 20.8125 },
        owner: vlasnik1._id,
        mainImage: sampleBase64Image,
        images: [sampleBase64Image]
      },
      {
        name: 'Vila Zlatibor',
        place: 'Zlatibor',
        services: 'wifi,parking,klima,kuhinja,tv,bazen',
        pricing: { summer: 12000, winter: 15000 },
        phone: '+381604444444',
        coordinates: { latitude: 43.7397, longitude: 19.7133 },
        owner: vlasnik2._id,
        mainImage: sampleBase64Image,
        images: [sampleBase64Image]
      },
      {
        name: 'Koliba na Kopaoniku',
        place: 'Kopaonik',
        services: 'wifi,parking,kuhinja',
        pricing: { summer: 6000, winter: 8000 },
        phone: '+381603333333',
        coordinates: { latitude: 43.2850, longitude: 20.8200 },
        owner: vlasnik1._id,
        mainImage: sampleBase64Image,
        images: [sampleBase64Image]
      },
      {
        name: 'Apartman Stara Planina',
        place: 'Stara Planina',
        services: 'wifi,parking,klima,tv',
        pricing: { summer: 5500, winter: 7000 },
        phone: '+381603333333',
        coordinates: { latitude: 43.3833, longitude: 22.6167 },
        owner: vlasnik1._id,
        mainImage: sampleBase64Image,
        images: [sampleBase64Image]
      },
      {
        name: 'Kuća na Zlatiboru',
        place: 'Zlatibor',
        services: 'wifi,parking,kuhinja,tv',
        pricing: { summer: 7000, winter: 9000 },
        phone: '+381604444444',
        coordinates: { latitude: 43.7400, longitude: 19.7100 },
        owner: vlasnik2._id,
        mainImage: sampleBase64Image,
        images: [sampleBase64Image]
      }
    ]);

    await Reservation.create([
      {
        tourist: turista1._id,
        cabin: vikendice[0]._id,
        startDate: new Date('2025-12-20'),
        endDate: new Date('2025-12-27'),
        adults: 2,
        children: 1,
        totalPrice: 56000,
        status: 'confirmed',
        creditCard: '4532444455556666'
      },
      {
        tourist: turista2._id,
        cabin: vikendice[1]._id,
        startDate: new Date('2025-11-15'),
        endDate: new Date('2025-11-18'),
        adults: 2,
        children: 0,
        totalPrice: 36000,
        status: 'pending',
        creditCard: '5412777788889999'
      },
      {
        tourist: turista1._id,
        cabin: vikendice[2]._id,
        startDate: new Date('2025-01-10'),
        endDate: new Date('2025-01-15'),
        adults: 3,
        children: 1,
        totalPrice: 30000,
        status: 'confirmed',
        creditCard: '4532444455556666'
      }
    ]);

    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}

seedDatabase();
