/**
 * Builds the CORS `origin` option from CLIENT_ORIGIN, a comma separated list
 * of allowed origins. Entries may be full origins (https://app.example.com)
 * or bare hosts (app.example.com). Render's `fromService: host` yields a bare
 * service slug ("airbnb-clone-web-nja8"), which is also accepted as its
 * public <slug>.onrender.com host. localhost on any port is always allowed
 * for development. With no configuration every origin is accepted.
 */
export function corsOrigin(clientOrigin) {
  const entries = (clientOrigin || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (entries.length === 0) return true;

  const hosts = new Set();
  for (const entry of entries) {
    const host = entry.replace(/^https?:\/\//, '').replace(/\/+$/, '').toLowerCase();
    hosts.add(host);
    if (!host.includes('.') && !host.startsWith('localhost')) hosts.add(`${host}.onrender.com`);
  }
  return (origin, callback) => {
    if (!origin) return callback(null, true); // same-origin, curl, health checks
    let host;
    try {
      host = new URL(origin).host.toLowerCase();
    } catch {
      return callback(null, false);
    }
    const allowed = hosts.has(host) || /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
    return callback(null, allowed);
  };
}
