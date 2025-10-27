const fs = require('fs');
const path = require('path');

console.log('🔧 FIX: Zamena :contains() sa XPath-om\n');

const testsDir = path.join(__dirname, 'tests');
const testFiles = fs.readdirSync(testsDir).filter(f => f.endsWith('.test.js'));

let fixed = 0;

testFiles.forEach(file => {
  const filePath = path.join(testsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;
  
  // Proveri da li ima :contains()
  if (content.includes(':contains(')) {
    console.log(`\n📝 ${file}:`);
    
    // Zameni button:contains() sa XPath pristupom
    // Pattern: button:contains("text")
    const regex = /By\.css\(['"]button:contains\(['"]([^'"]+)['"]\)['"]\)/g;
    const matches = [...content.matchAll(regex)];
    
    matches.forEach(match => {
      const text = match[1];
      console.log(`   - button:contains("${text}")`);
    });
    
    // Za sada samo reportuj, ne menjaj automatski
    // jer `:contains()` može biti u kompleksnim selekorima
    console.log(`   ⚠️  Treba manuelni fix!`);
    fixed++;
  }
});

console.log(`\n\n📊 Pronađeno ${fixed} fajlova sa :contains() selektorima`);
console.log(`\n💡 REŠENJE:`);
console.log(`   Zameni: By.css('button:contains("Odobri")')`);
console.log(`   Sa:     By.xpath('//button[contains(text(), "Odobri")]')`);
