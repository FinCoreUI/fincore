import { resolveTemplatePath } from '../utils/paths.js';

export const transactionItemRegistry = {
  name: 'transaction-item',
  displayName: 'Transaction Item',
  description: 'Weft Transaction Item component (pure CSS + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'transaction-item-wrapper',
      source: resolveTemplatePath('components/transaction-item/index.tsx'),
      dest: ['components', 'fincore', 'transaction-item', 'index.tsx'],
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
      id: 'transaction-item-css',
      source: resolveTemplatePath('styles/transaction-item.css'),
      dest: ['styles', 'fincore', 'transaction-item.css'],
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
    peer: ['react >=18.0.0', 'react-dom >=18.0.0']
  }
};

