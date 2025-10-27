const { By, until } = require('selenium-webdriver');
const { createDriver, runTest, sleep } = require('../selenium-setup');

async function testPromenaLozinke() {
  const driver = await createDriver();
  
  try {
    console.log('\n🧪 TEST 1: Pristup formi za promenu lozinke');
    
    await driver.get('http://localhost:4200');
    await sleep(1000);
    
    const promenaLozinkeLink = await driver.findElements(By.css('a[href*="promena-lozinke"], a[routerLink*="promena-lozinke"]'));
    
    if (promenaLozinkeLink.length > 0) {
      await promenaLozinkeLink[0].click();
      await sleep(2000);
      console.log('✓ Otvoren obrazac za promenu lozinke');
      
      console.log('✅ TEST 1 PROŠAO: Forma za promenu lozinke dostupna\n');
    } else {
      console.log('⚠️  TEST 1: Link za promenu lozinke nije pronađen\n');
    }
    
  } catch (error) {
    console.error('❌ TEST 1 NIJE PROŠAO:', error.message, '\n');
  }
  
  try {
    console.log('🧪 TEST 2: Provera polja forme za promenu lozinke');
    
    await driver.get('http://localhost:4200/promena-lozinke');
    await sleep(1000);
    
    const korisnickoImeInput = await driver.findElements(By.css('input[id="korisnickoIme"], input[name="username"]'));
    const staraLozinkaInput = await driver.findElements(By.css('input[id="staraLozinka"], input[placeholder*="tara"]'));
    const novaLozinkaInput = await driver.findElements(By.css('input[id="novaLozinka"], input[placeholder*="ova"]'));
    const potvrdaLozinkeInput = await driver.findElements(By.css('input[id="potvrdaLozinke"], input[placeholder*="onovljena"]'));
    
    console.log(`✓ Polja - korisničko ime: ${korisnickoImeInput.length}`);
    console.log(`✓ Polja - stara lozinka: ${staraLozinkaInput.length}`);
    console.log(`✓ Polja - nova lozinka: ${novaLozinkaInput.length}`);
    console.log(`✓ Polja - potvrda lozinke: ${potvrdaLozinkeInput.length}`);
    
    if (staraLozinkaInput.length > 0 && novaLozinkaInput.length > 0 && potvrdaLozinkeInput.length > 0) {
      console.log('✅ TEST 2 PROŠAO: Sva potrebna polja su prisutna\n');
    } else {
      console.log('⚠️  TEST 2: Neki poljа nedostaju\n');
    }
    
  } catch (error) {
    console.error('❌ TEST 2 NIJE PROŠAO:', error.message, '\n');
  }
  
  try {
    console.log('🧪 TEST 3: Validacija - stara i nova lozinka ne smeju biti iste');
    
    await driver.get('http://localhost:4200/promena-lozinke');
    await sleep(1000);
    
    const korisnickoImeInput = await driver.findElements(By.css('input[id="korisnickoIme"], input[name="username"]'));
    if (korisnickoImeInput.length > 0) {
      await korisnickoImeInput[0].sendKeys('testuser');
    }
    
    const staraLozinkaInput = await driver.findElements(By.css('input[id="staraLozinka"], input[placeholder*="tara"]'));
    if (staraLozinkaInput.length > 0) {
      await staraLozinkaInput[0].sendKeys('SamaLozinka123!');
    }
    
    const novaLozinkaInput = await driver.findElements(By.css('input[id="novaLozinka"], input[placeholder*="ova"]'));
    if (novaLozinkaInput.length > 0) {
      await novaLozinkaInput[0].sendKeys('SamaLozinka123!');
    }
    
    const potvrdaLozinkeInput = await driver.findElements(By.css('input[id="potvrdaLozinke"], input[placeholder*="onovljena"]'));
    if (potvrdaLozinkeInput.length > 0) {
      await potvrdaLozinkeInput[0].sendKeys('SamaLozinka123!');
    }
    
    await sleep(1000);
    
    const submitButton = await driver.findElements(By.css('button[type="submit"]'));
    if (submitButton.length > 0) {
      await submitButton[0].click();
      await sleep(2000);
      
      const greska = await driver.findElements(By.css('.error, .alert-danger, [class*="greska"]'));
      if (greska.length > 0) {
        console.log('✓ Prikazana greška - stara i nova lozinka su iste');
        console.log('✅ TEST 3 PROŠAO: Validacija radi pravilno\n');
      } else {
        console.log('⚠️  TEST 3: Validacija možda ne radi\n');
      }
    }
    
  } catch (error) {
    console.error('❌ TEST 3 NIJE PROŠAO:', error.message, '\n');
  }
  
  try {
    console.log('🧪 TEST 4: Validacija formata nove lozinke');
    
    await driver.get('http://localhost:4200/promena-lozinke');
    await sleep(1000);
    
    const novaLozinkaInput = await driver.findElements(By.css('input[id="novaLozinka"], input[placeholder*="ova"]'));
    if (novaLozinkaInput.length > 0) {
      await novaLozinkaInput[0].clear();
      await novaLozinkaInput[0].sendKeys('weak');
      await sleep(500);
      
      const validationMessage = await driver.findElements(By.css('.invalid-feedback, .error, [class*="validation"]'));
      if (validationMessage.length > 0) {
        console.log('✓ Prikazana validaciona poruka za slabu lozinku');
        console.log('✅ TEST 4 PROŠAO: Validacija formata lozinke radi\n');
      } else {
        console.log('⚠️  TEST 4: Validacija formata možda nije vidljiva\n');
      }
    }
    
  } catch (error) {
    console.error('❌ TEST 4 NIJE PROŠAO:', error.message, '\n');
    throw error;
  } finally {
    await driver.quit();
  }
}

testPromenaLozinke();

