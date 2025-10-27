const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const http = require('http');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Proveri da li je server pokrenut
async function checkServer(url, name) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      console.log(`✅ ${name} server radi (status: ${res.statusCode})`);
      resolve(true);
    }).on('error', (err) => {
      console.error(`❌ ${name} server NE RADI!`);
      console.error(`   ${err.message}`);
      resolve(false);
    });
  });
}

async function runPrerequisiteChecks() {
  console.log('\n🔍 PROVERA PREDUSLOVA PRE TESTIRANJA');
  console.log('═'.repeat(60));

  // Proveri backend
  console.log('\n1. Provera backend servera (http://localhost:5000)...');
  const backendRunning = await checkServer('http://localhost:5000/api/vikendice', 'Backend');

  // Proveri frontend
  console.log('\n2. Provera frontend aplikacije (http://localhost:4200)...');
  const frontendRunning = await checkServer('http://localhost:4200', 'Frontend');

  // Proveri MongoDB
  console.log('\n3. Provera MongoDB konekcije...');
  // MongoDB provera je već u backend-u, ali možemo dodati
  
  console.log('\n' + '═'.repeat(60));
  console.log('REZULTAT PROVERE:');
  console.log('═'.repeat(60));
  console.log(`Backend (port 5000):  ${backendRunning ? '✅ RADI' : '❌ NE RADI'}`);
  console.log(`Frontend (port 4200): ${frontendRunning ? '✅ RADI' : '❌ NE RADI'}`);
  console.log('═'.repeat(60));

  if (!backendRunning || !frontendRunning) {
    console.log('\n❌ GREŠKA: Servisi nisu pokrenuti!');
    console.log('\n📝 POTREBNO POKRENUTI:');
    
    if (!backendRunning) {
      console.log('\n  Backend:');
      console.log('    cd back');
      console.log('    npm run dev');
      console.log('    (ili: node src/server.js)');
    }
    
    if (!frontendRunning) {
      console.log('\n  Frontend:');
      console.log('    cd front/planinska-vikendica-app');
      console.log('    ng serve');
    }

    console.log('\n⏳ Sačekaj da se servisi pokrenu, pa ponovo pokreni testove.\n');
    return false;
  }

  console.log('\n✅ Svi preduslovi su ispunjeni - može testiranje!\n');
  return true;
}

async function testEnvironment() {
  // Prvo proveri da li su servisi pokrenuti
  const canProceed = await runPrerequisiteChecks();
  
  if (!canProceed) {
    console.log('\n⛔ Testovi se ne mogu pokrenuti bez aktivnih servisa.\n');
    process.exit(1);
  }

  // Ako su servisi pokrenuti, nastavi sa testiranjem
  const options = new chrome.Options();
  // options.addArguments('--headless');
  options.addArguments('--disable-gpu');
  options.addArguments('--no-sandbox');
  
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    console.log('\n🧪 TEST: Provera kompletnog okruženja');
    console.log('═'.repeat(60));

    // Test 1: Backend API
    console.log('\n1. Test Backend API...');
    await driver.get('http://localhost:5000/api/vikendice');
    await sleep(2000);
    
    const pageText = await driver.findElement(By.tagName('body')).getText();
    if (pageText.includes('[') || pageText.includes('vikendice')) {
      console.log('✅ Backend API vraća podatke');
    } else {
      console.log('⚠️  Backend ne vraća očekivane podatke');
    }

    // Test 2: Frontend učitavanje
    console.log('\n2. Test Frontend aplikacije...');
    await driver.get('http://localhost:4200');
    await sleep(3000);

    const title = await driver.getTitle();
    console.log(`✅ Frontend učitan: "${title}"`);

    // Test 3: Angular app se učitao
    const bodyHTML = await driver.findElement(By.tagName('body')).getAttribute('innerHTML');
    if (bodyHTML.includes('app-root') || bodyHTML.includes('planinska') || bodyHTML.length > 1000) {
      console.log('✅ Angular aplikacija se renderovala');
    } else {
      console.log('⚠️  Angular aplikacija možda nije pravilno učitana');
    }

    // Test 4: Provera da li ima grešaka u konzoli
    console.log('\n3. Provera browser konzole...');
    const logs = await driver.manage().logs().get('browser');
    const errors = logs.filter(log => log.level.name === 'SEVERE');
    
    if (errors.length === 0) {
      console.log('✅ Nema grešaka u browser konzoli');
    } else {
      console.log(`⚠️  Pronađeno ${errors.length} grešaka u konzoli:`);
      errors.slice(0, 3).forEach(err => {
        console.log(`   - ${err.message.substring(0, 80)}...`);
      });
    }

    console.log('\n✅ Okruženje je spremno za testiranje!');
    console.log('═'.repeat(60));

  } catch (error) {
    console.error('\n❌ Greška u testu okruženja:', error.message);
    throw error;
  } finally {
    await driver.quit();
  }
}

// Eksportuj funkciju za proveru
module.exports = { runPrerequisiteChecks, checkServer };

// Ako se pokreće direktno
if (require.main === module) {
  testEnvironment().catch(err => {
    console.error('\n❌ Test okruženja nije prošao:', err.message);
    process.exit(1);
  });
}
