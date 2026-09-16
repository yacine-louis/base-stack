import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { iconsSpritesheet } from "vite-plugin-icons-spritesheet";
import { reactRouterDevTools } from "react-router-devtools";
import babel from "@rolldown/plugin-babel";
import { reactCompilerPreset } from "@vitejs/plugin-react";
import { envSchema, checkEnv } from "./app/utils/env.server.ts";
import type * as Vite from "vite";
import type { StandardSchemaV1 } from "@standard-schema/spec";

export default defineConfig(({ mode }) => {
  const enableRouterDevTools =
    mode === "development" &&
    process.env.ENABLE_REACT_ROUTER_DEVTOOLS === "true";

  return {
    plugins: [
      validateEnv(envSchema),
      ...(enableRouterDevTools
        ? [
            reactRouterDevTools({
              pluginDir: "./devtools/plugins",
              server: {
                silent: false,
              },
            }),
          ]
        : []),
      tailwindcss(),
      reactRouter(),
      babel({
        // only transform app source; node_modules is already excluded by default
        include: /\.[jt]sx?$/,
        presets: [reactCompilerPreset()],
      }),
      iconsSpritesheet({
        withTypes: true,
        inputDir: "app/assets/icons",
        outputDir: "public/icons",
        // generated types
        typesOutputFile: "app/types/icons.ts",
        // The name of the generated spritesheet, defaults to sprite.svg
        fileName: "sprite.svg",
        cwd: process.cwd(),
        // Callback function that is called when the script is generating the icon name
        // This is useful if you want to modify the icon name before it is written to the file
        iconNameTransformer: (iconName) => iconName,
      }),
    ],
    test: {
      globals: true,
      environment: "happy-dom",
      browser: {
        enabled: true,
      },
    },
    resolve: {
      tsconfigPaths: true,
    },
    build: {
      minify: false,
    },
    define: {},
  };
});

// validate env variables when vite build/dev server is started
function validateEnv<T extends StandardSchemaV1>(schema: T): Vite.Plugin {
  return {
    name: "vite-plugin-validate-env",
    enforce: "pre",

    async config(config, { mode }) {
      const { loadEnv } = await import("vite");
      // merges env variables from what is in proccess.env and what .env files are loaded base on mode
      const env = loadEnv(mode, config.envDir ?? process.cwd(), "");

      Object.assign(process.env, env);

      try {
        await checkEnv(schema, env);
      } catch (error) {
        if (error instanceof Error) {
          console.error(`\n❌ ${error.message}\n`);
          if ("issues" in error) {
            console.error(error.issues);
          }
        }
        process.exit(1);
      }
    },
  };
}
