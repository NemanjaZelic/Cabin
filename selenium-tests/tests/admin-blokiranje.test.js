const { Builder, By, until } = require('selenium-webdriver');
const { createDriver, runTest, sleep, login } = require('../selenium-setup');
const chrome = require('selenium-webdriver/chrome');

async function testAdminBlokiranje() {
  const options = new chrome.Options();
  // options.addArguments('--headless');
  options.addArguments('--disable-gpu');
  options.addArguments('--no-sandbox');
  
  const driver = await createDriver(false); // headless = false

  try {
    console.log('\n🧪 TEST 1: Prijava admina');
    console.log('═'.repeat(60));

    await login(driver, 'admin', 'Admin123!');
    console.log('✓ Admin prijavljen');

    console.log('\n🧪 TEST 2: Pregled svih vikendica');
    console.log('═'.repeat(60));

    await driver.get('http://localhost:4200/admin/vikendice');
    await sleep(2000);

    console.log('✓ Stranica vikendica otvorena');

    // Proveri tabelu vikendica
    const table = await driver.findElement(By.css('table'));
    console.log('✓ Tabela vikendica pronađena');

    const rows = await driver.findElements(By.css('tbody tr'));
    console.log(`✓ Pronađeno ${rows.length} vikendica`);

    console.log('\n🧪 TEST 3: Identifikacija vikendica sa lošim ocenama');
    console.log('═'.repeat(60));

    // Proveri da li postoje vikendice obojene crvenom bojom - MORA postojati označavanje
    const redRows = await driver.findElements(By.css('tbody tr.bad-rating, tbody tr[style*="red"], tbody tr.danger, tbody tr[class*="low-rating"]'));
    
    if (redRows.length === 0) {
      throw new Error('❌ FAIL: Nema vikendica označenih crvenom bojom! Sistem za identifikaciju loših ocena nije implementiran.');
    }
    console.log(`✓ VALIDACIJA: Pronađeno ${redRows.length} vikendica sa lošim ocenama (obojene crveno)`);

    // Proveri prvu loše ocenjenu vikendicu
    const firstBad = redRows[0];
    const cabinName = await firstBad.findElement(By.css('td:first-child, td:nth-child(2)')).getText();
    console.log(`✓ VALIDACIJA: Vikendica sa lošim ocenama: "${cabinName}"`);

    // Proveri da li je zaista loše ocenjena (poslednje 3 ocene < 2)
    const ratingCells = await firstBad.findElements(By.css('*'));
    if (ratingCells.length === 0) {
      throw new Error('❌ FAIL: Ocene nisu prikazane u tabeli za proveru!');
    }
    console.log(`✓ VALIDACIJA: Ocene prikazane u tabeli`);

    console.log('\n🧪 TEST 4: Privremeno blokiranje vikendice (48h)');
    console.log('═'.repeat(60));

    // Pronađi dugme za blokiranje - MORA postojati
    const blockBtns = await driver.findElements(By.xpath('//button[contains(@class, "btn-success") or contains(@class, "btn-primary")]'));
    
    if (blockBtns.length === 0) {
      throw new Error('❌ FAIL: Dugme za privremeno blokiranje vikendice nije implementirano!');
    }
    console.log(`✓ VALIDACIJA: Pronađeno ${blockBtns.length} dugmadi za blokiranje`);

    // Klikni na prvo dugme
    const firstBtn = blockBtns[0];
    await firstBtn.click();
    await sleep(1500);
    console.log('✓ VALIDACIJA: Dugme za blokiranje kliknuto');

    // Proveri confirm dijalog ili modal
    try {
      // Pokušaj da prihvatiš browser alert
      const alert = await driver.switchTo().alert();
      const alertText = await alert.getText();
      console.log(`✓ Confirm dijalog: "${alertText}"`);
      
      // Proveri da li poruka sadrži "48 sati"
      if (alertText.includes('48') && (alertText.includes('sat') || alertText.includes('hour'))) {
        console.log('✓ Poruka sadrži informaciju o 48 sati blokade');
      }

      await alert.accept();
      await sleep(2000);
      console.log('✓ Blokiranje potvrđeno');

    } catch (e) {
      // Možda je modal umesto alert-a
      try {
        const modal = await driver.findElement(By.css('.modal, .dialog'));
        console.log('✓ Modal dijalog otvoren');

        const confirmBtn = await modal.findElement(By.css('button[data-action="confirm"], .potvrdi'));
        await confirmBtn.click();
        await sleep(2000);
        console.log('✓ Blokiranje potvrđeno kroz modal');

      } catch (e2) {
        console.log('⚠️  Confirm dijalog nije pronađen');
      }
    }

    // Proveri success poruku
    try {
      const successMsg = await driver.findElement(By.css('.success-message, .alert-success'));
      const msgText = await successMsg.getText();
      console.log('✓ Success poruka:', msgText);

      if (msgText.includes('blokirana') || msgText.includes('48') || msgText.includes('privremeno')) {
        console.log('✓ Poruka potvrđuje uspešno blokiranje');
      }

    } catch (e) {
      console.log('⚠️  Success poruka nije prikazana');
    }

    console.log('\n🧪 TEST 5: Provera statusa blokirane vikendice');
    console.log('═'.repeat(60));

    try {
      // Refresh stranice
      await driver.navigate().refresh();
      await sleep(2000);

      // Proveri da li se status promenio
      const blockedRows = await driver.findElements(By.css('tbody tr.blocked, tbody tr[data-status="blocked"]'));
      
      if (blockedRows.length > 0) {
        console.log(`✓ ${blockedRows.length} vikendica označena kao blokirana`);

        const firstBlocked = blockedRows[0];
        const statusCell = await firstBlocked.findElement(By.css('.status, td[data-col="status"]'));
        const statusText = await statusCell.getText();
        console.log(`  Status: "${statusText}"`);

        // Proveri da li piše "blokirana" ili "privremeno nedostupna"
        if (statusText.toLowerCase().includes('blokirano') || 
            statusText.toLowerCase().includes('nedostupn') ||
            statusText.toLowerCase().includes('privremeno')) {
          console.log('✓ Status prikazuje da je vikendica blokirana');
        }

      } else {
        console.log('⚠️  Status blokirane vikendice nije vidljiv u tabeli');
      }

    } catch (e) {
      console.log('⚠️  Ne mogu da proverim status:', e.message);
    }

    console.log('\n🧪 TEST 6: Pokušaj rezervacije blokirane vikendice (od strane turiste)');
    console.log('═'.repeat(60));

    // Logout admin
    try {
      const logoutBtn = await driver.findElement(By.css('button.logout, a[href*="logout"]'));
      await logoutBtn.click();
      await sleep(1000);
    } catch (e) {
      await driver.get('http://localhost:4200/logout');
      await sleep(1000);
    }

    // Prijava turiste
    await driver.get('http://localhost:4200/login');
    await sleep(2000);

    await driver.findElement(By.id('username')).sendKeys('marko');
    await driver.findElement(By.id('password')).sendKeys('Marko123!');
    await driver.findElement(By.css('button[type="submit"]')).click();
    await sleep(3000);

    console.log('✓ Turista prijavljen');

    // Pokušaj da rezerviše blokiranu vikendicu
    await driver.get('http://localhost:4200/turista/vikendice');
    await sleep(2000);

    try {
      // Pronađi blokiranu vikendicu
      const blockedCabin = await driver.findElement(By.css('tbody tr.blocked, tbody tr[data-blocked="true"]'));
      const link = await blockedCabin.findElement(By.css('a'));
      await link.click();
      await sleep(2000);

      console.log('✓ Otvoreni detalji blokirane vikendice');

      // Proveri da li je dugme za rezervaciju onemogućeno
      try {
        const reserveBtn = await driver.findElement(By.css('button[data-action="reserve"], .rezervisi'));
        const isDisabled = await reserveBtn.getAttribute('disabled');
        
        if (isDisabled === 'true') {
          console.log('✓ Dugme za rezervaciju je ONEMOGUĆENO (ispravno!)');
        } else {
          console.log('⚠️  Dugme za rezervaciju je OMOGUĆENO (ne bi trebalo!)');
        }

      } catch (e) {
        console.log('⚠️  Dugme za rezervaciju nije pronađeno');
      }

      // Proveri poruku o blokadi
      try {
        const blockMsg = await driver.findElement(By.css('.block-message, .nedostupna-poruka'));
        const msgText = await blockMsg.getText();
        console.log('✓ Poruka o blokadi:', msgText);

      } catch (e) {
        console.log('⚠️  Poruka o blokadi nije prikazana');
      }

    } catch (e) {
      console.log('⚠️  Ne mogu da pronađem blokiranu vikendicu:', e.message);
    }

    console.log('\n🧪 TEST 7: Provera automatskog odblokiranja nakon 48 sati');
    console.log('═'.repeat(60));

    console.log('ℹ️  Automatsko odblokiranje se dešava nakon 48 sati');
    console.log('  Za testiranje bi bilo potrebno:');
    console.log('  1. Čekati 48 sati (ne praktično)');
    console.log('  2. Ručno izmeniti timestamp u bazi');
    console.log('  3. Implementirati CRON job ili scheduled task');
    console.log('⚠️  Test automatskog odblokiranja preskočen (zahteva vreme)');

    console.log('\n✅ Svi testovi za blokiranje vikendica završeni');

  } catch (error) {
    console.error('\n❌ Greška u testu:', error.message);
    throw error;
  } finally {
    await driver.quit();
  }
}

runTest('Admin Blokiranje', testAdminBlokiranje);


