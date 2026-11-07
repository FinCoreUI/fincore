import { resolveTemplatePath } from '../utils/paths.js';

export const tableRegistry = {
  name: 'table',
  displayName: 'Table',
  description: 'Weft Table component (React + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'table-wrapper',
      source: resolveTemplatePath('components/table/index.tsx'),
      dest: ['components', 'fincore', 'table', 'index.tsx'],
      required: true,
      type: 'component',
      shared: false,
      overwrite: 'prompt'
    },
    {
      id: 'shared-types',
      source: resolveTemplatePath('components/types/index.ts'),
      dest: ['components', 'fincore', 'types', 'index.ts'],
      required: true,
      type: 'types',
      shared: true,
      sharedKey: 'fincore-shared-types',
      overwrite: 'skip-if-exists'
    },
    {
      id: 'table-css',
      source: resolveTemplatePath('styles/table.css'),
      dest: ['styles', 'fincore', 'table.css'],
      required: true,
      type: 'css',
      shared: false,
      overwrite: 'prompt'
    },
    {
      id: 'tokens-css',
      source: resolveTemplatePath('styles/tokens.css'),
      dest: ['styles', 'fincore', 'tokens.css'],
      required: true,
      type: 'css',
      shared: true,
      sharedKey: 'fincore-tokens',
      overwrite: 'skip-if-exists'
    }
  ],
  dependencies: {
    peer: ['react >=18.0.0', 'react-dom >=18.0.0'],
    npm: []
  }
};

