const { Builder, By, until } = require('selenium-webdriver');
const { createDriver, runTest, sleep, login } = require('../selenium-setup');
const chrome = require('selenium-webdriver/chrome');

async function testKalendar() {
  const options = new chrome.Options();
  // options.addArguments('--headless');
  options.addArguments('--disable-gpu');
  options.addArguments('--no-sandbox');
  
  const driver = await createDriver(false); // headless = false

  try {
    console.log('\n🧪 TEST 1: Prijava vlasnika');
    console.log('═'.repeat(60));

    await login(driver, 'petar', 'Petar123!');
    console.log('✓ Vlasnik prijavljen');

    console.log('\n🧪 TEST 2: Navigacija na rezervacije');
    console.log('═'.repeat(60));

    await driver.get('http://localhost:4200/vlasnik/rezervacije');
    await sleep(3000); // Duže čekanje za FullCalendar

    console.log('✓ Stranica rezervacija otvorena');

    console.log('\n🧪 TEST 3: Provera kalendara (FullCalendar)');
    console.log('═'.repeat(60));

    // Proveri da li postoji FullCalendar
    let calendarFound = false;
    const calendarSelectors = [
      '.fc',
      '.full-calendar',
      '.calendar-container',
      '#calendar',
      '[data-calendar]',
      '.fc-view',
      'full-calendar'
    ];

    for (let selector of calendarSelectors) {
      try {
        const calendar = await driver.findElement(By.css(selector));
        console.log(`✓ Kalendar pronađen: ${selector}`);
        calendarFound = true;

        // Proveri dimenzije
        const size = await calendar.getRect();
        console.log(`  Dimenzije: ${size.width}x${size.height}px`);

        break;
      } catch (e) {
        // Nastavi
      }
    }

    if (!calendarFound) {
      throw new Error('❌ FAIL: Kalendar (FullCalendar) NIJE implementiran! Potrebno dodati FullCalendar komponentu.');
    }
    console.log('✓ VALIDACIJA: FullCalendar komponenta detektovana');

    console.log('\n🧪 TEST 4: Provera prikaza rezervacija u kalendaru');
    console.log('═'.repeat(60));

    // Proveri da li postoje eventi u kalendaru
    const events = await driver.findElements(By.css('.fc-event, .fc-event-main, .calendar-event'));
    
    if (events.length === 0) {
      throw new Error('❌ FAIL: Nema događaja u kalendaru! Rezervacije se ne prikazuju kao eventi.');
    }
    console.log(`✓ VALIDACIJA: Pronađeno ${events.length} događaja u kalendaru`);

    // Proveri prvi događaj
    const firstEvent = events[0];
    const eventText = await firstEvent.getText();
    console.log(`  Prvi događaj: "${eventText}"`);

    // Proveri boju događaja
    const bgColor = await firstEvent.getCssValue('background-color');
    console.log(`  Boja: ${bgColor}`);

    // Proveri da li ima različite boje za različite statuse
    const colors = new Set();
    for (let i = 0; i < Math.min(events.length, 10); i++) {
      const color = await events[i].getCssValue('background-color');
      colors.add(color);
    }

    if (colors.size < 2) {
      throw new Error('❌ FAIL: Svi događaji imaju istu boju! Potrebno bojiti različite statuse različito (žuta=na čekanju, zelena=prihvaćeno).');
    }
    console.log(`✓ VALIDACIJA: Različite boje za različite statuse (${colors.size} boje detektovane)`);

      console.log('\n🧪 TEST 5: Provera boja za statuse rezervacija');
      console.log('═'.repeat(60));

      // Mora postojati razlika u bojama prema statusu
      // Zahtev: Žuta - na čekanju, Zelena - prihvaćena
      const eventColors = [];
      for (let i = 0; i < Math.min(events.length, 10); i++) {
        const color = await events[i].getCssValue('background-color');
        eventColors.push(color);
      }

      const hasYellow = eventColors.some(c => 
        c.includes('255, 255, 0') || c.includes('yellow') || 
        c.includes('255, 193, 7') || // amber/warning color
        c.includes('252, 196, 25')
      );
      
      const hasGreen = eventColors.some(c => 
        c.includes('0, 255, 0') || c.includes('green') || 
        c.includes('76, 175, 80') || // success green
        c.includes('40, 167, 69')
      );

      if (!hasYellow && !hasGreen) {
        throw new Error('❌ FAIL: Boje za statuse nisu ispravne! Potrebno: žuta za "na čekanju", zelena za "prihvaćeno".');
      }
      console.log(`✓ VALIDACIJA: Ispravne boje detektovane (${hasYellow ? 'žuta' : ''} ${hasGreen ? 'zelena' : ''})`);

      console.log('\n🧪 TEST 6: Klik na događaj u kalendaru');
      console.log('═'.repeat(60));

      const eventToClick = events[0];
      await eventToClick.click();
      await sleep(2000);

      // Mora se otvoriti modal/dialog sa detaljima
      const modal = await driver.findElement(By.css('.modal, .dialog, mat-dialog-container, .event-details'));
      console.log('✓ VALIDACIJA: Modal/dialog sa detaljima otvoren nakon klika');

      // Proveri da li modal ima dugmad za odobravanje/odbijanje
      const approveBtn = await driver.findElement(By.xpath('//button[@data-action="approve" or contains(text(), "Odobri") or contains(text(), "Prihvati")]'));
      const rejectBtn = await driver.findElement(By.xpath('//button[@data-action="reject" or contains(text(), "Odbij") or contains(text(), "Odbaci")]'));
      
      console.log('✓ VALIDACIJA: Dugmad za odobravanje i odbijanje prisutna');

      // Zatvori modal
      try {
        const closeBtn = await driver.findElement(By.css('.close, button[mat-dialog-close], .modal-close'));
        await closeBtn.click();
        await sleep(500);
      } catch (e) {
        // Možda ESC radi
        await driver.actions().sendKeys('\uE00C').perform();
        await sleep(500);
      }

      console.log('\n🧪 TEST 7: Navigacija kroz mesece u kalendaru');
      console.log('═'.repeat(60));

      // Proveri dugmad za prethodni/sledeći mesec
      const nextBtn = await driver.findElement(By.css('.fc-next-button, button[title*="Next"], .next-month'));
      const prevBtn = await driver.findElement(By.css('.fc-prev-button, button[title*="Prev"], .prev-month'));
      
      console.log('✓ Dugmad za navigaciju pronađena');

      // Klikni na sledeći mesec
      const currentMonth = await driver.findElement(By.css('.fc-toolbar-title, .fc-header-toolbar h2, .calendar-title')).getText();
      console.log(`  Trenutni mesec: ${currentMonth}`);

      await nextBtn.click();
      await sleep(1000);

      const newMonth = await driver.findElement(By.css('.fc-toolbar-title, .fc-header-toolbar h2, .calendar-title')).getText();
      console.log(`  Sledeći mesec: ${newMonth}`);

      if (currentMonth === newMonth) {
        throw new Error('❌ FAIL: Navigacija kroz mesece ne radi - mesec se nije promenio!');
      }
      console.log('✓ VALIDACIJA: Navigacija kroz mesece funkcioniše');

      // Vrati se nazad
      await prevBtn.click();
      await sleep(1000);

      console.log('\n🧪 TEST 8: Provera različitih prikaza (mesec/nedelja/dan)');
      console.log('═'.repeat(60));

      // Proveri dugmad za različite prikaze
      const monthBtn = await driver.findElement(By.css('.fc-dayGridMonth-button, button[title*="month"], .view-month'));
      const weekBtn = await driver.findElement(By.css('.fc-timeGridWeek-button, button[title*="week"], .view-week'));
      const dayBtn = await driver.findElement(By.css('.fc-timeGridDay-button, button[title*="day"], .view-day'));

      console.log('✓ Dugmad za različite prikaze pronađena');

      // Prebaci na nedelju
      await weekBtn.click();
      await sleep(1000);
      console.log('✓ VALIDACIJA: Prikaz nedelje');

      // Prebaci na dan
      await dayBtn.click();
      await sleep(1000);
      console.log('✓ VALIDACIJA: Prikaz dana');

      // Vrati na mesec
      await monthBtn.click();
      await sleep(1000);
      console.log('✓ VALIDACIJA: Nazad na mesečni prikaz');

    console.log('\n✅ Svi testovi za kalendar PROŠLI - funkcionalnost je POTPUNO implementirana!');

  } catch (error) {
    console.error('\n❌ Greška u testu:', error.message);
    throw error;
  } finally {
    await driver.quit();
  }
}

runTest('Kalendar', testKalendar);


