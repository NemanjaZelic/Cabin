const { By, until } = require('selenium-webdriver');
const { createDriver, runTest, sleep } = require('../selenium-setup');

async function testAdminPrijava() {
  const driver = await createDriver();
  
  try {
    console.log('🧪 TEST: Admin prijava');
    
    await driver.get('http://localhost:4200/prijava');
    console.log('✓ Otvoren obrazac za prijavu');
    
    await driver.findElement(By.id('korisnickoIme')).sendKeys('admin');
    await driver.findElement(By.id('lozinka')).sendKeys('Admin123!');
    console.log('✓ Uneti admin kredencijali');
    
    await sleep(1000);
    
    await driver.findElement(By.css('button[type="submit"]')).click();
    console.log('✓ Kliknuto na dugme za prijavu');
    
    await sleep(3000);
    
    const currentUrl = await driver.getCurrentUrl();
    if (currentUrl.includes('/admin/korisnici')) {
      console.log('✅ TEST PROŠAO: Admin uspešno prijavljen');
    } else {
      console.log('❌ TEST NIJE PROŠAO: Admin nije preusmerен na admin panel');
      console.log('Trenutni URL:', currentUrl);
    }
    
  } catch (error) {
    console.error('❌ TEST NIJE PROŠAO:', error.message);
    throw error;
  } finally {
    await driver.quit();
  }
}

testAdminPrijava();

