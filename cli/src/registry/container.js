import { resolveTemplatePath } from '../utils/paths.js';

export const containerRegistry = {
  name: 'container',
  displayName: 'Container',
  description: 'Weft Container component (max-width layout primitive + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'container-wrapper',
      source: resolveTemplatePath('components/container/index.tsx'),
      dest: ['components', 'fincore', 'container', 'index.tsx'],
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
      id: 'container-css',
      source: resolveTemplatePath('styles/container.css'),
      dest: ['styles', 'fincore', 'container.css'],
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

