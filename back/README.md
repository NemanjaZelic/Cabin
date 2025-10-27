# Planinska Vikendica - Backend

Backend API za projekat "Planinska vikendica" - PIA 2024/25

## Tehnologije
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Multer (file upload)

## Instalacija

1. Instaliraj dependencies:
```bash
npm install
```

2. Kreiraj `.env` fajl i podesi varijable (već postoji primer)

3. Pokreni MongoDB server lokalno ili koristi MongoDB Atlas

4. Pokreni server:
```bash
npm run dev
```

Server će biti pokrenut na `http://localhost:5000`

## API Endpoints

### Auth Routes (`/api/auth`)
- POST `/register` - Registracija novog korisnika
- POST `/login` - Login turista/vlasnika
- POST `/admin/login` - Login admina

### User Routes (`/api/users`)
- GET `/me` - Dobavi profil trenutnog korisnika
- PUT `/me` - Ažuriraj profil
- PUT `/change-password` - Promeni lozinku

### Cabin Routes (`/api/cabins`)
- GET `/` - Dobavi sve vikendice (sa pretragom)
- GET `/:id` - Dobavi vikendicu po ID-u
- POST `/` - Kreiraj novu vikendicu (vlasnik)
- PUT `/:id` - Ažuriraj vikendicu (vlasnik)
- DELETE `/:id` - Obriši vikendicu (vlasnik)
- GET `/owner/:ownerId` - Dobavi vikendice vlasnika

### Reservation Routes (`/api/reservations`)
- POST `/` - Kreiraj rezervaciju (turista)
- GET `/user/:userId/current` - Trenutne rezervacije
- GET `/user/:userId/archive` - Arhivirane rezervacije
- PUT `/:id/cancel` - Otkaži rezervaciju (turista)
- GET `/owner/:ownerId` - Rezervacije za vlasnike vikendice
- PUT `/:id/status` - Ažuriraj status rezervacije (vlasnik)

### Comment Routes (`/api/comments`)
- GET `/cabin/:cabinId` - Komentari za vikendicu
- POST `/` - Kreiraj komentar i ocenu (turista)

### Stats Routes (`/api/stats`)
- GET `/general` - Opšta statistika (javno)
- GET `/owner/:ownerId` - Statistika vlasnika

### Admin Routes (`/api/admin`)
- GET `/users` - Svi korisnici
- GET `/pending-users` - Zahtevi za registraciju
- PUT `/users/:id/approve` - Odobri korisnika
- PUT `/users/:id/reject` - Odbij korisnika
- PUT `/users/:id/deactivate` - Deaktiviraj korisnika
- PUT `/users/:id` - Ažuriraj korisnika
- DELETE `/users/:id` - Obriši korisnika
- GET `/cabins` - Sve vikendice
- PUT `/cabins/:id/block` - Blokiraj vikendicu

## Struktura projekta
```
back/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── cabin.controller.js
│   │   ├── reservation.controller.js
│   │   ├── comment.controller.js
│   │   ├── stats.controller.js
│   │   └── admin.controller.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Cabin.js
│   │   ├── Reservation.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── cabin.routes.js
│   │   ├── reservation.routes.js
│   │   ├── comment.routes.js
│   │   ├── stats.routes.js
│   │   └── admin.routes.js
│   └── server.js
├── uploads/
│   ├── profiles/
│   └── cabins/
├── .env
├── .gitignore
└── package.json
```

## Kreiranje inicijalnog admin korisnika

Nakon pokretanja servera, možeš kreirati admin korisnika direktno u MongoDB:

```javascript
use planinska_vikendica

db.users.insertOne({
  username: "admin",
  password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // lozinka: Admin123!
  firstName: "Admin",
  lastName: "System",
  gender: "M",
  address: "Admin Address",
  phone: "0601234567",
  email: "admin@example.com",
  role: "admin",
  status: "active",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Login kredencijali: `admin` / `Admin123!`
