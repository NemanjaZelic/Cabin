const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function createDriver(headless = false) {
  const options = new chrome.Options();
  
  // UVEK koristi headless mode za batch testove
  // Pojedinačni testovi mogu da rade bez headless
  const shouldBeHeadless = headless || process.env.HEADLESS === 'true' || process.env.CI === 'true';
  
  if (shouldBeHeadless) {
    options.addArguments('--headless');
    console.log('🔇 Headless mode: ON');
  } else {
    options.addArguments('--start-maximized');
    console.log('👁️  Headless mode: OFF (Chrome će se otvoriti)');
  }
  
  options.addArguments('--disable-blink-features=AutomationControlled');
  options.addArguments('--disable-gpu');
  options.addArguments('--no-sandbox');
  
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
    
  await driver.manage().setTimeouts({ implicit: 5000 });
  return driver;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Wrapper koji osigurava da se test zaista izvršava i baca grešku
 */
async function runTest(testName, testFunction) {
  console.log(`\n🧪 ${testName}`);
  console.log('═'.repeat(60));
  
  let driver = null;
  
  try {
    driver = await createDriver(process.env.HEADLESS === 'true');
    await testFunction(driver);
    console.log(`\n✅ ${testName} - PROŠAO!\n`);
    return true;
  } catch (error) {
    console.log(`\n❌ ${testName} - PUKAO!`);
    console.log(`   Greška: ${error.message}\n`);
    throw error; // Propagiraj grešku da bi test runner znao
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

module.exports = { createDriver, sleep, runTest };

