// Script za popravku svih testova da vraćaju exit code
const fs = require('fs');
const path = require('path');

const testsDir = path.join(__dirname, 'tests');
const testFiles = fs.readdirSync(testsDir)
  .filter(file => file.endsWith('.test.js'));

let fixed = 0;

testFiles.forEach(file => {
  const filePath = path.join(testsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Pattern: testFunction().catch(console.error);
  const oldPattern = /(\w+)\(\)\.catch\(console\.error\);/g;
  const newPattern = '$1()\n  .then(() => process.exit(0))\n  .catch((error) => {\n    console.error(error);\n    process.exit(1);\n  });';
  
  if (oldPattern.test(content)) {
    content = content.replace(oldPattern, newPattern);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${file} - Popravljen`);
    fixed++;
  }
});

console.log(`\n✅ Popravljeno ${fixed} testova`);
