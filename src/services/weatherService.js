// ─── Service layer ────────────────────────────────────────────────────────────
// All requests go to /api/* which is handled by:
//   • Vite dev proxy  (npm run dev)   → rewrites to api.weather-ai.co/v1/*
//   • Express proxy   (production)    → rewrites to api.weather-ai.co/v1/*
//
// The API token is attached server-side in both cases and never exposed
// in browser network traffic.
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = "/api";

const DEFAULTS = {
  latitude:  -1.2921,
  longitude:  36.8219,
};

/**
 * Core fetch helper — builds URL from endpoint + params.
 * @param {string} endpoint   e.g. "/weather"
 * @param {object} params     query-string key/value pairs
 * @returns {Promise<object>}
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

// ─── Public service methods ───────────────────────────────────────────────────

export const weatherService = {
  /**
   * Full weather payload: current + hourly + daily + optional AI summary.
   * @param {{ latitude?: number, longitude?: number, days?: number }} opts
   */
  getAll(opts = {}) {
    return apiFetch("/weather", { ...DEFAULTS, ...opts });
  },

  /**
   * API usage, plan limits, and billing period.
   * Accepts no query parameters.
   */
  getUsage() {
    return apiFetch("/usage");
  },
};
