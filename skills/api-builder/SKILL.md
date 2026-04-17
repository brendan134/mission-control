---
name: api-builder
description: Quickly scaffold new API routes in Mission Control. Use when: (1) need a new endpoint for a page, (2) adding new functionality that requires backend processing, (3) creating CRUD endpoints for data.
---

# API Builder

## Quick Template

Create `src/app/api/<name>/route.ts`:

```ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Your logic here
    return NextResponse.json({ data: 'result' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Your logic here
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
```

## Common Patterns

### With execSync (shell commands)
```ts
const { execSync } = require('child_process');
const output = execSync('command', { encoding: 'utf8', timeout: 10000 });
const data = JSON.parse(output);
```

### File-based data
```ts
import fs from 'fs';
const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
```

### With query params
```ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  // ...
}
```

## Testing
```bash
curl http://localhost:3003/api/<name>
curl -X POST -H "Content-Type: application/json" -d '{}' http://localhost:3003/api/<name>
```