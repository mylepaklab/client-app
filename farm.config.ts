import { config as configDotEnv } from "dotenv";

import path from "path";
import { defineConfig } from "@farmfe/core";
import farmPostcssPlugin from "@farmfe/js-plugin-postcss";

configDotEnv();

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
		define: {
			"import.meta.env": {
				FARM_API_URL: JSON.stringify(
					process.env.API_URL || "http://localhost:8080/api"
				),
			},
		},
	},
	envDir: "./env",
	publicDir: "./public",
});
