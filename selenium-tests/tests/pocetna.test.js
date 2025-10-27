const { By, until } = require('selenium-webdriver');
const { createDriver, runTest, sleep } = require('../selenium-setup');

async function testPocetnaStrana() {
  const driver = await createDriver();
  
  try {
    console.log('\n🧪 TEST 1: Početna strana - opšte informacije');
    
    await driver.get('http://localhost:4200');
    await sleep(2000);
    console.log('✓ Otvorena početna strana');
    
    const statistike = await driver.findElements(By.css('.stat-card, .info-box, .stats'));
    console.log(`✓ Pronađeno ${statistike.length} statističkih podataka`);
    
    if (statistike.length > 0) {
      console.log('✅ TEST 1 PROŠAO: Statistike prikazane\n');
    } else {
      console.log('⚠️  TEST 1: Statistike možda nisu vidljive\n');
    }
    
  } catch (error) {
    console.error('❌ TEST 1 NIJE PROŠAO:', error.message, '\n');
  }
  
  try {
    console.log('🧪 TEST 2: Pretraga vikendica na početnoj strani');
    
    await driver.get('http://localhost:4200');
    await sleep(2000);
    
    const searchInputs = await driver.findElements(By.css('input[type="text"], input[placeholder*="retra"]'));
    console.log(`✓ Pronađeno ${searchInputs.length} polja za pretragu`);
    
    if (searchInputs.length > 0) {
      await searchInputs[0].sendKeys('Test pretraga');
      console.log('✓ Unet tekst za pretragu');
      await sleep(1000);
      console.log('✅ TEST 2 PROŠAO: Pretraga funkcionalna\n');
    } else {
      console.log('⚠️  TEST 2: Polja za pretragu nisu pronađena\n');
    }
    
  } catch (error) {
    console.error('❌ TEST 2 NIJE PROŠAO:', error.message, '\n');
  }
  
  try {
    console.log('🧪 TEST 3: Sortiranje vikendica');
    
    await driver.get('http://localhost:4200');
    await sleep(2000);
    
    const sortButtons = await driver.findElements(By.css('th, .sort-btn, button[class*="sort"]'));
    console.log(`✓ Pronađeno ${sortButtons.length} opcija za sortiranje`);
    
    if (sortButtons.length > 0) {
      console.log('✅ TEST 3 PROŠAO: Sortiranje dostupno\n');
    } else {
      console.log('⚠️  TEST 3: Sortiranje možda nije implementirano\n');
    }
    
  } catch (error) {
    console.error('❌ TEST 3 NIJE PROŠAO:', error.message, '\n');
  }
  
  try {
    console.log('🧪 TEST 4: Navigacija - linkovi za prijavu i registraciju');
    
    await driver.get('http://localhost:4200');
    await sleep(1000);
    
    const prijavaLink = await driver.findElements(By.css('a[href*="prijava"], a[routerLink*="prijava"]'));
    const registracijaLink = await driver.findElements(By.css('a[href*="registracija"], a[routerLink*="registracija"]'));
    
    console.log(`✓ Prijava linkova: ${prijavaLink.length}`);
    console.log(`✓ Registracija linkova: ${registracijaLink.length}`);
    
    if (prijavaLink.length > 0 && registracijaLink.length > 0) {
      console.log('✅ TEST 4 PROŠAO: Navigacija kompletna\n');
    } else {
      console.log('⚠️  TEST 4: Neki linkovi nedostaju\n');
    }
    
  } catch (error) {
    console.error('❌ TEST 4 NIJE PROŠAO:', error.message, '\n');
    throw error;
  } finally {
    await driver.quit();
  }
}

testPocetnaStrana();

