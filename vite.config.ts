import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        // NewsAPI proxy — injects apiKey server-side
        "/api/newsapi": {
          target: "https://newsapi.org",
          changeOrigin: true,
          rewrite: (reqPath) => {
            const url = new URL(reqPath, "http://localhost");
            url.pathname = url.pathname.replace(/^\/api\/newsapi/, "/v2");
            if (env.NEWS_API_KEY) {
              url.searchParams.set("apiKey", env.NEWS_API_KEY);
            }
            return url.pathname + url.search;
          },
        },

        // Guardian API proxy — injects api-key server-side
        "/api/guardian": {
          target: "https://content.guardianapis.com",
          changeOrigin: true,
          rewrite: (reqPath) => {
            const url = new URL(reqPath, "http://localhost");
            url.pathname = url.pathname.replace(/^\/api\/guardian/, "");
            if (env.GUARDIAN_API_KEY) {
              url.searchParams.set("api-key", env.GUARDIAN_API_KEY);
            }
            return url.pathname + url.search;
          },
        },

        // NYT API proxy — injects api-key server-side
        "/api/nyt": {
          target: "https://api.nytimes.com",
          changeOrigin: true,
          rewrite: (reqPath) => {
            const url = new URL(reqPath, "http://localhost");
            url.pathname = url.pathname.replace(
              /^\/api\/nyt/,
              "/svc/search/v2"
            );
            if (env.NYT_API_KEY) {
              url.searchParams.set("api-key", env.NYT_API_KEY);
            }
            return url.pathname + url.search;
          },
        },
      },
    },
  };
});
