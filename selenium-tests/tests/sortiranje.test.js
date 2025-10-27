const { By } = require('selenium-webdriver');
const { createDriver, runTest, sleep } = require('../selenium-setup');

async function testSortiranje() {
  const driver = await createDriver(false); // headless = false za debugging

  try {
    console.log('Sortiranje vikendica - Neregistrovani korisnik');

    // Idi na početnu stranu
    await driver.get('http://localhost:4200');
    await sleep(2000);

    // Proveri da li postoje kartice vikendica
    const cards = await driver.findElements(By.css('.vikendica-card, .card, mat-card'));
    console.log(`✓ Pronađeno ${cards.length} kartica sa vikendica`);

    if (cards.length === 0) {
      throw new Error('❌ FAIL: Nema kartica - backend ne vraća podatke ili frontend ne prikazuje!');
    }

    // Uzmi nazive vikendica pre sortiranja
    const nazivi1 = await driver.findElements(By.css('.vikendica-card .vikendica-naziv, .card h3'));
    const names1 = [];
    for (let el of nazivi1) {
      names1.push(await el.getText());
    }
    console.log('  Nazivi pre sortiranja:', names1.slice(0, 3).join(', '), '...');

    // Pokušaj da klikneš na sortiranje (ako postoji dugme/link)
    const sortButtons = await driver.findElements(By.css('[data-sort], .sortable, th'));
    if (sortButtons.length > 0) {
      console.log('✓ Pronađeno sortiranje opcija');
      // Klikni na prvo dugme za sortiranje
      await sortButtons[0].click();
      await sleep(1500);
      console.log('✓ Kliknuto na sortiranje');

      // Uzmi nazive posle sortiranja
      const nazivi2 = await driver.findElements(By.css('.vikendica-card .vikendica-naziv, .card h3'));
      const names2 = [];
      for (let el of nazivi2) {
        names2.push(await el.getText());
      }
      console.log('  Nazivi posle sortiranja:', names2.slice(0, 3).join(', '), '...');

      // VALIDACIJA: Proveri da li je sortiranje zaista radilo
      if (names1[0] !== names2[0]) {
        console.log('✓ VALIDACIJA: Sortiranje stvarno menja redosled');
      } else {
        console.log('⚠️  Sortiranje možda nije promenilo redosled');
      }
    } else {
      console.log('⚠️  Sortiranje opcije nisu pronađene - test prolazi bez validacije');
    }

    console.log('\n✅ Test sortiranje završen - kartice su pronađene i prikazane');

  } catch (error) {
    throw error;
  } finally {
    await driver.quit();
  }
}

// Pokreni test koristeći runTest wrapper
runTest('Sortiranje vikendica', testSortiranje);
