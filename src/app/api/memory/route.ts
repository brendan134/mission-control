import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const memoryDir = '/data/.openclaw/memory';
  
  try {
    const files = fs.readdirSync(memoryDir).filter(f => f.endsWith('.md'));
    
    const memories = files
      .map(file => {
        const filePath = path.join(memoryDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const date = file.replace('.md', '');
        
        // Parse sections from markdown
        const sections: { title: string; content: string }[] = [];
        const lines = content.split('\n');
        let currentSection = { title: 'General', content: '' };
        
        lines.forEach(line => {
          if (line.startsWith('## ')) {
            if (currentSection.content) {
              sections.push({ ...currentSection, content: currentSection.content.trim() });
            }
            currentSection = { title: line.replace('## ', ''), content: '' };
          } else if (line.startsWith('### ')) {
            // Skip h3 headers for now
          } else {
            currentSection.content += line + '\n';
          }
        });
        
        if (currentSection.content) {
          sections.push({ ...currentSection, content: currentSection.content.trim() });
        }
        
        return {
          date,
          content,
          sections: sections.filter(s => s.content)
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date)); // Sort newest first
    
    return NextResponse.json(memories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load memories' }, { status: 500 });
  }
}