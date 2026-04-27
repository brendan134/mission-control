const fs = require('fs');
const path = require('path');
const { extractActions } = require('./action-extractor');

const transcriptsDir = './memory/coaching-transcripts';
const outputFile = './output/all-action-items.json';

const results = [];

// Get all month directories
const months = fs.readdirSync(transcriptsDir).filter(f => {
  return fs.statSync(path.join(transcriptsDir, f)).isDirectory();
});

for (const month of months) {
  const monthDir = path.join(transcriptsDir, month);
  const files = fs.readdirSync(monthDir).filter(f => f.endsWith('.md'));
  
  console.log(`Processing ${month}: ${files.length} files`);
  
  for (const file of files) {
    const filePath = path.join(monthDir, file);
    try {
      const result = extractActions(filePath);
      if (result.actions.length > 0) {
        results.push(result);
      }
    } catch (e) {
      console.error(`Error processing ${file}:`, e.message);
    }
  }
}

fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
console.log(`\nTotal: ${results.length} calls with actions`);
console.log(`Output: ${outputFile}`);

// Summary stats
const totalActions = results.reduce((sum, r) => sum + r.actions.length, 0);
console.log(`Total action items: ${totalActions}`);

// Owner breakdown
const owners = {};
results.forEach(r => {
  r.actions.forEach(a => {
    owners[a.owner] = (owners[a.owner] || 0) + 1;
  });
});
console.log('\nBy owner:');
Object.entries(owners).sort((a,b) => b[1] - a[1]).forEach(([owner, count]) => {
  console.log(`  ${owner}: ${count}`);
});