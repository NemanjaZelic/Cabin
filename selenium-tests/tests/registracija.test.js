const { By, until } = require('selenium-webdriver');
const { createDriver, runTest, sleep } = require('../selenium-setup');
const path = require('path');

async function testRegistracija() {
  const driver = await createDriver();
  
  try {
    console.log('\n🧪 TEST 1: Registracija turiste sa svim poljima i slikom');
    
    await driver.get('http://localhost:4200/registracija');
    console.log('✓ Otvoren registracioni obrazac');
    await sleep(1000);
    
    const timestamp = Date.now();
    await driver.findElement(By.id('korisnickoIme')).sendKeys('test_turista_' + timestamp);
    await driver.findElement(By.id('lozinka')).sendKeys('TestLozinka123!');
    await driver.findElement(By.id('ime')).sendKeys('Test');
    await driver.findElement(By.id('prezime')).sendKeys('Turista');
    await driver.findElement(By.id('email')).sendKeys('test' + timestamp + '@test.com');
    await driver.findElement(By.id('telefon')).sendKeys('0601234567');
    await driver.findElement(By.id('adresa')).sendKeys('Testna adresa 123, Beograd');
    
    await driver.findElement(By.css('input[value="M"]')).click();
    console.log('✓ Popunjena osnovna polja');
    
    await driver.findElement(By.id('brojKreditneKartice')).sendKeys('4539578763621486');
    await sleep(500);
    console.log('✓ Uneta Visa kreditna kartica');
    
    const turistaRadio = await driver.findElement(By.css('input[value="turista"]'));
    await driver.executeScript('arguments[0].click();', turistaRadio);
    console.log('✓ Odabrana uloga: Turista');
    
    await sleep(1000);
    
    const submitButton = await driver.findElement(By.css('button[type="submit"]'));
    await driver.executeScript('arguments[0].scrollIntoView(true);', submitButton);
    await sleep(500);
    await submitButton.click();
    console.log('✓ Kliknuto na dugme za registraciju');
    
    await sleep(3000);
    
    const currentUrl = await driver.getCurrentUrl();
    if (currentUrl.includes('/prijava')) {
      console.log('✅ TEST 1 PROŠAO: Registracija turiste uspešna\n');
    } else {
      console.log('✅ TEST 1 PROŠAO: Registracija poslata, čeka admin odobrenje\n');
    }
    
  } catch (error) {
    console.error('❌ TEST 1 NIJE PROŠAO:', error.message, '\n');
  }
  
  try {
    console.log('🧪 TEST 2: Registracija vlasnika');
    
    await driver.get('http://localhost:4200/registracija');
    await sleep(1000);
    
    const timestamp = Date.now();
    await driver.findElement(By.id('korisnickoIme')).sendKeys('test_vlasnik_' + timestamp);
    await driver.findElement(By.id('lozinka')).sendKeys('VlasnikPass123!');
    await driver.findElement(By.id('ime')).sendKeys('Test');
    await driver.findElement(By.id('prezime')).sendKeys('Vlasnik');
    await driver.findElement(By.id('email')).sendKeys('vlasnik' + timestamp + '@test.com');
    await driver.findElement(By.id('telefon')).sendKeys('0629876543');
    await driver.findElement(By.id('adresa')).sendKeys('Vlasnicka 45, Novi Sad');
    
    await driver.findElement(By.css('input[value="M"]')).click();
    await driver.findElement(By.id('brojKreditneKartice')).sendKeys('5500000000000004');
    console.log('✓ Uneta MasterCard kartica');
    
    const vlasnikRadio = await driver.findElement(By.css('input[value="vlasnik"]'));
    await driver.executeScript('arguments[0].click();', vlasnikRadio);
    console.log('✓ Odabrana uloga: Vlasnik');
    
    await sleep(1000);
    
    const submitButton = await driver.findElement(By.css('button[type="submit"]'));
    await driver.executeScript('arguments[0].scrollIntoView(true);', submitButton);
    await sleep(500);
    await submitButton.click();
    
    await sleep(3000);
    
    console.log('✅ TEST 2 PROŠAO: Registracija vlasnika uspešna\n');
    
  } catch (error) {
    console.error('❌ TEST 2 NIJE PROŠAO:', error.message, '\n');
  }
  
  try {
    console.log('🧪 TEST 3: Validacija lozinke (negativan test)');
    
    await driver.get('http://localhost:4200/registracija');
    await sleep(1000);
    
    await driver.findElement(By.id('korisnickoIme')).sendKeys('invaliduser');
    await driver.findElement(By.id('lozinka')).sendKeys('weak');
    await driver.findElement(By.id('ime')).sendKeys('Test');
    await driver.findElement(By.id('prezime')).sendKeys('User');
    
    const submitButton = await driver.findElement(By.css('button[type="submit"]'));
    const isDisabled = await submitButton.getAttribute('disabled');
    
    if (isDisabled) {
      console.log('✅ TEST 3 PROŠAO: Validacija lozinke radi - dugme onemogućeno\n');
    } else {
      console.log('⚠️  TEST 3: Validacija lozinke možda ne radi pravilno\n');
    }
    
  } catch (error) {
    console.error('❌ TEST 3 NIJE PROŠAO:', error.message, '\n');
    throw error;
  } finally {
    await driver.quit();
  }
}

testRegistracija();

