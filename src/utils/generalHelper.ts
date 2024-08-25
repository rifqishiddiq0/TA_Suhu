/**
 * Parse boolean like value, with following rules:
 * - If value is boolean, will return the value itself
 * - If value is string, will return `true` if value is `'true'`, `false` if value is `'false'`
 * - If value is number, will return `true` if value is `1`, `false` if value is `0`
 * - Otherwise, will return fallback value (default is `false` if not provided)
 */
export function parseBooleanish<T>(value: any, fallback?: T): boolean | T {
  if (typeof value === 'boolean') return value

  if (typeof value === 'string') {
    if (value === 'true') return true
    if (value === 'false') return false
  }

  if (typeof value === 'number') {
    if (value === 1) return true
    if (value === 0) return false
  }

  return fallback ?? false
}

/**
 * Check if the value is empty, with following rules:
 * - If value is `undefined`, `null`, or empty string, will return `true`
 * - Otherwise, will return `false`
 */
export function isEnvVarEmpty(value: any): boolean {
  return value === undefined || value === null || value === ''
}

/**
 * Shorthand for `isEnvVarEmpty(X) ? undefined : X`
 */
export function readEnvVar(value: any): string | undefined {
  if (isEnvVarEmpty(value)) {
    return undefined
  }

  return value
}

/**
 * Delay operation for a given time in milliseconds
 */
export async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
