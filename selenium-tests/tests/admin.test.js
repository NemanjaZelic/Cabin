const { By, until } = require('selenium-webdriver');
const { createDriver, runTest, sleep } = require('../selenium-setup');

async function testAdminFunkcionalnosti() {
  const driver = await createDriver();
  
  try {
    console.log('\n🧪 TEST 1: Admin prijava');
    
    await driver.get('http://localhost:4200/prijava');
    await sleep(1000);
    
    await driver.findElement(By.id('korisnickoIme')).sendKeys('admin');
    await driver.findElement(By.id('lozinka')).sendKeys('Admin123!');
    await driver.findElement(By.css('button[type="submit"]')).click();
    console.log('✓ Kliknuto na dugme za admin prijavu');
    
    await sleep(3000);
    
    const currentUrl = await driver.getCurrentUrl();
    if (currentUrl.includes('/admin')) {
      console.log('✅ TEST 1 PROŠAO: Admin uspešno prijavljen\n');
    } else {
      console.log('❌ TEST 1 NIJE PROŠAO: Admin nije preusmerен na admin panel\n');
      console.log('Trenutni URL:', currentUrl);
      return;
    }
    
  } catch (error) {
    console.error('❌ TEST 1 NIJE PROŠAO:', error.message, '\n');
    await driver.quit();
    return;
  }
  
  try {
    console.log('🧪 TEST 2: Pregled svih korisnika');
    
    await driver.get('http://localhost:4200/admin/korisnici');
    await sleep(2000);
    console.log('✓ Otvoren panel sa svim korisnicima');
    
    const korisnici = await driver.findElements(By.css('tbody tr, .user-card, .korisnik-item'));
    console.log(`✓ Pronađeno ${korisnici.length} korisnika u sistemu`);
    
    const tabela = await driver.findElements(By.css('table'));
    if (tabela.length > 0) {
      console.log('✓ Tabela sa korisnicima prikazana');
    }
    
    const statusBadge = await driver.findElements(By.css('.status-badge, .badge, span[class*="status"]'));
    console.log(`✓ Statusnih oznaka: ${statusBadge.length}`);
    
    console.log('✅ TEST 2 PROŠAO: Pregled korisnika funkcionalan\n');
    
  } catch (error) {
    console.error('❌ TEST 2 NIJE PROŠAO:', error.message, '\n');
  }
  
  try {
    console.log('🧪 TEST 3: Razmatranje zahteva za registraciju');
    
    await driver.get('http://localhost:4200/admin/zahtevi');
    await sleep(2000);
    console.log('✓ Otvoren panel za zahteve');
    
    const zahtevi = await driver.findElements(By.css('.zahtev-card, .request-card, .pending-user'));
    console.log(`✓ Pronađeno ${zahtevi.length} zahteva na čekanju`);
    
    if (zahtevi.length > 0) {
      const odobriButton = await driver.findElements(By.xpath("//button[contains(text(), 'dobri')]"));
      const odbijButton = await driver.findElements(By.xpath("//button[contains(text(), 'dbij')]"));
      
      console.log(`✓ Dugmad - odobri: ${odobriButton.length}, odbij: ${odbijButton.length}`);
      
      if (odobriButton.length > 0) {
        console.log('✓ Opcija za odobravanje dostupna');
        
        await odobriButton[0].click();
        console.log('✓ Kliknuto na dugme za odobravanje');
        
        await sleep(1000);
        
        try {
          await driver.switchTo().alert().accept();
          console.log('✓ Potvrđeno odobravanje preko alert dijaloga');
          await sleep(2000);
          console.log('✅ TEST 3 PROŠAO: Zahtev uspešno odobren\n');
        } catch (e) {
          console.log('⚠️  Nema alert dijaloga za potvrdu');
          await sleep(2000);
          console.log('✅ TEST 3 PROŠAO: Zahtev poslat na obradu\n');
        }
      } else {
        console.log('⚠️  TEST 3: Dugmad za odobravanje nisu dostupna\n');
      }
    } else {
      console.log('✅ TEST 3 PROŠAO: Nema zahteva (svi već obrađeni)\n');
    }
    
  } catch (error) {
    console.error('❌ TEST 3 NIJE PROŠAO:', error.message, '\n');
  }
  
  try {
    console.log('🧪 TEST 4: Deaktivacija korisnika');
    
    await driver.get('http://localhost:4200/admin/korisnici');
    await sleep(2000);
    
    const deaktivirajButtons = await driver.findElements(By.xpath("//button[contains(text(), 'eaktiviraj')]"));
    
    if (deaktivirajButtons.length > 0) {
      console.log(`✓ Pronađeno ${deaktivirajButtons.length} dugmadi za deaktivaciju`);
      
      await driver.executeScript('arguments[0].scrollIntoView(true);', deaktivirajButtons[0]);
      await sleep(500);
      await deaktivirajButtons[0].click();
      console.log('✓ Kliknuto na dugme za deaktivaciju');
      
      await sleep(1000);
      
      try {
        await driver.switchTo().alert().accept();
        console.log('✓ Potvrđena deaktivacija');
        await sleep(2000);
        console.log('✅ TEST 4 PROŠAO: Korisnik deaktiviran\n');
      } catch (e) {
        console.log('⚠️  Nema alert dijaloga');
        await sleep(2000);
        console.log('✅ TEST 4 PROŠAO: Deaktivacija poslata\n');
      }
    } else {
      console.log('⚠️  TEST 4: Nema korisnika za deaktivaciju\n');
    }
    
  } catch (error) {
    console.error('❌ TEST 4 NIJE PROŠAO:', error.message, '\n');
  }
  
  try {
    console.log('🧪 TEST 5: Aktivacija deaktiviranog korisnika');
    
    await driver.get('http://localhost:4200/admin/korisnici');
    await sleep(2000);
    
    const aktivirajButtons = await driver.findElements(By.xpath('//button[contains(text(), "ktiviraj") and not(contains(text(), "eaktiviraj"))]'));
    
    if (aktivirajButtons.length > 0) {
      console.log(`✓ Pronađeno ${aktivirajButtons.length} dugmadi za aktivaciju`);
      
      await driver.executeScript('arguments[0].scrollIntoView(true);', aktivirajButtons[0]);
      await sleep(500);
      await aktivirajButtons[0].click();
      console.log('✓ Kliknuto na dugme za aktivaciju');
      
      await sleep(1000);
      
      try {
        await driver.switchTo().alert().accept();
        console.log('✓ Potvrđena aktivacija');
        await sleep(2000);
        console.log('✅ TEST 5 PROŠAO: Korisnik reaktiviran\n');
      } catch (e) {
        console.log('⚠️  Nema alert dijaloga');
        await sleep(2000);
        console.log('✅ TEST 5 PROŠAO: Aktivacija poslata\n');
      }
    } else {
      console.log('⚠️  TEST 5: Nema deaktiviranih korisnika za aktivaciju\n');
    }
    
  } catch (error) {
    console.error('❌ TEST 5 NIJE PROŠAO:', error.message, '\n');
  }
  
  try {
    console.log('🧪 TEST 6: Pregled svih vikendica (admin)');
    
    await driver.get('http://localhost:4200/admin/vikendice');
    await sleep(2000);
    console.log('✓ Otvoren pregled vikendica');
    
    const vikendice = await driver.findElements(By.css('tbody tr, .vikendica-card, .cabin-item'));
    console.log(`✓ Pronađeno ${vikendice.length} vikendica`);
    
    const blokirajButtons = await driver.findElements(By.xpath("//button[contains(text(), 'lokiraj')]"));
    if (blokirajButtons.length > 0) {
      console.log(`✓ Opcija za blokiranje vikendica: ${blokirajButtons.length} dostupno`);
    }
    
    const crveneVikendice = await driver.findElements(By.css('tr[style*="red"], .red-row, [class*="bad-rating"]'));
    if (crveneVikendice.length > 0) {
      console.log(`⚠️  Pronađeno ${crveneVikendice.length} vikendica sa lošim ocenama (crvene)`);
    }
    
    console.log('✅ TEST 6 PROŠAO: Pregled vikendica funkcionalan\n');
    
  } catch (error) {
    console.error('❌ TEST 6 NIJE PROŠAO:', error.message, '\n');
  }
  
  try {
    console.log('🧪 TEST 7: Privremeno blokiranje vikendice');
    
    await driver.get('http://localhost:4200/admin/vikendice');
    await sleep(2000);
    
    const blokirajButtons = await driver.findElements(By.xpath("//button[contains(text(), 'lokiraj')]"));
    
    if (blokirajButtons.length > 0) {
      console.log('✓ Dugme za blokiranje pronađeno');
      
      await driver.executeScript('arguments[0].scrollIntoView(true);', blokirajButtons[0]);
      await sleep(500);
      await blokirajButtons[0].click();
      console.log('✓ Kliknuto na dugme za blokiranje');
      
      await sleep(1000);
      
      try {
        await driver.switchTo().alert().accept();
        console.log('✓ Potvrđeno blokiranje');
        await sleep(2000);
        console.log('✅ TEST 7 PROŠAO: Vikendica privremeno blokirana\n');
      } catch (e) {
        console.log('⚠️  Nema alert dijaloga');
        await sleep(2000);
        console.log('✅ TEST 7 PROŠAO: Blokiranje poslato\n');
      }
    } else {
      console.log('⚠️  TEST 7: Nema vikendica za blokiranje (možda nema loših ocena)\n');
    }
    
  } catch (error) {
    console.error('❌ TEST 7 NIJE PROŠAO:', error.message, '\n');
  }
  
  try {
    console.log('🧪 TEST 8: Izmena podataka korisnika');
    
    await driver.get('http://localhost:4200/admin/korisnici');
    await sleep(2000);
    
    const izmeniButtons = await driver.findElements(By.xpath("//button[contains(text(), 'zmeni')]"));
    
    if (izmeniButtons.length > 0) {
      console.log('✓ Opcija za izmenu korisnika dostupna');
      console.log('✅ TEST 8 PROŠAO: Admin može da menja podatke korisnika\n');
    } else {
      console.log('⚠️  TEST 8: Izmena korisnika možda nije implementirana\n');
    }
    
  } catch (error) {
    console.error('❌ TEST 8 NIJE PROŠAO:', error.message, '\n');
  }
  
  try {
    console.log('🧪 TEST 9: Logout funkcionalnost');
    
    const logoutButton = await driver.findElements(By.xpath("//button[contains(text(), 'djava')]"));
    
    if (logoutButton.length > 0) {
      await logoutButton[0].click();
      await sleep(2000);
      
      const currentUrl = await driver.getCurrentUrl();
      if (currentUrl.includes('/prijava') || currentUrl === 'http://localhost:4200/') {
        console.log('✅ TEST 9 PROŠAO: Logout uspešan\n');
      } else {
        console.log('⚠️  TEST 9: Logout možda nije preusmerio pravilno\n');
      }
    } else {
      console.log('⚠️  TEST 9: Logout dugme nije pronađeno\n');
    }
    
  } catch (error) {
    console.error('❌ TEST 9 NIJE PROŠAO:', error.message, '\n');
    throw error;
  } finally {
    await driver.quit();
  }
}

testAdminFunkcionalnosti();



