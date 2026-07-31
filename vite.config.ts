import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { iconsSpritesheet } from "vite-plugin-icons-spritesheet";
import { reactRouterDevTools } from "react-router-devtools";

export default defineConfig({
  plugins: [
    reactRouterDevTools({
      pluginDir: "./plugins",
    }),
    tailwindcss(),
    reactRouter(),
    iconsSpritesheet({
      withTypes: true,
      inputDir: "icons",
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
  resolve: {
    tsconfigPaths: true,
  },
});
