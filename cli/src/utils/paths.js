import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function getCliRoot() {
  // cli/src/utils -> cli
  return path.resolve(__dirname, '../../');
}

export function getRepoRoot() {
  // cli/src/utils -> cli -> repo root
  return path.resolve(__dirname, '../../../');
}

export function getTemplatesRoot() {
  // cli/src/utils -> cli -> templates
  return path.resolve(getCliRoot(), 'templates');
}

export function resolveTemplatePath(...segments) {
  const localTemplate = path.resolve(getTemplatesRoot(), ...segments);
  return localTemplate;
}

export function resolveRepoPath(...segments) {
  return path.resolve(getRepoRoot(), ...segments);
}

export function resolveConsumerPath(consumerDir, ...segments) {
  const resolved = path.resolve(consumerDir, ...segments);
  const consumerResolved = path.resolve(consumerDir);
  if (!resolved.startsWith(consumerResolved + path.sep) && resolved !== consumerResolved) {
    throw new Error(`Path traversal detected: ${resolved} escapes ${consumerResolved}`);
  }
  return resolved;
}

export function isPathInside(base, target) {
  const baseResolved = path.resolve(base);
  const targetResolved = path.resolve(target);
  return targetResolved.startsWith(baseResolved + path.sep) || targetResolved === baseResolved;
}
