import type { CapacitorConfig } from "@capacitor/cli";
import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";

const mode = process.env.CAPACITOR_ENV || "development";

dotenvConfig({ path: resolve(process.cwd(), `.env.${mode}`) });

const appName = process.env.VITE_APP_TITLE || "balatro";
const appEnv = process.env.VITE_APP_ENV || mode;

const config: CapacitorConfig = {
    appId: "com.xiaokaixuan.balatro",
    appName: appName,
    webDir: "dist",
    server:
        appEnv === "development"
            ? {
                  url: process.env.VITE_DEBUG_URL,
                  cleartext: true,
              }
            : undefined,
};

export default config;
