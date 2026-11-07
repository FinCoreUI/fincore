import { resolveTemplatePath } from '../utils/paths.js';

export const popoverRegistry = {
  name: 'popover',
  displayName: 'Popover',
  description: 'Weft Popover component (Radix UI Popover + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'popover-wrapper',
      source: resolveTemplatePath('components/popover/index.tsx'),
      dest: ['components', 'fincore', 'popover', 'index.tsx'],
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
      id: 'popover-css',
      source: resolveTemplatePath('styles/popover.css'),
      dest: ['styles', 'fincore', 'popover.css'],
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
    npm: ['@radix-ui/react-popover']
  }
};

