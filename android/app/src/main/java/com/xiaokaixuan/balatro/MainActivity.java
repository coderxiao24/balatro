package com.xiaokaixuan.balatro;

import android.os.Bundle;
import android.view.View;

import androidx.activity.EdgeToEdge;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private WindowInsetsControllerCompat windowInsetsController;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        EdgeToEdge.enable(this);
        super.onCreate(savedInstanceState);

        // 获取控制器实例并保存为成员变量，方便在其他生命周期中使用
        windowInsetsController = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());

        if (windowInsetsController != null) {
            // 彻底隐藏系统栏
            windowInsetsController.hide(WindowInsetsCompat.Type.systemBars());

            // 【关键】设置行为：当用户在屏幕边缘滑动唤出系统UI后，系统UI会自动延迟隐藏，而不是直接退出沉浸模式
            windowInsetsController.setSystemBarsBehavior(
                WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
            );
        }
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        // 每次窗口重新获得焦点时，强制隐藏系统栏，防止因弹窗或切换应用导致状态栏/导航栏意外出现
        if (hasFocus && windowInsetsController != null) {
            windowInsetsController.hide(WindowInsetsCompat.Type.systemBars());
        }
    }
}