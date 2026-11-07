import { resolveTemplatePath } from '../utils/paths.js';

export const drawerRegistry = {
  name: 'drawer',
  displayName: 'Drawer',
  description: 'Weft Drawer component (Radix UI Dialog + TypeScript wrapper)',
  framework: 'react',
  language: 'typescript',
  files: [
    {
      id: 'drawer-wrapper',
      source: resolveTemplatePath('components/drawer/index.tsx'),
      dest: ['components', 'fincore', 'drawer', 'index.tsx'],
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
      id: 'drawer-css',
      source: resolveTemplatePath('styles/drawer.css'),
      dest: ['styles', 'fincore', 'drawer.css'],
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
    npm: ['@radix-ui/react-dialog']
  }
};

