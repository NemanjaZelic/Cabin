const fs = require('fs');
const path = require('path');

// Fajlovi koje treba popraviti
const files = [
  'admin-blokiranje.test.js',
  'kalendar.test.js',
  'komentari-ocene.test.js',
  'PRAVI-sortiranje.test.js',
  'profil-izmena.test.js',
  'turista.test.js',
  'vikendica-dodavanje.test.js',
  'vlasnik.test.js'
];

const testsDir = path.join(__dirname, 'tests');

function fixContainsSelector(line) {
  // Ako linija sadrži PowerShell kod, očisti je
  if (line.includes('param($match)')) {
    // Ova linija je potpuno oštećena, treba je rekonstruisati
    // Izvuci osnovni format: const varName = await driver.findElements(...)
    const varMatch = line.match(/^\s*const\s+(\w+)\s*=\s*await\s+driver\.findElements\(/);
    if (varMatch) {
      // Rekonstruiši sa generičkim XPath-om
      return `    const ${varMatch[1]} = await driver.findElements(By.xpath('//button[contains(@class, "btn-success") or contains(@class, "btn-primary")]'));`;
    }
    return line; // Ako ne možemo da rekonstruišemo, ostavi kako jeste
  }
  
  let newLine = line;
  
  // Zameni button:contains("text")
  newLine = newLine.replace(
    /By\.css\((['"])button:contains\((['"])([^'"]+)\2\)\1\)/g,
    (match, q1, q2, text) => `By.xpath("//button[contains(text(), '${text}')]")`
  );
  
  // Zameni a:contains("text")
  newLine = newLine.replace(
    /By\.css\((['"])a:contains\((['"])([^'"]+)\2\)\1\)/g,
    (match, q1, q2, text) => `By.xpath("//a[contains(text(), '${text}')]")`
  );
  
  // Zameni span:contains("text")
  newLine = newLine.replace(
    /By\.css\((['"])span:contains\((['"])([^'"]+)\2\)\1\)/g,
    (match, q1, q2, text) => `By.xpath("//span[contains(text(), '${text}')]")`
  );
  
  // Zameni td:contains("text")
  newLine = newLine.replace(
    /By\.css\((['"])td:contains\((['"])([^'"]+)\2\)\1\)/g,
    (match, q1, q2, text) => `By.xpath("//td[contains(text(), '${text}')]")`
  );
  
  // Zameni div:contains("text")
  newLine = newLine.replace(
    /By\.css\((['"])div:contains\((['"])([^'"]+)\2\)\1\)/g,
    (match, q1, q2, text) => `By.xpath("//div[contains(text(), '${text}')]")`
  );
  
  // Složeniji selektori sa zarezima - zameni samo :contains deo
  // .btn-success, button:contains("text") -> samo koristi XPath
  if (newLine.includes(':contains') && newLine.includes(',')) {
    // Izvuci tekst iz :contains
    const containsMatch = newLine.match(/:contains\((['"])([^'"]+)\1\)/);
    if (containsMatch) {
      const text = containsMatch[2];
      // Zameni celu CSS selektor sa XPath-om
      newLine = newLine.replace(
        /By\.css\((['"])[^)]*:contains\([^)]+\)[^)]*\1\)/,
        `By.xpath("//button[contains(text(), '${text}') or contains(@class, 'btn-success') or contains(@class, 'btn-primary')]")`
      );
    }
  }
  
  return newLine;
}

let totalFixed = 0;

for (const file of files) {
  const filePath = path.join(testsDir, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  ${file} ne postoji`);
    continue;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const newLines = lines.map(fixContainsSelector);
  const newContent = newLines.join('\n');
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ ${file}`);
    totalFixed++;
  } else {
    console.log(`⚪ ${file} - nema promene`);
  }
}

console.log(`\n📊 Popravljeno: ${totalFixed} fajlova`);
