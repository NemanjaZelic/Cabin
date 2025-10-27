const fs = require('fs');
const path = require('path');

console.log('🔧 AUTO-FIX: Zamena :contains() sa XPath-om\n');

const testsDir = path.join(__dirname, 'tests');
const testFiles = fs.readdirSync(testsDir).filter(f => f.endsWith('.test.js'));

let fixed = 0;

// Helper funkcija za zamenu CSS selektora sa :contains() u XPath
function convertContainsToXPath(cssSelector) {
  // Primer: button:contains("Odobri") => //button[contains(text(), "Odobri")]
  // Primer: a:contains("Odjava") => //a[contains(text(), "Odjava")]
  
  // Pattern 1: tag:contains("text")
  let xpath = cssSelector.replace(/(\w+):contains\(['"]([^'"]+)['"]\)/g, '//$1[contains(text(), "$2")]');
  
  // Pattern 2: button:contains("text"), .class
  // Ovo je kompleksnije - treba split i OR logika
  if (xpath.includes(',')) {
    const parts = xpath.split(',').map(p => p.trim());
    // Za sada samo uzmi prvi deo
    xpath = parts[0];
  }
  
  // Pattern 3: :not(:contains("text"))
  xpath = xpath.replace(/:not\(:contains\(['"]([^'"]+)['"]\)\)/g, '[not(contains(text(), "$1"))]');
  
  return xpath;
}

testFiles.forEach(file => {
  const filePath = path.join(testsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;
  
  if (content.includes(':contains(')) {
    console.log(`\n📝 ${file}:`);
    
    // Pattern 1: By.css sa :contains
    const lines = content.split('\n');
    const newLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      
      if (line.includes('By.css') && line.includes(':contains(')) {
        console.log(`   🔍 Linija ${i + 1}: ${line.trim().substring(0, 80)}...`);
        
        // Zameni button:contains("text") sa //button[contains(text(), "text")]
        line = line.replace(/By\.css\((['"])([^'"]+)\1\)/g, (match, quote, selector) => {
          if (selector.includes(':contains(')) {
            // Jednostavna transformacija
            let xpath = selector
              .replace(/(\w+):contains\(['"]([^'"]+)['"]\)/g, '//$1[contains(text(), "$2")]')
              .replace(/:not\(:contains\(['"]([^'"]+)['"]\)\)/g, '[not(contains(text(), "$1"))]');
            
            // Ako ima zarez (OR selector), uzmi samo prvi deo
            if (xpath.includes(',')) {
              xpath = xpath.split(',')[0].trim();
            }
            
            console.log(`   ✅ Zamenjeno sa XPath: ${xpath.substring(0, 60)}...`);
            changed = true;
            return `By.xpath(${quote}${xpath}${quote})`;
          }
          return match;
        });
      }
      
      newLines.push(line);
    }
    
    if (changed) {
      content = newLines.join('\n');
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`   💾 Sačuvano!`);
      fixed++;
    }
  }
});

console.log(`\n📊 Popravljeno: ${fixed} fajlova`);
