const { spawn } = require('child_process');
const http = require('http');

// Funkcija za proveru da li server radi
function checkServer(url, name) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      resolve(true);
    }).on('error', () => {
      resolve(false);
    });
  });
}

const tests = [
  { name: 'Početna strana (nerregistrovani)', file: 'tests/pocetna.test.js' },
  { name: 'Registracija', file: 'tests/registracija.test.js' },
  { name: 'Prijava', file: 'tests/prijava.test.js' },
  { name: 'Promena lozinke', file: 'tests/promena-lozinke.test.js' },
  { name: 'Sortiranje vikendica', file: 'tests/sortiranje.test.js' },
  { name: 'Profil - Izmena sa slikom', file: 'tests/profil-izmena.test.js' },
  { name: 'Rezervacija - Kompletan proces', file: 'tests/rezervacija-kompletan.test.js' },
  { name: 'Vikendica - Dodavanje i izmena', file: 'tests/vikendica-dodavanje.test.js' },
  { name: 'Komentari i ocene', file: 'tests/komentari-ocene.test.js' },
  { name: 'Dinamička mapa', file: 'tests/dinamicka-mapa.test.js' },
  { name: 'Kalendar (FullCalendar)', file: 'tests/kalendar.test.js' },
  { name: 'Statistika i dijagrami', file: 'tests/statistika-dijagrami.test.js' },
  { name: 'Admin - Blokiranje vikendica', file: 'tests/admin-blokiranje.test.js' },
  { name: 'Responsive dizajn', file: 'tests/responsive-dizajn.test.js' },
  { name: 'Admin funkcionalnosti', file: 'tests/admin.test.js' },
  { name: 'Turista funkcionalnosti', file: 'tests/turista.test.js' },
  { name: 'Vlasnik funkcionalnosti', file: 'tests/vlasnik.test.js' }
];

async function runTest(test) {
  return new Promise((resolve, reject) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Pokretanje testa: ${test.name}`);
    console.log('='.repeat(60));
    
    const testProcess = spawn('node', [test.file], {
      cwd: __dirname,
      shell: true
    });
    
    testProcess.stdout.on('data', (data) => {
      process.stdout.write(data);
    });
    
    testProcess.stderr.on('data', (data) => {
      process.stderr.write(data);
    });
    
    testProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Test ${test.name} završen sa kodom ${code}`));
      }
    });
  });
}

async function runAllTests() {
  console.log('\n🚀 POKRETANJE SELENIUM TESTOVA\n');
  
  // PROVERAVAMO DA LI SU SERVISI POKRENUTI
  console.log('🔍 Provera preduslova...\n');
  
  const backendRunning = await checkServer('http://localhost:5000/api/vikendice', 'Backend');
  const frontendRunning = await checkServer('http://localhost:4200', 'Frontend');
  
  console.log(`Backend (port 5000):  ${backendRunning ? '✅ RADI' : '❌ NE RADI'}`);
  console.log(`Frontend (port 4200): ${frontendRunning ? '✅ RADI' : '❌ NE RADI'}`);
  
  if (!backendRunning || !frontendRunning) {
    console.log('\n❌ GREŠKA: Servisi nisu pokrenuti!\n');
    console.log('📝 POTREBNO POKRENUTI:\n');
    
    if (!backendRunning) {
      console.log('  Backend:');
      console.log('    cd back');
      console.log('    npm run dev\n');
    }
    
    if (!frontendRunning) {
      console.log('  Frontend:');
      console.log('    cd front/planinska-vikendica-app');
      console.log('    ng serve\n');
    }
    
    console.log('⏳ Pokreni servise pa ponovo testove: npm test\n');
    process.exit(1);
  }
  
  console.log('\n✅ Svi preduslovi ispunjeni - počinje testiranje!\n');
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
        
      await runTest(test);
      passed++;
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`\n❌ ${error.message}`);
      failed++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('REZULTATI TESTIRANJA');
  console.log('='.repeat(60));
  console.log(`✅ Prošlo testova: ${passed}`);
  console.log(`❌ Neuspešnih testova: ${failed}`);
  console.log(`📊 Ukupno testova: ${tests.length}`);
  console.log('='.repeat(60) + '\n');
}

runAllTests().catch(console.error);
