const REFRESH_KEY = 'goodmanGlsRefresh';

const isBrowser = typeof window !== 'undefined';

// Access Token: memory only (not accessible via XSS)
let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string): void {
  accessToken = token;
}

export function getRefreshToken(): string | null {
  if (!isBrowser) return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function setRefreshToken(token: string): void {
  if (!isBrowser) return;
  localStorage.setItem(REFRESH_KEY, token);
}

export function clearAllTokens(): void {
  accessToken = null;
  if (!isBrowser) return;
  localStorage.removeItem(REFRESH_KEY);
}
