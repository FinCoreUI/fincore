import { resolveTemplatePath } from '../utils/paths.js';

export const balanceCardRegistry = {
  name: 'balance-card',
  displayName: 'Balance Card',
  description: 'Weft Balance Card component (pure CSS + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'balance-card-wrapper',
      source: resolveTemplatePath('components/balance-card/index.tsx'),
      dest: ['components', 'fincore', 'balance-card', 'index.tsx'],
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
      id: 'balance-card-css',
      source: resolveTemplatePath('styles/balance-card.css'),
      dest: ['styles', 'fincore', 'balance-card.css'],
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

