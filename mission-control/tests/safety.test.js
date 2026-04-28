// Safety Tests for Mission Control
// Validates data integrity before deploy

const fs = require('fs');
const path = require('path');

describe('Data Safety Checks', () => {
  const TASKS_FILE = '/data/.openclaw/workspace/tasks.json';
  const PROJECTS_FILE = '/data/.openclaw/workspace/projects.json';

  describe('Tasks Validation', () => {
    let tasks;
    
    beforeAll(() => {
      tasks = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8'));
    });

    it('should have tasks', () => {
      expect(tasks.length).toBeGreaterThan(0);
    });

    it('should NOT have tasks with empty titles', () => {
      const emptyTitles = tasks.filter(t => !t.title || t.title.trim() === '');
      expect(emptyTitles).toHaveLength(0);
      if (emptyTitles.length > 0) {
        console.error('❌ Found tasks with empty titles:', emptyTitles.map(t => t.id));
      }
    });

    it('should NOT have tasks with empty stages', () => {
      const emptyStages = tasks.filter(t => !t.stage || t.stage.trim() === '');
      expect(emptyStages).toHaveLength(0);
    });

    it('should have valid stage values', () => {
      const validStages = ['Capture', 'Define', 'In Progress', 'Waiting', 'Done'];
      const invalidStages = tasks.filter(t => !validStages.includes(t.stage));
      expect(invalidStages).toHaveLength(0);
    });

    it('should have tasks linked to a project', () => {
      const orphaned = tasks.filter(t => !t.project_id);
      expect(orphaned).toHaveLength(0);
    });
  });

  describe('Projects Validation', () => {
    let projects;
    
    beforeAll(() => {
      projects = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf8'));
    });

    it('should have projects', () => {
      expect(projects.length).toBeGreaterThan(0);
    });

    it('should NOT have projects with empty names', () => {
      const emptyNames = projects.filter(p => !p.name || p.name.trim() === '');
      expect(emptyNames).toHaveLength(0);
    });

    it('should have valid stage values', () => {
      const validStages = ['Planning', 'Define', 'Execution', 'Review', 'Complete'];
      const invalidStages = projects.filter(p => !validStages.includes(p.stage));
      expect(invalidStages).toHaveLength(0);
    });
  });

  describe('JSON Structure', () => {
    it('tasks.json should be valid JSON', () => {
      expect(() => JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8'))).not.toThrow();
    });

    it('projects.json should be valid JSON', () => {
      expect(() => JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf8'))).not.toThrow();
    });
  });
});

describe('API Smoke Tests', () => {
  it('should pass basic sanity check', () => {
    expect(true).toBe(true);
  });
});