import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    "import.meta.env.VITE_GA_MEASUREMENT_ID": JSON.stringify("G-TEST1234"),
  },
  test: {
    environment: "jsdom",
    include: ["test/ui/**/*.test.{js,jsx}"],
  },
});
