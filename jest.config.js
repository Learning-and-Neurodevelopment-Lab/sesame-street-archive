import nextJest from "next/jest";
const createJestConfig = nextJest({ dir: "./" });

export default async () => ({
  ...(await createJestConfig({
    testEnvironment: "jsdom",
    rootDir: "",
  })()),
  transformIgnorePatterns: ['node_modules/(?!next-intl)/'],
 
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
});
