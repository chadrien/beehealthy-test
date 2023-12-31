import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: '../backend/src/**/*.gql',
  documents: ['src/graphql/**/*.ts'],
  generates: {
    'src/@types/codegen/': {
      preset: 'client',
    },
  },
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
};

export default config;
