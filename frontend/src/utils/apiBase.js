/**
 * API origin. Empty in development (Vite proxies /api) and when the API
 * serves the built frontend itself. Set VITE_API_BASE for a split deploy
 * (e.g. a Render static site talking to a Render web service). A bare
 * hostname is upgraded to https, and a bare service slug - what Render's
 * `fromService: host` yields, e.g. "airbnb-clone-api-e8n8" - is expanded to
 * its public onrender.com host.
 */
export function resolveApiBase(raw) {
  let base = (raw || '').trim().replace(/\/+$/, '');
  if (!base) return '';
  if (!/^https?:\/\//.test(base)) {
    if (!base.includes('.') && !/^localhost(:\d+)?$/.test(base)) base += '.onrender.com';
    base = `https://${base}`;
  }
  return base;
}
