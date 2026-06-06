import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],

    server: {
      proxy: {
        // In development, Vite forwards /api/* to the real upstream directly.
        // The token is attached here server-side so it never appears in
        // browser network traffic.
        "/api": {
          target: env.VITE_WEATHER_API_BASE_URL?.replace("/v1", "") || "https://api.weather-ai.co",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "/v1"),
          configure(proxy) {
            proxy.on("proxyReq", (proxyReq) => {
              if (env.VITE_WEATHER_API_TOKEN) {
                proxyReq.setHeader(
                  "Authorization",
                  `Bearer ${env.VITE_WEATHER_API_TOKEN}`
                );
              }
            });
          },
        },
      },
    },
  };
});
