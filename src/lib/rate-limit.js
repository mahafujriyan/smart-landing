const WINDOW_MS = 60_000;
const LIMIT = 8;

function getStore() {
  if (!globalThis.__smartLandingRateLimit) {
    globalThis.__smartLandingRateLimit = new Map();
  }

  return globalThis.__smartLandingRateLimit;
}

export function checkRateLimit(identifier) {
  const key = identifier || "anonymous";
  const now = Date.now();
  const store = getStore();
  const current = store.get(key) ?? [];
  const recent = current.filter((timestamp) => now - timestamp < WINDOW_MS);

  if (recent.length >= LIMIT) {
    store.set(key, recent);
    return false;
  }

  recent.push(now);
  store.set(key, recent);
  return true;
}
