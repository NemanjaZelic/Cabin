const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

// Postavi ChromeDriver path eksplicitno iz node_modules
const chromeDriverPath = require('chromedriver').path;

/**
 * Kreira Selenium WebDriver sa ChromeDriver-om iz node_modules
 * @param {boolean} headless - Da li pokrenuti Chrome u headless modu
 * @returns {Promise<WebDriver>}
 */
async function createDriver(headless = false) {
  const options = new chrome.Options();
  
  if (headless) {
    options.addArguments('--headless');
  }
  
  options.addArguments('--disable-gpu');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--window-size=1920,1080');
  
  const service = new chrome.ServiceBuilder(chromeDriverPath);
  
  // Timeout za build() - ako se ne završi za 15s, baci grešku
  const buildPromise = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .setChromeService(service)
    .build();
  
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('ChromeDriver build() timeout posle 15s')), 15000)
  );
  
  return await Promise.race([buildPromise, timeoutPromise]);
}

/**
 * Wrapper za izvršavanje testa sa automatskim cleanup-om
 * @param {string} testName - Naziv testa
 * @param {Function} testFunction - Async funkcija koja izvršava test
 */
async function runTest(testName, testFunction) {
  console.log(`\n🧪 TEST: ${testName}`);
  console.log('═'.repeat(60));
  
  try {
    await testFunction();
    console.log('\n✅ TEST PROŠAO!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ TEST PUKAO!');
    console.error(`   Greška: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Sleep funkcija - čeka određeni broj milisekundi
 * @param {number} ms - Broj milisekundi čekanja
 * @returns {Promise}
 */
async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Helper funkcija za login
 * @param {WebDriver} driver - Selenium WebDriver instance
 * @param {string} username - Korisničko ime
 * @param {string} password - Lozinka
 * @param {string} url - URL login stranice (default: http://localhost:4200/login)
 */
async function login(driver, username, password, url = 'http://localhost:4200/login') {
  const { By } = require('selenium-webdriver');
  
  await driver.get(url);
  await sleep(2000);

  // Čekaj da se forma učita
  await driver.wait(async () => {
    try {
      await driver.findElement(By.id('korisnickoIme'));
      return true;
    } catch (e) {
      return false;
    }
  }, 5000);

  await driver.findElement(By.id('korisnickoIme')).sendKeys(username);
  await driver.findElement(By.id('lozinka')).sendKeys(password);
  await driver.findElement(By.css('button[type="submit"]')).click();
  await sleep(3000);
}

module.exports = {
  createDriver,
  runTest,
  sleep,
  login,
  chromeDriverPath
};
