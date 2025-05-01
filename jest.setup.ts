import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Mock the environment variables
process.env.SERVER_URL = "http://localhost:3000";

// Mock console.error and console.log to keep test output clean
global.console = {
	...console,
	error: jest.fn(),
	log: jest.fn(),
};

// Reset mocks before each test
beforeEach(() => {
	jest.clearAllMocks();
});
