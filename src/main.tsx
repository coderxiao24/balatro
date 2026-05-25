import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { StatusBar, Style } from "@capacitor/status-bar";

// 注意：不要调用 setOverlaysWebView！
// 因为 Capacitor 的 StatusBar 插件在 setOverlaysWebView(true) 时
// 会自动添加 SYSTEM_UI_FLAG_LAYOUT_STABLE，
// 这个 flag 会导致横屏左侧（摄像头区域）出现留白。
// 全屏布局已经在 MainActivity.java 的原生沉浸模式中处理了。
const setupStatusBar = async () => {
    try {
        // 只设置样式和隐藏，不设置 overlay
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.hide();
    } catch (error) {
        console.log("StatusBar not available (running in browser)");
    }
};

setupStatusBar();

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
