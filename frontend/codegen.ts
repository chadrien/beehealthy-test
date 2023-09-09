import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: '../backend/src/**/*.gql',
  documents: ['src/**/*.tsx'],
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
