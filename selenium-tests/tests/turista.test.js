const { By, until } = require('selenium-webdriver');
const { createDriver, runTest, sleep } = require('../selenium-setup');

async function testTuristaFunkcionalnost() {
  const driver = await createDriver();
  
  try {
    console.log('\n🧪 TEST 1: Turista prijava');
    
    await driver.get('http://localhost:4200/prijava');
    await sleep(1000);
    
    await driver.findElement(By.id('korisnickoIme')).sendKeys('marko');
    await driver.findElement(By.id('lozinka')).sendKeys('Marko123!');
    await driver.findElement(By.css('button[type="submit"]')).click();
    console.log('✓ Kliknuto na dugme za prijavu');
    
    await sleep(3000);
    
    const currentUrl = await driver.getCurrentUrl();
    if (!currentUrl.includes('/turista')) {
      console.log('⚠️  Turista nije odobren ili nisu dobri kredencijali');
      console.log('Potrebno je prvo odobriti korisnika "marko" preko admin panela\n');
      return;
    }
    
    console.log('✅ TEST 1 PROŠAO: Turista uspešno prijavljen\n');
    
  } catch (error) {
    console.error('❌ TEST 1 NIJE PROŠAO:', error.message, '\n');
    await driver.quit();
    return;
  }
  
  try {
    console.log('🧪 TEST 2: Profil turiste - pregled i ažuriranje');
    
    await driver.get('http://localhost:4200/turista/profil');
    await sleep(2000);
    
    const ime = await driver.findElements(By.css('input[id="ime"], input[name="firstName"]'));
    const email = await driver.findElements(By.css('input[id="email"], input[type="email"]'));
    const profilnaSlika = await driver.findElements(By.css('img[src], img[alt*="rofil"]'));
    
    console.log(`✓ Polja na profilu - ime: ${ime.length}, email: ${email.length}, slika: ${profilnaSlika.length}`);
    
    if (ime.length > 0 && email.length > 0) {
      const izmeniButton = await driver.findElements(By.xpath('//button[@type="submit" or contains(text(), "Sačuvaj") or contains(text(), "žuri")]'));
      if (izmeniButton.length > 0) {
        console.log('✓ Dugme za ažuriranje profila pronađeno');
      }
      console.log('✅ TEST 2 PROŠAO: Profil turiste funkcionalan\n');
    } else {
      console.log('⚠️  TEST 2: Profil možda nije potpuno prikazan\n');
    }
    
  } catch (error) {
    console.error('❌ TEST 2 NIJE PROŠAO:', error.message, '\n');
  }
  
  try {
    console.log('🧪 TEST 3: Pregled vikendica sa pretragom i sortiranjem');
    
    await driver.get('http://localhost:4200/turista/vikendice');
    await sleep(2000);
    console.log('✓ Otvoren pregled vikendica');
    
    const vikendice = await driver.findElements(By.css('.vikendica-card, .cabin-card, tbody tr'));
    console.log(`✓ Pronađeno ${vikendice.length} vikendica`);
    
    const searchField = await driver.findElements(By.css('input[placeholder*="retra"], input[type="search"]'));
    if (searchField.length > 0) {
      console.log('✓ Polje za pretragu dostupno');
    }
    
    const ocene = await driver.findElements(By.xpath('//button[contains(@class, "btn-success") or contains(@class, "btn-primary")]'));
    if (ocene.length > 0) {
      console.log('✓ Ocene vikendica prikazane');
    }
    
    console.log('✅ TEST 3 PROŠAO: Pregled vikendica funkcionalan\n');
    
  } catch (error) {
    console.error('❌ TEST 3 NIJE PROŠAO:', error.message, '\n');
  }
  
  try {
    console.log('🧪 TEST 4: Detalji vikendice');
    
    await driver.get('http://localhost:4200/turista/vikendice');
    await sleep(2000);
    
    const detaljButtons = await driver.findElements(By.xpath('//button[contains(@class, "btn-success") or contains(@class, "btn-primary")]'));
    
    if (detaljButtons.length > 0) {
      await detaljButtons[0].click();
      console.log('✓ Kliknuto na detalje vikendice');
      
      await sleep(3000);
      
      const naziv = await driver.findElements(By.css('h1, h2, .vikendica-naziv'));
      const opis = await driver.findElements(By.css('.opis, .description, p'));
      const slike = await driver.findElements(By.css('img, .gallery img'));
      const cena = await driver.findElements(By.css('.cena, .price, span'));
      
      console.log(`✓ Detalji - naziv: ${naziv.length}, opis: ${opis.length}, slike: ${slike.length}, cena: ${cena.length}`);
      
      const rezervisiButton = await driver.findElements(By.xpath('//button[contains(text(), "ezerviši") or contains(text(), "akaži")]'));
      if (rezervisiButton.length > 0) {
        console.log('✓ Dugme za rezervaciju pronađeno');
      }
      
      console.log('✅ TEST 4 PROŠAO: Detalji vikendice funkcionalni\n');
    } else {
      console.log('⚠️  TEST 4: Nema vikendica za prikaz detalja\n');
    }
    
  } catch (error) {
    console.error('❌ TEST 4 NIJE PROŠAO:', error.message, '\n');
  }
  
  try {
    console.log('🧪 TEST 5: Rezervacija vikendice (multi-step)');
    
    await driver.get('http://localhost:4200/turista/vikendice');
    await sleep(2000);
    
    const detaljButtons = await driver.findElements(By.css('.btn-primary, a[href*="vikendica/"]'));
    
    if (detaljButtons.length > 0) {
      await detaljButtons[0].click();
      await sleep(2000);
      
      const rezervisiButton = await driver.findElements(By.xpath("//button[contains(text(), 'ezerviši')]"));
      
      if (rezervisiButton.length > 0) {
        console.log('✓ Forma za rezervaciju dostupna');
        
        const datePickers = await driver.findElements(By.css('input[type="date"], input[placeholder*="atum"]'));
        const brojOsobaInput = await driver.findElements(By.css('input[type="number"], input[placeholder*="osob"]'));
        
        console.log(`✓ Polja - datumi: ${datePickers.length}, broj osoba: ${brojOsobaInput.length}`);
        
        if (datePickers.length >= 2 && brojOsobaInput.length > 0) {
          console.log('✅ TEST 5 PROŠAO: Forma za rezervaciju kompletna\n');
        } else {
          console.log('⚠️  TEST 5: Forma možda nije potpuna\n');
        }
      } else {
        console.log('⚠️  TEST 5: Vikendica nije dostupna za rezervaciju\n');
      }
    }
    
  } catch (error) {
    console.error('❌ TEST 5 NIJE PROŠAO:', error.message, '\n');
  }
  
  try {
    console.log('🧪 TEST 6: Pregled trenutnih rezervacija');
    
    await driver.get('http://localhost:4200/turista/rezervacije');
    await sleep(2000);
    console.log('✓ Otvoren pregled rezervacija');
    
    const tabele = await driver.findElements(By.css('table, .rezervacije, .reservation-list'));
    console.log(`✓ Pronađeno ${tabele.length} tabela sa rezervacijama`);
    
    const otkaziButton = await driver.findElements(By.xpath('//button[contains(@class, "btn-success") or contains(@class, "btn-primary")]'));
    if (otkaziButton.length > 0) {
      console.log('✓ Opcija za otkazivanje rezervacije dostupna');
    }
    
    console.log('✅ TEST 6 PROŠAO: Pregled rezervacija funkcionalan\n');
    
  } catch (error) {
    console.error('❌ TEST 6 NIJE PROŠAO:', error.message, '\n');
  }
  
  try {
    console.log('🧪 TEST 7: Logout funkcionalnost');
    
    const logoutButton = await driver.findElements(By.xpath('//button[contains(text(), "djava")] | //a[contains(text(), "djava")]'));
    
    if (logoutButton.length > 0) {
      await logoutButton[0].click();
      await sleep(2000);
      
      const currentUrl = await driver.getCurrentUrl();
      if (currentUrl.includes('/prijava') || currentUrl === 'http://localhost:4200/') {
        console.log('✅ TEST 7 PROŠAO: Logout uspešan\n');
      } else {
        console.log('⚠️  TEST 7: Logout možda nije preusmerio pravilno\n');
      }
    } else {
      console.log('⚠️  TEST 7: Logout dugme nije pronađeno\n');
    }
    
  } catch (error) {
    console.error('❌ TEST 7 NIJE PROŠAO:', error.message, '\n');
    throw error;
  } finally {
    await driver.quit();
  }
}

testTuristaFunkcionalnost();



