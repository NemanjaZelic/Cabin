/**
 * AUTOMATSKA KONVERZIJA TESTOVA U PRAVE TESTOVE
 * 
 * Ovaj script automatski konvertuje stare testove koji koriste:
 * - findElements() koji vraća prazan niz
 * - try-catch koji guta greške
 * - return; umesto throw Error
 * 
 * U nove testove koji:
 * - Koriste findElement() koji baca grešku
 * - Bacaju Error kada nešto ne radi
 * - Koriste runTest() wrapper
 */

const fs = require('fs');
const path = require('path');

const testsDir = path.join(__dirname, 'tests');
const testFiles = fs.readdirSync(testsDir)
  .filter(file => file.endsWith('.test.js'))
  .filter(file => !file.startsWith('PRAVI-')); // Preskoči već prepravljene

console.log(`🔧 Pronađeno ${testFiles.length} testova za konverziju\n`);

testFiles.forEach((file, index) => {
  const filePath = path.join(testsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  let changed = false;
  
  // 1. Zameni: console.log('❌...'); return; → throw new Error('...');
  const regex1 = /console\.log\(['"]❌[^'"]+(.*?)['"]\);?\s*return;/g;
  if (regex1.test(content)) {
    content = content.replace(regex1, (match, msg) => {
      return `throw new Error(${msg ? `'${msg.trim()}'` : "'Test failed'"});`;
    });
    changed = true;
  }
  
  // 2. Zameni: console.log('⚠️...'); return; → throw new Error('...');
  const regex2 = /console\.log\(['"]⚠️[^'"]+(.*?)['"]\);?\s*return;/g;
  if (regex2.test(content)) {
    content = content.replace(regex2, (match, msg) => {
      return `throw new Error(${msg ? `'${msg.trim()}'` : "'Warning - test stopped'"});`;
    });
    changed = true;
  }
  
  // 3. Dodaj komentar o problematičnim findElements koji vraćaju []
  const findElementsMatches = content.match(/await driver\.findElements\(By\.css\(['"]table['"]\)\)/g);
  if (findElementsMatches && findElementsMatches.length > 0) {
    console.log(`⚠️  ${file}: Ima ${findElementsMatches.length}x findElements('table') - možda ne radi!`);
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${index + 1}. ${file} - Konvertovan`);
  } else {
    console.log(`⏭️  ${index + 1}. ${file} - Već dobar ili nema šta da se menja`);
  }
});

console.log('\n✅ Konverzija završena!');
console.log('ℹ️  Sada pokreni: npm test');
