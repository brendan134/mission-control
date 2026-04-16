/**
 * Humanizer - Strip AI Writing Patterns
 * 
 * Based on Wikipedia "Signs of AI writing" patterns and common AI tell detection.
 * Removes: stock phrases, hedging, formulaic transitions, rule of three overuse,
 * hallmark vocabulary, structural tics, performed authenticity.
 */

const STOCK_PHRASES = [
  'at the end of the day',
  "it's worth noting",
  "it is worth noting",
  "in today's digital age",
  "as technology continues to evolve",
  "in today's fast-paced world",
  "move forward",
  'moving forward',
  "ultimately",
  "in essence",
  "in conclusion",
  "to sum up",
  "all things considered",
  "by and large",
  "the fact of the matter",
  "at this point in time",
  "due to the fact that",
  "in the event that",
  "for all intents and purposes",
  "needless to say",
  "it goes without saying",
  "as a matter of fact",
  "in point of fact",
  "last but not least",
  "the bottom line is",
  "the long and short of it"
];

const HEDGING_PATTERNS = [
  /\bmay\b/gi,
  /\bmight\b/gi,
  /\bcould\b/gi,
  /\bmaybe\b/gi,
  /\bperhaps\b/gi,
  /\bpossibly\b/gi,
  /it could be argued that/gi,
  /it's possible that/gi,
  /one might say/gi,
  /it seems that/gi,
  /it appears that/gi,
  /\bapparently\b/gi,
  /\bpresumably\b/gi
];

const FORMULAIC_TRANSITIONS = [
  'firstly', 'secondly', 'thirdly', 'fourthly', 'fifthly',
  'on the other hand',
  'additionally',
  'furthermore',
  'moreover',
  'that being said',
  'having said that',
  'with that in mind',
  'in addition to',
  'as a result',
  'consequently',
  'therefore',
  'thus',
  'hence'
];

const HALLMARK_VOCAB = {
  'tapestry': 'picture',
  'delve': 'dig',
  'leverage': 'use',
  'testament': 'proof',
  'myriad': 'many',
  'facet': 'aspect',
  'ever-evolving': 'changing',
  'cutting-edge': 'modern',
  'game-changer': 'breakthrough',
  'robust': 'strong',
  'seamless': 'smooth',
  'revolutionary': 'new',
  'innovative': 'new',
  'transformative': 'changing',
  'optimize': 'improve',
  'enhance': 'improve',
  'streamline': 'simplify',
  'empower': 'enable',
  'foster': 'encourage',
  'cultivate': 'grow',
  'synergy': 'cooperation',
  'leveraging': 'using',
  'diving deep': 'exploring',
  'at the forefront': 'leading',
  'pioneering': 'leading',
  'unparalleled': 'unique',
  'unmatched': 'best'
};

const VAPID_OPENERS = [
  /^as .* continues to evolve/i,
  /^in today's .* world/i,
  /^the .* landscape/i,
  /^in the realm of/i,
  /^when it comes to/i,
  /^regarding/i,
  /^with regards to/i,
  /^as we .* in the/i
];

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Detect AI patterns in text
 * @param {string} text - Input text
 * @returns {Object} Detection results
 */
function detect(text) {
  const results = {
    stockPhrases: [],
    hedging: [],
    formulaic: [],
    hallmark: [],
    structural: [],
    total: 0
  };

  // Stock phrases - case insensitive with proper escaping
  STOCK_PHRASES.forEach(phrase => {
    const regex = new RegExp(escapeRegex(phrase), 'gi');
    const matches = text.match(regex);
    if (matches) {
      results.stockPhrases.push({ phrase, count: matches.length });
    }
  });

  // Hedging
  HEDGING_PATTERNS.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      results.hedging.push({ pattern: pattern.source, count: matches.length });
    }
  });

  // Formulaic transitions
  FORMULAIC_TRANSITIONS.forEach(word => {
    const regex = new RegExp('\\b' + escapeRegex(word) + '\\b', 'gi');
    const matches = text.match(regex);
    if (matches) {
      results.formulaic.push({ word, count: matches.length });
    }
  });

  // Hallmark vocabulary
  Object.keys(HALLMARK_VOCAB).forEach(word => {
    const regex = new RegExp('\\b' + escapeRegex(word) + '\\b', 'gi');
    const matches = text.match(regex);
    if (matches) {
      results.hallmark.push({ 
        word, 
        replacement: HALLMARK_VOCAB[word],
        count: matches.length 
      });
    }
  });

  // Structural (em dashes)
  const emDashCount = (text.match(/—/g) || []).length;
  if (emDashCount > 2) {
    results.structural.push({ type: 'em-dashes', count: emDashCount });
  }

  // Rule of three detection - simplified pattern
  const noNoJustPattern = /\bNo\s+\w+[^.]*\.\s*No\s+\w+[^.]*\.\s*(Just|Because)\s+\w+/gi;
  const ruleMatches = text.match(noNoJustPattern);
  if (ruleMatches) {
    results.structural.push({ type: 'rule-of-three', count: 1 });
  }

  // Vapid openers
  VAPID_OPENERS.forEach(pattern => {
    if (pattern.test(text)) {
      results.structural.push({ type: 'vapid-opener', pattern: pattern.source });
    }
  });

  // Calculate total
  results.total = 
    results.stockPhrases.reduce((sum, m) => sum + m.count, 0) +
    results.hedging.reduce((sum, m) => sum + m.count, 0) +
    results.formulaic.reduce((sum, m) => sum + m.count, 0) +
    results.hallmark.reduce((sum, m) => sum + m.count, 0) +
    results.structural.reduce((sum, m) => sum + (m.count || 0), 0);

  return results;
}

