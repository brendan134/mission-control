import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const OBSIDIAN_PATH = path.join(process.cwd(), '..', 'obsidian');

interface Note {
  title: string;
  folder: string;
  path: string;
  content: string;
  modified: string;
}

function getFiles(dir: string, baseDir: string = ''): Note[] {
  const notes: Note[] = [];
  
  if (!fs.existsSync(dir)) return notes;
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    const relativePath = baseDir ? `${baseDir}/${item}` : item;
    
    if (stat.isDirectory()) {
      notes.push(...getFiles(fullPath, relativePath));
    } else if (item.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      notes.push({
        title: item.replace('.md', ''),
        folder: baseDir || 'root',
        path: relativePath,
        content,
        modified: stat.mtime.toISOString()
      });
    }
  }
  
  return notes;
}

export async function GET() {
  try {
    const notes = getFiles(OBSIDIAN_PATH);
    return NextResponse.json({ notes });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read obsidian' }, { status: 500 });
  }
}