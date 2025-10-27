// Test exit code wrapper
const { spawn } = require('child_process');

const testFile = process.argv[2] || 'tests/rezervacija-kompletan.test.js';

console.log(`\n🔍 Testiram exit code za: ${testFile}\n`);

const testProcess = spawn('node', [testFile], {
  cwd: __dirname,
  stdio: 'inherit'
});

testProcess.on('close', (exitCode) => {
  console.log(`\n\n═══════════════════════════════════`);
  console.log(`📊 EXIT CODE: ${exitCode}`);
  console.log(`═══════════════════════════════════\n`);
  
  if (exitCode === 0) {
    console.log('✅ Test je vratio exit code 0 (SUCCESS)');
  } else {
    console.log('❌ Test je vratio exit code', exitCode, '(FAILED)');
  }
  
  process.exit(exitCode);
});
