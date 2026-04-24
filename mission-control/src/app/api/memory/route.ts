import fs from 'fs';
import path from 'path';

const MEMORY_DIR = path.join(process.cwd(), '..', 'memory');
const LONGTERM_FILE = path.join(process.cwd(), '..', 'MEMORY.md');

export async function GET() {
  const memories: { date: string; entries: { time?: string; content: string }[] }[] = [];
  
  // Read daily memories
  try {
    const files = fs.readdirSync(MEMORY_DIR).filter(f => {
      // Only include files matching YYYY-MM-DD pattern
      return f.match(/^\d{4}-\d{2}-\d{2}\.md$/) && f.endsWith('.md');
    });
    
    for (const file of files) {
      const date = file.replace('.md', '');
      const content = fs.readFileSync(path.join(MEMORY_DIR, file), 'utf-8');
      const entries = parseDailyMemory(content);
      
      memories.push({ date, entries });
    }
  } catch (e) {
    // Directory may not exist
  }
  
  // Read long-term memory
  let longTermMemory = '';
  try {
    longTermMemory = fs.readFileSync(LONGTERM_FILE, 'utf-8');
  } catch (e) {
    // File may not exist
  }
  
  // Sort by date descending
  memories.sort((a, b) => b.date.localeCompare(a.date));
  
  return Response.json({
    daily: memories,
    longTerm: parseLongTermMemory(longTermMemory),
  });
}

function parseDailyMemory(content: string): { time?: string; content: string }[] {
  const entries: { time?: string; content: string }[] = [];
  const lines = content.split('\n');
  
  let currentTitle = '';
  let currentContent = '';
  
  for (const line of lines) {
    if (line.startsWith('## ') || line.startsWith('### ')) {
      // Save previous entry
      if (currentTitle || currentContent.trim()) {
        const fullContent = currentTitle + (currentTitle && currentContent ? '\n' : '') + currentContent.trim();
        if (fullContent.trim()) {
          entries.push({
            content: fullContent.trim()
          });
        }
      }
      currentTitle = line.replace(/^#+\s/, '').trim();
      currentContent = '';
    } else if (line.startsWith('# ')) {
      // Skip main title
    } else {
      currentContent += line + '\n';
    }
  }
  
  // Don't forget last entry
  if (currentTitle || currentContent.trim()) {
    const fullContent = currentTitle + (currentTitle && currentContent ? '\n' : '') + currentContent.trim();
    if (fullContent.trim()) {
      entries.push({
        content: fullContent.trim()
      });
    }
  }
  
  return entries;
}

function parseLongTermMemory(content: string): { sections: { title: string; content: string }[] } {
  const sections: { title: string; content: string }[] = [];
  const lines = content.split('\n');
  
  let currentTitle = '';
  let currentContent = '';
  
  for (const line of lines) {
    if (line.startsWith('### ')) {
      // Save previous section
      if (currentTitle && currentContent) {
        sections.push({ title: currentTitle, content: currentContent.trim() });
      }
      currentTitle = line.replace('### ', '').trim();
      currentContent = '';
    } else if (line.startsWith('## ') || line.startsWith('# ')) {
      // Top level header - skip
    } else if (currentTitle) {
      currentContent += line + '\n';
    }
  }
  
  // Don't forget last section
  if (currentTitle && currentContent) {
    sections.push({ title: currentTitle, content: currentContent.trim() });
  }
  
  return { sections };
}