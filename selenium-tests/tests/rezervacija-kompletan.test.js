const { By, until } = require('selenium-webdriver');
const { createDriver, runTest, sleep } = require('../selenium-setup');

async function testRezervacija(driver) {
  // PRIJAVA
  await driver.get('http://localhost:4200/prijava');
  await sleep(1000);
  
  await driver.findElement(By.id('korisnickoIme')).sendKeys('marko');
  await driver.findElement(By.id('lozinka')).sendKeys('Marko123!');
  await driver.findElement(By.css('button[type="submit"]')).click();
  await sleep(3000);
  
  const currentUrl = await driver.getCurrentUrl();
  if (!currentUrl.includes('/turista')) {
    throw new Error('Turista nije prijavljen - nije preusmerен na /turista');
  }
  console.log('✓ Turista prijavljen');
  
  // PREGLED VIKENDICA
  await driver.get('http://localhost:4200/turista/vikendice');
  await sleep(2000);
  console.log('✓ Otvoren pregled vikendica');
  
  // Traži kartice ili tabelu
  const cards = await driver.findElements(By.css('.card, mat-card, .vikendica-card'));
  if (cards.length === 0) {
    throw new Error('Nema vikendica u sistemu - ni kartice ni tabela nisu pronađeni');
  }
  console.log(`✓ Pronađeno ${cards.length} vikendica`);
  
  // Pronađi dugme za detalje
  const firstCard = cards[0];
  const detaljButtons = await firstCard.findElements(By.css('button, a'));
  
  let clicked = false;
  for (const btn of detaljButtons) {
    const text = (await btn.getText()).toLowerCase();
    if (text.includes('detalj') || text.includes('pogledaj') || text.includes('više')) {
      await btn.click();
      clicked = true;
      break;
    }
  }
  
  if (!clicked) {
    throw new Error('Dugme za detalje vikendice nije pronađeno u kartici');
  }
  
  await sleep(3000);
  console.log('✓ Otvoren detalj vikendice');
  
  // Pronađi dugme "Rezerviši"
  const allButtons = await driver.findElements(By.css('button'));
  let rezervisiButton = null;
  
  for (const btn of allButtons) {
    const text = (await btn.getText()).toLowerCase();
    if (text.includes('rezerv') || text.includes('zakaž') || text.includes('book')) {
      rezervisiButton = btn;
      break;
    }
  }
  
  if (!rezervisiButton) {
    throw new Error('Dugme "Rezerviši" nije pronađeno na stranici detalja');
  }
  
  await rezervisiButton.click();
  await sleep(2000);
  console.log('✓ Kliknuto na dugme Rezerviši');
  
  // POPUNJAVANJE FORME
  console.log('\n--- Unos datuma i broja osoba ---');
  
  const dateInputs = await driver.findElements(By.css('input[type="date"]'));
  if (dateInputs.length < 2) {
    throw new Error(`Nedostaju input polja za datume - pronađeno ${dateInputs.length}, očekivano 2`);
  }
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 7);
  const datumOd = tomorrow.toISOString().split('T')[0];
  
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 14);
  const datumDo = nextWeek.toISOString().split('T')[0];
  
  await dateInputs[0].clear();
  await dateInputs[0].sendKeys(datumOd);
  console.log(`✓ Datum od: ${datumOd}`);
  
  await dateInputs[1].clear();
  await dateInputs[1].sendKeys(datumDo);
  console.log(`✓ Datum do: ${datumDo}`);
  
  // Broj osoba (ako postoje polja)
  const numberInputs = await driver.findElements(By.css('input[type="number"]'));
  if (numberInputs.length >= 1) {
    await numberInputs[0].clear();
    await numberInputs[0].sendKeys('2');
    console.log('✓ Broj odraslih: 2');
  }
  if (numberInputs.length >= 2) {
    await numberInputs[1].clear();
    await numberInputs[1].sendKeys('1');
    console.log('✓ Broj dece: 1');
  }
  
  await sleep(1000);
  
  // Pronađi submit dugme
  const submitButtons = await driver.findElements(By.css('button[type="submit"]'));
  if (submitButtons.length === 0) {
    throw new Error('Submit dugme nije pronađeno u formi');
  }
  
  // Probaj da pronađeš pravo submit dugme (ne "Odjava")
  let submitButton = null;
  for (const btn of submitButtons) {
    const text = (await btn.getText()).toLowerCase();
    if (!text.includes('odjav')) {
      submitButton = btn;
      break;
    }
  }
  
  if (!submitButton && submitButtons.length > 0) {
    submitButton = submitButtons[submitButtons.length - 1]; // Uzmi poslednje
  }
  
  await submitButton.click();
  await sleep(3000);
  console.log('✓ Forma submitovana');
  
  // Proveri da li ima greške
  const errors = await driver.findElements(By.css('.error, .alert-danger, [class*="greška"]'));
  if (errors.length > 0) {
    const errorText = await errors[0].getText();
    throw new Error(`Greška pri rezervaciji: ${errorText}`);
  }
  
  // PROVERA REZERVACIJE
  console.log('\n--- Provera da li je rezervacija kreirana ---');
  await driver.get('http://localhost:4200/turista/rezervacije');
  await sleep(2000);
  
  const rezervacijeCards = await driver.findElements(By.css('.card, mat-card, .rezervacija-card, tbody tr'));
  console.log(`  Pronađeno ${rezervacijeCards.length} rezervacija`);
  
  if (rezervacijeCards.length === 0) {
    throw new Error('❌❌❌ FAIL: Rezervacija NIJE KREIRANA! Stranica rezervacija je prazna!');
  }
  
  console.log('✅ Rezervacija uspešno kreirana');
}

// Pokreni test
runTest('Kompletna rezervacija vikendice', testRezervacija)
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
