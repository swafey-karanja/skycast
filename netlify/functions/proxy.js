const UPSTREAM_BASE = "https://api.weather-ai.co/v1";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const handler = async (event) => {
  // Pre-flight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: "Method not allowed" }),
    };
  }

  const rawPath = event.path || "";
  const endpoint =
    rawPath
      .replace(/^\/.netlify\/functions\/proxy/, "")
      .replace(/^\/api/, "") || "/weather";

  // Build upstream URL with all forwarded query params
  const upstreamUrl = new URL(`${UPSTREAM_BASE}${endpoint}`);
  const params = event.queryStringParameters || {};
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) upstreamUrl.searchParams.set(k, v);
  });

  const token = process.env.WEATHER_API_TOKEN;

  try {
    const upstreamRes = await fetch(upstreamUrl.toString(), {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const body = await upstreamRes.text();

    return {
      statusCode: upstreamRes.status,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/json",
      },
      body,
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: `Proxy error: ${err.message}` }),
    };
  }
};
