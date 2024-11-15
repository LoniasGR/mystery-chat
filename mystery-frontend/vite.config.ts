import { defineConfig } from "vite";
import path from "path";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/common": path.resolve(__dirname, "../common"),
    },
  },
});
