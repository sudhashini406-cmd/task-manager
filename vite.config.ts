// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
// import path from "path";

// interface ImportMetaEnv {
//   readonly VITE_API_URL: string;
// }

// interface ImportMeta {
//   readonly env: ImportMetaEnv;
// }

// // https://vitejs.dev/config/
// export default defineConfig({
//   define: {
//     "process.env.NODE_ENV": '"development"',
//   },

//   plugins: [
//     TanStackRouterVite({
//       target: "react",
//       autoCodeSplitting: true,
//     }),
//     react(),
//   ],

//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// });
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";

export default defineConfig(({ mode }) => {
  // Load environment variables from .env file
  const env = loadEnv(mode, process.cwd(), "");

  return {
    define: {
      "process.env.NODE_ENV": JSON.stringify(mode),
      "import.meta.env.VITE_API_URL": JSON.stringify(env.VITE_API_URL), // Ensure it's available
    },

    plugins: [
      TanStackRouterVite({
        target: "react",
        autoCodeSplitting: true,
      }),
      react(),
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
