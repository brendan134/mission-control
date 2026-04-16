/**
 * Humanizer Regression Tests
 * 
 * Tests to catch AI writing patterns that keep coming back despite the rules.
 * Run: node tests/regression.test.js
 */

const { detect, humanize, formatReport, STOCK_PHRASES, HALLMARK_VOCAB } = require('../lib/humanizer');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (e) {
    console.log(`❌ ${name}`);
    console.log(`   ${e.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function h(text) {
  return humanize(text, { minLength: 10 });
}

// === STOCK PHRASES TESTS ===

test('Detects "at the end of the day"', () => {
  const result = detect('At the end of the day, we succeed.');
  assert(result.stockPhrases.length > 0, 'Should detect stock phrase');
});

test('Removes "it\'s worth noting"', () => {
  const result = h("It's worth noting that this is important.");
  assert(!result.text.includes("it's worth noting"), 'Should remove phrase');
});

test('Removes "in conclusion"', () => {
  const result = h('In conclusion, this matters.');
  assert(!result.text.includes('In conclusion'), 'Should remove phrase');
});

test('Detects multiple stock phrases', () => {
  const result = detect('At the end of the day, we move forward ultimately.');
  assert(result.stockPhrases.length >= 3, 'Should detect 3+ phrases');
});

// === HEDGING TESTS ===

test('Detects hedging language', () => {
  const result = detect('This could be important maybe.');
  assert(result.hedging.length > 0, 'Should detect hedging');
});

test('Reduces hedging', () => {
  // With multiple occurrences, should reduce at least some
  const result = h('This could maybe perhaps might work. That could maybe perhaps might help.');
  const hedgeCount = (result.text.match(/could|maybe|perhaps|might/gi) || []).length;
  assert(hedgeCount < 8, 'Should reduce some hedging (had ' + hedgeCount + ')');
});

// === HALLMARK VOCAB TESTS ===

test('Detects "leverage"', () => {
  const result = detect('We leverage this tool.');
  assert(result.hallmark.length > 0, 'Should detect hallmark');
});

test('Replaces "tapestry" with "picture"', () => {
  const result = h('The tapestry of experience matters.');
  assert(result.text.includes('picture'), 'Should replace hallmark word');
  assert(!result.text.includes('tapestry'), 'Should remove original');
});

test('Replaces "delve" with "dig"', () => {
  const result = h('We delve into the data.');
  assert(result.text.includes('dig'), 'Should replace');
  assert(!result.text.includes('delve'), 'Should remove original');
});

test('Replaces multiple hallmarks', () => {
  const result = h('This is a transformative leverage of innovative tools.');
  assert(result.text.includes('use'), 'Should replace leverage');
  assert(result.text.includes('new'), 'Should replace innovative');
});

// === STRUCTURAL TESTS ===

test('Detects excessive em dashes', () => {
  const result = detect('This is — frankly — amazing — and — true.');
  assert(result.structural.some(s => s.type === 'em-dashes'), 'Should detect em-dashes');
});

test('Reduces em dashes to max 2', () => {
  const result = h('This — is — too — many — dashes.');
  const dashCount = (result.text.match(/—/g) || []).length;
  assert(dashCount <= 2, `Should have max 2 dashes, had ${dashCount}`);
});

test('Detects Rule of Three', () => {
  const result = detect('No shortcuts. No excuses. Just results.');
  assert(result.structural.some(s => s.type === 'rule-of-three'), 'Should detect rule of three');
});

// === EDGE CASES ===

test('Skips short text under 200 chars', () => {
  const result = humanize('This is short.');
  assert(!result.changed, 'Should not process short text');
});

test('Preserves meaningful content', () => {
  const result = h('We built a system that helps people. It works well. People trust it.');
  assert(result.text.length > 20, 'Should preserve meaningful content');
});

test('Handles empty input', () => {
  const result = humanize('');
  assert(result.text === '', 'Should handle empty');
});

test('Handles text with only patterns', () => {
  const result = h('At the end of the day we leverage tools.');
  assert(result.changed, 'Should detect changes');
  assert(result.text.length > 0, 'Should have some output');
});

// === REGRESSION: Common failing patterns ===

test('REGRESSION: "myriad" detection', () => {
  const result = detect('A myriad of options exists.');
  assert(result.hallmark.some(h => h.word === 'myriad'), 'Should detect myriad');
});

test('REGRESSION: "cutting-edge" detection', () => {
  const result = detect('Cutting-edge technology');
  assert(result.hallmark.some(h => h.word === 'cutting-edge'), 'Should detect cutting-edge');
});

test('REGRESSION: "in today\'s fast-paced world"', () => {
  const result = detect("In today's fast-paced world, technology evolves.");
  assert(result.stockPhrases.length > 0, 'Should detect vapid opener');
});

test('REGRESSION: "furthermore" detection', () => {
  const result = detect('Furthermore, we proceed.');
  assert(result.formulaic.some(f => f.word === 'furthermore'), 'Should detect furthermore');
});

test('REGRESSION: Double spaces after removal', () => {
  const result = h('At the end of  the day.');
  assert(!result.text.includes('  '), 'Should not have double spaces');
});

// === INTEGRATION ===

test('Full humanization flow', () => {
  const input = `At the end of the day, we leverage cutting-edge tools to deliver transformative results. 
Furthermore, this could maybe work. No shortcuts. No excuses. Just success.

In today's fast-paced world, we delve into the myriad challenges.`;
  
  const result = h(input);
  
  assert(result.changed, 'Should detect changes');
  assert(!result.text.includes('At the end of the day'), 'Should remove stock phrase');
  assert(!result.text.includes('leverage'), 'Should replace leverage');
  assert(!result.text.includes('cutting-edge'), 'Should replace cutting-edge');
  assert(result.report.removed > 5, 'Should remove multiple patterns');
});

test('Report generation', () => {
  const result = h('At the end of the day we leverage tools.');
  const report = formatReport(result);
  assert(report.includes('Humanized'), 'Should have header');
  assert(report.includes('Changes Made'), 'Should have section');
});

// === SUMMARY ===

console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

if (failed > 0) {
  console.log('\n⚠️  Some tests failed. Fix patterns and re-run.');
  process.exit(1);
} else {
  console.log('\n✅ All regression tests passed.');
  process.exit(0);
}