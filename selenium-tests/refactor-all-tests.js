const fs = require('fs');
const path = require('path');

const testsDir = path.join(__dirname, 'tests');
const testFiles = fs.readdirSync(testsDir).filter(f => f.endsWith('.test.js'));

console.log(`📝 Pronađeno ${testFiles.length} testova za refaktorisanje\n`);

let fixed = 0;
let skipped = 0;

testFiles.forEach(file => {
  const filePath = path.join(testsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Proveri da li već koristi selenium-setup
  if (content.includes('require(\'../selenium-setup\')')) {
    console.log(`⏭️  ${file} - već koristi selenium-setup`);
    skipped++;
    return;
  }
  
  // Dodaj require za selenium-setup na početak
  if (!content.includes('const { createDriver') && !content.includes('const createDriver')) {
    // Pronađi prvo require() i dodaj posle njega
    const requireMatch = content.match(/const.*require\(['"]selenium-webdriver['"]\);/);
    if (requireMatch) {
      content = content.replace(
        requireMatch[0],
        `${requireMatch[0]}\nconst { createDriver } = require('../selenium-setup');`
      );
    }
  }
  
  // Zameni .then().catch() pattern sa runTest() ako postoji
  const hasThenCatch = content.match(/(\w+)\(\)\s*\.then\(\s*\(\)\s*=>\s*process\.exit\(0\)\s*\)\s*\.catch/);
  if (hasThenCatch) {
    const funcName = hasThenCatch[1];
    
    // Dodaj runTest require ako još nije dodan
    if (!content.includes('const { createDriver, runTest }')) {
      content = content.replace(
        'const { createDriver }',
        'const { createDriver, runTest }'
      );
    }
    
    // Zameni poziv funkcije sa runTest wrapperom
    content = content.replace(
      new RegExp(`${funcName}\\(\\)\\s*\\.then\\([^}]+\\}\\)\\s*\\.catch\\([^}]+\\}\\);`, 's'),
      `runTest('${file.replace('.test.js', '')}', ${funcName});`
    );
  }
  
  // Sačuvaj izmene
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ ${file} - refaktorisan`);
  fixed++;
});

console.log(`\n📊 Rezultat:`);
console.log(`   ✅ Refaktorisano: ${fixed}`);
console.log(`   ⏭️  Preskočeno: ${skipped}`);
console.log(`   📝 Ukupno: ${testFiles.length}`);
