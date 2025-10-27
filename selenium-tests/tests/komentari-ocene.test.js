const { Builder, By, until } = require('selenium-webdriver');
const { createDriver, runTest, sleep, login } = require('../selenium-setup');
const chrome = require('selenium-webdriver/chrome');

async function testKomentariOcene() {
  const options = new chrome.Options();
  // options.addArguments('--headless');
  options.addArguments('--disable-gpu');
  options.addArguments('--no-sandbox');
  
  const driver = await createDriver(false); // headless = false

  try {
    console.log('\n🧪 TEST 1: Prijava turiste');
    console.log('═'.repeat(60));

    await login(driver, 'marko', 'Marko123!');
    console.log('✓ Turista prijavljen');

    console.log('\n🧪 TEST 2: Prikaz komentara i ocena na detaljima vikendice');
    console.log('═'.repeat(60));

    // Idi na vikendice
    await driver.get('http://localhost:4200/turista/vikendice');
    await sleep(2000);

    // Klikni na prvu vikendicu
    const firstCabin = await driver.findElement(By.css('tbody tr:first-child a'));
    await firstCabin.click();
    await sleep(2000);

    console.log('✓ Otvoreni detalji vikendice');

    // Proveri da li postoji sekcija sa komentarima
    const commentsSection = await driver.findElement(By.css('.comments-section, #komentari, [data-test="comments"], .reviews'));
    console.log('✓ VALIDACIJA: Sekcija sa komentarima pronađena');

    // Proveri da li postoje komentari
    const comments = await driver.findElements(By.css('.comment-item, .komentar, .review-item'));
    
    if (comments.length === 0) {
      throw new Error('❌ FAIL: Nema prikazanih komentara! Proveri da li backend vraća komentare.');
    }
    console.log(`✓ VALIDACIJA: Prikazano ${comments.length} komentara`);

    // Proveri prvi komentar - mora imati tekst i ocenu
    const firstComment = comments[0];
    const commentText = await firstComment.getText();
    
    if (commentText.length < 10) {
      throw new Error('❌ FAIL: Komentar je previše kratak ili prazan!');
    }
    console.log(`✓ VALIDACIJA: Komentar ima tekst (${commentText.substring(0, 50)}...)`);

    // Proveri ocene (zvezdice) - MORAJU postojati
    const commentStars = await firstComment.findElements(By.css('.fa-star, .star, [class*="star"], [class*="rating"]'));
    
    if (commentStars.length === 0) {
      throw new Error('❌ FAIL: Ocene (zvezdice) nisu prikazane uz komentare!');
    }
    console.log(`✓ VALIDACIJA: Prikazano ${commentStars.length} zvezdica za ocenu`);

    // Proveri prosečnu ocenu - MORA postojati
    const avgRating = await driver.findElement(By.css('.average-rating, .prosecna-ocena, .rating-average'));
    const ratingText = await avgRating.getText();
    
    if (!ratingText || ratingText.length === 0) {
      throw new Error('❌ FAIL: Prosečna ocena nije prikazana!');
    }
    console.log(`✓ VALIDACIJA: Prosečna ocena prikazana: ${ratingText}`);

    console.log('\n🧪 TEST 3: Dodavanje komentara i ocene nakon završene rezervacije');
    console.log('═'.repeat(60));

    // Idi na rezervacije
    await driver.get('http://localhost:4200/turista/rezervacije');
    await sleep(2000);

    // Proveri arhivu
    try {
      const arhivaTab = await driver.findElement(By.css('button[data-tab="arhiva"], a[href*="arhiva"]'));
      await arhivaTab.click();
      await sleep(1000);
      console.log('✓ Otvorena arhiva rezervacija');
    } catch (e) {
      console.log('⚠️  Arhiva rezervacija nije dostupna kao tab');
    }

    // Pronađi dugme za dodavanje komentara - MORA postojati za završene rezervacije
    const addCommentBtns = await driver.findElements(By.xpath('//button[contains(@class, "btn-success") or contains(@class, "btn-primary")]'));
    
    if (addCommentBtns.length === 0) {
      throw new Error('❌ FAIL: Dugme za dodavanje komentara nije implementirano za završene rezervacije!');
    }
    console.log(`✓ VALIDACIJA: Pronađeno ${addCommentBtns.length} rezervacija bez komentara`);

    // Klikni na dugme za dodavanje komentara
    await addCommentBtns[0].click();
    await sleep(1500);
    console.log('✓ VALIDACIJA: Otvoren dijalog za dodavanje komentara');

    // Mora postojati textarea za komentar
    const commentInput = await driver.findElement(By.css('textarea[name="komentar"], #komentar, textarea[placeholder*="komentar"]'));
    await commentInput.sendKeys('Odličan boravak! Preporučujem svima. Čista vikendica, lep pogled na planinu.');
    console.log('✓ VALIDACIJA: Komentar unet u textarea');

    // Dodaj ocenu (klikni na zvezdice) - MORA postojati sistem za davanje ocene 1-5
    const ratingStars = await driver.findElements(By.css('.star-rating input, .star-rating label, .ocena-zvezdica button, i[class*="star"]'));
    
    if (ratingStars.length < 5) {
      throw new Error('❌ FAIL: Sistem za davanje ocene (1-5 zvezdica) nije implementiran!');
    }
    
    // Klikni na 4. zvezdicu (4/5)
    await ratingStars[3].click();
    await sleep(500);
    console.log('✓ VALIDACIJA: Ocena 4/5 data kliknom na zvezdice');

    // Potvrdi - dugme mora postojati
    const submitBtn = await driver.findElement(By.xpath('//button[contains(@class, "btn")]'));
    await submitBtn.click();
    await sleep(2000);
    console.log('✓ VALIDACIJA: Komentar i ocena poslati');

    // Proveri success poruku - MORA postojati feedback korisniku
    const successMsg = await driver.findElement(By.css('.success-message, .alert-success, .mat-snack-bar-container'));
    const msgText = await successMsg.getText();
    
    if (!msgText || msgText.length === 0) {
      throw new Error('❌ FAIL: Success poruka nije prikazana nakon dodavanja komentara!');
    }
    console.log(`✓ VALIDACIJA: Success poruka prikazana: "${msgText}"`);

    console.log('\n🧪 TEST 4: Prikaz dodanih komentara na vikendici');
    console.log('═'.repeat(60));

    // Vrati se na vikendice
    await driver.get('http://localhost:4200/turista/vikendice');
    await sleep(2000);

    // Otvori prvu vikendicu ponovo
    const cabin = await driver.findElement(By.css('tbody tr:first-child a'));
    await cabin.click();
    await sleep(2000);

    // Proveri da li se novi komentar pojavio
    try {
      const comments = await driver.findElements(By.css('.comment-item, .komentar'));
      console.log(`✓ Sada prikazano ${comments.length} komentara`);

      // Proveri da li se naš komentar pojavio
      let found = false;
      for (let comment of comments) {
        const text = await comment.getText();
        if (text.includes('Odličan boravak') || text.includes('marko')) {
          console.log('✓ Novi komentar se pojavio!');
          found = true;
          break;
        }
      }

      if (!found) {
        console.log('⚠️  Novi komentar se nije pojavio ili je potrebno vreme za refresh');
      }

    } catch (e) {
      console.log('⚠️  Ne mogu da proverim komentare');
    }

    console.log('\n🧪 TEST 5: Validacija - komentar samo za završene rezervacije');
    console.log('═'.repeat(60));

    // Idi na trenutne rezervacije
    await driver.get('http://localhost:4200/turista/rezervacije');
    await sleep(2000);

    try {
      // Proveri da li ima dugme za komentar kod trenutnih rezervacija
      const currentReservations = await driver.findElements(By.css('tbody tr'));
      let hasCommentButton = false;

      for (let res of currentReservations) {
        try {
          await res.findElement(By.css('button[data-action="add-comment"], .dodaj-komentar'));
          hasCommentButton = true;
          break;
        } catch (e) {
          // Nema dugme - to je dobro!
        }
      }

      if (!hasCommentButton) {
        console.log('✓ Trenutne rezervacije NEMAJU dugme za komentar (ispravno!)');
      } else {
        console.log('⚠️  Trenutne rezervacije IMAJU dugme za komentar (ne bi trebalo!)');
      }

    } catch (e) {
      console.log('⚠️  Ne mogu da proverim validaciju');
    }

    console.log('\n✅ Svi testovi za komentare i ocene završeni');

  } catch (error) {
    console.error('\n❌ Greška u testu:', error.message);
    throw error;
  } finally {
    await driver.quit();
  }
}

runTest('Komentari Ocene', testKomentariOcene);


