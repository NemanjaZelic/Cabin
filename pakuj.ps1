# =================================================================
# SKRIPTA ZA PAKOVANJE PROJEKTA - PIA
# =================================================================
# Ova skripta kreira ZIP arhivu spremnu za slanje na predmet
# =================================================================

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  PAKOVANJE PROJEKTA - PIA" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Provera da li postoji arhiva
$arhivaIme = "piggbbbb.zip"  # PROMENI OVO SA SVOJIM PODACIMA!
Write-Host "[INFO] Naziv arhive: $arhivaIme" -ForegroundColor Yellow
Write-Host "[INFO] Primer: zn211234.zip (Zelic Nemanja, 2021, indeks 1234)" -ForegroundColor Yellow
Write-Host ""

# 2. Brisanje stare arhive ako postoji
if (Test-Path $arhivaIme) {
    Write-Host "[BRISANJE] Stara arhiva vec postoji, brisem..." -ForegroundColor Red
    Remove-Item $arhivaIme -Force
}

# 3. Kreiranje temp foldera
$tempFolder = "temp_projekat"
if (Test-Path $tempFolder) {
    Remove-Item -Recurse -Force $tempFolder
}
New-Item -ItemType Directory -Path $tempFolder | Out-Null
Write-Host "[OK] Kreiran privremeni folder: $tempFolder" -ForegroundColor Green

# 4. Kopiranje backend-a (BEZ node_modules!)
Write-Host ""
Write-Host "[COPY] Kopiram backend..." -ForegroundColor Cyan
New-Item -ItemType Directory -Path "$tempFolder\back" | Out-Null

# Backend fajlovi
Copy-Item "back\src" -Destination "$tempFolder\back\src" -Recurse
Copy-Item "back\data" -Destination "$tempFolder\back\data" -Recurse
Copy-Item "back\package.json" -Destination "$tempFolder\back\"
Copy-Item "back\seed.js" -Destination "$tempFolder\back\"
Copy-Item "back\import.js" -Destination "$tempFolder\back\"
Copy-Item "back\export.js" -Destination "$tempFolder\back\"
Copy-Item "back\skriptakracija.js" -Destination "$tempFolder\back\"
Write-Host "[OK] Backend - DONE (bez node_modules)" -ForegroundColor Green

# 5. Kopiranje frontend-a (BEZ node_modules, dist, .angular!)
Write-Host ""
Write-Host "[COPY] Kopiram frontend..." -ForegroundColor Cyan
New-Item -ItemType Directory -Path "$tempFolder\front" | Out-Null
New-Item -ItemType Directory -Path "$tempFolder\front\planinska-vikendica-app" | Out-Null

# Frontend fajlovi
Copy-Item "front\planinska-vikendica-app\src" -Destination "$tempFolder\front\planinska-vikendica-app\src" -Recurse
Copy-Item "front\planinska-vikendica-app\public" -Destination "$tempFolder\front\planinska-vikendica-app\public" -Recurse -ErrorAction SilentlyContinue
Copy-Item "front\planinska-vikendica-app\package.json" -Destination "$tempFolder\front\planinska-vikendica-app\"
Copy-Item "front\planinska-vikendica-app\angular.json" -Destination "$tempFolder\front\planinska-vikendica-app\"
Copy-Item "front\planinska-vikendica-app\tsconfig.json" -Destination "$tempFolder\front\planinska-vikendica-app\"
Copy-Item "front\planinska-vikendica-app\tsconfig.app.json" -Destination "$tempFolder\front\planinska-vikendica-app\" -ErrorAction SilentlyContinue
Write-Host "[OK] Frontend - DONE (bez node_modules, dist, .angular)" -ForegroundColor Green

# 6. Kopiranje Selenium testova (BEZ node_modules!)
Write-Host ""
Write-Host "[COPY] Kopiram Selenium testove..." -ForegroundColor Cyan
New-Item -ItemType Directory -Path "$tempFolder\selenium-tests" | Out-Null

Copy-Item "selenium-tests\tests" -Destination "$tempFolder\selenium-tests\tests" -Recurse -ErrorAction SilentlyContinue
Copy-Item "selenium-tests\package.json" -Destination "$tempFolder\selenium-tests\" -ErrorAction SilentlyContinue
Copy-Item "selenium-tests\run-all-tests.js" -Destination "$tempFolder\selenium-tests\" -ErrorAction SilentlyContinue
Write-Host "[OK] Selenium testovi - DONE" -ForegroundColor Green

# 7. Kopiranje dokumentacije
Write-Host ""
Write-Host "[COPY] Kopiram dokumentaciju..." -ForegroundColor Cyan
Copy-Item "projekat.txt" -Destination "$tempFolder\" -ErrorAction SilentlyContinue
Copy-Item "README_POKRETANJE.md" -Destination "$tempFolder\"
Copy-Item "BAZA_PODATAKA.md" -Destination "$tempFolder\"
Copy-Item "BIBLIOTEKE.txt" -Destination "$tempFolder\"
Write-Host "[OK] Dokumentacija - DONE" -ForegroundColor Green

# 8. Kreiranje ZIP arhive
Write-Host ""
Write-Host "[ZIP] Kreiram arhivu..." -ForegroundColor Cyan
Compress-Archive -Path "$tempFolder\*" -DestinationPath $arhivaIme -Force
Write-Host "[OK] Arhiva kreirana: $arhivaIme" -ForegroundColor Green

# 9. Brisanje temp foldera
Write-Host ""
Write-Host "[CLEANUP] Brišem privremeni folder..." -ForegroundColor Cyan
Remove-Item -Recurse -Force $tempFolder
Write-Host "[OK] Cleanup - DONE" -ForegroundColor Green

# 10. Provera veličine arhive
$fileSize = (Get-Item $arhivaIme).Length / 1MB
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  GOTOVO!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Arhiva: $arhivaIme" -ForegroundColor Yellow
Write-Host "Veličina: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Yellow
Write-Host ""
Write-Host "[INFO] Proveri sadržaj arhive pre slanja!" -ForegroundColor Magenta
Write-Host "[INFO] Arhiva treba da sadrži:" -ForegroundColor Magenta
Write-Host "  - back/ (sa src, data, seed.js, package.json)" -ForegroundColor White
Write-Host "  - front/planinska-vikendica-app/ (sa src, package.json)" -ForegroundColor White
Write-Host "  - selenium-tests/ (sa tests, package.json)" -ForegroundColor White
Write-Host "  - README_POKRETANJE.md" -ForegroundColor White
Write-Host "  - BAZA_PODATAKA.md" -ForegroundColor White
Write-Host "  - BIBLIOTEKE.txt" -ForegroundColor White
Write-Host "  - projekat.txt" -ForegroundColor White
Write-Host ""
Write-Host "[INFO] Arhiva NE SME da sadrži:" -ForegroundColor Red
Write-Host "  - node_modules/ foldere" -ForegroundColor Red
Write-Host "  - dist/ folder" -ForegroundColor Red
Write-Host "  - .angular/ folder" -ForegroundColor Red
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan

# 11. Pitanje za otvaranje arhive
Write-Host ""
$odgovor = Read-Host "Da li želiš da otvoriš arhivu za proveru? (y/n)"
if ($odgovor -eq "y" -or $odgovor -eq "Y") {
    Invoke-Item $arhivaIme
}

Write-Host ""
Write-Host "[GOTOVO] Arhiva je spremna za slanje!" -ForegroundColor Green
Write-Host "Subject: SI4PIA - Prijava za odbranu u roku OKTOBAR-2-3 2025" -ForegroundColor Yellow
Write-Host ""
