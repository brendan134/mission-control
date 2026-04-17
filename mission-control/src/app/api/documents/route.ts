import fs from 'fs';
import path from 'path';

const DOCS_DIR = path.join(process.cwd(), '..');

function getFiles(dir: string, relativePath: string = ''): any[] {
  const files: any[] = [];
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const itemPath = relativePath ? `${relativePath}/${item}` : item;
      if (item.startsWith('.') || item === 'node_modules' || item === 'memory' || item === 'tmp' || item === 'mission-control') continue;
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        files.push(...getFiles(fullPath, itemPath));
      } else if (item.endsWith('.md') || item.endsWith('.txt')) {
        let preview = '';
        try {
          const content = fs.readFileSync(fullPath, 'utf-8');
          preview = content.substring(0, 300).replace(/[#*`\n]/g, ' ').trim();
        } catch (e) { preview = ''; }
        let category = 'Other';
        if (itemPath.startsWith('workflows/')) category = 'Workflow';
        else if (itemPath.startsWith('content/')) category = 'Content';
        else if (itemPath.startsWith('podcast/')) category = 'Podcast';
        else if (itemPath.startsWith('packs/')) category = 'Packs';
        else if (itemPath.startsWith('curriculum/')) category = 'Curriculum';
        else if (itemPath.startsWith('RULES') || itemPath.startsWith('MODES') || itemPath.startsWith('SPECIALISTS')) category = 'System';
        
        // Generate meaningful title
        let title = item.replace(/\.(md|txt)$/, '').replace(/-/g, ' ').replace(/_/g, ' ');
        // Use first line of content as subtitle hint if available
        let subtitle = '';
        try {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const firstLine = content.split('\n').find(l => l.trim() && !l.startsWith('#'));
          if (firstLine) subtitle = firstLine.substring(0, 60).trim();
        } catch (e) {}
        
        files.push({ 
          title, 
          subtitle,
          path: itemPath, 
          category, 
          date: stats.mtime.toISOString().split('T')[0], 
          size: stats.size, 
          preview: preview.substring(0, 150) 
        });
      }
    }
  } catch (e) { }
  return files;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const docPath = searchParams.get('path');
  
  // If path provided, return full document content
  if (docPath) {
    const fullPath = path.join(DOCS_DIR, docPath);
    try {
      const content = fs.readFileSync(fullPath, 'utf-8');
      return Response.json({ content, path: docPath });
    } catch (e) {
      return Response.json({ error: 'Document not found' }, { status: 404 });
    }
  }
  
  const allFiles = getFiles(DOCS_DIR);
  allFiles.sort((a, b) => b.date.localeCompare(a.date));
  return Response.json({ documents: allFiles });
}
