const nextJest = require("next/jest");
const createJestConfig = nextJest({ dir: "./" });

module.exports = async () => ({
  ...(await createJestConfig({
    testEnvironment: "jsdom",
    rootDir: "",
  })()),
  transformIgnorePatterns: ['node_modules/(?!next-intl)/'],
  // preset: "ts-jest",
  // testEnvironment: "jsdom",
  // testPathIgnorePatterns: [
  //   "/node_modules/",
  //   "/.next/",
  //   "/out/",
  //   "node_modules/(?!next-intl)/",
  // ],
  // moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  // roots: ["<rootDir>/components", "<rootDir>/lib", "<rootDir>/__tests__"],
  // transform: {
  //   "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  // },
  // moduleNameMapper: {
  //   "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  //   "^@/(.*)$": "<rootDir>/$1",
  //   "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
  //     "<rootDir>/__mocks__/fileMock.js",
  // },
  setupFilesAfterEnv: ["<rootDir>/setupTests.js"],
});
