// tsup.config.ts
import { defineConfig } from "tsup";
var commonCfg = {
  splitting: true,
  sourcemap: false,
  clean: true,
  format: ["cjs", "esm"],
  target: ["esnext"]
};
var tsup_config_default = defineConfig([
  {
    ...commonCfg,
    entry: [
      "src/index.ts",
      "src/index.css",
      "src/ext/twitter.tsx",
      "src/utils/index.ts",
      "src/api/index.ts",
      "src/hooks/index.ts",
      "src/hooks/icp/index.ts",
      "src/index.css"
    ],
    dts: {
      entry: [
        "src/index.ts",
        "src/ext/twitter.tsx",
        "src/utils/index.ts",
        "src/api/index.ts",
        "src/hooks/index.ts",
        "src/hooks/icp/index.ts"
      ]
    }
  }
]);
export {
  tsup_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiL21udC9GQzlFRUNBRDlFRUM2MjFFL1dvcmsvT3JhbmpCYXNlL1N0cmlrZS9wYWNrYWdlcy9jb3JlL3RzdXAuY29uZmlnLnRzXCI7Y29uc3QgX19pbmplY3RlZF9kaXJuYW1lX18gPSBcIi9tbnQvRkM5RUVDQUQ5RUVDNjIxRS9Xb3JrL09yYW5qQmFzZS9TdHJpa2UvcGFja2FnZXMvY29yZVwiO2NvbnN0IF9faW5qZWN0ZWRfaW1wb3J0X21ldGFfdXJsX18gPSBcImZpbGU6Ly8vbW50L0ZDOUVFQ0FEOUVFQzYyMUUvV29yay9PcmFuakJhc2UvU3RyaWtlL3BhY2thZ2VzL2NvcmUvdHN1cC5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIHR5cGUgT3B0aW9ucyB9IGZyb20gJ3RzdXAnO1xuXG5jb25zdCBjb21tb25DZmc6IFBhcnRpYWw8T3B0aW9ucz4gPSB7XG4gIHNwbGl0dGluZzogdHJ1ZSxcbiAgc291cmNlbWFwOiBmYWxzZSxcbiAgY2xlYW46IHRydWUsXG4gIGZvcm1hdDogWydjanMnLCAnZXNtJ10sXG4gIHRhcmdldDogWydlc25leHQnXSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyhbXG4gIHtcbiAgICAuLi5jb21tb25DZmcsXG4gICAgZW50cnk6IFtcbiAgICAgICdzcmMvaW5kZXgudHMnLFxuICAgICAgJ3NyYy9pbmRleC5jc3MnLFxuICAgICAgJ3NyYy9leHQvdHdpdHRlci50c3gnLFxuICAgICAgJ3NyYy91dGlscy9pbmRleC50cycsXG4gICAgICAnc3JjL2FwaS9pbmRleC50cycsXG4gICAgICAnc3JjL2hvb2tzL2luZGV4LnRzJyxcbiAgICAgICdzcmMvaG9va3MvaWNwL2luZGV4LnRzJyxcbiAgICAgICdzcmMvaW5kZXguY3NzJyxcbiAgICBdLFxuICAgIGR0czoge1xuICAgICAgZW50cnk6IFtcbiAgICAgICAgJ3NyYy9pbmRleC50cycsXG4gICAgICAgICdzcmMvZXh0L3R3aXR0ZXIudHN4JyxcbiAgICAgICAgJ3NyYy91dGlscy9pbmRleC50cycsXG4gICAgICAgICdzcmMvYXBpL2luZGV4LnRzJyxcbiAgICAgICAgJ3NyYy9ob29rcy9pbmRleC50cycsXG4gICAgICAgICdzcmMvaG9va3MvaWNwL2luZGV4LnRzJyxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSxcbl0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5VCxTQUFTLG9CQUFrQztBQUVwVyxJQUFNLFlBQThCO0FBQUEsRUFDbEMsV0FBVztBQUFBLEVBQ1gsV0FBVztBQUFBLEVBQ1gsT0FBTztBQUFBLEVBQ1AsUUFBUSxDQUFDLE9BQU8sS0FBSztBQUFBLEVBQ3JCLFFBQVEsQ0FBQyxRQUFRO0FBQ25CO0FBRUEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUI7QUFBQSxJQUNFLEdBQUc7QUFBQSxJQUNILE9BQU87QUFBQSxNQUNMO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsTUFDQTtBQUFBLElBQ0Y7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNILE9BQU87QUFBQSxRQUNMO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
