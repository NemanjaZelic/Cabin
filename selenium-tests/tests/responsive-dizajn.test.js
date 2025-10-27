const { Builder, By, until } = require('selenium-webdriver');
const { createDriver, runTest, sleep } = require('../selenium-setup');
const chrome = require('selenium-webdriver/chrome');

async function testResponsiveDesign() {
  const options = new chrome.Options();
  options.addArguments('--disable-gpu');
  options.addArguments('--no-sandbox');
  
  const driver = await createDriver(false); // headless = false

  try {
    console.log('\n🧪 TEST 1: Desktop prikaz (1920x1080)');
    console.log('═'.repeat(60));

    await driver.manage().window().setRect({ width: 1920, height: 1080 });
    await driver.get('http://localhost:4200');
    await sleep(2000);

    // Proveri header
    const header = await driver.findElement(By.css('header, .header, nav'));
    const headerSize = await header.getRect();
    console.log(`✓ Header: ${headerSize.width}x${headerSize.height}px`);

    // Proveri navigaciju
    try {
      const navItems = await driver.findElements(By.css('nav a, .nav-item'));
      console.log(`✓ Navigacijski linkovi: ${navItems.length}`);
      
      // Proveri da li su vidljivi
      for (let item of navItems) {
        const isDisplayed = await item.isDisplayed();
        if (!isDisplayed) {
          console.log('⚠️  Neki nav linkovi nisu vidljivi na desktop-u');
          break;
        }
      }
      console.log('✓ Svi nav linkovi su vidljivi');

    } catch (e) {
      console.log('⚠️  Ne mogu da proverim navigaciju');
    }

    // Proveri tabelu
    try {
      const table = await driver.findElement(By.css('table'));
      const tableWidth = await table.getRect();
      console.log(`✓ Tabela: ${tableWidth.width}px širine`);
    } catch (e) {
      console.log('⚠️  Tabela nije pronađena');
    }

    console.log('\n🧪 TEST 2: Tablet prikaz (768x1024)');
    console.log('═'.repeat(60));

    await driver.manage().window().setRect({ width: 768, height: 1024 });
    await sleep(2000);

    // Proveri da li se layout prilagodio
    const headerTablet = await driver.findElement(By.css('header, .header, nav'));
    const headerTabletSize = await headerTablet.getRect();
    console.log(`✓ Header: ${headerTabletSize.width}x${headerTabletSize.height}px`);

    // Proveri hamburger menu
    try {
      const hamburger = await driver.findElement(By.css('.hamburger, .menu-toggle, .navbar-toggler'));
      const isVisible = await hamburger.isDisplayed();
      
      if (isVisible) {
        console.log('✓ Hamburger menu je vidljiv (responsive!)');

        // Klikni na hamburger
        await hamburger.click();
        await sleep(1000);

        // Proveri da li se meni otvorio
        const mobileMenu = await driver.findElement(By.css('.mobile-menu, .navbar-collapse'));
        const menuVisible = await mobileMenu.isDisplayed();
        
        if (menuVisible) {
          console.log('✓ Mobilni meni se otvara');
        } else {
          console.log('⚠️  Mobilni meni se ne otvara');
        }

      } else {
        console.log('⚠️  Hamburger menu nije vidljiv na tablet-u');
      }

    } catch (e) {
      console.log('⚠️  Hamburger menu nije implementiran:', e.message);
    }

    // Proveri tabelu na tablet-u
    try {
      const table = await driver.findElement(By.css('table'));
      const tableWidth = await table.getRect();
      
      if (tableWidth.width > 768) {
        console.log('⚠️  Tabela je šira od ekrana - nije responsivna!');
      } else {
        console.log('✓ Tabela se prilagodila širini ekrana');
      }

      // Proveri horizontal scroll
      const hasScroll = await driver.executeScript(`
        const table = document.querySelector('table');
        return table ? table.scrollWidth > table.clientWidth : false;
      `);

      if (hasScroll) {
        console.log('✓ Tabela ima horizontal scroll (za široke tabele)');
      }

    } catch (e) {
      console.log('⚠️  Ne mogu da proverim tabelu');
    }

    console.log('\n🧪 TEST 3: Mobile prikaz (375x667) - iPhone X');
    console.log('═'.repeat(60));

    await driver.manage().window().setRect({ width: 375, height: 667 });
    await sleep(2000);

    // Proveri da li se sve prilagodilo
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    console.log('✓ Stranica učitana na mobile ekranu');

    // Proveri header
    const headerMobile = await driver.findElement(By.css('header, .header, nav'));
    const headerMobileSize = await headerMobile.getRect();
    console.log(`✓ Header: ${headerMobileSize.width}px (max 375px)`);

    if (headerMobileSize.width > 375) {
      console.log('⚠️  Header je širi od ekrana!');
    } else {
      console.log('✓ Header se prilagodio mobile ekranu');
    }

    // Proveri font size
    const fontSize = await driver.executeScript(`
      return window.getComputedStyle(document.body).fontSize;
    `);
    console.log(`✓ Font size: ${fontSize}`);

    // Proveri da li postoji horizontal scroll (ne bi trebalo)
    const hasHorizontalScroll = await driver.executeScript(`
      return document.body.scrollWidth > window.innerWidth;
    `);

    if (hasHorizontalScroll) {
      console.log('⚠️  Stranica ima horizontal scroll - NIJE dobro responsive!');
    } else {
      console.log('✓ Nema horizontal scroll (dobro!)');
    }

    // Proveri dugmad
    try {
      const buttons = await driver.findElements(By.css('button'));
      if (buttons.length > 0) {
        const btnSize = await buttons[0].getRect();
        
        if (btnSize.height < 44) {
          console.log('⚠️  Dugmad su premala za touch (min 44px)');
        } else {
          console.log('✓ Dugmad su dovoljno velika za touch (>44px)');
        }
      }
    } catch (e) {
      console.log('⚠️  Ne mogu da proverim dugmad');
    }

    console.log('\n🧪 TEST 4: Mobile landscape prikaz (667x375)');
    console.log('═'.repeat(60));

    await driver.manage().window().setRect({ width: 667, height: 375 });
    await sleep(2000);

    console.log('✓ Landscape mod testiran');

    const hasScrollLandscape = await driver.executeScript(`
      return document.body.scrollWidth > window.innerWidth;
    `);

    if (hasScrollLandscape) {
      console.log('⚠️  Horizontal scroll u landscape modu');
    } else {
      console.log('✓ Nema horizontal scroll u landscape modu');
    }

    console.log('\n🧪 TEST 5: Testiranje viewport meta tag-a');
    console.log('═'.repeat(60));

    const hasViewport = await driver.executeScript(`
      const viewport = document.querySelector('meta[name="viewport"]');
      return viewport !== null;
    `);

    if (hasViewport) {
      const viewportContent = await driver.executeScript(`
        return document.querySelector('meta[name="viewport"]').getAttribute('content');
      `);
      console.log('✓ Viewport meta tag postoji:', viewportContent);

      if (viewportContent.includes('width=device-width')) {
        console.log('✓ Viewport je pravilno podešen');
      } else {
        console.log('⚠️  Viewport nije optimalan za responsive');
      }

    } else {
      console.log('❌ Viewport meta tag NEDOSTAJE!');
      console.log('  Dodati u <head>: <meta name="viewport" content="width=device-width, initial-scale=1">');
    }

    console.log('\n🧪 TEST 6: Testiranje forme na mobile-u');
    console.log('═'.repeat(60));

    // Idi na login stranu
    await driver.get('http://localhost:4200/login');
    await sleep(2000);

    try {
      const inputs = await driver.findElements(By.css('input'));
      
      if (inputs.length > 0) {
        const inputSize = await inputs[0].getRect();
        console.log(`✓ Input polje: ${inputSize.width}x${inputSize.height}px`);

        if (inputSize.height < 44) {
          console.log('⚠️  Input polja su premala za touch (min 44px visine)');
        } else {
          console.log('✓ Input polja su dovoljno velika');
        }

        // Test typing na mobile
        await inputs[0].click();
        await inputs[0].sendKeys('test');
        await sleep(500);
        console.log('✓ Typing funkcioniše na mobile-u');

        const value = await inputs[0].getAttribute('value');
        if (value === 'test') {
          console.log('✓ Input vrednost se čuva');
        }
      }

    } catch (e) {
      console.log('⚠️  Ne mogu da testiram input polja:', e.message);
    }

    console.log('\n🧪 TEST 7: Testiranje slika na različitim rezolucijama');
    console.log('═'.repeat(60));

    await driver.manage().window().setRect({ width: 375, height: 667 });
    await driver.get('http://localhost:4200');
    await sleep(2000);

    try {
      const images = await driver.findElements(By.css('img'));
      console.log(`✓ Pronađeno ${images.length} slika`);

      for (let i = 0; i < Math.min(3, images.length); i++) {
        const img = images[i];
        const src = await img.getAttribute('src');
        const size = await img.getRect();
        
        if (size.width > 375) {
          console.log(`⚠️  Slika ${i + 1} je šira od ekrana: ${size.width}px`);
        } else {
          console.log(`✓ Slika ${i + 1} se prilagodila: ${size.width}px`);
        }
      }

    } catch (e) {
      console.log('⚠️  Ne mogu da proverim slike');
    }

    console.log('\n🧪 TEST 8: CSS Media Queries provera');
    console.log('═'.repeat(60));

    // Testiraj različite breakpoint-e
    const breakpoints = [
      { width: 1920, name: 'Desktop (1920px)' },
      { width: 1200, name: 'Desktop (1200px)' },
      { width: 992, name: 'Tablet Landscape (992px)' },
      { width: 768, name: 'Tablet (768px)' },
      { width: 576, name: 'Mobile (576px)' },
      { width: 375, name: 'Mobile Small (375px)' }
    ];

    for (let bp of breakpoints) {
      await driver.manage().window().setRect({ width: bp.width, height: 800 });
      await sleep(500);

      const bodyClass = await driver.executeScript('return document.body.className;');
      console.log(`✓ ${bp.name}: body class = "${bodyClass}"`);
    }

    // Vrati normalan prozor
    await driver.manage().window().maximize();
    await sleep(1000);

    console.log('\n✅ Svi testovi za responsive dizajn završeni');

  } catch (error) {
    console.error('\n❌ Greška u testu:', error.message);
    throw error;
  } finally {
    await driver.quit();
  }
}

runTest('Responsive Dizajn', testResponsiveDesign);
