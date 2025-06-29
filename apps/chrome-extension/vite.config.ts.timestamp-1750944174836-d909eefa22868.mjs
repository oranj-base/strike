// vite.config.ts
import { defineConfig } from "file:///mnt/FC9EECAD9EEC621E/Work/OranjBase/Strike/node_modules/vite/dist/node/index.js";
import { crx } from "file:///mnt/FC9EECAD9EEC621E/Work/OranjBase/Strike/node_modules/@crxjs/vite-plugin/dist/index.mjs";
import react from "file:///mnt/FC9EECAD9EEC621E/Work/OranjBase/Strike/node_modules/@vitejs/plugin-react/dist/index.mjs";

// src/manifest.ts
import { defineManifest } from "file:///mnt/FC9EECAD9EEC621E/Work/OranjBase/Strike/node_modules/@crxjs/vite-plugin/dist/index.mjs";

// package.json
var package_default = {
  name: "@oranjbase/strike-chrome-extension",
  displayName: "STRIKE by Oranj",
  version: "1.0.1",
  author: "Edward Lee",
  description: "Enable Internet Computer Blinks on Twitter, with support for Internet Identity and Plug.",
  private: true,
  type: "module",
  license: "MIT",
  keywords: [
    "chrome-extension",
    "react",
    "vite",
    "create-chrome-ext"
  ],
  engines: {
    node: ">=14.18.0"
  },
  scripts: {
    dev: "vite",
    build: "tsc && vite build",
    preview: "vite preview",
    fmt: "prettier --write '**/*.{tsx,ts,json,css,scss,md}'",
    zip: "npm run build && node src/zip.js"
  },
  dependencies: {
    "@oranjbase/icp-wallet-adapter": "*",
    "@oranjbase/strike": "*",
    axios: "^1.9.0",
    buffer: "^6.0.3",
    react: "^18.3.1",
    "react-dom": "^18.3.1"
  },
  devDependencies: {
    "@crxjs/vite-plugin": "^2.0.0-beta.26",
    "@types/chrome": "^0.0.268",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    autoprefixer: "^10.4.19",
    postcss: "^8.4.39",
    prettier: "^3.3.3",
    tailwindcss: "^3.4.4",
    typescript: "^5.5.3",
    vite: "^5.3.3"
  }
};

// src/manifest.ts
var isDev = process.env.NODE_ENV == "development";
var manifest_default = defineManifest({
  name: `${package_default.displayName || package_default.name}${isDev ? ` \u27A1\uFE0F Dev` : ""}`,
  description: package_default.description,
  version: package_default.version,
  manifest_version: 3,
  icons: {
    16: "img/logo-16.png",
    32: "img/logo-32.png",
    48: "img/logo-48.png",
    128: "img/logo-128.png"
  },
  action: {
    default_popup: "popup.html",
    default_icon: "img/logo-48.png"
  },
  background: {
    service_worker: "src/background.ts",
    type: "module"
  },
  content_scripts: [
    {
      matches: [
        "https://twitter.com/*",
        "https://x.com/*",
        "https://pro.x.com/*"
      ],
      js: ["src/contentScript.ts"]
    }
  ],
  web_accessible_resources: [
    {
      resources: [
        "img/logo-16.png",
        "img/logo-32.png",
        "img/logo-48.png",
        "img/logo-128.png"
      ],
      matches: []
    }
  ],
  permissions: ["storage", "activeTab", "scripting"],
  host_permissions: ["https://twitter.com/*", "https://x.com/*"]
});

