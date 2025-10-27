const { Builder, By, until } = require('selenium-webdriver');
const { createDriver, runTest, sleep, login } = require('../selenium-setup');
const chrome = require('selenium-webdriver/chrome');

async function testStatistikaDijagrami() {
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

    console.log('\n🧪 TEST 2: Navigacija na statistiku');
    console.log('═'.repeat(60));

    await driver.get('http://localhost:4200/vlasnik/statistika');
    await sleep(3000); // Duže čekanje za učitavanje dijagrama

    console.log('✓ Stranica statistike otvorena');

    console.log('\n🧪 TEST 3: Provera dijagrama sa kolonama (Bar Chart)');
    console.log('═'.repeat(60));

    // Proveri različite moguće selektore za bar chart
    let barChartFound = false;
    const barChartSelectors = [
      'canvas[id*="bar"]',
      '.bar-chart canvas',
      '#barChart',
      '[data-chart="bar"]',
      'canvas[id*="kolone"]',
      'svg[class*="recharts"]',
      '.recharts-bar-chart'
    ];

    for (let selector of barChartSelectors) {
      try {
        const chart = await driver.findElement(By.css(selector));
        console.log(`✓ Bar chart pronađen: ${selector}`);
        barChartFound = true;

        // Proveri dimenzije
        const size = await chart.getRect();
        console.log(`  Dimenzije: ${size.width}x${size.height}px`);

        if (size.width > 300 && size.height > 200) {
          console.log('✓ Dijagram ima validne dimenzije');
        }

        break;
      } catch (e) {
        // Nastavi
      }
    }

    if (!barChartFound) {
      throw new Error('❌ FAIL: Bar chart (dijagram sa kolonama) NIJE implementiran! Potrebno dodati Chart.js ili sličnu biblioteku.');
    }
    console.log('✓ VALIDACIJA: Bar chart pronađen i prikazan');

    // Proveri legendu/opis - mora postojati
    const legend = await driver.findElement(By.css('.chart-legend, .chart-title, h3, h2'));
    const legendText = await legend.getText();
    console.log(`✓ VALIDACIJA: Naslov/legenda prisutna: "${legendText}"`);

    // Proveri da li prikazuje rezervacije po mesecima
    const pageText = await driver.findElement(By.tagName('body')).getText();
    const hasMontlyData = pageText.includes('Januar') || pageText.includes('Februar') || 
        pageText.includes('Mart') || pageText.includes('po mesecima') || 
        pageText.includes('mesečno') || pageText.includes('January') || pageText.includes('February');
    
    if (!hasMontlyData) {
      throw new Error('❌ FAIL: Dijagram ne prikazuje podatke po mesecima!');
    }
    console.log('✓ VALIDACIJA: Dijagram prikazuje podatke po mesecima');

    console.log('\n🧪 TEST 4: Provera dijagrama pita (Pie Chart)');
    console.log('═'.repeat(60));

    let pieChartFound = false;
    const pieChartSelectors = [
      'canvas[id*="pie"]',
      '.pie-chart canvas',
      '#pieChart',
      '[data-chart="pie"]',
      'canvas[id*="pita"]',
      '.recharts-pie-chart',
      'svg path[class*="recharts-pie"]'
    ];

    for (let selector of pieChartSelectors) {
      try {
        const chart = await driver.findElement(By.css(selector));
        console.log(`✓ Pie chart pronađen: ${selector}`);
        pieChartFound = true;

        // Proveri dimenzije
        const size = await chart.getRect();
        console.log(`  Dimenzije: ${size.width}x${size.height}px`);

        break;
      } catch (e) {
        // Nastavi
      }
    }

    if (!pieChartFound) {
      throw new Error('❌ FAIL: Pie chart (dijagram pita) NIJE implementiran! Potrebno dodati Chart.js ili sličnu biblioteku.');
    }
    console.log('✓ VALIDACIJA: Pie chart pronađen i prikazan');

    // Proveri da li prikazuje vikend vs radni dani - MORA
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    const hasWeekendData = bodyText.includes('vikend') || bodyText.includes('radna nedelja') || 
        bodyText.includes('radni dan') || bodyText.includes('weekend') || 
        bodyText.includes('Vikend') || bodyText.includes('Radni');
    
    if (!hasWeekendData) {
      throw new Error('❌ FAIL: Pie chart ne prikazuje odnos vikend/radni dani!');
    }
    console.log('✓ VALIDACIJA: Pie chart prikazuje odnos vikend/radni dani');

    console.log('\n🧪 TEST 5: Provera konkretnih podataka u dijagramima');
    console.log('═'.repeat(60));

    // Proveri da li postoje brojevi u dijagramu - MORAJU postojati
    const pageContent = await driver.findElement(By.tagName('body')).getText();
    const hasNumbers = /\d+/.test(pageContent);
    
    if (!hasNumbers) {
      throw new Error('❌ FAIL: Dijagrami ne prikazuju konkretne brojeve!');
    }
    console.log('✓ VALIDACIJA: Dijagrami prikazuju konkretne brojeve');

    console.log('\n🧪 TEST 6: Provera biblioteke za dijagrame');
    console.log('═'.repeat(60));

    // Proveri koju biblioteku koristi
    const hasChartJs = await driver.executeScript(`
      return typeof Chart !== 'undefined';
    `);

    const hasRecharts = await driver.executeScript(`
      return document.querySelector('[class*="recharts"]') !== null;
    `);

    const hasNgxCharts = await driver.executeScript(`
      return document.querySelector('ngx-charts-bar-vertical, ngx-charts-pie-chart') !== null;
    `);

    if (!hasChartJs && !hasRecharts && !hasNgxCharts) {
      throw new Error('❌ FAIL: Biblioteka za dijagrame nije detektovana! Potrebno instalirati Chart.js, Recharts ili ngx-charts.');
    }

    if (hasChartJs) {
      console.log('✓ VALIDACIJA: Koristi Chart.js biblioteku');
    } else if (hasRecharts) {
      console.log('✓ VALIDACIJA: Koristi Recharts biblioteku');
    } else if (hasNgxCharts) {
      console.log('✓ VALIDACIJA: Koristi ngx-charts biblioteku');
    }

    console.log('\n✅ Svi testovi za statistiku i dijagrame PROŠLI - funkcionalnost je POTPUNO implementirana!');

  } catch (error) {
    console.error('\n❌ Greška u testu:', error.message);
    throw error;
  } finally {
    await driver.quit();
  }
}

runTest('Statistika Dijagrami', testStatistikaDijagrami);
