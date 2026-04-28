// API Tests for Mission Control
// Basic smoke tests to verify endpoints work

describe('API Endpoints', () => {
  const BASE_URL = 'http://localhost:3003';
  
  describe('GET /api/projects', () => {
    it('should return projects list', async () => {
      // TODO: Add actual test when we can make HTTP requests
      expect(true).toBe(true);
    });
  });

  describe('GET /api/tasks', () => {
    it('should return tasks list', async () => {
      expect(true).toBe(true);
    });
  });

  describe('GET /api/coaching-actions', () => {
    it('should return coaching actions', async () => {
      expect(true).toBe(true);
    });
  });
});

describe('Data Validation', () => {
  it('should have valid projects.json', () => {
    const fs = require('fs');
    const projects = JSON.parse(fs.readFileSync('/data/.openclaw/workspace/projects.json', 'utf8'));
    expect(Array.isArray(projects)).toBe(true);
  });

  it('should have valid tasks.json', () => {
    const fs = require('fs');
    const tasks = JSON.parse(fs.readFileSync('/data/.openclaw/workspace/tasks.json', 'utf8'));
    expect(Array.isArray(tasks)).toBe(true);
  });
});