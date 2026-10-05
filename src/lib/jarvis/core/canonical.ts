import crypto from 'crypto';

export function canonicalize(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return '[' + value.map(canonicalize).join(',') + ']';
  }
  const keys = Object.keys(value as object).sort();
  const entries = keys.map((key) => `${JSON.stringify(key)}:${canonicalize((value as Record<string, unknown>)[key])}`);
  return '{' + entries.join(',') + '}';
}

export function sha256(value: unknown): string {
  const str = typeof value === 'string' ? value : canonicalize(value);
  return crypto.createHash('sha256').update(str).digest('hex');
}
