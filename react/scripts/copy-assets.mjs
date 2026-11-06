import { copyFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../..');
const distStyles = resolve(__dirname, '../dist/styles');

mkdirSync(distStyles, { recursive: true });

copyFileSync(resolve(root, 'components/button/button.css'), resolve(distStyles, 'button.css'));
copyFileSync(resolve(root, 'components/input/input.css'), resolve(distStyles, 'input.css'));
copyFileSync(resolve(root, 'components/password-input/password-input.css'), resolve(distStyles, 'password-input.css'));
copyFileSync(resolve(root, 'components/phone-input/phone-input.css'), resolve(distStyles, 'phone-input.css'));
copyFileSync(resolve(root, 'tokens/dist/tokens.css'), resolve(distStyles, 'tokens.css'));

console.log('Copied CSS assets to dist/styles/');
