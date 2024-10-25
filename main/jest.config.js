const nextJest = require('next/jest')

const createJestConfig = nextJest({
    dir: './'
})

const customJestConfig = {
        setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
        testEnvironment: "jsdom",
        testPathIgnorePatterns: [
            "public"
        ],
        testMatch: [
            "**/test/**/*.test.ts",
            "**/test/**/*.test.tsx"
        ],
    coveragePathIgnorePatterns : [
        "<rootDir>/src/app/layout.tsx"
    ],
    collectCoverage: true,
    collectCoverageFrom: [
        'src/app/api/confirm/**/*.ts',
        'src/app/api/password/**/*.ts',
        'src/app/api/signup/*.ts',
        'src/app/**/*.tsx',
        'src/methods/**/*.ts',
        'src/utils/**/*.ts',
        'src/hooks/**/*.ts',
        'src/components/**/*.{ts,tsx}',
        'src/layouts/**/*.tsx'
    ]

}


module.exports = createJestConfig(customJestConfig)
