import { NextRequest, NextResponse } from 'next/server';
import { getProjects, createProject } from '../../../lib/project-service';
import { Project } from '../../../lib/data-model';

// GET /api/projects - List all projects
export async function GET() {
  try {
    const projects = getProjects();
    return NextResponse.json(projects);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST /api/projects - Create a project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const project = createProject(body as Omit<Project, 'id' | 'created_at' | 'updated_at' | 'linked_task_ids' | 'progress' | 'last_activity_at'>);
    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}