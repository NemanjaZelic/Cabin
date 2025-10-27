const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.log('\n🧪 POKRETANJE SVIH TESTOVA');
console.log('═'.repeat(80));
console.log(`📅 Vreme: ${new Date().toLocaleString('sr-RS')}\n`);

const testsDir = path.join(__dirname, 'tests');
const testFiles = fs.readdirSync(testsDir)
  .filter(file => file.endsWith('.test.js'))
  .sort();

const results = {
  passed: [],
  failed: [],
  total: 0,
  startTime: Date.now()
};

async function runTest(testFile) {
  const testPath = path.join(testsDir, testFile);
  const testName = testFile.replace('.test.js', '');
  
  console.log(`\n${'─'.repeat(80)}`);
  console.log(`🧪 Test ${results.total + 1}/${testFiles.length}: ${testName}`);
  console.log('─'.repeat(80));
  
  const startTime = Date.now();
  
  return new Promise((resolve) => {
    const testProcess = spawn('node', [testPath], {
      cwd: __dirname,
      env: { ...process.env },
      stdio: 'inherit', // PROMENA: inherit umesto pipe da bi async operacije radile
      shell: false
    });
    
    testProcess.on('close', (exitCode) => {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      
      console.log(`\n[DEBUG] Test "${testName}" zavr\u0161io sa exit code: ${exitCode}`);
      
      if (exitCode === 0) {
        console.log(`✅ PROŠAO - ${duration}s`);
        results.passed.push({ name: testName, duration });
      } else {
        console.log(`\n❌ PUKAO - ${duration}s`);
        console.log(`   Exit Code: ${exitCode}`);
        results.failed.push({ 
          name: testName, 
          duration,
          error: `Exit code ${exitCode}`
        });
      }
      
      results.total++;
      resolve();
    });
    
    testProcess.on('error', (error) => {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`\n❌ PUKAO - ${duration}s`);
      console.log(`   Greška: ${error.message}`);
      
      results.failed.push({ 
        name: testName, 
        duration,
        error: error.message
      });
      
      results.total++;
      resolve();
    });
  });
}

async function runAllTests() {
  console.log(`📋 Pronađeno ${testFiles.length} testova\n`);
  
  for (const testFile of testFiles) {
    await runTest(testFile);
  }
  
  // FINALNI IZVEŠTAJ
  const totalDuration = ((Date.now() - results.startTime) / 1000).toFixed(2);
  
  console.log('\n\n');
  console.log('═'.repeat(80));
  console.log('📊 FINALNI REZULTAT');
  console.log('═'.repeat(80));
  console.log(`✅ Prošli:   ${results.passed.length}/${results.total}`);
  console.log(`❌ Pukli:    ${results.failed.length}/${results.total}`);
  console.log(`⏱️  Vreme:    ${totalDuration}s`);
  console.log('═'.repeat(80));
  
  if (results.passed.length > 0) {
    console.log('\n✅ PROŠLI TESTOVI:');
    results.passed.forEach((test, i) => {
      console.log(`   ${i + 1}. ${test.name} (${test.duration}s)`);
    });
  }
  
  if (results.failed.length > 0) {
    console.log('\n❌ PUKLI TESTOVI:');
    results.failed.forEach((test, i) => {
      console.log(`   ${i + 1}. ${test.name} (${test.duration}s)`);
      console.log(`      Greška: ${test.error}`);
    });
  }
  
  console.log('\n');
  
  // Exit sa greškom ako ima test koji nije prošao
  process.exit(results.failed.length > 0 ? 1 : 0);
}

runAllTests().catch(error => {
  console.error('\n💥 KRITIČNA GREŠKA:', error);
  process.exit(1);
});
