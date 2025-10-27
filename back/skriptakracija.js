const fs = require('fs');
const path = require('path');

console.log('Kreiranje direktorijuma data/...');
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const sampleBase64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

console.log('Kreiranje users.json...');
const users = [
  {
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
  },
  {
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
  },
  {
    username: 'ana',
    password: 'Ana12345!',
    firstName: 'Ana',
    lastName: 'Anić',
    gender: 'Ž',
    email: 'ana@example.com',
    phone: '+381602222222',
    address: 'Niš, Srbija',
    creditCard: '5412777788889999',
    profileImage: sampleBase64Image,
    role: 'turista',
    status: 'active'
  },
  {
    username: 'jovan',
    password: 'Jovan123!',
    firstName: 'Jovan',
    lastName: 'Jovanović',
    gender: 'M',
    email: 'jovan@example.com',
    phone: '+381603333333',
    address: 'Kopaonik, Srbija',
    creditCard: '4532123456789012',
    profileImage: sampleBase64Image,
    role: 'vlasnik',
    status: 'active'
  },
  {
    username: 'milica',
    password: 'Milica123!',
    firstName: 'Milica',
    lastName: 'Milić',
    gender: 'Ž',
    email: 'milica@example.com',
    phone: '+381604444444',
    address: 'Zlatibor, Srbija',
    creditCard: '5412345678901234',
    profileImage: sampleBase64Image,
    role: 'vlasnik',
    status: 'active'
  },
  {
    username: 'stefan',
    password: 'Stefan123!',
    firstName: 'Stefan',
    lastName: 'Stefanović',
    gender: 'M',
    email: 'stefan@example.com',
    phone: '+381605555555',
    address: 'Tara, Srbija',
    creditCard: '4916123456789012',
    profileImage: sampleBase64Image,
    role: 'vlasnik',
    status: 'pending'
  }
];

fs.writeFileSync(
  path.join(dataDir, 'users.json'),
  JSON.stringify(users, null, 2)
);
console.log(`Kreirano ${users.length} korisnika`);

console.log('Kreiranje cabins.json...');
const cabins = [
  {
    name: 'Planinska kuća Kopaonik',
    place: 'Kopaonik',
    services: 'wifi,parking,klima,kuhinja,tv',
    pricing: { summer: 8000, winter: 10000 },
    phone: '+381603333333',
    coordinates: { latitude: 43.2897, longitude: 20.8125 },
    ownerUsername: 'jovan',
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
    ownerUsername: 'milica',
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
    ownerUsername: 'jovan',
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
    ownerUsername: 'jovan',
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
    ownerUsername: 'milica',
    mainImage: sampleBase64Image,
    images: [sampleBase64Image]
  }
];

fs.writeFileSync(
  path.join(dataDir, 'cabins.json'),
  JSON.stringify(cabins, null, 2)
);
console.log(`Kreirano ${cabins.length} vikendica`);

console.log('Kreiranje reservations.json...');
const reservations = [
  {
    touristUsername: 'marko',
    cabinName: 'Planinska kuća Kopaonik',
    startDate: '2025-12-20',
    endDate: '2025-12-27',
    adults: 2,
    children: 1,
    totalPrice: 56000,
    status: 'confirmed',
    creditCard: '4532444455556666'
  },
  {
    touristUsername: 'ana',
    cabinName: 'Vila Zlatibor',
    startDate: '2025-11-15',
    endDate: '2025-11-18',
    adults: 2,
    children: 0,
    totalPrice: 36000,
    status: 'pending',
    creditCard: '5412777788889999'
  },
  {
    touristUsername: 'marko',
    cabinName: 'Koliba na Kopaoniku',
    startDate: '2025-01-10',
    endDate: '2025-01-15',
    adults: 3,
    children: 1,
    totalPrice: 30000,
    status: 'confirmed',
    creditCard: '4532444455556666'
  }
];

fs.writeFileSync(
  path.join(dataDir, 'reservations.json'),
  JSON.stringify(reservations, null, 2)
);
console.log(`Kreirano ${reservations.length} rezervacija`);

console.log('Kreiranje comments.json...');
const comments = [];

fs.writeFileSync(
  path.join(dataDir, 'comments.json'),
  JSON.stringify(comments, null, 2)
);
console.log(`Kreirano ${comments.length} komentara`);

console.log('\nUspesno kreirani svi JSON fajlovi!');
console.log('Za import u bazu pokrenite: node import.js');
