import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");
  return {
    // vite config
    define: {
      __APP_ENV__: env.APP_ENV,
    },
    root: "src", //we added this file since we changed code to src,So keep src as root, whenever we run vite commd it runs through this file
  };
});
