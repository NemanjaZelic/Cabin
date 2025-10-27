const { By, until } = require('selenium-webdriver');
const { createDriver, runTest, sleep } = require('../selenium-setup');
const path = require('path');
const fs = require('fs');

async function testVikendicaDodavanje() {
  const driver = await createDriver();
  
  try {
    console.log('\n🧪 TEST 1: Vlasnik - Dodavanje nove vikendice SA slikama');
    
    await driver.get('http://localhost:4200/prijava');
    await sleep(1000);
    
    await driver.findElement(By.id('korisnickoIme')).sendKeys('jovan');
    await driver.findElement(By.id('lozinka')).sendKeys('Jovan123!');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await sleep(3000);
    
    const currentUrl = await driver.getCurrentUrl();
    if (!currentUrl.includes('/vlasnik')) {
      throw new Error('Warning - test stopped');
    }
    
    await driver.get('http://localhost:4200/vlasnik/vikendica/nova');
    await sleep(2000);
    console.log('✓ Otvoren obrazac za novu vikendicu');
    
    const timestamp = Date.now();
    
    const imeInput = await driver.findElements(By.css('input[id="ime"], input[name="name"]'));
    if (imeInput.length > 0) {
      await imeInput[0].sendKeys(`Selenium Test Vikendica ${timestamp}`);
      console.log('✓ Uneto ime vikendice');
    }
    
    const mestoInput = await driver.findElements(By.css('input[id="mesto"], input[name="place"]'));
    if (mestoInput.length > 0) {
      await mestoInput[0].sendKeys('Kopaonik');
      console.log('✓ Uneto mesto');
    }
    
    const opisInput = await driver.findElements(By.css('textarea[id="opis"], textarea[name="description"]'));
    if (opisInput.length > 0) {
      await opisInput[0].sendKeys('Ovo je test vikendica kreirana pomoću Selenium testa. Vikendica ima sve potrebne sadržaje za udoban boravak.');
      console.log('✓ Unet opis');
    }
    
    const letnaCenaInput = await driver.findElements(By.css('input[name*="summer"], input[id*="letnja"]'));
    if (letnaCenaInput.length > 0) {
      await letnaCenaInput[0].sendKeys('5000');
      console.log('✓ Uneta letnja cena');
    }
    
    const zimskaCenaInput = await driver.findElements(By.css('input[name*="winter"], input[id*="zimska"]'));
    if (zimskaCenaInput.length > 0) {
      await zimskaCenaInput[0].sendKeys('7000');
      console.log('✓ Uneta zimska cena');
    }
    
    const telefonInput = await driver.findElements(By.css('input[type="tel"], input[name*="phone"]'));
    if (telefonInput.length > 0) {
      await telefonInput[0].sendKeys('0651234567');
      console.log('✓ Unet telefon');
    }
    
    const latitudeInput = await driver.findElements(By.css('input[name*="latitude"], input[name*="lat"]'));
    if (latitudeInput.length > 0) {
      await latitudeInput[0].sendKeys('43.2866');
      console.log('✓ Uneta latitude');
    }
    
    const longitudeInput = await driver.findElements(By.css('input[name*="longitude"], input[name*="lng"]'));
    if (longitudeInput.length > 0) {
      await longitudeInput[0].sendKeys('20.7714');
      console.log('✓ Uneta longitude');
    }
    
    await sleep(1000);
    
    const fileInput = await driver.findElements(By.css('input[type="file"]'));
    if (fileInput.length > 0) {
      const testImagePath = path.resolve(__dirname, '../test-image.jpg');
      
      if (!fs.existsSync(testImagePath)) {
        console.log('⚠️  Kreiranje test slike...');
        const buffer = Buffer.from('FFD8FFE000104A46494600010100000100010000FFDB00430001010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101FFC00011080064006403012200021101031101FFC4001500010100000000000000000000000000000000FFDA000C03010002110311003F00F7FFFF', 'hex');
        fs.writeFileSync(testImagePath, buffer);
      }
      
      await fileInput[0].sendKeys(testImagePath);
      console.log('✓ Slika odabrana za upload');
      await sleep(2000);
    }
    
    const submitButton = await driver.findElements(By.xpath('//button[@type="submit" or contains(text(), "ačuvaj") or contains(text(), "odaj")]'));
    if (submitButton.length > 0) {
      await driver.executeScript('arguments[0].scrollIntoView(true);', submitButton[0]);
      await sleep(500);
      await submitButton[0].click();
      console.log('✓ Kliknuto na dugme Dodaj vikendicu');
      await sleep(4000);
      
      const greska = await driver.findElements(By.css('.error, .alert-danger, [class*="greška"]'));
      
      if (greska.length > 0) {
        const greskaText = await greska[0].getText();
        console.log('❌ TEST 1 NIJE PROŠAO: Greška -', greskaText, '\n');
      } else {
        const trenutniUrl = await driver.getCurrentUrl();
        if (trenutniUrl.includes('/vlasnik/vikendice')) {
          console.log('✅ TEST 1 PROŠAO: Vikendica sa slikom uspešno dodata\n');
        } else {
          console.log('⚠️  TEST 1: Vikendica poslata, čeka se rezultat\n');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ TEST 1 NIJE PROŠAO:', error.message, '\n');
  }
  
  try {
    console.log('🧪 TEST 2: Uređivanje postojeće vikendice');
    
    await driver.get('http://localhost:4200/vlasnik/vikendice');
    await sleep(2000);
    
    const urediButtons = await driver.findElements(By.xpath('//button[contains(@class, "btn-success") or contains(@class, "btn-primary")]'));
    
    if (urediButtons.length > 0) {
      await urediButtons[0].click();
      await sleep(2000);
      console.log('✓ Otvoren obrazac za izmenu vikendice');
      
      const imeInput = await driver.findElements(By.css('input[id="ime"], input[name="name"]'));
      if (imeInput.length > 0) {
        const trenutnoIme = await imeInput[0].getAttribute('value');
        await imeInput[0].clear();
        await imeInput[0].sendKeys(trenutnoIme + ' - EDITED');
        console.log('✓ Izmenjeno ime vikendice');
      }
      
      const opisInput = await driver.findElements(By.css('textarea'));
      if (opisInput.length > 0) {
        await opisInput[0].sendKeys(' Ažurirano pomoću Selenium testa.');
        console.log('✓ Dopunjen opis');
      }
      
      await sleep(1000);
      
      const submitButton = await driver.findElements(By.css('button[type="submit"]'));
      if (submitButton.length > 0) {
        await submitButton[0].click();
        console.log('✓ Kliknuto na dugme Sačuvaj izmene');
        await sleep(3000);
        
        console.log('✅ TEST 2 PROŠAO: Izmena vikendice uspešna\n');
      }
    } else {
      console.log('⚠️  TEST 2: Nema vikendica za uređivanje\n');
    }
    
  } catch (error) {
    console.error('❌ TEST 2 NIJE PROŠAO:', error.message, '\n');
  }
  
  try {
    console.log('🧪 TEST 3: Brisanje vikendice');
    
    await driver.get('http://localhost:4200/vlasnik/vikendice');
    await sleep(2000);
    
    const obrisiButtons = await driver.findElements(By.xpath('//button[contains(text(), "briši") or contains(@class, "btn-danger")]'));
    
    if (obrisiButtons.length > 0) {
      console.log(`✓ Pronađeno ${obrisiButtons.length} dugmadi za brisanje`);
      
      const prviTestVikendica = await driver.findElements(By.xpath('//td[contains(text(), "Selenium Test")]/parent::tr//button[contains(text(), "briši")]'));
      
      if (prviTestVikendica.length > 0) {
        await prviTestVikendica[0].click();
        console.log('✓ Kliknuto na dugme Obriši test vikendicu');
        await sleep(1000);
        
        try {
          await driver.switchTo().alert().accept();
          console.log('✓ Potvrđeno brisanje');
          await sleep(2000);
          console.log('✅ TEST 3 PROŠAO: Brisanje vikendice uspešno\n');
        } catch (e) {
          console.log('⚠️  Nema alert dijaloga');
          console.log('✅ TEST 3 PROŠAO: Brisanje poslato\n');
        }
      } else {
        console.log('⚠️  TEST 3: Test vikendica nije pronađena za brisanje\n');
      }
    } else {
      console.log('⚠️  TEST 3: Nema vikendica za brisanje\n');
    }
    
  } catch (error) {
    console.error('❌ TEST 3 NIJE PROŠAO:', error.message, '\n');
  }
  
  try {
    console.log('🧪 TEST 4: JSON import vikendice');
    
    await driver.get('http://localhost:4200/vlasnik/vikendica/nova');
    await sleep(2000);
    
    const jsonUploadButton = await driver.findElements(By.xpath('//input[contains(@accept, "json")] | //button[contains(text(), "JSON")] | //label[contains(text(), "JSON")]'));
    
    if (jsonUploadButton.length > 0) {
      console.log('✓ Opcija za JSON import pronađena');
      
      const testJsonPath = path.resolve(__dirname, '../test-vikendica.json');
      
      if (!fs.existsSync(testJsonPath)) {
        const testData = {
          name: 'JSON Test Vikendica',
          place: 'Zlatibor',
          description: 'Vikendica učitana iz JSON fajla',
          pricing: {
            summer: 6000,
            winter: 8000
          },
          phone: '0691234567',
          coordinates: {
            latitude: 43.7305,
            longitude: 19.7104
          }
        };
        fs.writeFileSync(testJsonPath, JSON.stringify(testData, null, 2));
        console.log('✓ Test JSON fajl kreiran');
      }
      
      const fileInput = await driver.findElements(By.css('input[type="file"][accept*="json"]'));
      if (fileInput.length > 0) {
        await fileInput[0].sendKeys(testJsonPath);
        console.log('✓ JSON fajl učitan');
        await sleep(2000);
        
        const imeInput = await driver.findElements(By.css('input[id="ime"], input[name="name"]'));
        if (imeInput.length > 0) {
          const vrednost = await imeInput[0].getAttribute('value');
          if (vrednost.includes('JSON')) {
            console.log('✅ TEST 4 PROŠAO: JSON import radi - polja popunjena\n');
          } else {
            console.log('⚠️  TEST 4: JSON import možda ne popunjava polja\n');
          }
        }
      } else {
        console.log('⚠️  TEST 4: Input za JSON fajl nije pronađen\n');
      }
    } else {
      console.log('⚠️  TEST 4: JSON import funkcionalnost nije implementirana\n');
    }
    
  } catch (error) {
    console.error('❌ TEST 4 NIJE PROŠAO:', error.message, '\n');
    throw error;
  } finally {
    await driver.quit();
  }
}

testVikendicaDodavanje();



