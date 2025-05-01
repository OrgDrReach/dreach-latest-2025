import "@testing-library/jest-dom";

// Mock the environment variables
process.env.SERVER_URL = "http://localhost:3000";

// Mock console.error and console.log to keep test output clean
global.console = {
	...console,
	error: jest.fn(),
	log: jest.fn(),
};
