export default {
  transform: {
    "^.+\\.(t|j)sx?$": [
      "@swc/jest",
      {
        jsc: {
          target: "es2020",
          transform: {
            useDefineForClassFields: false,
            legacyDecorator: true,
            decoratorMetadata: true,
          },
          parser: {
            syntax: "typescript",
            decorators: true,
          },
        },
      },
    ],
  },
  clearMocks: true,
  coverageProvider: "v8"
};