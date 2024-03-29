import "jest";
import { join } from "path";

const config = {
  moduleFileExtensions: ["ts", "js", "json"],
  testMatch: ["**/test/**/*.spec.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  setupFiles: ["dotenv/config"],
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules/"],
  globalSetup: join(__dirname, "test/config/setup.ts"),
  globalTeardown: join(__dirname, "test/config/teardown.ts"),
  rootDir: "test",
  testTimeout: 60000,
  testPathIgnorePatterns: ["/node_modules/"],
  moduleDirectories: ["node_modules"],
};

export default config;
