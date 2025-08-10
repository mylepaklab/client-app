import { defineConfig } from "@farmfe/core";
import farmPostcssPlugin from "@farmfe/js-plugin-postcss";

export default defineConfig({
	plugins: ["@farmfe/plugin-react", farmPostcssPlugin()],
	server: { port: 3000 },
});