// vite.config.ts
var vite_config_default = defineConfig(({ mode }) => {
  return {
    build: {
      emptyOutDir: true,
      outDir: "build",
      rollupOptions: {
        output: {
          chunkFileNames: "assets/chunk-[hash].js"
        }
      }
    },
    plugins: [crx({ manifest: manifest_default }), react()],
    resolve: {
      alias: {
        buffer: "buffer/"
      }
    },
    define: {
      global: "globalThis"
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL21hbmlmZXN0LnRzIiwgInBhY2thZ2UuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9tbnQvRkM5RUVDQUQ5RUVDNjIxRS9Xb3JrL09yYW5qQmFzZS9TdHJpa2UvYXBwcy9jaHJvbWUtZXh0ZW5zaW9uXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvbW50L0ZDOUVFQ0FEOUVFQzYyMUUvV29yay9PcmFuakJhc2UvU3RyaWtlL2FwcHMvY2hyb21lLWV4dGVuc2lvbi92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vbW50L0ZDOUVFQ0FEOUVFQzYyMUUvV29yay9PcmFuakJhc2UvU3RyaWtlL2FwcHMvY2hyb21lLWV4dGVuc2lvbi92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHsgY3J4IH0gZnJvbSAnQGNyeGpzL3ZpdGUtcGx1Z2luJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5cbmltcG9ydCBtYW5pZmVzdCBmcm9tICcuL3NyYy9tYW5pZmVzdCc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG4gIHJldHVybiB7XG4gICAgYnVpbGQ6IHtcbiAgICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuICAgICAgb3V0RGlyOiAnYnVpbGQnLFxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2Fzc2V0cy9jaHVuay1baGFzaF0uanMnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIHBsdWdpbnM6IFtjcngoeyBtYW5pZmVzdCB9KSwgcmVhY3QoKV0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgYnVmZmVyOiAnYnVmZmVyLycsXG4gICAgICB9LFxuICAgIH0sXG4gICAgZGVmaW5lOiB7XG4gICAgICBnbG9iYWw6ICdnbG9iYWxUaGlzJyxcbiAgICB9XG4gIH07XG59KTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL21udC9GQzlFRUNBRDlFRUM2MjFFL1dvcmsvT3JhbmpCYXNlL1N0cmlrZS9hcHBzL2Nocm9tZS1leHRlbnNpb24vc3JjXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvbW50L0ZDOUVFQ0FEOUVFQzYyMUUvV29yay9PcmFuakJhc2UvU3RyaWtlL2FwcHMvY2hyb21lLWV4dGVuc2lvbi9zcmMvbWFuaWZlc3QudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL21udC9GQzlFRUNBRDlFRUM2MjFFL1dvcmsvT3JhbmpCYXNlL1N0cmlrZS9hcHBzL2Nocm9tZS1leHRlbnNpb24vc3JjL21hbmlmZXN0LnRzXCI7aW1wb3J0IHsgZGVmaW5lTWFuaWZlc3QgfSBmcm9tICdAY3J4anMvdml0ZS1wbHVnaW4nO1xuaW1wb3J0IHBhY2thZ2VEYXRhIGZyb20gJy4uL3BhY2thZ2UuanNvbic7XG5cbi8vQHRzLWlnbm9yZVxuY29uc3QgaXNEZXYgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PSAnZGV2ZWxvcG1lbnQnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVNYW5pZmVzdCh7XG4gIG5hbWU6IGAke3BhY2thZ2VEYXRhLmRpc3BsYXlOYW1lIHx8IHBhY2thZ2VEYXRhLm5hbWV9JHtpc0RldiA/IGAgXHUyN0ExXHVGRTBGIERldmAgOiAnJ31gLFxuICBkZXNjcmlwdGlvbjogcGFja2FnZURhdGEuZGVzY3JpcHRpb24sXG4gIHZlcnNpb246IHBhY2thZ2VEYXRhLnZlcnNpb24sXG4gIG1hbmlmZXN0X3ZlcnNpb246IDMsXG4gIGljb25zOiB7XG4gICAgMTY6ICdpbWcvbG9nby0xNi5wbmcnLFxuICAgIDMyOiAnaW1nL2xvZ28tMzIucG5nJyxcbiAgICA0ODogJ2ltZy9sb2dvLTQ4LnBuZycsXG4gICAgMTI4OiAnaW1nL2xvZ28tMTI4LnBuZycsXG4gIH0sXG4gIGFjdGlvbjoge1xuICAgIGRlZmF1bHRfcG9wdXA6ICdwb3B1cC5odG1sJyxcbiAgICBkZWZhdWx0X2ljb246ICdpbWcvbG9nby00OC5wbmcnLFxuICB9LFxuICBiYWNrZ3JvdW5kOiB7XG4gICAgc2VydmljZV93b3JrZXI6ICdzcmMvYmFja2dyb3VuZC50cycsXG4gICAgdHlwZTogJ21vZHVsZScsXG4gIH0sXG4gIGNvbnRlbnRfc2NyaXB0czogW1xuICAgIHtcbiAgICAgIG1hdGNoZXM6IFtcbiAgICAgICAgJ2h0dHBzOi8vdHdpdHRlci5jb20vKicsXG4gICAgICAgICdodHRwczovL3guY29tLyonLFxuICAgICAgICAnaHR0cHM6Ly9wcm8ueC5jb20vKicsXG4gICAgICBdLFxuICAgICAganM6IFsnc3JjL2NvbnRlbnRTY3JpcHQudHMnXSxcbiAgICB9LFxuICBdLFxuICB3ZWJfYWNjZXNzaWJsZV9yZXNvdXJjZXM6IFtcbiAgICB7XG4gICAgICByZXNvdXJjZXM6IFtcbiAgICAgICAgJ2ltZy9sb2dvLTE2LnBuZycsXG4gICAgICAgICdpbWcvbG9nby0zMi5wbmcnLFxuICAgICAgICAnaW1nL2xvZ28tNDgucG5nJyxcbiAgICAgICAgJ2ltZy9sb2dvLTEyOC5wbmcnLFxuICAgICAgXSxcbiAgICAgIG1hdGNoZXM6IFtdLFxuICAgIH0sXG4gIF0sXG4gIHBlcm1pc3Npb25zOiBbJ3N0b3JhZ2UnLCAnYWN0aXZlVGFiJywgJ3NjcmlwdGluZyddLFxuICBob3N0X3Blcm1pc3Npb25zOiBbJ2h0dHBzOi8vdHdpdHRlci5jb20vKicsICdodHRwczovL3guY29tLyonXSxcbn0pO1xuIiwgIntcbiAgXCJuYW1lXCI6IFwiQG9yYW5qYmFzZS9zdHJpa2UtY2hyb21lLWV4dGVuc2lvblwiLFxuICBcImRpc3BsYXlOYW1lXCI6IFwiU1RSSUtFIGJ5IE9yYW5qXCIsXG4gIFwidmVyc2lvblwiOiBcIjEuMC4xXCIsXG4gIFwiYXV0aG9yXCI6IFwiRWR3YXJkIExlZVwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiRW5hYmxlIEludGVybmV0IENvbXB1dGVyIEJsaW5rcyBvbiBUd2l0dGVyLCB3aXRoIHN1cHBvcnQgZm9yIEludGVybmV0IElkZW50aXR5IGFuZCBQbHVnLlwiLFxuICBcInByaXZhdGVcIjogdHJ1ZSxcbiAgXCJ0eXBlXCI6IFwibW9kdWxlXCIsXG4gIFwibGljZW5zZVwiOiBcIk1JVFwiLFxuICBcImtleXdvcmRzXCI6IFtcbiAgICBcImNocm9tZS1leHRlbnNpb25cIixcbiAgICBcInJlYWN0XCIsXG4gICAgXCJ2aXRlXCIsXG4gICAgXCJjcmVhdGUtY2hyb21lLWV4dFwiXG4gIF0sXG4gIFwiZW5naW5lc1wiOiB7XG4gICAgXCJub2RlXCI6IFwiPj0xNC4xOC4wXCJcbiAgfSxcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcImRldlwiOiBcInZpdGVcIixcbiAgICBcImJ1aWxkXCI6IFwidHNjICYmIHZpdGUgYnVpbGRcIixcbiAgICBcInByZXZpZXdcIjogXCJ2aXRlIHByZXZpZXdcIixcbiAgICBcImZtdFwiOiBcInByZXR0aWVyIC0td3JpdGUgJyoqLyoue3RzeCx0cyxqc29uLGNzcyxzY3NzLG1kfSdcIixcbiAgICBcInppcFwiOiBcIm5wbSBydW4gYnVpbGQgJiYgbm9kZSBzcmMvemlwLmpzXCJcbiAgfSxcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQG9yYW5qYmFzZS9pY3Atd2FsbGV0LWFkYXB0ZXJcIjogXCIqXCIsXG4gICAgXCJAb3JhbmpiYXNlL3N0cmlrZVwiOiBcIipcIixcbiAgICBcImF4aW9zXCI6IFwiXjEuOS4wXCIsXG4gICAgXCJidWZmZXJcIjogXCJeNi4wLjNcIixcbiAgICBcInJlYWN0XCI6IFwiXjE4LjMuMVwiLFxuICAgIFwicmVhY3QtZG9tXCI6IFwiXjE4LjMuMVwiXG4gIH0sXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBjcnhqcy92aXRlLXBsdWdpblwiOiBcIl4yLjAuMC1iZXRhLjI2XCIsXG4gICAgXCJAdHlwZXMvY2hyb21lXCI6IFwiXjAuMC4yNjhcIixcbiAgICBcIkB0eXBlcy9yZWFjdFwiOiBcIl4xOC4zLjNcIixcbiAgICBcIkB0eXBlcy9yZWFjdC1kb21cIjogXCJeMTguMy4wXCIsXG4gICAgXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiOiBcIl40LjMuMVwiLFxuICAgIFwiYXV0b3ByZWZpeGVyXCI6IFwiXjEwLjQuMTlcIixcbiAgICBcInBvc3Rjc3NcIjogXCJeOC40LjM5XCIsXG4gICAgXCJwcmV0dGllclwiOiBcIl4zLjMuM1wiLFxuICAgIFwidGFpbHdpbmRjc3NcIjogXCJeMy40LjRcIixcbiAgICBcInR5cGVzY3JpcHRcIjogXCJeNS41LjNcIixcbiAgICBcInZpdGVcIjogXCJeNS4zLjNcIlxuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXFYLFNBQVMsb0JBQW9CO0FBQ2xaLFNBQVMsV0FBVztBQUNwQixPQUFPLFdBQVc7OztBQ0Z5VyxTQUFTLHNCQUFzQjs7O0FDQTFaO0FBQUEsRUFDRSxNQUFRO0FBQUEsRUFDUixhQUFlO0FBQUEsRUFDZixTQUFXO0FBQUEsRUFDWCxRQUFVO0FBQUEsRUFDVixhQUFlO0FBQUEsRUFDZixTQUFXO0FBQUEsRUFDWCxNQUFRO0FBQUEsRUFDUixTQUFXO0FBQUEsRUFDWCxVQUFZO0FBQUEsSUFDVjtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVc7QUFBQSxJQUNULE1BQVE7QUFBQSxFQUNWO0FBQUEsRUFDQSxT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
