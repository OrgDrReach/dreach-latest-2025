import type { Config } from "jest";

const config: Config = {
	preset: "ts-jest",
	testEnvironment: "node",
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/$1",
	},
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
	testMatch: ["**/__tests__/**/*.test.ts?(x)"],
	collectCoverageFrom: [
		"lib/**/*.{ts,tsx}",
		"!lib/**/*.d.ts",
		"!lib/**/index.ts",
		"!lib/**/*.types.ts",
	],
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 80,
		},
	},
};

export default config;
