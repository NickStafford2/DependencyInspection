import { defineConfig, loadEnv, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// interface FrontendEnv extends UserConfig {
// 	VITE_APP_BACKEND_ADDRESS: string;
// }
export default defineConfig(({ mode }) => {
	const env: UserConfig = loadEnv(mode, process.cwd());
	const isProduction = mode === "production";
	return {
		plugins: [react()],
		server: isProduction
			? {
					port: 3000,
					host: true,
					watch: {
						usePolling: true,
					},
					esbuild: {
						target: "esnext",
						platform: "linux",
					},
				}
			: {
					proxy: {
						"/api": {
							target: "http://127.0.0.1:5000/",
							changeOrigin: true,
							rewrite: (path) => path.replace(/^\/api/, ""),
						},
					},
				},
		define: isProduction
			? {
					VITE_APP_BACKEND_ADDRESS: JSON.stringify(
						// @ts-expect-error env variable should be provided by Docker
						env.VITE_APP_BACKEND_ADDRESS,
					),
				}
			: {},
		// Shadcn
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
		// build: isProduction
		//   ? {
		//       outDir: 'dist', // Production build output
		//       sourcemap: false, // Disable sourcemaps in production for better performance
		//       minify: 'esbuild', // Minify production code
		//       chunkSizeWarningLimit: 500, // Increase chunk size warning limit (default is 500KB)
		//     }
		//   : {}, // No additional build options needed for development
	};
});
