const { By, until } = require('selenium-webdriver');
const { createDriver, runTest, sleep } = require('../selenium-setup');

async function testAktivacijaDeaktiviranogKorisnika() {
  const driver = await createDriver();
  
  try {
    console.log('🧪 TEST: Aktivacija deaktiviranog korisnika');
    
    await driver.get('http://localhost:4200/prijava');
    console.log('✓ Otvoren obrazac za prijavu');
    
    await driver.findElement(By.id('korisnickoIme')).sendKeys('admin');
    await driver.findElement(By.id('lozinka')).sendKeys('Admin123!');
    await driver.findElement(By.css('button[type="submit"]')).click();
    console.log('✓ Admin prijavljen');
    
    await sleep(3000);
    
    await driver.get('http://localhost:4200/admin/korisnici');
    console.log('✓ Otvoren panel korisnika');
    
    await sleep(2000);
    
    const rows = await driver.findElements(By.css('tbody tr'));
    console.log(`✓ Pronađeno ${rows.length} korisnika`);
    
    const deaktivacijaButtons = await driver.findElements(By.css('.btn-danger'));
    
    if (deaktivacijaButtons.length > 0) {
      console.log('✓ Pronađen aktivan korisnik za deaktivaciju');
      await deaktivacijaButtons[0].click();
      console.log('✓ Kliknuto na dugme za deaktivaciju');
      
      await sleep(1000);
      await driver.switchTo().alert().accept();
      console.log('✓ Potvrđena deaktivacija');
      
      await sleep(2000);
      
      const aktivacijaButtons = await driver.findElements(By.css('.btn-success'));
      if (aktivacijaButtons.length > 0) {
        console.log('✓ Korisnik deaktiviran, pronađeno dugme za aktivaciju');
        await aktivacijaButtons[0].click();
        console.log('✓ Kliknuto na dugme za aktivaciju');
        
        await sleep(1000);
        await driver.switchTo().alert().accept();
        console.log('✓ Potvrđena aktivacija');
        
        await sleep(2000);
        
        console.log('✅ TEST PROŠAO: Aktivacija deaktiviranog korisnika uspešna!');
      } else {
        console.log('❌ TEST NIJE PROŠAO: Dugme za aktivaciju nije pronađeno');
      throw new Error('Test failed');
      }
    } else {
      const aktivacijaButtons = await driver.findElements(By.css('.btn-success'));
      if (aktivacijaButtons.length > 0) {
        console.log('✓ Pronađen deaktiviran korisnik, testiram aktivaciju');
        await aktivacijaButtons[0].click();
        console.log('✓ Kliknuto na dugme za aktivaciju');
        
        await sleep(1000);
        await driver.switchTo().alert().accept();
        console.log('✓ Potvrđena aktivacija');
        
        await sleep(2000);
        
        console.log('✅ TEST PROŠAO: Aktivacija deaktiviranog korisnika uspešna!');
      } else {
        console.log('⚠️  Nema deaktiviranih korisnika za testiranje');
      }
    }
    
  } catch (error) {
    console.error('❌ TEST NIJE PROŠAO:', error.message);
    throw error;
  } finally {
    await driver.quit();
  }
}

testAktivacijaDeaktiviranogKorisnika();

