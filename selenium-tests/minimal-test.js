const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function minimalTest() {
  console.log('🧪 MINIMALAN TEST');
  
  const options = new chrome.Options();
  options.addArguments('--disable-gpu');
  options.addArguments('--no-sandbox');
  
  console.log('1. Kreiranje drivera...');
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  
  console.log('2. Driver kreiran!');
  
  try {
    console.log('3. Otvaranje http://localhost:4200...');
    await driver.get('http://localhost:4200');
    console.log('4. Stranica otvorena!');
    
    console.log('5. Traž im title...');
    const title = await driver.getTitle();
    console.log(`6. Title: ${title}`);
    
    console.log('✅ TEST PROŠAO!');
  } catch (error) {
    console.log(`❌ TEST PUKAO: ${error.message}`);
    throw error;
  } finally {
    console.log('7. Zatvaranje drivera...');
    await driver.quit();
    console.log('8. Driver zatvoren!');
  }
}

minimalTest()
  .then(() => {
    console.log('\n✅ Exit code: 0');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Exit code: 1');
    console.error(error);
    process.exit(1);
  });
