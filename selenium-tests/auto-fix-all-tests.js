const fs = require('fs');
const path = require('path');

console.log('🔧 AUTO-FIX: Dodavanje selenium-setup.js u sve testove\n');

const testsDir = path.join(__dirname, 'tests');
const testFiles = fs.readdirSync(testsDir)
  .filter(f => f.endsWith('.test.js'))
  .filter(f => f !== 'sortiranje.test.js'); // Već je popravljen

let fixed = 0;

testFiles.forEach(file => {
  console.log(`\n📝 ${file}:`);
  const filePath = path.join(testsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;
  
  // 1. Proveri da li već ima selenium-setup
  if (content.includes("require('../selenium-setup')")) {
    console.log('   ⏭️  Već koristi selenium-setup');
    return;
  }
  
  // 2. Zameni utils.js sa selenium-setup.js
  if (content.includes("require('./utils')") || content.includes("require('../utils')")) {
    content = content.replace(
      /const.*require\(['"]\.\.?\/utils['"]\);?/g,
      "const { createDriver, runTest } = require('../selenium-setup');"
    );
    console.log('   ✅ Zamenjen utils.js sa selenium-setup.js');
    changed = true;
  }
  
  // 3. Dodaj selenium-setup import ako ga nema
  if (!content.includes('selenium-setup') && content.includes('selenium-webdriver')) {
    // Pronađi prvi require('selenium-webdriver')
    const match = content.match(/(const.*require\(['"]selenium-webdriver['"]\);)/);
    if (match) {
      content = content.replace(
        match[1],
        `${match[1]}\nconst { createDriver, runTest } = require('../selenium-setup');`
      );
      console.log('   ✅ Dodat import selenium-setup');
      changed = true;
    }
  }
  
  // 4. Zameni new Builder() sa createDriver()
  if (content.includes('new Builder()')) {
    // Pronađi celu Builder konstrukciju
    const builderRegex = /const driver = await new Builder\(\)\s*\.forBrowser\(['"]chrome['"]\)\s*\.setChromeOptions\(options\)\s*\.build\(\);/gs;
    
    if (builderRegex.test(content)) {
      content = content.replace(
        builderRegex,
        'const driver = await createDriver(false); // headless = false'
      );
      console.log('   ✅ Zamenjen new Builder() sa createDriver()');
      changed = true;
    }
  }
  
  // 5. Zameni .then().catch() sa runTest()
  const thenCatchRegex = /(\w+)\(\)\s*\.then\(\s*\(\)\s*=>\s*{\s*console\.log[^}]+\s*process\.exit\(0\);?\s*}\s*\)\s*\.catch\(\s*\(error\)\s*=>\s*{\s*console\.error[^}]+\s*process\.exit\(1\);?\s*}\s*\);/gs;
  
  const match = content.match(/(\w+)\(\)\s*\.then\(/);
  if (match) {
    const funcName = match[1];
    
    // Izvuci naziv testa iz file name
    const testName = file
      .replace('.test.js', '')
      .replace('PRAVI-', '')
      .replace(/-/g, ' ')
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    
    // Zameni sa runTest()
    content = content.replace(
      /\w+\(\)\s*\.then\([^;]+\);/gs,
      `runTest('${testName}', ${funcName});`
    );
    console.log(`   ✅ Dodat runTest() wrapper`);
    changed = true;
  }
  
  // 6. Sačuvaj ako je bilo izmena
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`   💾 Sačuvano!`);
    fixed++;
  } else {
    console.log('   ⚠️  Nisu nađene izmene');
  }
});

console.log(`\n\n📊 FINALNI REZULTAT:`);
console.log(`   ✅ Popravljeno: ${fixed}/${testFiles.length}`);
console.log(`\n✨ Svi testovi sada koriste selenium-setup.js!`);
