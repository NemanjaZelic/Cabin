# Uputstvo za pakovanje i slanje projekta - PIA

## 📧 NAZIV I FORMAT MEJLA

**Subject:** `SI4PIA - Prijava za odbranu u roku OKTOBAR-2-3 2025`

**Naziv arhive:** `piggbbbb.zip`
- `p` - prvo slovo prezimena
- `i` - prvo slovo imena
- `gg` - poslednje 2 cifre godine upisa
- `bbbb` - broj indeksa

**Primer:** `zn211234.zip` (Nemanja Zelic, 2021, indeks 1234)

---

## 📁 SADRŽAJ ARHIVE

### ✅ ŠTO TREBA DA BUDE U ARHIVI:

```
piggbbbb.zip
├── back/
│   ├── src/                    # Backend source kod
│   ├── data/                   # JSON fajlovi sa podacima
│   ├── package.json            # Node zavisnosti
│   ├── seed.js                 # Skripta za punjenje baze
│   ├── import.js               # Import iz JSON
│   ├── skriptakracija.js       # Kreiranje JSON fajlova
│   └── export.js               # Export u JSON
│
├── front/
│   └── planinska-vikendica-app/
│       ├── src/                # Angular source kod
│       ├── package.json        # Angular zavisnosti
│       └── angular.json        # Angular config
│
├── selenium-tests/             # E2E testovi
│   ├── tests/
│   └── package.json
│
├── projekat.txt                # Specifikacija zadatka
├── BIBLIOTEKE.txt              # Lista biblioteka sa linkovima
├── README_POKRETANJE.md        # Uputstvo za pokretanje
└── BAZA_PODATAKA.md            # Uputstvo za bazu podataka
```

### ❌ ŠTA NE SME BITI U ARHIVI:

- ❌ `node_modules/` folder (ni u back, ni u front, ni u testovima!)
- ❌ `dist/` folder (Angular build)
- ❌ `.angular/` folder (cache)
- ❌ `target/` folder (ako ima Java)
- ❌ Bilo kakvi izvršni fajlovi (.exe, .jar, .war)
- ❌ IDE fajlovi (.idea/, .vscode/ - opciono, može ostati)

---

## 📝 OBAVEZNI FAJLOVI

### 1. BIBLIOTEKE.txt

Kreirati fajl sa listom svih korišćenih biblioteka:

```txt
# Backend (Node.js + Express)

- express (v4.18.2) - https://www.npmjs.com/package/express
- mongoose (v7.5.0) - https://www.npmjs.com/package/mongoose
- bcryptjs (v2.4.3) - https://www.npmjs.com/package/bcryptjs
- jsonwebtoken (v9.0.2) - https://www.npmjs.com/package/jsonwebtoken
- cors (v2.8.5) - https://www.npmjs.com/package/cors
- multer (v1.4.5-lts.1) - https://www.npmjs.com/package/multer

# Frontend (Angular)

- @angular/core (v20.1.0) - https://angular.io
- @angular/common (v20.1.0)
- @angular/forms (v20.1.0)
- @angular/router (v20.1.0)

# Testovi (Selenium)

- selenium-webdriver (v4.x) - https://www.npmjs.com/package/selenium-webdriver
- chromedriver (v130.x) - https://www.npmjs.com/package/chromedriver
```

### 2. README_POKRETANJE.md

(Već kreiran u projektu - `README_POKRETANJE.md`)

### 3. BAZA_PODATAKA.md

<function_calls>
<invoke name="create_file">
<parameter name="content"># Baza podataka - MongoDB

## Tip baze: MongoDB (NoSQL)

## Kolekcije:

1. **users** - Korisnici sistema (admin, turisti, vlasnici)
2. **cabins** - Planinske vikendice
3. **reservations** - Rezervacije
4. **comments** - Komentari i ocene

---

## Formiranje i punjenje baze

### Metod 1: Korišćenje seed.js skripte

```bash
cd back
node seed.js
```

Ova skripta će:
- Kreirati MongoDB konekciju na `mongodb://localhost:27017/planinska_vikendica`
- Obrisati sve postojeće podatke
- Kreirati testne korisnike (1 admin, 2 turista, 3 vlasnika)
- Kreirati 5 vikendica
- Kreirati 3 test rezervacije

### Metod 2: Import iz JSON fajlova

```bash
cd back
node skriptakracija.js  # Kreira JSON fajlove u data/ folderu
node import.js          # Importuje podatke iz JSON u MongoDB
```

JSON fajlovi se nalaze u `back/data/` folderu:
- `users.json` - Korisnici
- `cabins.json` - Vikendice
- `reservations.json` - Rezervacije
- `comments.json` - Komentari (prazan)

---

## Test podaci

### Korisnici za testiranje:

**Admin:**
- Username: `admin`
- Password: `Admin123!`

**Turisti:**
- Username: `marko` | Password: `Marko123!`
- Username: `ana` | Password: `Ana12345!`

**Vlasnici:**
- Username: `jovan` | Password: `Jovan123!`
- Username: `milica` | Password: `Milica123!`
- Username: `stefan` | Password: `Stefan123!` (status: pending)

### Vikendice:
- 5 vikendica na lokacijama: Kopaonik (3), Zlatibor (2)
- Cene: 5500-15000 RSD po noćenju
- Svi sadrže wifi, parking, i druge pogodnosti

### Rezervacije:
- 3 test rezervacije za različite periode
- Statusy: confirmed i pending

---

## Struktura MongoDB baze

### Baza: `planinska_vikendica`

**Konekcija string:** `mongodb://localhost:27017/planinska_vikendica`

**Kolekcije:**

1. **users**
   - _id: ObjectId
   - username: String (unique)
   - password: String (hashed)
   - firstName, lastName: String
   - email: String (unique)
   - phone, address, creditCard: String
   - profileImage: String (base64)
   - role: String ('admin', 'turista', 'vlasnik')
   - status: String ('active', 'pending', 'blocked')

2. **cabins**
   - _id: ObjectId
   - name: String
   - place: String
   - services: String (comma-separated)
   - pricing: { summer: Number, winter: Number }
   - phone: String
   - coordinates: { latitude: Number, longitude: Number }
   - owner: ObjectId (ref: User)
   - mainImage: String (base64)
   - images: [String] (base64 array)

3. **reservations**
   - _id: ObjectId
   - tourist: ObjectId (ref: User)
   - cabin: ObjectId (ref: Cabin)
   - startDate, endDate: Date
   - adults, children: Number
   - totalPrice: Number
   - status: String ('pending', 'confirmed', 'rejected', 'cancelled')
   - creditCard: String

4. **comments**
   - _id: ObjectId
   - tourist: ObjectId (ref: User)
   - cabin: ObjectId (ref: Cabin)
   - rating: Number (1-5)
   - text: String
   - createdAt: Date

---

## Export trenutnih podataka

Za export podataka iz baze u JSON format:

```bash
cd back
node export.js
```

Podaci će biti sačuvani u `back/data/` folderu.

---

## Zahtevi

- **MongoDB** mora biti instaliran i pokrenut
- Port: `27017` (default MongoDB port)
- Baza će biti automatski kreirana pri prvom pokretanju
