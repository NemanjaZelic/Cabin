# Planinska Vikendica - Web Aplikacija

Web sistem za iznajmljivanje planinskih vikendica u Srbiji.

## Tehnologije

### Backend
- Node.js + Express 4.18.2
- MongoDB (Mongoose 8.0.0)
- JWT autentifikacija
- Bcrypt za enkripciju lozinki
- Multer za upload fajlova

### Frontend
- Angular 18 (standalone components)
- TypeScript
- RxJS
- CSS (responsive dizajn)

## Instalacija

### Preduslovi
- Node.js (v16 ili noviji)
- MongoDB (lokalno ili remote)

### Backend

```bash
cd back
npm install
```

Kreirati `.env` fajl u `back/` folderu:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/planinska_vikendica
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
```

Pokretanje:

```bash
node src/server.js
```

Backend će biti dostupan na `http://localhost:5000`

### Frontend

```bash
cd front/planinska-vikendica-app
npm install
```

Pokretanje:

```bash
ng serve
```

Frontend će biti dostupan na `http://localhost:4200`

### Popunjavanje baze test podacima

```bash
cd back
node seed.js
```

## Struktura baze podataka

### Kolekcije

- **users** - Korisnici (admin, turista, vlasnik)
- **cabins** - Vikendice
- **reservations** - Rezervacije
- **comments** - Komentari i ocene

## Test korisnici

Nakon pokretanja seed skripta:

| Username | Password | Role | Status |
|----------|----------|------|--------|
| admin | Admin123! | admin | active |
| marko | Marko123! | turista | active |
| ana | Ana12345! | turista | active |
| jovan | Jovan123! | vlasnik | active |
| milica | Milica123! | vlasnik | active |
| stefan | Stefan123! | vlasnik | pending |

## Funkcionalnosti

### Neregistrovani korisnik
- Pregled vikendica
- Pretraga i sortiranje vikendica
- Prikaz statistika sistema

### Turista
- Registracija i prijava
- Profil (pregled i izmena podataka)
- Pretraga vikendica
- Rezervacija vikendice (multi-step forma)
- Pregled rezervacija
- Otkazivanje rezervacija
- Ostavljanje komentara i ocena

### Vlasnik
- Registracija i prijava
- Profil (pregled i izmena podataka)
- CRUD operacije nad vikendicama
- Pregled rezervacija
- Potvrda/odbijanje rezervacija

### Administrator
- Posebna prijava
- Upravljanje korisnicima
- Odobravanje/odbijanje registracija
- Deaktivacija korisnika
- Pregled svih vikendica

## Validacije

### Lozinka
- 6-10 karaktera
- Mora početi slovom
- Minimum jedno veliko slovo
- Minimum tri mala slova
- Minimum jedan broj
- Minimum jedan specijalni karakter (@$!%*?&#)

### Kreditna kartica
Podržani tipovi:
- **Diners**: počinje sa 300-303, 36, ili 38 (15 cifara)
- **MasterCard**: počinje sa 51-55 (16 cifara)
- **Visa**: počinje sa 4539, 4556, 4916, 4532, 4929, 4485, 4716 (16 cifara)

## API Endpoints

### Auth
- `POST /api/auth/register` - Registracija
- `POST /api/auth/login` - Prijava (turista/vlasnik)
- `POST /api/auth/admin/login` - Prijava (admin)

### Users
- `GET /api/users/profile` - Profil korisnika
- `PUT /api/users/profile` - Izmena profila
- `PUT /api/users/password` - Promena lozinke

### Cabins
- `GET /api/cabins` - Lista vikendica
- `GET /api/cabins/:id` - Detalji vikendice
- `POST /api/cabins` - Kreiranje vikendice (vlasnik)
- `PUT /api/cabins/:id` - Izmena vikendice (vlasnik)
- `DELETE /api/cabins/:id` - Brisanje vikendice (vlasnik)
- `GET /api/cabins/my-cabins` - Moje vikendice (vlasnik)

### Reservations
- `GET /api/reservations` - Liste rezervacija
- `POST /api/reservations` - Kreiranje rezervacije
- `PUT /api/reservations/:id/cancel` - Otkazivanje rezervacije
- `GET /api/reservations/my-reservations` - Rezervacije za vlasnika
- `PUT /api/reservations/:id/accept` - Prihvatanje rezervacije (vlasnik)
- `PUT /api/reservations/:id/reject` - Odbijanje rezervacije (vlasnik)

### Comments
- `GET /api/comments/cabin/:cabinId` - Komentari za vikendicu
- `POST /api/comments` - Dodavanje komentara

### Admin
- `GET /api/admin/users` - Svi korisnici
- `GET /api/admin/users/pending` - Pending korisnici
- `PUT /api/admin/users/:id/approve` - Odobravanje korisnika
- `PUT /api/admin/users/:id/reject` - Odbijanje korisnika
- `PUT /api/admin/users/:id/activate` - Aktivacija korisnika
- `PUT /api/admin/users/:id/deactivate` - Deaktivacija korisnika
- `GET /api/admin/cabins` - Sve vikendice

### Stats
- `GET /api/stats/general` - Opšte statistike

## Struktura projekta

```
pia_projekat/
├── back/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── uploads/
│   ├── seed.js
│   └── package.json
├── front/
│   └── planinska-vikendica-app/
│       └── src/
│           └── app/
│               ├── components/
│               ├── guards/
│               ├── interceptori/
│               ├── modeli/
│               └── servisi/
└── projekat.txt
```

## Napomene

- Upload slika je ograničen na 2MB po slici
- Profilne slike moraju biti između 100x100px i 300x300px
- JWT tokeni istječu nakon 7 dana
- Sve lozinke su enkriptovane u bazi
- Backend validacija je primenjena na svim endpointima

## Autor

Nemanja Zelic
Elektrotehnički fakultet, Beograd
Programiranje internet aplikacija 2024/25
