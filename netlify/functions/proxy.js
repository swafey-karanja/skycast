// netlify/functions/proxy.js
//
// Serverless proxy for the weather-ai.co API.
//
// All requests from the browser hit:
//   /.netlify/functions/proxy/<endpoint>?<params>
// e.g.
//   /.netlify/functions/proxy/weather?latitude=-1.2921&longitude=36.8219&days=3
//
// This function:
//   1. Reconstructs the upstream URL: https://api.weather-ai.co/v1/<endpoint>
//   2. Forwards all query-string params unchanged
//   3. Attaches the bearer token from the Netlify environment variable
//      (WEATHER_API_TOKEN — set in Netlify dashboard, never exposed to the browser)
//   4. Returns the upstream JSON response with permissive CORS headers so the
//      browser on the Netlify domain can read it

const UPSTREAM_BASE = "https://api.weather-ai.co/v1";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const handler = async (event) => {
  // Handle pre-flight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS_HEADERS, body: "" };
  }

  // Only allow GET
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: "Method not allowed" }),
    };
  }

  // Extract the endpoint path from the function path
  // e.g. /.netlify/functions/proxy/weather  →  /weather
  const rawPath = event.path || "";
  const endpoint = rawPath.replace(/^\/.netlify\/functions\/proxy/, "") || "/weather";

  // Build upstream URL, forwarding all query params
  const upstreamUrl = new URL(`${UPSTREAM_BASE}${endpoint}`);
  const params = event.queryStringParameters || {};
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) upstreamUrl.searchParams.set(k, v);
  });

  // Retrieve the token from Netlify environment (set in dashboard, not .env)
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
