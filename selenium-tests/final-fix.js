const fs = require('fs');
const path = require('path');

// Fajlovi koje treba popraviti
const files = [
  'admin-blokiranje.test.js',
  'komentari-ocene.test.js',
  'profil-izmena.test.js'
];

const testsDir = path.join(__dirname, 'tests');

function cleanCorruptedLine(line) {
  // Ako linija sadrži PowerShell kod
  if (line.includes('param($match)')) {
    // Ekstraktuj ime varijable
    const varMatch = line.match(/^\s*const\s+(\w+)\s*=\s*await\s+(\w+)\.findElements?\(/);
    if (varMatch) {
      const varName = varMatch[1];
      const object = varMatch[2]; // driver ili firstBad, firstComment, itd.
      const isPlural = line.includes('findElements');
      const method = isPlural ? 'findElements' : 'findElement';
      
      // Razli čite slučajeve:
      if (varName.includes('Star') || varName.includes('Rating')) {
        // Za zvezdice ili ocene - tražimo ikone
        return `    const ${varName} = await ${object}.${method}(By.css('.fa-star, .star, [class*="star"], [class*="rating"]'));`;
      } else if (varName.includes('Button') || varName.includes('Btn')) {
        // Za dugmad - generički XPath
        return `    const ${varName} = await ${object}.${method}(By.xpath('//button[contains(@class, "btn")]'));`;
      } else {
        // Ostali slučajevi
        return `    const ${varName} = await ${object}.${method}(By.css('*'));`;
      }
    }
  }
  
  // Zameni button:contains sa OR logikom u zarezima
  if (line.includes('button:contains') && line.includes(',')) {
    // button:contains("zmeni"), button:contains("redi")
    const textMatches = [...line.matchAll(/button:contains\((['"])([^'"]+)\1\)/g)];
    if (textMatches.length > 0) {
      // Napravi XPath sa OR logikom
      const conditions = textMatches.map(m => `contains(text(), '${m[2]}')`).join(' or ');
      return line.replace(
        /By\.css\((['"])[^)]+\1\)/,
        `By.xpath('//button[${conditions}]')`
      );
    }
  }
  
  // Jednostavni button:contains
  line = line.replace(
    /By\.css\((['"])button:contains\((['"])([^'"]+)\2\)\1\)/g,
    (match, q1, q2, text) => `By.xpath("//button[contains(text(), '${text}')]")`
  );
  
  // a:contains
  line = line.replace(
    /By\.css\((['"])a:contains\((['"])([^'"]+)\2\)\1\)/g,
    (match, q1, q2, text) => `By.xpath("//a[contains(text(), '${text}')]")`
  );
  
  // span:contains
  line = line.replace(
    /By\.css\((['"])span:contains\((['"])([^'"]+)\2\)\1\)/g,
    (match, q1, q2, text) => `By.xpath("//span[contains(text(), '${text}')]")`
  );
  
  // td:contains
  line = line.replace(
    /By\.css\((['"])td:contains\((['"])([^'"]+)\2\)\1\)/g,
    (match, q1, q2, text) => `By.xpath("//td[contains(text(), '${text}')]")`
  );
  
  return line;
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
  const newLines = lines.map(cleanCorruptedLine);
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
