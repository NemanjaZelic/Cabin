const fs = require('fs');
const path = require('path');

const testsDir = path.join(__dirname, 'tests');
const files = fs.readdirSync(testsDir).filter(f => f.endsWith('.test.js'));

let totalFixed = 0;

for (const file of files) {
  const filePath = path.join(testsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Proveri da li ima i import sleep I definiciju sleep
  const hasImport = content.includes("require('../selenium-setup')") && content.includes('sleep');
  const hasSleepFunction = content.includes('async function sleep(ms)');
  
  if (hasImport && hasSleepFunction) {
    // Ukloni duplirani sleep function
    const newContent = content.replace(/\nasync function sleep\(ms\) \{\s*return new Promise\(resolve => setTimeout\(resolve, ms\)\);\s*\}\s*\n/g, '\n');
    
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ ${file} - uklonjenadup duplikata sleep funkcije`);
      totalFixed++;
    }
  }
}

console.log(`\n📊 Popravljeno: ${totalFixed} fajlova`);
