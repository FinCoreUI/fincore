import { resolveTemplatePath } from '../utils/paths.js';

export const amountDisplayRegistry = {
  name: 'amount-display',
  displayName: 'Amount Display',
  description: 'Weft Amount Display component (pure CSS + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'amount-display-wrapper',
      source: resolveTemplatePath('components/amount-display/index.tsx'),
      dest: ['components', 'fincore', 'amount-display', 'index.tsx'],
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
      id: 'amount-display-css',
      source: resolveTemplatePath('styles/amount-display.css'),
      dest: ['styles', 'fincore', 'amount-display.css'],
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

