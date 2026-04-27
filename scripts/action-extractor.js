/**
 * Post-Call Action Extractor
 * Parses V2 coaching transcripts and outputs clean action list
 * 
 * Input: V2 transcript file path
 * Output: JSON array of {owner, action, due_date, priority, source}
 */

const fs = require('fs');
const path = require('path');

/**
 * Extract action items from V2 transcript
 * @param {string} transcriptPath - Path to V2 transcript file
 * @returns {Array} Array of action objects
 */
function extractActions(transcriptPath) {
  const content = fs.readFileSync(transcriptPath, 'utf-8');
  const lines = content.split('\n');
  
  const actions = [];
  let inActionItemsSection = false;
  let currentSection = '';
  
  // Extract client name - look for pattern after ## Client
  let clientName = 'Unknown';
  const clientMatch = content.match(/^##\s+Client\s*\n([^#]+)/m);
  if (clientMatch) {
    const clientLine = clientMatch[1].trim();
    // Take first line, remove markdown formatting
    const namePart = clientLine.split(' - ')[0].replace(/\*\*/g, '').trim();
    if (namePart) clientName = namePart;
  }
  
  // Extract date for context
  const dateMatch = content.match(/\*\*Date:\*\*\s*([^/\n]+)/);
  const callDate = dateMatch ? dateMatch[1].trim() : null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detect section headers
    if (line.startsWith('## ')) {
      currentSection = line.replace('## ', '').toLowerCase();
      if (currentSection.includes('action item')) {
        inActionItemsSection = true;
        continue;
      } else {
        inActionItemsSection = false;
      }
    }
    
    // Parse action items
    if (inActionItemsSection && (line.startsWith('- [ ]') || line.startsWith('- [x]'))) {
      const actionText = line.replace(/^- \[\s?\]/, '').replace(/^- \[x\]/, '').trim();
      
      // Extract owner (look for "@name" or "Brendan to" or "Client to" patterns)
      let owner = clientName;
      if (actionText.match(/^(brendan|you)/i)) {
        owner = 'Brendan';
      } else if (actionText.match(/^(alby|jerry|mervyn|brett|dan|joey|steph|jocelyn)/i)) {
        const nameMatch = actionText.match(/^(alby|jerry|mervyn|brett|dan|joey|steph|jocelyn)/i);
        if (nameMatch) owner = nameMatch[1].charAt(0).toUpperCase() + nameMatch[1].slice(1);
      }
      
      // Extract due date (look for "by [date]", "next [day]", "tomorrow", "within [time]")
      let dueDate = null;
      const dueDatePatterns = [
        /(by\s+tomorrow|by\s+monday|by\s+tuesday|by\s+wednesday|by\s+thursday|by\s+friday|by\s+saturday|by\s+sunday|tomorrow morning|tomorrow afternoon)/i,
        /by\s+(\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec))/i,
        /next\s+(week|month|friday|monday)/i,
        /within\s+(\d+\s+(day|week))/i,
        /(\d{1,2}\/\d{1,2})/
      ];
      
      for (const pattern of dueDatePatterns) {
        const match = actionText.match(pattern);
        if (match) {
          dueDate = match[0];
          break;
        }
      }
      
      // Determine priority based on keywords
      let priority = 'Medium';
      const urgentKeywords = ['urgent', 'asap', 'immediately', 'critical', 'must do'];
      const lowKeywords = ['when possible', 'eventually', 'sometime', 'when you can'];
      
      for (const kw of urgentKeywords) {
        if (actionText.toLowerCase().includes(kw)) {
          priority = 'High';
          break;
        }
      }
      if (priority === 'Medium') {
        for (const kw of lowKeywords) {
          if (actionText.toLowerCase().includes(kw)) {
            priority = 'Low';
            break;
          }
        }
      }
      
      // Clean up action text
      const cleanAction = actionText
        .replace(/^(brendan\s+(to\s+)?|you\s+(need\s+to\s+)?|i\s+(need\s+to\s+)?|we\s+(need\s+to\s+)?)/gi, '')
        .replace(/^(alby|jerry|mervyn|brett|dan|joey|steph|jocelyn)\s+(to\s+)?/gi, '')
        .trim();
      
      // Capitalize first letter
      const finalAction = cleanAction.charAt(0).toUpperCase() + cleanAction.slice(1);
      
      actions.push({
        owner,
        action: finalAction,
        due_date: dueDate,
        priority,
        source: 'Action Items section'
      });
    }
  }
  
  // If no action items found, try to extract from Key Topics
  if (actions.length === 0) {
    const keyTopicsMatch = content.match(/## Key Topics([\s\S]*?)##/);
    if (keyTopicsMatch) {
      const topicsText = keyTopicsMatch[1];
      const topicLines = topicsText.split('\n');
      
      for (const line of topicLines) {
        // Look for action-oriented language in topics
        if (line.match(/need to|should|will|plan to|going to|intend to|must|has to|have to/i)) {
          const actionMatch = line.match(/[-*]\s*(.+)/);
          if (actionMatch) {
            let actionText = actionMatch[1];
            
            // Skip if it's just a description, not an action
            if (actionText.length < 10 || !actionText.match(/need to|should|will|plan to|going to/i)) {
              continue;
            }
            
            // Extract owner
            let owner = clientName;
            if (actionText.match(/^(brendan|you)/i)) {
              owner = 'Brendan';
            }
            
            actions.push({
              owner,
              action: actionText.replace(/^[-*]\s*/, '').trim(),
              due_date: null,
              priority: 'Medium',
              source: 'Key Topics (inferred)'
            });
          }
        }
      }
    }
  }
  
  return {
    call_date: callDate,
    client: clientName,
    actions,
    total_actions: actions.length
  };
}

// CLI usage
if (require.main === module) {
  const transcriptPath = process.argv[2];
  
  if (!transcriptPath) {
    console.log('Usage: node action-extractor.js <path-to-transcript>');
    console.log('Example: node action-extractor.js ../memory/coaching-transcripts/2025-04/01-alby-kennard.md');
    process.exit(1);
  }
  
  const fullPath = path.isAbsolute(transcriptPath) 
    ? transcriptPath 
    : path.join(__dirname, transcriptPath);
  
  if (!fs.existsSync(fullPath)) {
    console.error('File not found:', fullPath);
    process.exit(1);
  }
  
  const result = extractActions(fullPath);
  console.log(JSON.stringify(result, null, 2));
}

module.exports = { extractActions };