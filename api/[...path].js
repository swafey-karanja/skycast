const UPSTREAM = process.env.WEATHER_API_BASE || "https://api.weather-ai.co/v1";
const API_TOKEN = process.env.WEATHER_API_TOKEN;

export default async function handler(req, res) {
  const upstreamPath = (req.query.path || []).join("/");
  const upstreamUrl = new URL(`${UPSTREAM}/${upstreamPath}`);

  Object.entries(req.query).forEach(([k, v]) => {
    if (k !== "path") upstreamUrl.searchParams.set(k, v);
  });

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  try {
    const upstream = await fetch(upstreamUrl.toString(), {
      headers: {
        ...(API_TOKEN && { Authorization: `Bearer ${API_TOKEN}` }),
      },
    });

    const data = await upstream.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(upstream.status).json(data);
  } catch (err) {
    console.error("[proxy] upstream error:", err.message);
    res.status(502).json({ error: "Bad gateway", detail: err.message });
  }
}
