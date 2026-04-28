// Jest setup file for Mission Control
// This runs before each test file

// Mock console methods to keep test output clean
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Add custom matchers or utilities here as needed
beforeAll(() => {
  // Global setup before all tests
});

afterAll(() => {
  // Global teardown after all tests
});