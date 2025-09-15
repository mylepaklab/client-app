import { config as configDotEnv } from "dotenv";

import path from "path";
import { defineConfig } from "@farmfe/core";
import mkcert from "vite-plugin-mkcert";
import farmPostcssPlugin from "@farmfe/js-plugin-postcss";

configDotEnv({ path: path.resolve(process.cwd(), "./.env") });

export default defineConfig({
	plugins: ["@farmfe/plugin-react", farmPostcssPlugin()],
	vitePlugins: [mkcert() as any],
	server: { port: 3000 },
	compilation: {
		external: ["node:fs"],
		resolve: {
			alias: {
				"~/": path.join(process.cwd(), "src/"),
			},
		},
		define: {
			"import.meta.env.FARM_API_URL": JSON.stringify(
				process.env.FARM_API_URL ?? ""
			),
		},
		persistentCache: false,
	},
	envDir: "./",
	publicDir: "./public",
});
