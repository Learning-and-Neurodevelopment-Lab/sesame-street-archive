const nextJest = require("next/jest");
const createJestConfig = nextJest({ dir: "./" });

module.exports = async () => ({
  ...(await createJestConfig({
    testEnvironment: "jsdom",
    rootDir: "",
  })()),
  transformIgnorePatterns: ['node_modules/(?!next-intl)/'],
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
});
