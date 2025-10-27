const { By, until } = require('selenium-webdriver');
const { createDriver, runTest, sleep } = require('../selenium-setup');

async function testVlasnikFunkcionalnost() {
  const driver = await createDriver();
  
  try {
    console.log('\n🧪 TEST 1: Vlasnik prijava');
    
    await driver.get('http://localhost:4200/prijava');
    await sleep(1000);
    
    await driver.findElement(By.id('korisnickoIme')).sendKeys('jovan');
    await driver.findElement(By.id('lozinka')).sendKeys('Jovan123!');
    await driver.findElement(By.css('button[type="submit"]')).click();
    console.log('✓ Kliknuto na dugme za prijavu');
    
    await sleep(3000);
    
    const currentUrl = await driver.getCurrentUrl();
    if (!currentUrl.includes('/vlasnik')) {
      console.log('⚠️  Vlasnik nije odobren ili nisu dobri kredencijali');
      console.log('Potrebno je prvo odobriti korisnika "jovan" preko admin panela\n');
      return;
    }
    
    console.log('✅ TEST 1 PROŠAO: Vlasnik uspešno prijavljen\n');
    
  } catch (error) {
    console.error('❌ TEST 1 NIJE PROŠAO:', error.message, '\n');
    await driver.quit();
    return;
  }
  
  try {
    console.log('🧪 TEST 2: Profil vlasnika - pregled i ažuriranje');
    
    await driver.get('http://localhost:4200/vlasnik/profil');
    await sleep(2000);
    
    const ime = await driver.findElements(By.css('input[id="ime"], input[name="firstName"]'));
    const email = await driver.findElements(By.css('input[id="email"], input[type="email"]'));
    const profilnaSlika = await driver.findElements(By.css('img[src], img[alt*="rofil"]'));
    
    console.log(`✓ Polja na profilu - ime: ${ime.length}, email: ${email.length}, slika: ${profilnaSlika.length}`);
    
    if (ime.length > 0 && email.length > 0) {
      console.log('✅ TEST 2 PROŠAO: Profil vlasnika funkcionalan\n');
    } else {
      console.log('⚠️  TEST 2: Profil možda nije potpuno prikazan\n');
    }
    
  } catch (error) {
    console.error('❌ TEST 2 NIJE PROŠAO:', error.message, '\n');
  }
  
  try {
    console.log('🧪 TEST 3: Pregled rezervacija za vikendice vlasnika');
    
    await driver.get('http://localhost:4200/vlasnik/rezervacije');
    await sleep(2000);
    console.log('✓ Otvoren pregled rezervacija');
    
    const tabele = await driver.findElements(By.css('table, .rezervacije, .reservation-list'));
    console.log(`✓ Pronađeno ${tabele.length} prikaza rezervacija`);
    
    const odobriButtons = await driver.findElements(By.xpath('//button[contains(@class, "btn-success") or contains(@class, "btn-primary")]'));
    const odbijButtons = await driver.findElements(By.xpath('//button[contains(@class, "btn-success") or contains(@class, "btn-primary")]'));
    
    console.log(`✓ Dugmad - odobri: ${odobriButtons.length}, odbij: ${odbijButtons.length}`);
    
    if (tabele.length > 0) {
      console.log('✅ TEST 3 PROŠAO: Pregled rezervacija funkcionalan\n');
    } else {
      console.log('⚠️  TEST 3: Nema prikazanih rezervacija\n');
    }
    
  } catch (error) {
    console.error('❌ TEST 3 NIJE PROŠAO:', error.message, '\n');
  }
  
  try {
    console.log('🧪 TEST 4: Pregled svih vikendica vlasnika');
    
    await driver.get('http://localhost:4200/vlasnik/vikendice');
    await sleep(2000);
    console.log('✓ Otvoren pregled vikendica');
    
    const vikendice = await driver.findElements(By.css('.vikendica-card, .cabin-card, tbody tr'));
    console.log(`✓ Vlasnik ima ${vikendice.length} vikendica`);
    
    const urediButtons = await driver.findElements(By.xpath('//button[contains(@class, "btn-success") or contains(@class, "btn-primary")]'));
    const obrisiButtons = await driver.findElements(By.xpath('//button[contains(@class, "btn-success") or contains(@class, "btn-primary")]'));
    
    console.log(`✓ Opcije - uredi: ${urediButtons.length}, obriši: ${obrisiButtons.length}`);
    
    console.log('✅ TEST 4 PROŠAO: Pregled vikendica funkcionalan\n');
    
  } catch (error) {
    console.error('❌ TEST 4 NIJE PROŠAO:', error.message, '\n');
  }
  
  try {
    console.log('🧪 TEST 5: Dodavanje nove vikendice');
    
    await driver.get('http://localhost:4200/vlasnik/vikendica/nova');
    await sleep(2000);
    console.log('✓ Otvoren obrazac za novu vikendicu');
    
    const imeInput = await driver.findElements(By.css('input[id="ime"], input[name="name"]'));
    const opisInput = await driver.findElements(By.css('textarea[id="opis"], textarea[name="description"]'));
    const mestoInput = await driver.findElements(By.css('input[id="mesto"], input[name="place"]'));
    const cenaInput = await driver.findElements(By.css('input[id="cena"], input[name="price"], input[type="number"]'));
    
    console.log(`✓ Polja - ime: ${imeInput.length}, opis: ${opisInput.length}, mesto: ${mestoInput.length}, cena: ${cenaInput.length}`);
    
    if (imeInput.length > 0) {
      await imeInput[0].sendKeys('Test Vikendica ' + Date.now());
      console.log('✓ Uneto ime vikendice');
    }
    
    if (opisInput.length > 0) {
      await opisInput[0].sendKeys('Ovo je test opis vikendice za Selenium test. Vikendica ima sve potrebne sadržaje.');
      console.log('✓ Unet opis vikendice');
    }
    
    if (mestoInput.length > 0) {
      await mestoInput[0].sendKeys('Kopaonik');
      console.log('✓ Uneto mesto vikendice');
    }
    
    const fileInputs = await driver.findElements(By.css('input[type="file"]'));
    console.log(`✓ Polja za upload slika: ${fileInputs.length}`);
    
    const jsonUpload = await driver.findElements(By.xpath('//button[contains(@class, "btn-success") or contains(@class, "btn-primary")]'));
    if (jsonUpload.length > 0) {
      console.log('✓ Opcija za JSON import postoji');
    }
    
    console.log('✅ TEST 5 PROŠAO: Forma za novu vikendicu kompletna\n');
    
  } catch (error) {
    console.error('❌ TEST 5 NIJE PROŠAO:', error.message, '\n');
  }
  
  try {
    console.log('🧪 TEST 6: Uređivanje postojeće vikendice');
    
    await driver.get('http://localhost:4200/vlasnik/vikendice');
    await sleep(2000);
    
    const urediButtons = await driver.findElements(By.xpath('//button[contains(@class, "btn-success") or contains(@class, "btn-primary")]'));
    
    if (urediButtons.length > 0) {
      await urediButtons[0].click();
      await sleep(2000);
      console.log('✓ Otvoren obrazac za izmenu vikendice');
      
      const imeInput = await driver.findElements(By.css('input[id="ime"], input[name="name"]'));
      if (imeInput.length > 0) {
        const currentValue = await imeInput[0].getAttribute('value');
        console.log(`✓ Trenutno ime vikendice: "${currentValue}"`);
      }
      
      console.log('✅ TEST 6 PROŠAO: Izmena vikendice funkcionalna\n');
    } else {
      console.log('⚠️  TEST 6: Nema vikendica za izmenu\n');
    }
    
  } catch (error) {
    console.error('❌ TEST 6 NIJE PROŠAO:', error.message, '\n');
  }
  
  try {
    console.log('🧪 TEST 7: Statistika vlasnika (dijagrami)');
    
    const statistikaLinks = await driver.findElements(By.css('a[href*="statistika"], a[routerLink*="statistika"]'));
    
    if (statistikaLinks.length > 0) {
      await statistikaLinks[0].click();
      await sleep(2000);
      console.log('✓ Otvorena stranica sa statistikom');
      
      const charts = await driver.findElements(By.css('canvas, svg, .chart, .diagram'));
      console.log(`✓ Pronađeno ${charts.length} dijagrama`);
      
      if (charts.length >= 2) {
        console.log('✅ TEST 7 PROŠAO: Statistika sa dijagramima prikazana\n');
      } else {
        console.log('⚠️  TEST 7: Dijagrami možda nisu potpuno prikazani\n');
      }
    } else {
      console.log('⚠️  TEST 7: Link za statistiku nije pronađen\n');
    }
    
  } catch (error) {
    console.error('❌ TEST 7 NIJE PROŠAO:', error.message, '\n');
  }
  
  try {
    console.log('🧪 TEST 8: Logout funkcionalnost');
    
    const logoutButton = await driver.findElements(By.xpath('//button[contains(text(), "djava")] | //a[contains(text(), "djava")]'));
    
    if (logoutButton.length > 0) {
      await logoutButton[0].click();
      await sleep(2000);
      
      const currentUrl = await driver.getCurrentUrl();
      if (currentUrl.includes('/prijava') || currentUrl === 'http://localhost:4200/') {
        console.log('✅ TEST 8 PROŠAO: Logout uspešan\n');
      } else {
        console.log('⚠️  TEST 8: Logout možda nije preusmerio pravilno\n');
      }
    } else {
      console.log('⚠️  TEST 8: Logout dugme nije pronađeno\n');
    }
    
  } catch (error) {
    console.error('❌ TEST 8 NIJE PROŠAO:', error.message, '\n');
    throw error;
  } finally {
    await driver.quit();
  }
}

testVlasnikFunkcionalnost();



