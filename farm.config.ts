import { defineConfig } from "@farmfe/core";
import farmPostcssPlugin from "@farmfe/js-plugin-postcss";

import path from "path";

export default defineConfig({
	plugins: ["@farmfe/plugin-react", farmPostcssPlugin()],
	server: { port: 3000 },
	compilation: {
		external: ["node:fs"],
		resolve: {
			alias: {
				"~/": path.join(process.cwd(), "src/"),
			},
		},
	},
	envDir: "./env",
});