/**
 * Humanize text by removing AI patterns
 * @param {string} text - Input text
 * @param {Object} options - Options
 * @returns {Object} Result with cleaned text and report
 */
function humanize(text, options = {}) {
  const minLength = options.minLength || 200;
  
  // Skip short texts
  if (text.length < minLength) {
    return {
      text,
      changed: false,
      reason: 'under minimum length',
      report: null
    };
  }

  let result = text;

  // 1. Remove/replace stock phrases (case insensitive)
  STOCK_PHRASES.forEach(phrase => {
    const regex = new RegExp(escapeRegex(phrase), 'gi');
    result = result.replace(regex, ' ');
  });

  // 2. Reduce hedging (keep some for naturalness, replace ~50%)
  HEDGING_PATTERNS.forEach(pattern => {
    let count = 0;
    result = result.replace(pattern, (match) => {
      count++;
      return count % 2 === 0 ? ' ' : match.toLowerCase();
    });
  });

  // 3. Reduce formulaic transitions (keep one max per paragraph)
  const paragraphs = result.split(/\n\n+/);
  const processedParagraphs = paragraphs.map(para => {
    let count = 0;
    FORMULAIC_TRANSITIONS.forEach(word => {
      const regex = new RegExp('\\b' + escapeRegex(word) + '\\b', 'gi');
      para = para.replace(regex, (match) => {
        count++;
        return count > 1 ? ' ' : match;
      });
    });
    return para;
  });
  result = processedParagraphs.join('\n\n');

  // 4. Replace hallmark vocabulary
  Object.keys(HALLMARK_VOCAB).forEach(word => {
    const regex = new RegExp('\\b' + escapeRegex(word) + '\\b', 'gi');
    result = result.replace(regex, HALLMARK_VOCAB[word]);
  });

  // 5. Reduce em dashes (keep max 2)
  let dashCount = 0;
  result = result.replace(/—/g, () => {
    dashCount++;
    return dashCount > 2 ? ' ' : '—';
  });

  // 6. Clean up empty parentheses and brackets from removals
  result = result.replace(/\(\s*\)/g, '');
  result = result.replace(/\[\s*\]/g, '');

  // 7. Clean up multiple spaces created by removals
  result = result.replace(/\s+/g, ' ');

  // 8. Clean up orphaned punctuation
  result = result.replace(/\.\s+\./g, '.');
  result = result.replace(/,\s+,/g, ',');
  
  // 9. Clean up leading/trailing punctuation
  result = result.replace(/^\s*[\.,]\s*/g, '');
  result = result.replace(/\s*[\.,]\s*$/g, '');

  const detection = detect(text);
  const afterDetection = detect(result);

  return {
    text: result.trim(),
    changed: detection.total > afterDetection.total,
    originalCount: detection.total,
    remainingCount: afterDetection.total,
    report: {
      removed: detection.total - afterDetection.total,
      stockPhrases: detection.stockPhrases.length,
      hedging: detection.hedging.length,
      formulaic: detection.formulaic.length,
      hallmark: detection.hallmark.length,
      structural: detection.structural.length
    }
  };
}

/**
 * Format humanizer report
 * @param {Object} report - Report from humanize()
 * @returns {string} Formatted report
 */
function formatReport(report) {
  if (!report || !report.changed) {
    return `## No changes needed\n\nText was under 200 words or no patterns detected.`;
  }

  return `## Humanized

${report.text}

## Changes Made
- Removed ${report.report.stockPhrases} stock phrases
- Reduced ${report.report.hedging} hedging expressions
- Cleaned ${report.report.formulaic} formulaic transitions
- Simplified ${report.report.hallmark} hallmark words
- Fixed ${report.report.structural} structural patterns
- **Total: ${report.report.removed} patterns fixed**`;
}

module.exports = {
  detect,
  humanize,
  formatReport,
  STOCK_PHRASES,
  HEDGING_PATTERNS,
  FORMULAIC_TRANSITIONS,
  HALLMARK_VOCAB
};
