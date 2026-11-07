import { resolveTemplatePath } from '../utils/paths.js';

export const statusIndicatorRegistry = {
  name: 'status-indicator',
  displayName: 'Status Indicator',
  description: 'Weft Status Indicator component (pure CSS + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'status-indicator-wrapper',
      source: resolveTemplatePath('components/status-indicator/index.tsx'),
      dest: ['components', 'fincore', 'status-indicator', 'index.tsx'],
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
      id: 'status-indicator-css',
      source: resolveTemplatePath('styles/status-indicator.css'),
      dest: ['styles', 'fincore', 'status-indicator.css'],
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

