let counter = 0;

export function generateId(prefix: string): string {
  counter += 1;
  return `fincore-${prefix}-${counter}-${Date.now().toString(36)}`;
}
