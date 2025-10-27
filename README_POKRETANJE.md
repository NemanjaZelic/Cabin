# Pokretanje projekta - Planinska Vikendica

## Preduslov

Potrebno je da imate instalirano:
- **Node.js** (v18 ili novija verzija)
- **MongoDB** (lokalna instalacija ili MongoDB Compass)
- **Angular CLI** (`npm install -g @angular/cli`)

---

## 1️⃣ Pokretanje MongoDB baze podataka

### Opcija A: MongoDB servis (Windows)

```bash
# Pokretanje MongoDB servisa
net start MongoDB
```

### Opcija B: Ručno pokretanje

```bash
# Pokrenite MongoDB server
mongod --dbpath "C:\data\db"
```

### Provera da li MongoDB radi:

```bash
# U novom terminalu pokrenite
mongosh
# ili
mongo
```

Ako se poveže, MongoDB radi! ✅

---

## 2️⃣ Pokretanje Backend servera

### Prvi put - instalacija paketa:

```bash
cd back
npm install
```

### Kreiranje inicijalnih podataka:

```bash
# Opcija 1: Korišćenje seed.js (direktno MongoDB)
node seed.js

# Opcija 2: Kreiranje JSON fajlova pa import
node skriptakracija.js    # Kreira JSON fajlove u data/ folderu
node import.js             # Importuje podatke iz JSON u MongoDB
```

### Pokretanje backend servera:

```bash
cd back
node src/server.js
```

Server će biti dostupan na: **http://localhost:5000** 🚀

---

## 3️⃣ Pokretanje Frontend aplikacije

### Prvi put - instalacija paketa:

```bash
cd front\planinska-vikendica-app
npm install
```

### Pokretanje Angular dev servera:

```bash
cd front\planinska-vikendica-app
ng serve
```

Ili sa automatskim otvaranjem u browseru:

```bash
ng serve -o
```

Frontend će biti dostupan na: **http://localhost:4200** 🌐

---

## 📋 Brzi Start (sve odjednom)

### Terminal 1 - MongoDB
```bash
net start MongoDB
# ili
mongod --dbpath "C:\data\db"
```

### Terminal 2 - Backend
```bash
cd back
npm install          # Samo prvi put
node seed.js         # Samo prvi put - kreira test podatke
node src/server.js   # Startuje server na portu 5000
```

### Terminal 3 - Frontend
```bash
cd front\planinska-vikendica-app
npm install          # Samo prvi put
ng serve             # Startuje Angular na portu 4200
```

### Terminal 4 - Selenium testovi (opciono)
```bash
cd selenium-tests
npm install          # Samo prvi put
npm test             # Pokreće testove
```

---

## 🔑 Test nalozi

Nakon pokretanja `seed.js` ili `import.js`, možete se prijaviti sa:

### Admin
- **Username:** `admin`
- **Password:** `Admin123!`

### Turisti
- **Username:** `marko` | **Password:** `Marko123!`
- **Username:** `ana` | **Password:** `Ana12345!`

### Vlasnici
- **Username:** `jovan` | **Password:** `Jovan123!`
- **Username:** `milica` | **Password:** `Milica123!`
- **Username:** `stefan` | **Password:** `Stefan123!` *(status: pending)*

---

## 🛠️ Česti problemi

### MongoDB ne može da se pokrene
```bash
# Proverite da li je MongoDB servis već pokrenut
net start MongoDB

# Ako to ne radi, pokrenite ručno
mongod --dbpath "C:\data\db"
```

### Port 5000 ili 4200 je zauzet
```bash
# Windows - oslobodite port
netstat -ano | findstr :5000
taskkill /PID <broj_procesa> /F

# Ili zaustavite sve node procese
taskkill /F /IM node.exe
```

### Frontend ne može da se poveže na backend
- Proverite da li backend radi na http://localhost:5000
- Proverite konzolu browsera za CORS greške
- Proverite da li je MongoDB aktivan

---

## 📂 Struktura projekta

```
pia_projekat/
├── back/                          # Backend (Node.js + Express)
│   ├── src/
│   │   ├── server.js             # Glavni server fajl
│   │   ├── models/               # Mongoose modeli
│   │   ├── controllers/          # API kontroleri
│   │   └── routes/               # API rute
│   ├── data/                     # JSON fajlovi sa podacima
│   ├── seed.js                   # Skripta za seed baze
│   ├── import.js                 # Import iz JSON
│   ├── export.js                 # Export u JSON
│   └── skriptakracija.js         # Kreiranje JSON fajlova
│
├── front/planinska-vikendica-app/ # Frontend (Angular)
│   ├── src/
│   │   ├── app/                  # Angular komponente
│   │   ├── styles.css            # Globalni stilovi
│   │   └── index.html
│   └── angular.json
│
└── selenium-tests/                # E2E testovi
    ├── tests/
    └── package.json
```

---

## 🎯 Redosled pokretanja

1. ✅ **MongoDB** - Mora biti prvi!
2. ✅ **Backend** - Nakon MongoDB-a
3. ✅ **Frontend** - Nakon backend-a
4. ⚙️ **Testovi** - Opciono, nakon svih

---

## 💾 Backup i restore podataka

### Export podataka iz baze:
```bash
cd back
node export.js
```
Podaci se exportuju u `back/data/` folder kao JSON fajlovi.

### Import podataka u bazu:
```bash
cd back
node import.js
```
Importuje podatke iz `back/data/` foldera u MongoDB.

---

## 📞 Pomoć

Ako imate problema:
1. Proverite da li su svi servisi pokrenuti
2. Pogledajte konzolu/terminal za greške
3. Proverite da li su portovi 27017 (MongoDB), 5000 (Backend), 4200 (Frontend) slobodni

---

**Srećno! 🚀**
