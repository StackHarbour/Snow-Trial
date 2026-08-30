export async function fetchJson<T>(url: string, init: RequestInit = {}, timeoutMs = 10_000): Promise<{ data: T; retrievedAt: string; response: Response }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const retrievedAt = new Date().toISOString();
  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(init.headers ?? {}),
      },
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error(`Upstream request failed: ${response.status} ${response.statusText}`);
    }
    return { data: (await response.json()) as T, retrievedAt, response };
  } finally {
    clearTimeout(timeout);
  }
}

export function env(name: string, required = false): string | undefined {
  const value = process.env[name];
  if (required && !value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
