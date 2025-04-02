module.exports = {
    arrowParens: 'always',
    bracketSpacing: true,
    endOfLine: 'lf',
    jsxSingleQuote: false,
    printWidth: 100,
    semi: false,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'es5',
    useTabs: false,
    plugins: ['@ianvs/prettier-plugin-sort-imports'],
    importOrder: [
        '^(react/(.*)$)|^(react$)', // React
        '^(react-native/(.*)$)|^(react-native$)', // React Native
        '^(expo/(.*)$)|^(expo$)', // Expo
        "", // Empty line
        '^@/(.*)$|^[./]\'', // Internal imports
        '<THIRD_PARTY_MODULES>', // Third party modules
        "", // Empty line
        "<TYPES>^(node:)", // Node modules
        "<TYPES>", // Types
        "", // Empty line
        "<TYPES>^[.]", // Internal
        '^.*\\.types.ts', // Types
        "", // Empty line
        '^.*\\.styles.ts', // Styles
    ],
    importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
    importOrderTypeScriptVersion: '5.0.0',
}