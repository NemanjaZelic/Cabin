const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function dijagnostikaFrontend() {
  const options = new chrome.Options();
  options.addArguments('--disable-gpu');
  options.addArguments('--no-sandbox');
  
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    console.log('\n🔍 DIJAGNOSTIKA FRONTEND APLIKACIJE\n');
    console.log('═'.repeat(80));

    // 1. PRIJAVA
    console.log('\n1️⃣  TEST PRIJAVE');
    console.log('-'.repeat(80));
    
    await driver.get('http://localhost:4200');
    await sleep(2000);
    
    console.log('Trenutna URL:', await driver.getCurrentUrl());
    console.log('Naslov stranice:', await driver.getTitle());
    
    // Pronađi sve linkove na početnoj strani
    const links = await driver.findElements(By.tagName('a'));
    console.log(`\nPronađeno ${links.length} linkova na početnoj strani:`);
    for (let i = 0; i < Math.min(links.length, 10); i++) {
      const text = await links[i].getText();
      const href = await links[i].getAttribute('href');
      if (text && text.trim()) {
        console.log(`  - "${text}" → ${href}`);
      }
    }

    // Pronađi login formu
    console.log('\n📝 Tražim login formu...');
    const loginLinks = [];
    for (const link of links) {
      const text = await link.getText();
      const href = await link.getAttribute('href');
      if (text.toLowerCase().includes('prijav') || 
          text.toLowerCase().includes('login') ||
          href.includes('login') ||
          href.includes('prijava')) {
        loginLinks.push({ text, href });
      }
    }
    
    if (loginLinks.length > 0) {
      console.log('✅ Pronađeni linkovi za prijavu:');
      loginLinks.forEach(l => console.log(`  - "${l.text}" → ${l.href}`));
      
      // Idi na login
      await driver.get(loginLinks[0].href);
      await sleep(2000);
      console.log('\n✅ Otvorena stranica za prijavu');
    } else {
      console.log('❌ NIJE pronađen link za prijavu!');
      
      // Probaj direktno
      await driver.get('http://localhost:4200/login');
      await sleep(2000);
      console.log('Probam direktno http://localhost:4200/login');
    }

    // Analiziraj login formu
    console.log('\n📋 Analiza login forme:');
    const inputs = await driver.findElements(By.tagName('input'));
    console.log(`Pronađeno ${inputs.length} input polja:`);
    
    for (let i = 0; i < inputs.length; i++) {
      const type = await inputs[i].getAttribute('type');
      const name = await inputs[i].getAttribute('name');
      const id = await inputs[i].getAttribute('id');
      const placeholder = await inputs[i].getAttribute('placeholder');
      const formControlName = await inputs[i].getAttribute('formcontrolname');
      
      console.log(`  Input ${i + 1}:`);
      console.log(`    type="${type}"`);
      console.log(`    id="${id}"`);
      console.log(`    name="${name}"`);
      console.log(`    formControlName="${formControlName}"`);
      console.log(`    placeholder="${placeholder}"`);
    }

    // Proveri dugmad
    const buttons = await driver.findElements(By.tagName('button'));
    console.log(`\nPronađeno ${buttons.length} dugmadi:`);
    for (let i = 0; i < buttons.length; i++) {
      const text = await buttons[i].getText();
      const type = await buttons[i].getAttribute('type');
      const className = await buttons[i].getAttribute('class');
      console.log(`  Button ${i + 1}: "${text}" (type="${type}", class="${className}")`);
    }

    // 2. POKUŠAJ PRIJAVE
    console.log('\n\n2️⃣  POKUŠAJ PRIJAVE KAO TURISTA');
    console.log('-'.repeat(80));
    
    // Pokušaj naći username/email polje
    let usernameInput = null;
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const name = await input.getAttribute('name');
      const formControlName = await input.getAttribute('formcontrolname');
      const placeholder = (await input.getAttribute('placeholder') || '').toLowerCase();
      
      if (id === 'username' || id === 'korisnickoIme' || id === 'email' ||
          name === 'username' || name === 'korisnickoIme' ||
          formControlName === 'username' || formControlName === 'korisnickoIme' ||
          placeholder.includes('korisni') || placeholder.includes('username') || placeholder.includes('email')) {
        usernameInput = input;
        console.log('✅ Pronađeno korisničko ime polje');
        break;
      }
    }

    // Pokušaj naći password polje
    let passwordInput = null;
    for (const input of inputs) {
      const type = await input.getAttribute('type');
      if (type === 'password') {
        passwordInput = input;
        console.log('✅ Pronađeno lozinka polje');
        break;
      }
    }

    if (usernameInput && passwordInput) {
      await usernameInput.clear();
      await usernameInput.sendKeys('marko');
      console.log('✅ Unet username: marko');
      
      await passwordInput.clear();
      await passwordInput.sendKeys('Marko123!');
      console.log('✅ Uneta lozinka: Marko123!');
      
      // Pronađi submit dugme
      let submitBtn = null;
      for (const btn of buttons) {
        const type = await btn.getAttribute('type');
        if (type === 'submit') {
          submitBtn = btn;
          break;
        }
      }
      
      if (submitBtn) {
        await submitBtn.click();
        console.log('✅ Kliknuto na submit');
        await sleep(3000);
        
        const newUrl = await driver.getCurrentUrl();
        console.log('Nova URL nakon prijave:', newUrl);
        
        if (newUrl.includes('turista')) {
          console.log('✅✅✅ PRIJAVA USPEŠNA - Korisnik je turista!');
        } else {
          console.log('❌ Prijava možda nije uspela - URL se nije promenila na /turista');
        }
      }
    } else {
      console.log('❌ Ne mogu naći username ili password polje!');
    }

    // 3. VIKENDICE
    console.log('\n\n3️⃣  TEST STRANICE SA VIKENDICA');
    console.log('-'.repeat(80));
    
    await driver.get('http://localhost:4200/turista/vikendice');
    await sleep(3000);
    
    console.log('Trenutna URL:', await driver.getCurrentUrl());
    
    // Proveri tabelu
    const tables = await driver.findElements(By.tagName('table'));
    console.log(`\nPronađeno ${tables.length} tabela`);
    
    if (tables.length > 0) {
      const rows = await driver.findElements(By.css('table tbody tr'));
      console.log(`✅ Tabela ima ${rows.length} redova (vikendica)`);
      
      if (rows.length > 0) {
        console.log('\n📊 Prva vikendica:');
        const cells = await rows[0].findElements(By.tagName('td'));
        for (let i = 0; i < cells.length; i++) {
          const text = await cells[i].getText();
          console.log(`  Kolona ${i + 1}: ${text}`);
        }
        
        // Proveri dugmad u prvom redu
        const rowButtons = await rows[0].findElements(By.tagName('button'));
        const rowLinks = await rows[0].findElements(By.tagName('a'));
        
        console.log(`\nDugmad u redu: ${rowButtons.length}`);
        for (const btn of rowButtons) {
          const text = await btn.getText();
          const className = await btn.getAttribute('class');
          console.log(`  Button: "${text}" (class="${className}")`);
        }
        
        console.log(`Linkovi u redu: ${rowLinks.length}`);
        for (const link of rowLinks) {
          const text = await link.getText();
          const href = await link.getAttribute('href');
          console.log(`  Link: "${text}" → ${href}`);
        }
      }
    } else {
      console.log('❌ Nema tabele sa vikendica!');
      
      // Proveri da li ima kartice
      const cards = await driver.findElements(By.css('.card, mat-card, .vikendica-card'));
      console.log(`Pronađeno ${cards.length} kartica`);
    }

    // 4. REZERVACIJE
    console.log('\n\n4️⃣  TEST STRANICE SA REZERVACIJAMA');
    console.log('-'.repeat(80));
    
    await driver.get('http://localhost:4200/turista/rezervacije');
    await sleep(3000);
    
    console.log('Trenutna URL:', await driver.getCurrentUrl());
    
    const rezervacijeTables = await driver.findElements(By.tagName('table'));
    console.log(`\nPronađeno ${rezervacijeTables.length} tabela`);
    
    if (rezervacijeTables.length > 0) {
      const rezervacijeRows = await driver.findElements(By.css('table tbody tr'));
      console.log(`✅ Tabela ima ${rezervacijeRows.length} redova (rezervacija)`);
      
      if (rezervacijeRows.length === 0) {
        console.log('⚠️  Nema rezervacija u sistemu');
      }
    } else {
      console.log('❌ Nema tabele sa rezervacijama!');
    }

    console.log('\n\n═'.repeat(80));
    console.log('✅ DIJAGNOSTIKA ZAVRŠENA');
    console.log('═'.repeat(80));

  } catch (error) {
    console.error('\n❌ GREŠKA:', error.message);
    console.error(error.stack);
  } finally {
    await driver.quit();
  }
}

dijagnostikaFrontend().catch(console.error);
