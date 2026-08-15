/**
 * Typed environment access.
 *
 * Only `VITE_`-prefixed variables reach the client, and everything that does
 * is public in the bundle by construction — never put a secret behind the
 * prefix.
 */
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5080",
  isDev: import.meta.env.DEV,
} as const;
