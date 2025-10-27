const { Builder, By, until } = require('selenium-webdriver');
const { createDriver, runTest, sleep } = require('../selenium-setup');
const chrome = require('selenium-webdriver/chrome');

async function testSortiranje() {
  const options = new chrome.Options();
  // NE KORISTIMO HEADLESS - ŽELIMO DA VIDIMO ŠTO SE DEŠAVA!
  options.addArguments('--disable-gpu');
  options.addArguments('--no-sandbox');
  options.addArguments('--start-maximized');
  
  const driver = await createDriver(false); // headless = false

  try {
    console.log('\n🧪 PRAVI TEST: Sortiranje vikendica');
    console.log('═'.repeat(60));

    await driver.get('http://localhost:4200');
    await sleep(3000);
    console.log('✓ Otvorena početna strana');

    // DIJAGNOSTIKA: Šta ima na stranici?
    console.log('\n🔍 DIJAGNOSTIKA: Šta je na početnoj strani?');
    
    // 1. Proveri kartice (NE TABELE!)
    const cards = await driver.findElements(By.css('.card, mat-card, .vikendica-card'));
    console.log(`  Pronađeno ${cards.length} kartica sa vikendica`);
    
    if (cards.length === 0) {
      // Pokušaj pronaći tabelu
      const tables = await driver.findElements(By.css('table'));
      if (tables.length > 0) {
        console.log(`  ⚠️  Našao sam ${tables.length} tabela umesto kartica!`);
        throw new Error('❌ FAIL: Aplikacija koristi tabele, ali test očekuje kartice! Prepravi frontend ili test.');
      } else {
        throw new Error('❌ FAIL: Nema NI kartica NI tabela sa vikendica! Backend ne vraća podatke ili frontend ne prikazuje ništa.');
      }
    }

    console.log(`✅ VALIDACIJA: Pronađeno ${cards.length} kartica sa vikendica`);

    // 2. Proveri da li ima search/filter opcije
    console.log('\n🔍 Provera SEARCH/FILTER funkcionalnosti...');
    
    const searchInputs = await driver.findElements(By.css('input[type="text"], input[placeholder*="Pretraž"], input[name*="search"]'));
    console.log(`  Pronađeno ${searchInputs.length} search polja`);
    
    if (searchInputs.length === 0) {
      console.log('⚠️  UPOZORENJE: Nema search polja za pretragu vikendica');
    }

    // 3. Proveri sortiranje - dropdown ili buttons
    console.log('\n🔍 Provera SORTIRANJE funkcionalnosti...');
    
    const sortDropdowns = await driver.findElements(By.css('select[name*="sort"], select#sort, .sort-select'));
    const sortButtons = await driver.findElements(By.xpath('//button[contains(@class, "btn-success") or contains(@class, "btn-primary")]'));
    
    console.log(`  Pronađeno ${sortDropdowns.length} sort dropdown-a`);
    console.log(`  Pronađeno ${sortButtons.length} sort dugmadi`);
    
    if (sortDropdowns.length === 0 && sortButtons.length === 0) {
      throw new Error('❌ FAIL: Sortiranje NIJE implementirano! Nema ni dropdown ni dugmadi za sortiranje.');
    }

    // 4. Testiraj sortiranje (ako postoji dropdown)
    if (sortDropdowns.length > 0) {
      console.log('\n📝 TEST: Sortiranje pomoću dropdown-a');
      
      const sortSelect = sortDropdowns[0];
      const options = await sortSelect.findElements(By.tagName('option'));
      console.log(`  Dropdown ima ${options.length} opcija`);
      
      for (let i = 0; i < Math.min(options.length, 3); i++) {
        const text = await options[i].getText();
        const value = await options[i].getAttribute('value');
        console.log(`    Opcija ${i + 1}: "${text}" (value="${value}")`);
      }
      
      // Pročitaj nazive PRIJE sortiranja
      const cardTitlesBefore = [];
      for (let i = 0; i < Math.min(cards.length, 5); i++) {
        const titleEl = await cards[i].findElement(By.css('h5, h4, h3, .card-title, .vikendica-naziv'));
        const title = await titleEl.getText();
        cardTitlesBefore.push(title);
      }
      console.log(`\n  Nazivi PRIJE sortiranja:`, cardTitlesBefore);
      
      // Izaberi drugu opciju (prva je obično default)
      if (options.length > 1) {
        await options[1].click();
        await sleep(2000);
        console.log('  ✓ Promenjena sort opcija');
        
        // Pročitaj nazive POSLE sortiranja
        const cardsAfter = await driver.findElements(By.css('.card, mat-card, .vikendica-card'));
        const cardTitlesAfter = [];
        for (let i = 0; i < Math.min(cardsAfter.length, 5); i++) {
          const titleEl = await cardsAfter[i].findElement(By.css('h5, h4, h3, .card-title, .vikendica-naziv'));
          const title = await titleEl.getText();
          cardTitlesAfter.push(title);
        }
        console.log(`  Nazivi POSLE sortiranja:`, cardTitlesAfter);
        
        // VALIDACIJA: Proveri da li se redosled promenio
        const isti = JSON.stringify(cardTitlesBefore) === JSON.stringify(cardTitlesAfter);
        if (isti) {
          throw new Error('❌ FAIL: Sortiranje NE RADI! Redosled je isti pre i posle sortiranja.');
        }
        
        console.log('✅ VALIDACIJA: Sortiranje RADI - redosled se promenio!');
      }
    }

    // 5. Testiraj search (ako postoji)
    if (searchInputs.length > 0) {
      console.log('\n📝 TEST: Search funkcionalnost');
      
      const searchInput = searchInputs[0];
      await searchInput.clear();
      await searchInput.sendKeys('Kopaonik');
      await sleep(1000);
      
      // Pritisni Enter ili klikni search button
    const searchButtons = await driver.findElements(By.xpath('//button[contains(@class, "btn-success") or contains(@class, "btn-primary")]'));
      if (searchButtons.length > 0) {
        await searchButtons[0].click();
      } else {
        await searchInput.sendKeys('\n'); // Enter
      }
      
      await sleep(2000);
      console.log('  ✓ Search izvršen za "Kopaonik"');
      
      // Proveri rezultate
      const cardsAfterSearch = await driver.findElements(By.css('.card, mat-card, .vikendica-card'));
      console.log(`  Rezultati: ${cardsAfterSearch.length} vikendica`);
      
      if (cardsAfterSearch.length === 0) {
        console.log('  ⚠️  Search vratio 0 rezultata - možda nema vikendice sa tim imenom ili search ne radi');
      } else {
        // Proveri da li rezultat sadrži "Kopaonik"
        const firstTitle = await cardsAfterSearch[0].findElement(By.css('h5, h4, h3, .card-title')).getText();
        if (firstTitle.includes('Kopaonik')) {
          console.log(`  ✅ VALIDACIJA: Search radi - pronađena vikendica "${firstTitle}"`);
        } else {
          console.log(`  ⚠️  UPOZORENJE: Search možda ne radi pravilno - prva vikendica je "${firstTitle}" (ne sadrži "Kopaonik")`);
        }
      }
    }

    console.log('\n✅✅✅ TEST SORTIRANJA ZAVRŠEN');
    console.log('═'.repeat(60));

  } catch (error) {
    console.error('\n❌❌❌ TEST NIJE PROŠAO!');
    console.error('Greška:', error.message);
    console.error('\n📸 Screenshot je sačuvan da vidiš šta je pošlo po zlu.');
    
    // Napravi screenshot
    try {
      const screenshot = await driver.takeScreenshot();
      require('fs').writeFileSync('screenshot-sortiranje-FAIL.png', screenshot, 'base64');
      console.log('💾 Screenshot: screenshot-sortiranje-FAIL.png');
    } catch (e) {}
    
    throw error;
  } finally {
    console.log('\n⏳ Zatvaram Chrome za 5 sekundi...');
    await sleep(5000); // Daj vremena da vidiš šta je na ekranu
    await driver.quit();
  }
}

// Pokreni test
runTest('Sortiranje', testSortiranje);
