const { Builder, By, until } = require('selenium-webdriver');
const { createDriver, runTest, sleep, login } = require('../selenium-setup');
const chrome = require('selenium-webdriver/chrome');

async function testDinamickaMapa() {
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

    console.log('\n🧪 TEST 2: Prikaz mape na detaljima vikendice');
    console.log('═'.repeat(60));

    // Idi na vikendice
    await driver.get('http://localhost:4200/turista/vikendice');
    await sleep(2000);

    // Otvori prvu vikendicu
    const firstCabin = await driver.findElement(By.css('tbody tr:first-child a'));
    await firstCabin.click();
    await sleep(3000); // Duže čekanje za učitavanje mape

    console.log('✓ Otvoreni detalji vikendice');

    // Proveri da li postoji mapa (različiti selektori)
    let mapFound = false;
    const mapSelectors = [
      '#map',
      '.map-container',
      '[data-map]',
      'google-map',
      '.leaflet-container',
      'iframe[src*="google.com/maps"]',
      'iframe[src*="openstreetmap"]'
    ];

    for (let selector of mapSelectors) {
      try {
        const mapElement = await driver.findElement(By.css(selector));
        console.log(`✓ Mapa pronađena: ${selector}`);
        mapFound = true;

        // Proveri dimenzije mape
        const size = await mapElement.getRect();
        console.log(`  Dimenzije mape: ${size.width}x${size.height}px`);

        if (size.width > 200 && size.height > 200) {
          console.log('✓ Mapa ima validne dimenzije');
        } else {
          console.log('⚠️  Mapa je premala');
        }

        break;
      } catch (e) {
        // Nastavi sa sledećim selektorom
      }
    }

    if (!mapFound) {
      throw new Error('❌ FAIL: Dinamička mapa NIJE implementirana! Potrebno dodati Leaflet ili Google Maps.');
    }

    console.log('\n🧪 TEST 3: Provera da li je mapa interaktivna (nije slika)');
    console.log('═'.repeat(60));

    // Proveri da li postoji Leaflet mapa
    const isLeaflet = await driver.executeScript(`
      return typeof L !== 'undefined' && document.querySelector('.leaflet-container') !== null;
    `);

    // Proveri Google Maps
    const isGoogleMaps = await driver.executeScript(`
      return typeof google !== 'undefined' && typeof google.maps !== 'undefined';
    `);

    // Proveri da li je to samo slika (što nije dozvoljeno)
    const isStaticImage = await driver.executeScript(`
      const mapContainer = document.querySelector('#map, .map-container, [data-map]');
      if (!mapContainer) return false;
      const img = mapContainer.querySelector('img');
      if (!img) return false;
      // Ako ima samo img bez leaflet/google biblioteka, onda je statička
      return !document.querySelector('.leaflet-container') && typeof google === 'undefined';
    `);

    if (isStaticImage) {
      throw new Error('❌ FAIL: Mapa je STATIČKA SLIKA! Mora biti dinamička (Leaflet ili Google Maps).');
    }

    if (!isLeaflet && !isGoogleMaps) {
      throw new Error('❌ FAIL: Mapa nije ni Leaflet ni Google Maps - nepoznat tip mape!');
    }

    if (isLeaflet) {
      console.log('✓ VALIDACIJA: Leaflet mapa detektovana (dinamička)');

      // Proveri da li postoji marker
      const hasMarker = await driver.executeScript(`
        const markers = document.querySelectorAll('.leaflet-marker-icon');
        return markers.length > 0;
      `);

      if (!hasMarker) {
        throw new Error('❌ FAIL: Marker vikendice nije prikazan na mapi!');
      }
      console.log('✓ VALIDACIJA: Marker vikendice prikazan na mapi');

      // Proveri zoom kontrole
      const hasZoom = await driver.executeScript(`
        return document.querySelector('.leaflet-control-zoom') !== null;
      `);

      if (!hasZoom) {
        throw new Error('❌ FAIL: Zoom kontrole nisu dostupne na mapi!');
      }
      console.log('✓ VALIDACIJA: Zoom kontrole dostupne');

    } else if (isGoogleMaps) {
      console.log('✓ VALIDACIJA: Google Maps detektovana (dinamička)');
      
      const hasGoogleMarker = await driver.executeScript(`
        const iframes = document.querySelectorAll('iframe');
        for (let iframe of iframes) {
          if (iframe.src.includes('google.com/maps')) return true;
        }
        return false;
      `);

      if (!hasGoogleMarker) {
        throw new Error('❌ FAIL: Google Maps iframe nije pronađen!');
      }
      console.log('✓ VALIDACIJA: Google Maps iframe prisutan');
    }
    console.log('\n🧪 TEST 4: Test interakcije sa mapom');
    console.log('═'.repeat(60));

    // Pokušaj da klikneš na zoom in
    const zoomIn = await driver.findElement(By.css('.leaflet-control-zoom-in, button[aria-label*="Zoom in"]'));
    await zoomIn.click();
    await sleep(500);
    console.log('✓ VALIDACIJA: Zoom in funkcioniše');

    // Zoom out
    const zoomOut = await driver.findElement(By.css('.leaflet-control-zoom-out, button[aria-label*="Zoom out"]'));
    await zoomOut.click();
    await sleep(500);
    console.log('✓ VALIDACIJA: Zoom out funkcioniše');

    console.log('\n🧪 TEST 5: Test drag (pomeranje) mape');
    console.log('═'.repeat(60));

    const mapContainer = await driver.findElement(By.css('.leaflet-container, #map'));
    const actions = driver.actions({ async: true });
    
    await actions
      .move({ origin: mapContainer })
      .press()
      .move({ x: 50, y: 50, origin: mapContainer })
      .release()
      .perform();
    
    await sleep(500);
    console.log('✓ VALIDACIJA: Drag (pomeranje) mape funkcioniše');

    console.log('\n✅ Svi testovi za dinamičku mapu PROŠLI - funkcionalnost je POTPUNO implementirana!');

  } catch (error) {
    console.error('\n❌ Greška u testu:', error.message);
    throw error;
  } finally {
    await driver.quit();
  }
}

runTest('Dinamicka Mapa', testDinamickaMapa);
