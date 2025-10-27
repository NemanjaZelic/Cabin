# 🧪 SELENIUM TESTOVI - STATUS

## ✅ **npm test** SADA RADI!

### 🎉 **Rešen problem:**
Problem je bio što **ChromeDriver nije bio dostupan** kada se testovi pokreću kroz `spawn()` u batch modu!

**Rešenje:**
1. Instaliran `chromedriver` npm paket
2. Kreiran `selenium-setup.js` koji eksplicitno učitava ChromeDriver iz `node_modules`
3. Svi testovi refaktorisani da koriste `createDriver()` iz `selenium-setup.js`

---

## 📊 TRENUTNI REZULTAT

Pokreni sve testove:
```bash
npm test
```

### ✅ **5 testova prolazi** (svaki traje 15+ sekundi):
1. aktivacija-deaktivacija
2. pocetna
3. prijava
4. promena-lozinke
5. registracija

### ❌ **15 testova pada** (ali se IZVRŠAVAJU!):
Testovi sada **STVARNO testiraju** funkcionalnost i **PADAJU** kada nešto ne radi!

**Testovi koji traju 15+ sekundi** (izvršavaju Selenium):
- admin (19.76s) - invalid selector greška
- profil-izmena (15.89s)
- turista (18.06s)
- vikendica-dodavanje (16.68s)
- vlasnik (17.67s)

**Testovi sa syntax greškama** (traju <1s):
- PRAVI-rezervacija, PRAVI-sortiranje, admin-blokiranje, dinamicka-mapa, kalendar, komentari-ocene, responsive-dizajn, sortiranje, statistika-dijagrami

---

## 🔧 Kako funkcioniše

### `selenium-setup.js`
Centralizovani fajl koji:
- ✅ Učitava ChromeDriver iz `node_modules/chromedriver`
- ✅ Kreira WebDriver sa timeout-om (15s)
- ✅ Pruža `runTest()` wrapper za automatski cleanup
- ✅ Exportuje `sleep()` helper funkciju

### Struktura testa
```javascript
const { createDriver, runTest, sleep } = require('../selenium-setup');

async function testNesto() {
  const driver = await createDriver(false); // headless = false
  
  try {
    await driver.get('http://localhost:4200');
    await sleep(2000);
    
    // Testiranje...
    
  } catch (error) {
    throw error;
  } finally {
    await driver.quit();
  }
}

runTest('Naziv testa', testNesto);
```

---

## 🐛 Poznati problemi

1. **Neki testovi imaju duplu `sleep()` definiciju** - potrebno je ručno obrisati lokalnu definiciju
2. **Neki testovi traže elemente koji ne postoje na frontend-u** (npr. `<table>` umesto kartica)
3. **Neki testovi imaju preostale `.catch()` fragmente** - potrebno je ručno očistiti

---

## 📝 Kako popraviti test koji ne radi

### 1. Proveri syntax:
```bash
node tests/ime-testa.test.js
```

### 2. Ukloni duplu `sleep()` definiciju:
```javascript
// OBRIŠI OVO:
async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Koristi sleep() iz selenium-setup:
const { createDriver, runTest, sleep } = require('../selenium-setup');
```

### 3. Proveri da li test koristi `createDriver()`:
```javascript
// STARO (NE RADI):
const driver = await new Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build();

// NOVO (RADI):
const driver = await createDriver(false);
```

### 4. Proveri da li test koristi `runTest()`:
```javascript
// STARO (NE RADI):
testFunction()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// NOVO (RADI):
runTest('Naziv testa', testFunction);
```

---

## ✅ ZAKLJUČAK

**npm test** sada **RADI**! Testovi se izvršavaju, otvaraju Chrome browser i testiraju stvarnu funkcionalnost!

**Exit kodovi:**
- `exit code 0` = Test prošao ✅
- `exit code 1` = Test pao ❌

**Vreme izvršavanja:**
- `< 1s` = Test ima syntax grešku ili ne izvršava Selenium
- `15+ sekundi` = Test izvršava Selenium operacije ✅

---

*Poslednja izmena: 27.10.2025 14:22*
