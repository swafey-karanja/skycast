import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],

    server: {
      proxy: {
        // In development, Vite forwards /api/* to the real upstream directly.
        // The token is attached here server-side so it never appears in
        // browser network traffic — matching exactly what the Netlify proxy does.
        "/api": {
          target: "https://api.weather-ai.co",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "/v1"),
          configure(proxy) {
            proxy.on("proxyReq", (proxyReq) => {
              const token = env.VITE_WEATHER_API_TOKEN;
              if (token) {
                proxyReq.setHeader("Authorization", `Bearer ${token}`);
              }
            });
          },
        },
      },
    },
  };
});
