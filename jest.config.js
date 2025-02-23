const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  moduleDirectories: ['node_modules', '<rootDir>'],
  testMatch: [
    "**/__test__/**/*.test.js",
    "**/__tests__/**/*.test.js"
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
}

module.exports = createJestConfig(config)