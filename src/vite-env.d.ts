/// <reference types="vite/client" />

// 扩展 import.meta.env 的类型定义
interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string;
    readonly VITE_APP_ENV: string;
    readonly VITE_APP_API_URL: string;
    readonly VITE_APP_DEBUG: string;
    readonly VITE_APP_VERSION: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

// 自定义全局变量 __APP_ENV__ 的类型
declare const __APP_ENV__: {
    VITE_APP_TITLE: string;
    VITE_APP_ENV: string;
    VITE_APP_API_URL: string;
    VITE_APP_DEBUG: string;
    VITE_APP_VERSION: string;
};
