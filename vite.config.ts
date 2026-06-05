import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
    // 根据 mode 加载对应的 .env 文件（如 .env.production）
    const env = loadEnv(mode, process.cwd(), "VITE_");

    return {
        base: "./",
        plugins: [react()],
        logLevel: mode === "production" ? ("warning" as any) : undefined,
        server: {
            host: "0.0.0.0",
            port: 1124,
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        phaser: ["phaser"],
                    },
                },
            },
            minify: "terser",
            terserOptions: {
                compress: {
                    passes: 2,
                },
                mangle: true,
                format: {
                    comments: false,
                },
            },
        },
        // 将环境变量暴露给客户端
        define: {
            __APP_ENV__: env,
        },
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
    };
});
