const { By, until } = require('selenium-webdriver');
const { createDriver, sleep } = require('../selenium-setup');

async function testRezervacijeUcitavanje() {
  const driver = await createDriver();
  
  try {
    console.log('\n=== TEST REZERVACIJA DEBUG ===\n');
    
    // BRIŠI STARI LOCALSTORAGE
    console.log('0️⃣  Brisanje localStorage...');
    await driver.get('http://localhost:4200');
    await driver.executeScript('localStorage.clear();');
    await sleep(500);
    
    // PRIJAVA
    console.log('1️⃣  Odlazak na login stranicu...');
    await driver.get('http://localhost:4200/prijava');
    await sleep(2000);
  
  console.log('2️⃣  Unos kredencijala (marko / Marko123!)...');
  await driver.wait(until.elementLocated(By.id('korisnickoIme')), 10000);
  await driver.findElement(By.id('korisnickoIme')).sendKeys('marko');
  await driver.findElement(By.id('lozinka')).sendKeys('Marko123!');
  
  console.log('3️⃣  Klik na dugme za prijavu...');
  await driver.findElement(By.css('button[type="submit"]')).click();
  await sleep(3000);
  
  // Provera da li je login uspeo
  const currentUrl = await driver.getCurrentUrl();
  console.log('4️⃣  Trenutna URL nakon logina:', currentUrl);
  
  // Check localStorage
  const token = await driver.executeScript('return localStorage.getItem("token");');
  const korisnikStr = await driver.executeScript('return localStorage.getItem("korisnik");');
  console.log('5️⃣  Token u localStorage:', token ? `${token.substring(0, 30)}...` : 'NEMA');
  console.log('6️⃣  Korisnik u localStorage:', korisnikStr);
  
  if (korisnikStr) {
    const korisnik = JSON.parse(korisnikStr);
    console.log('   - _id:', korisnik._id);
    console.log('   - id:', korisnik.id);
    console.log('   - username:', korisnik.username);
  }
  
  // ODLAZAK NA REZERVACIJE
  console.log('\n7️⃣  Odlazak na stranicu rezervacija...');
  await driver.get('http://localhost:4200/turista/rezervacije');
  await sleep(2000);
  
  // Provera console.log outputa
  console.log('8️⃣  Čitanje browser console log-ova...');
  const logs = await driver.manage().logs().get('browser');
  logs.forEach(log => {
    console.log(`   [BROWSER] ${log.level.name}: ${log.message}`);
  });
  
  // Provera DOM-a
  console.log('\n9️⃣  Provera DOM-a...');
  const pageSource = await driver.getPageSource();
  
  if (pageSource.includes('Učitavanje rezervacija')) {
    console.log('   ⏳ SPINNER JE VIDLJIV - "Učitavanje rezervacija..."');
  }
  
  if (pageSource.includes('Moje Rezervacije')) {
    console.log('   ✅ Header "Moje Rezervacije" je prisutan');
  }
  
  // Čekanje malo duže
  console.log('\n🔟  Čekam 5 sekundi da se podaci učitaju...');
  await sleep(5000);
  
  // Provera ponovo
  const logs2 = await driver.manage().logs().get('browser');
  console.log('1️⃣1️⃣  Browser console nakon 5s:');
  logs2.forEach(log => {
    console.log(`   [BROWSER] ${log.level.name}: ${log.message}`);
  });
  
  const pageSource2 = await driver.getPageSource();
  if (pageSource2.includes('Učitavanje rezervacija')) {
    console.log('\n❌❌❌ PROBLEM: SPINNER JE JOŠ UVEK VIDLJIV!');
    throw new Error('Spinner se ne gasi - rezervacije se ne učitavaju!');
  } else {
    console.log('\n✅✅✅ Spinner je nestao - rezervacije su učitane!');
  }
  } catch (error) {
    console.error('\n🔥 GREŠKA U TEST FUNKCIJI:');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

testRezervacijeUcitavanje()
  .then(() => {
    console.log('\n✅✅✅ TEST USPEŠAN!\n');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌❌❌ TEST NEUSPEŠAN!');
    console.error('Error details:', err.message);
    process.exit(1);
  });
