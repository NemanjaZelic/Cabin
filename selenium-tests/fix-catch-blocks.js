/**
 * AUTOMATSKO DODAVANJE throw error U CATCH BLOKOVE
 */

const fs = require('fs');
const path = require('path');

const testsDir = path.join(__dirname, 'tests');
const testFiles = fs.readdirSync(testsDir)
  .filter(file => file.endsWith('.test.js'))
  .filter(file => !file.startsWith('PRAVI-')); // Preskoči već prepravljene

console.log(`🔧 Dodajem throw error u catch blokove...\n`);

let totalFixed = 0;

testFiles.forEach((file, index) => {
  const filePath = path.join(testsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  let changed = false;
  let fixCount = 0;
  
  // Pattern 1: console.error u catch bloku bez throw error nakon toga
  // Traži: } catch (error) { console.error(...); } finally
  // Zameni sa: } catch (error) { console.error(...); throw error; } finally
  const pattern1 = /(\} catch \(error\) \{[\s\S]*?console\.error[^;]*;)(\s*\} finally)/g;
  
  content = content.replace(pattern1, (match, group1, group2) => {
    // Proveri da li već ima throw error
    if (!group1.includes('throw error')) {
      fixCount++;
      return `${group1}\n    throw error;${group2}`;
    }
    return match;
  });
  
  // Pattern 2: console.log('❌...') bez return ili throw nakon toga
  const pattern2 = /(console\.log\(['"]❌[^'"]*['"]\);)\s*(\n\s*\})/g;
  
  content = content.replace(pattern2, (match, group1, group2) => {
    // Proveri da li već ima return ili throw
    if (!group1.includes('return') && !group1.includes('throw')) {
      fixCount++;
      return `${group1}\n      throw new Error('Test failed');${group2}`;
    }
    return match;
  });
  
  if (fixCount > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${index + 1}. ${file} - Dodato ${fixCount} throw Error`);
    totalFixed += fixCount;
    changed = true;
  } else {
    console.log(`⏭️  ${index + 1}. ${file} - Već u redu`);
  }
});

console.log(`\n✅ Završeno! Dodato ukupno ${totalFixed} throw Error izjava`);
console.log(`ℹ️  Sada pokreni: npm test`);
