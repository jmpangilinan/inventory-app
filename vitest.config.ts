import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    exclude: ["node_modules/**", "e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      exclude: [
        "node_modules/**",
        "src/api/**",
        ".next/**",
        "**/*.config.*",
        "**/types/**",
        "src/test/**",
        "src/app/**",
        "src/components/ui/**",
        "src/components/shared/providers.tsx",
        "src/components/shared/sidebar.tsx",
        "src/components/shared/theme-toggle.tsx",
        "src/components/shared/delete-dialog.tsx",
        "src/components/shared/row-actions.tsx",
        "src/features/**/*-columns.tsx",
        "src/features/**/*-form.tsx",
        "src/features/**/*-dialog.tsx",
        "src/features/**/*-table.tsx",
        "src/middleware.ts",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
