// ─── Skycast CORS Proxy ───────────────────────────────────────────────────────

import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

const UPSTREAM = process.env.WEATHER_API_BASE || "https://api.weather-ai.co";
const API_TOKEN = process.env.WEATHER_API_TOKEN;
const PORT = process.env.PORT || 3001;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";

if (!API_TOKEN) {
  console.warn(
    "[proxy] WARNING: WEATHER_API_TOKEN is not set. " +
      "Requests will be forwarded without an Authorization header.",
  );
}

// ─── CORS headers ─────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// ─── Proxy /api/* → upstream /v1/* ────────────────────────────────────────────
app.use(
  "/api",
  createProxyMiddleware({
    target: UPSTREAM,
    changeOrigin: true,

    // Strip the /api prefix and add /v1 so the paths align with the upstream.
    // /api/weather  →  https://api.weather-ai.co/v1/weather
    pathRewrite: { "^/api": "/v1" },

    on: {
      // Attach the bearer token server-side — the token never reaches the browser.
      proxyReq(proxyReq) {
        if (API_TOKEN) {
          proxyReq.setHeader("Authorization", `Bearer ${API_TOKEN}`);
        }
      },

      error(err, req, res) {
        console.error("[proxy] upstream error:", err.message);
        res.status(502).json({ error: "Bad gateway", detail: err.message });
      },
    },
  }),
);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`[proxy] listening on http://localhost:${PORT}`);
  console.log(`[proxy] forwarding /api/* → ${UPSTREAM}/v1/*`);
  console.log(`[proxy] CORS origin: ${ALLOWED_ORIGIN}`);
});
