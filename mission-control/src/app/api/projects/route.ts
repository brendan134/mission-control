import { NextRequest, NextResponse } from 'next/server';
import { getProjects, createProject, updateProject, deleteProject } from '../../../lib/project-service';
import { Project } from '../../../lib/data-model';

// GET /api/projects - List all projects
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const projects = getProjects();
    // console.log('GET /api/projects returning:', projects.length, 'projects'); // Added for debugging
    console.log('[API /projects] Returning:', projects.length, 'projects'); // DEBUG
    return NextResponse.json(projects);
  } catch (err) {
    console.error('Error in GET /api/projects:', err);
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

// PATCH /api/projects - Update a project
export async function PATCH(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json();
    const project = updateProject(id, updates as Partial<Project>);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE /api/projects - Delete a project
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }
    deleteProject(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}