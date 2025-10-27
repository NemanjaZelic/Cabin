# Import/Export podataka iz MongoDB baze

## Struktura

```
back/
├── data/
│   ├── users.json          # Korisnici (admin, turisti, vlasnici)
│   ├── cabins.json         # Vikendice
│   ├── reservations.json   # Rezervacije
│   └── comments.json       # Komentari
├── import.js               # Skripta za import
└── export.js               # Skripta za export
```

## Import podataka iz JSON fajlova u MongoDB

Za import podataka pokrenite:

```bash
cd back
node import.js
```

Ova skripta će:
1. Obrisati sve postojeće podatke iz baze
2. Učitati podatke iz JSON fajlova u `data/` folderu
3. Kreirati sve korisnike
4. Kreirati vikendice i povezati ih sa vlasnicima
5. Kreirati rezervacije i povezati ih sa turistima i vikendica
6. Kreirati komentare

## Export podataka iz MongoDB u JSON fajlove

Za export trenutnih podataka iz baze pokrenite:

```bash
cd back
node export.js
```

Ova skripta će:
1. Izvući sve podatke iz baze
2. Sačuvati ih u JSON format u `data/` folderu
3. Zameniti ObjectId reference sa username/name poljima radi lakšeg razumevanja

## Format JSON fajlova

### users.json
```json
[
  {
    "username": "admin",
    "password": "Admin123!",
    "firstName": "Petar",
    "lastName": "Petrović",
    "gender": "M",
    "email": "admin@example.com",
    "phone": "+381601234567",
    "address": "Beograd, Srbija",
    "creditCard": "4532111122223333",
    "profileImage": "data:image/png;base64,...",
    "role": "admin",
    "status": "active"
  }
]
```

### cabins.json
```json
[
  {
    "name": "Planinska kuća Kopaonik",
    "place": "Kopaonik",
    "services": "wifi,parking,klima,kuhinja,tv",
    "pricing": { "summer": 8000, "winter": 10000 },
    "phone": "+381603333333",
    "coordinates": { "latitude": 43.2897, "longitude": 20.8125 },
    "ownerUsername": "jovan",
    "mainImage": "data:image/png;base64,...",
    "images": ["data:image/png;base64,..."]
  }
]
```

### reservations.json
```json
[
  {
    "touristUsername": "marko",
    "cabinName": "Planinska kuća Kopaonik",
    "startDate": "2025-12-20",
    "endDate": "2025-12-27",
    "adults": 2,
    "children": 1,
    "totalPrice": 56000,
    "status": "confirmed",
    "creditCard": "4532444455556666"
  }
]
```

### comments.json
```json
[
  {
    "touristUsername": "marko",
    "cabinName": "Planinska kuća Kopaonik",
    "rating": 5,
    "text": "Odlična vikendica!",
    "createdAt": "2025-10-27T12:00:00.000Z"
  }
]
```

## Napomene

- Svi podaci u `users.json` koriste plaintext lozinke koje će biti hash-ovane pri importu
- `ownerUsername` u `cabins.json` mora odgovarati postojećem username-u vlasnika
- `touristUsername` i `cabinName` u `reservations.json` i `comments.json` moraju odgovarati postojećim podacima
- Datumi su u ISO formatu (YYYY-MM-DD)
- ProfileImage i mainImage/images su base64 encoded slike

## Testni podaci

### Korisnici:
- **Admin**: admin / Admin123!
- **Turisti**: 
  - marko / Marko123!
  - ana / Ana12345!
- **Vlasnici**: 
  - jovan / Jovan123! (aktivan)
  - milica / Milica123! (aktivan)
  - stefan / Stefan123! (pending)

### Vikendice:
- 5 vikendica na različitim lokacijama (Kopaonik, Zlatibor, Stara Planina)

### Rezervacije:
- 3 test rezervacije
