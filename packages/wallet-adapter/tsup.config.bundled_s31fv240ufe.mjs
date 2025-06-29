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
      "src/providers/index.ts",
      "src/providers/btc/index.ts",
      "src/providers/icp/index.ts"
    ],
    dts: {
      entry: [
        "src/index.ts",
        "src/providers/index.ts",
        "src/providers/btc/index.ts",
        "src/providers/icp/index.ts"
      ]
    },
    loader: {
      ".png": "dataurl",
      ".svg": "dataurl"
    }
  }
]);
export {
  tsup_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiL21udC9GQzlFRUNBRDlFRUM2MjFFL1dvcmsvT3JhbmpCYXNlL1N0cmlrZS9wYWNrYWdlcy93YWxsZXQtYWRhcHRlci90c3VwLmNvbmZpZy50c1wiO2NvbnN0IF9faW5qZWN0ZWRfZGlybmFtZV9fID0gXCIvbW50L0ZDOUVFQ0FEOUVFQzYyMUUvV29yay9PcmFuakJhc2UvU3RyaWtlL3BhY2thZ2VzL3dhbGxldC1hZGFwdGVyXCI7Y29uc3QgX19pbmplY3RlZF9pbXBvcnRfbWV0YV91cmxfXyA9IFwiZmlsZTovLy9tbnQvRkM5RUVDQUQ5RUVDNjIxRS9Xb3JrL09yYW5qQmFzZS9TdHJpa2UvcGFja2FnZXMvd2FsbGV0LWFkYXB0ZXIvdHN1cC5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIHR5cGUgT3B0aW9ucyB9IGZyb20gXCJ0c3VwXCI7XG5cbmNvbnN0IGNvbW1vbkNmZzogUGFydGlhbDxPcHRpb25zPiA9IHtcbiAgc3BsaXR0aW5nOiB0cnVlLFxuICBzb3VyY2VtYXA6IGZhbHNlLFxuICBjbGVhbjogdHJ1ZSxcbiAgZm9ybWF0OiBbXCJjanNcIiwgXCJlc21cIl0sXG4gIHRhcmdldDogW1wiZXNuZXh0XCJdLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKFtcbiAge1xuICAgIC4uLmNvbW1vbkNmZyxcbiAgICBlbnRyeTogW1xuICAgICAgXCJzcmMvaW5kZXgudHNcIixcbiAgICAgIFwic3JjL3Byb3ZpZGVycy9pbmRleC50c1wiLFxuICAgICAgXCJzcmMvcHJvdmlkZXJzL2J0Yy9pbmRleC50c1wiLFxuICAgICAgXCJzcmMvcHJvdmlkZXJzL2ljcC9pbmRleC50c1wiLFxuICAgIF0sXG4gICAgZHRzOiB7XG4gICAgICBlbnRyeTogW1xuICAgICAgICBcInNyYy9pbmRleC50c1wiLFxuICAgICAgICBcInNyYy9wcm92aWRlcnMvaW5kZXgudHNcIixcbiAgICAgICAgXCJzcmMvcHJvdmlkZXJzL2J0Yy9pbmRleC50c1wiLFxuICAgICAgICBcInNyYy9wcm92aWRlcnMvaWNwL2luZGV4LnRzXCIsXG4gICAgICBdLFxuICAgIH0sXG4gICAgbG9hZGVyOiB7XG4gICAgICBcIi5wbmdcIjogXCJkYXRhdXJsXCIsXG4gICAgICBcIi5zdmdcIjogXCJkYXRhdXJsXCIsXG4gICAgfSxcbiAgfSxcbl0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF1VixTQUFTLG9CQUFrQztBQUVsWSxJQUFNLFlBQThCO0FBQUEsRUFDbEMsV0FBVztBQUFBLEVBQ1gsV0FBVztBQUFBLEVBQ1gsT0FBTztBQUFBLEVBQ1AsUUFBUSxDQUFDLE9BQU8sS0FBSztBQUFBLEVBQ3JCLFFBQVEsQ0FBQyxRQUFRO0FBQ25CO0FBRUEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUI7QUFBQSxJQUNFLEdBQUc7QUFBQSxJQUNILE9BQU87QUFBQSxNQUNMO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLElBQ0EsS0FBSztBQUFBLE1BQ0gsT0FBTztBQUFBLFFBQ0w7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sUUFBUTtBQUFBLE1BQ1IsUUFBUTtBQUFBLElBQ1Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
