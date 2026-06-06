// src/services/weatherService.js
//
// In development  → requests go to /api/* which Vite proxies to the upstream
//                   directly (see vite.config.js), attaching the token server-side.
//
// In production   → requests go to /api/* which Netlify rewrites to the
//                   proxy serverless function (netlify/functions/proxy.js),
//                   which attaches the token from the Netlify environment.
//
// Either way the browser never sees the bearer token or touches the upstream
// API directly — CORS is handled entirely by the proxy layer.

const BASE_URL = "/api";

const DEFAULTS = {
  latitude:  -1.2921,
  longitude:  36.8219,
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
