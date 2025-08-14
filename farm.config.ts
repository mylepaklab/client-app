import { config as configDotEnv } from "dotenv";

import path from "path";
import { defineConfig } from "@farmfe/core";
import farmPostcssPlugin from "@farmfe/js-plugin-postcss";
import importMeta from "@farmfe/runtime-plugin-import-meta";

configDotEnv({ path: path.resolve(process.cwd(), "./.env") });

export default defineConfig({
	plugins: ["@farmfe/plugin-react", farmPostcssPlugin(), importMeta],
	server: { port: 3000 },
	compilation: {
		external: ["node:fs"],
		resolve: {
			alias: {
				"~/": path.join(process.cwd(), "src/"),
			},
		},
		define: {
			"import.meta.env.FARM_API_URL": JSON.stringify(process.env.FARM_API_URL),
		},
		persistentCache: false,
	},
	envDir: "./",
	publicDir: "./public",
});
