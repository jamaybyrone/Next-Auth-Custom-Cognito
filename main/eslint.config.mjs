// eslint.config.js
import js from "@eslint/js"
import tseslint from "typescript-eslint"
import react from "eslint-plugin-react"
import jsxA11y from "eslint-plugin-jsx-a11y"

export default [
    {
        ignores: [
            "node_modules",
            ".next",
            "dist",
            "out",
            "coverage",
            "build",
            "public"
        ],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended, // adds parser + TypeScript rules
    {
        plugins: {
            react,
            "jsx-a11y": jsxA11y,
        },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                project: "./tsconfig.json",
            },
        },
        rules: {
            "comma-dangle": ["error", "never"],
            "comma-spacing": ["error", { before: false, after: true }],
            "comma-style": ["error", "last"],
            "computed-property-spacing": ["error", "never"],
            "func-call-spacing": ["error", "never"],
            "no-trailing-spaces": ["error", { skipBlankLines: true }],
            "no-whitespace-before-property": "error",
            curly: "error",
            quotes: ["error", "single"],
            semi: ["error", "never"],
        },
        settings: {
            react: { version: "detect" },
        },
    },
]
