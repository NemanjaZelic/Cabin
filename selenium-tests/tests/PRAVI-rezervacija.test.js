const { Builder, By, until } = require('selenium-webdriver');
const { createDriver, runTest, sleep } = require('../selenium-setup');
const chrome = require('selenium-webdriver/chrome');

async function testRezervacija() {
  const options = new chrome.Options();
  // NE KORISTIMO HEADLESS!
  options.addArguments('--disable-gpu');
  options.addArguments('--no-sandbox');
  options.addArguments('--start-maximized');
  
  const driver = await createDriver(false); // headless = false

  try {
    console.log('\n🧪 PRAVI TEST: Kompletna rezervacija vikendice');
    console.log('═'.repeat(60));

    // 1. PRIJAVA
    console.log('\n1️⃣  PRIJAVA TURISTE');
    console.log('-'.repeat(60));
    
    await driver.get('http://localhost:4200/prijava');
    await sleep(2000);
    
    // Nađi polja
    const usernameInput = await driver.findElement(By.id('korisnickoIme'));
    const passwordInput = await driver.findElement(By.id('lozinka'));
    const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
    
    await usernameInput.sendKeys('marko');
    await passwordInput.sendKeys('Marko123!');
    await submitBtn.click();
    await sleep(3000);
    
    const urlAfterLogin = await driver.getCurrentUrl();
    if (!urlAfterLogin.includes('turista')) {
      throw new Error('❌ FAIL: Prijava nije uspela! URL nije promenjena na /turista');
    }
    console.log('✅ Prijava uspešna');

    // 2. VIKENDICE
    console.log('\n2️⃣  PREGLED VIKENDICA');
    console.log('-'.repeat(60));
    
    await driver.get('http://localhost:4200/turista/vikendice');
    await sleep(3000);
    
    const cards = await driver.findElements(By.css('.card, mat-card, .vikendica-card'));
    console.log(`  Pronađeno ${cards.length} kartica sa vikendica`);
    
    if (cards.length === 0) {
      throw new Error('❌ FAIL: Nema vikendica! Backend ne vraća podatke.');
    }
    console.log('✅ Vikendice prikazane');

    // 3. OTVORI DETALJE PRVE VIKENDICE
    console.log('\n3️⃣  OTVARANJE DETALJA VIKENDICE');
    console.log('-'.repeat(60));
    
    // Pronađi link ili dugme u prvoj kartici
    const firstCard = cards[0];
    
    console.log('\n🔍 DIJAGNOSTIKA: Šta ima u prvoj kartici?');
    
    // Probaj različite načine da nađeš link
    const cardLinks = await firstCard.findElements(By.tagName('a'));
    const cardButtons = await firstCard.findElements(By.tagName('button'));
    const allText = await firstCard.getText();
    
    console.log(`  Tekst kartice:\n${allText}`);
    console.log(`  Broj linkova: ${cardLinks.length}`);
    console.log(`  Broj dugmadi: ${cardButtons.length}`);
    
    // Ispiši SVE linkove
    if (cardLinks.length > 0) {
      for (let i = 0; i < cardLinks.length; i++) {
        const text = await cardLinks[i].getText();
        const href = await cardLinks[i].getAttribute('href');
        const className = await cardLinks[i].getAttribute('class');
        console.log(`    Link ${i + 1}: text="${text}" href="${href}" class="${className}"`);
      }
    }
    
    // Ispiši SVA dugmad
    if (cardButtons.length > 0) {
      for (let i = 0; i < cardButtons.length; i++) {
        const text = await cardButtons[i].getText();
        const className = await cardButtons[i].getAttribute('class');
        console.log(`    Dugme ${i + 1}: "${text}" class="${className}"`);
      }
    }
    
    // Pokušaj da nađeš bilo šta klikabilno
    let clickable = null;
    
    // Prvo probaj linkove
    for (const link of cardLinks) {
      const href = await link.getAttribute('href');
      if (href && (href.includes('vikendica') || href.includes('detalj'))) {
        clickable = link;
        console.log('  ✅ Našao link sa href koji sadrži "vikendica"');
        break;
      }
    }
    
    // Ako nema linkova, probaj dugmad
    if (!clickable && cardButtons.length > 0) {
      for (const btn of cardButtons) {
        const text = (await btn.getText()).toLowerCase();
        if (text.includes('detalj') || text.includes('više') || text.includes('view')) {
          clickable = btn;
          console.log('  ✅ Našao dugme sa tekstom koji sadrži "detalj"');
          break;
        }
      }
    }
    
    // Ako NIŠTA nije pronađeno, možda sama kartica ima link
    if (!clickable) {
      console.log('  ⚠️  Nema eksplicitnog linka/dugmeta - probam da kliknem celu karticu...');
      const cardTag = await firstCard.getTagName();
      const cardHref = await firstCard.getAttribute('href');
      console.log(`    Kartica tag: ${cardTag}, href: ${cardHref}`);
      
      if (cardTag === 'a' || cardHref) {
        clickable = firstCard;
      }
    }
    
    if (!clickable) {
      throw new Error('❌ FAIL: Kartica nema NIKAKAV način da se otvore detalji! Ni link ni dugme.');
    }
    
    await clickable.click();
    await sleep(3000);
    console.log('✅ Otvoreni detalji vikendice');

    // 4. REZERVIŠI
    console.log('\n4️⃣  KREIRANJE REZERVACIJE');
    console.log('-'.repeat(60));
    
    // Nađi dugme za rezervaciju
    const allButtons = await driver.findElements(By.tagName('button'));
    console.log(`  Pronađeno ${allButtons.length} dugmadi na stranici:`);
    
    let rezervisiButton = null;
    for (let i = 0; i < allButtons.length; i++) {
      const text = (await allButtons[i].getText()).toLowerCase();
      console.log(`    Dugme ${i + 1}: "${await allButtons[i].getText()}"`);
      
      if (text.includes('rezerv') || text.includes('book') || text.includes('zakaz')) {
        rezervisiButton = allButtons[i];
        break;
      }
    }
    
    if (!rezervisiButton) {
      throw new Error('❌ FAIL: Dugme za rezervaciju nije pronađeno!');
    }
    
    await rezervisiButton.click();
    await sleep(2000);
    console.log('✅ Kliknuto na "Rezerviši"');

    // 5. POPUNI FORMU
    console.log('\n5️⃣  POPUNJAVANJE REZERVACIONE FORME');
    console.log('-'.repeat(60));
    
    // Nađi sva input polja
    const allInputs = await driver.findElements(By.tagName('input'));
    console.log(`  Pronađeno ${allInputs.length} input polja u formi`);
    
    // Datum OD
    const datumOdInputs = await driver.findElements(By.css(
      'input[type="date"], ' +
      'input[name*="datumOd"], ' +
      'input[name*="checkIn"], ' +
      'input[placeholder*="datum od"]'
    ));
    
    if (datumOdInputs.length === 0) {
      console.log('❌ FAIL: Polje "Datum OD" nije pronađeno!');
      console.log('  Dostupna polja:');
      for (const inp of allInputs) {
        const name = await inp.getAttribute('name');
        const placeholder = await inp.getAttribute('placeholder');
        const type = await inp.getAttribute('type');
        console.log(`    - type="${type}" name="${name}" placeholder="${placeholder}"`);
      }
      throw new Error('❌ FAIL: Forma za rezervaciju nema polje za "Datum OD"');
    }
    
    // Postavi datume
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 7);
    const datumOd = tomorrow.toISOString().split('T')[0];
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 10);
    const datumDo = nextWeek.toISOString().split('T')[0];
    
    await datumOdInputs[0].clear();
    await datumOdInputs[0].sendKeys(datumOd);
    console.log(`  ✓ Datum OD: ${datumOd}`);
    
    // Datum DO
    const datumDoInputs = await driver.findElements(By.css(
      'input[name*="datumDo"], ' +
      'input[name*="checkOut"]'
    ));
    
    if (datumDoInputs.length > 0) {
      await datumDoInputs[0].clear();
      await datumDoInputs[0].sendKeys(datumDo);
      console.log(`  ✓ Datum DO: ${datumDo}`);
    }
    
    // Broj osoba
    const odrasliInputs = await driver.findElements(By.css(
      'input[name*="odrasl"], ' +
      'input[name*="adults"], ' +
      'input[placeholder*="odrasl"]'
    ));
    
    if (odrasliInputs.length > 0) {
      await odrasliInputs[0].clear();
      await odrasliInputs[0].sendKeys('2');
      console.log('  ✓ Odraslih: 2');
    }

    await sleep(1000);

    // 6. POTVRDI REZERVACIJU
    console.log('\n6️⃣  POTVRDA REZERVACIJE');
    console.log('-'.repeat(60));
    
    // Nađi submit dugme
    const allSubmitButtons = await driver.findElements(By.tagName('button'));
    console.log(`  Pronađeno ${allSubmitButtons.length} dugmadi`);
    
    let submitButton = null;
    for (const btn of allSubmitButtons) {
      const type = await btn.getAttribute('type');
      const text = (await btn.getText()).toLowerCase();
      console.log(`    - type="${type}" text="${await btn.getText()}"`);
      
      if (type === 'submit' || text.includes('potvrdi') || text.includes('rezerv')) {
        submitButton = btn;
        break;
      }
    }
    
    if (!submitButton) {
      throw new Error('❌ FAIL: Submit dugme nije pronađeno u formi!');
    }
    
    await submitButton.click();
    await sleep(3000);
    console.log('✅ Submit kliknut');
    
    // Proveri success poruku
    const successElements = await driver.findElements(By.css(
      '.success, ' +
      '.alert-success, ' +
      '.mat-snack-bar-container, ' +
      '[class*="success"]'
    ));
    
    if (successElements.length > 0) {
      const successText = await successElements[0].getText();
      console.log(`  ✅ Success poruka: "${successText}"`);
    } else {
      console.log('  ⚠️  Success poruka nije pronađena (možda nema)');
    }

    // 7. PROVERI REZERVACIJE
    console.log('\n7️⃣  PROVERA DA LI JE REZERVACIJA KREIRANA');
    console.log('-'.repeat(60));
    
    await driver.get('http://localhost:4200/turista/rezervacije');
    await sleep(3000);
    
    // Proveri kartice ili tabelu
    const rezervacijeCards = await driver.findElements(By.css('.card, mat-card, .rezervacija-card'));
    const rezervacijeTable = await driver.findElements(By.css('table tbody tr'));
    
    const brojRezervacija = rezervacijeCards.length > 0 ? rezervacijeCards.length : rezervacijeTable.length;
    
    console.log(`  Pronađeno ${brojRezervacija} rezervacija`);
    
    if (brojRezervacija === 0) {
      throw new Error('❌❌❌ FAIL: Rezervacija NIJE KREIRANA! Stranica rezervacija je prazna!');
    }
    
    console.log('✅✅✅ REZERVACIJA JE USPEŠNO KREIRANA!');

    console.log('\n✅✅✅ TEST REZERVACIJE ZAVRŠEN - SVE RADI!');
    console.log('═'.repeat(60));

  } catch (error) {
    console.error('\n❌❌❌ TEST NIJE PROŠAO!');
    console.error('Greška:', error.message);
    
    // Screenshot
    try {
      const screenshot = await driver.takeScreenshot();
      require('fs').writeFileSync('screenshot-rezervacija-FAIL.png', screenshot, 'base64');
      console.log('💾 Screenshot: screenshot-rezervacija-FAIL.png');
    } catch (e) {}
    
    throw error;
  } finally {
    console.log('\n⏳ Zatvaram Chrome za 5 sekundi...');
    await sleep(5000);
    await driver.quit();
  }
}

runTest('Rezervacija', testRezervacija);
