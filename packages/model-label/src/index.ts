/**
 * Host entry. The Loader validates the row configuration before the browser
 * half starts; the label itself is a browser-only contribution.
 */
export { Config } from './schema.ts'

/** No Host-side behavior. */
export function apply(): void {}
