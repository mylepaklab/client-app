import { config as configDotEnv } from "dotenv";

import path from "path";
import { defineConfig } from "@farmfe/core";
import farmPostcssPlugin from "@farmfe/js-plugin-postcss";

configDotEnv({ path: path.resolve(process.cwd(), "./.env") });

export default defineConfig({
	plugins: ["@farmfe/plugin-react", farmPostcssPlugin()],
	server: { port: 3000 },
	compilation: {
		external: ["node:fs"],
		resolve: {
			alias: {
				"~/": path.join(process.cwd(), "src/"),
				"@tensorflow/tfjs-backend-webgl": require.resolve(
					"@tensorflow/tfjs-backend-webgl/dist/tf-backend-webgl.esm.js"
				),
				"@tensorflow/tfjs-layers": require.resolve(
					"@tensorflow/tfjs-layers/dist/tf-layers.esm.js"
				),
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
