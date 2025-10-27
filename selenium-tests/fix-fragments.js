const fs = require('fs');
const path = require('path');

console.log('🔧 FIX: Brisanje preostalih .then().catch() fragmenata\n');

const testsDir = path.join(__dirname, 'tests');
const testFiles = fs.readdirSync(testsDir).filter(f => f.endsWith('.test.js'));

let fixed = 0;

testFiles.forEach(file => {
  const filePath = path.join(testsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;
  
  // Ukloni preostale fragmente od .then().catch()
  const fragments = [
    /\s*process\.exit\(0\);?\s*$/gm,
    /\s*process\.exit\(1\);?\s*\}\s*\);?\s*$/gm,
    /\s*console\.log\(['"]\[DEBUG-TEST\][^)]+\);?\s*$/gm,
    /\s*console\.error\(['"]\[DEBUG-TEST\][^)]+\);?\s*$/gm,
    /\s*}\s*\)\s*;\s*$/gm,
    /\s*console\.error\(error\);?\s*$/gm
  ];
  
  fragments.forEach(regex => {
    if (regex.test(content)) {
      content = content.replace(regex, '');
      changed = true;
    }
  });
  
  // Dodaj sleep ako ga nema
  if (content.includes('sleep is not defined') || (content.includes('await sleep(') && !content.includes('async function sleep'))) {
    if (!content.includes('const { createDriver, runTest, sleep }')) {
      content = content.replace(
        'const { createDriver, runTest }',
        'const { createDriver, runTest, sleep }'
      );
      changed = true;
      console.log(`✅ ${file} - Dodat sleep import`);
    }
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`💾 ${file} - Sačuvano`);
    fixed++;
  }
});

console.log(`\n📊 Popravljeno: ${fixed}/${testFiles.length}`);
