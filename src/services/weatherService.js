const BASE_URL = "/api";

const DEFAULTS = {
  latitude: -1.2921,
  longitude: 36.8219,
};

/**
 * Core fetch helper.
 * No Authorization header here — the proxy (Vite or Netlify) attaches it.
 */
async function apiFetch(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`, window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  });

  const res = await fetch(url.toString());

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `HTTP ${res.status} — ${res.statusText}`);
  }

  return res.json();
}

export const weatherService = {
  /**
   * Full weather payload: current + hourly + daily + optional AI summary.
   * @param {{ latitude?, longitude?, days?, units? }} opts
   */
  getAll(opts = {}) {
    return apiFetch("/weather", { ...DEFAULTS, ...opts });
  },

  /**
   * API usage, plan limits, and billing period.
   */
  getUsage() {
    return apiFetch("/usage");
  },
};
