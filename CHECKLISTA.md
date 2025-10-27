# =================================================================
# CHECKLISTA - PIA PROJEKAT - OKTOBAR 2025
# =================================================================

## ✅ PRE PAKOVANJA

- [ ] Backend radi bez grešaka (localhost:5000)
- [ ] Frontend radi bez grešaka (localhost:4200)
- [ ] MongoDB je pokrenut i baza je popunjena
- [ ] Svi testovi su bar jednom uspešno prošli
- [ ] Login/Registracija rade ispravno
- [ ] Admin, Turista, Vlasnik funkcionalnosti rade
- [ ] Rezervacije se kreiraju i prikazuju
- [ ] Slike vikendica se prikazuju

## ✅ DOKUMENTACIJA

- [ ] `README_POKRETANJE.md` - Kompletno uputstvo za pokretanje
- [ ] `BAZA_PODATAKA.md` - Opis baze i test podataka
- [ ] `BIBLIOTEKE.txt` - Lista svih biblioteka sa linkovima
- [ ] `projekat.txt` - Specifikacija zadatka

## ✅ BAZA PODATAKA

- [ ] `back/seed.js` - Skripta za kreiranje test podataka
- [ ] `back/skriptakracija.js` - Alternativna skripta za JSON
- [ ] `back/import.js` - Import iz JSON fajlova
- [ ] `back/export.js` - Export u JSON fajlove
- [ ] `back/data/*.json` - JSON fajlovi sa podacima

## ✅ STRUKTURA PROJEKTA

### Backend (back/)
- [ ] `back/src/` - Source kod
- [ ] `back/package.json` - Zavisnosti
- [ ] `back/seed.js` - Seed skripta
- [ ] **NEMA** `back/node_modules/` ❌

### Frontend (front/planinska-vikendica-app/)
- [ ] `front/planinska-vikendica-app/src/` - Source kod
- [ ] `front/planinska-vikendica-app/package.json` - Zavisnosti
- [ ] `front/planinska-vikendica-app/angular.json` - Config
- [ ] **NEMA** `front/planinska-vikendica-app/node_modules/` ❌
- [ ] **NEMA** `front/planinska-vikendica-app/dist/` ❌
- [ ] **NEMA** `front/planinska-vikendica-app/.angular/` ❌

### Testovi (selenium-tests/)
- [ ] `selenium-tests/tests/` - Test fajlovi
- [ ] `selenium-tests/package.json` - Zavisnosti
- [ ] **NEMA** `selenium-tests/node_modules/` ❌

## ✅ PAKOVANJE

- [ ] Naziv arhive: `piggbbbb.zip` (promeni sa svojim podacima!)
  - Primer: `zn211234.zip` (Zelic Nemanja, 2021, indeks 1234)
- [ ] Ekstenzija: `.zip` (MORA biti .zip!)
- [ ] Veličina: Razumna (bez node_modules treba biti <10MB)

## ✅ MEJL

- [ ] Subject: `SI4PIA - Prijava za odbranu u roku OKTOBAR-2-3 2025`
- [ ] Arhiva priložena kao attachment
- [ ] Proveri da li mejl server prihvata arhivu
- [ ] Ako odbija - podesi OneDrive link (samo preuzimanje)

## ✅ ISPITNI TERMIN

- [ ] Pријављen ispит na službenom sistemu
- [ ] Bez prijavljenog ispita - ocena se ne može uneti!

## ✅ FINALNA PROVERA

- [ ] Otvorite arhivu i proverite strukturu
- [ ] Proverite da node_modules, dist, .angular NISU u arhivi
- [ ] Proverite da su svi .md i .txt fajlovi tu
- [ ] Proverite da su package.json fajlovi tu
- [ ] Veličina arhive je razumna (<10-15MB)

=================================================================

## 🚀 KAKO PAKOVATI PROJEKAT

### Automatsko pakovanje (PowerShell):

```powershell
# 1. Promeni naziv arhive u pakuj.ps1 (linija 11)
$arhivaIme = "zn211234.zip"  # Tvoji podaci!

# 2. Pokreni skriptu
.\pakuj.ps1
```

### Ručno pakovanje:

1. Kopiraj ceo projekat u temp folder
2. Obriši sve `node_modules/` foldere
3. Obriši `front/planinska-vikendica-app/dist/`
4. Obriši `front/planinska-vikendica-app/.angular/`
5. Spakovati u .zip arhivu sa tvojim nazivom

=================================================================

## 📧 SLANJE MEJLA

**Prima:** Adresa koju su dali na predmetu
**Subject:** SI4PIA - Prijava za odbranu u roku OKTOBAR-2-3 2025
**Attachment:** piggbbbb.zip (tvoj naziv)

**Sadržaj mejla:**

```
Poštovani,

Šaljem projekat za PIA u prilogu.

Ime i prezime: [Tvoje ime]
Broj indeksa: [Tvoj indeks]
Godina upisa: [Godina]

Projekat: Planinske vikendice - MEAN stack
- Backend: Node.js + Express + MongoDB
- Frontend: Angular 20.1.0
- Baza: MongoDB (seed.js za punjenje)

Srdačan pozdrav,
[Tvoje ime]
```

=================================================================
