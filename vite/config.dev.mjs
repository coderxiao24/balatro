import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // 根据 mode 加载对应的 .env 文件（如 .env.development）
    const env = loadEnv(mode, process.cwd(), "VITE_");

    return {
        base: "./",
        plugins: [react()],
        server: {
            host: "0.0.0.0",
            port: 8080,
        },
        // 将环境变量暴露给客户端
        define: {
            __APP_ENV__: JSON.stringify(env),
        },
    };
});
