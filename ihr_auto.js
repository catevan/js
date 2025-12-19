/**
 * i人事：全自动助手 (版本号: 20251218_V3)
 */

(function() {
    // 基础校验
    if (typeof $request === 'undefined' || !$request.body) return $done({});

    const url = $request.url;
    const body = $request.body;
    
    // 打印版本号，确保运行的是最新代码
    console.log("🚀 [i人事] 脚本版本: 20251218_V3 触发");

    // 获取开关状态
    let isCaptureMode = false;
    if (typeof $argument !== 'undefined' && $argument) {
        isCaptureMode = (String($argument.captureMode) === "true");
    }
    console.log("ℹ️ 当前模式: " + (isCaptureMode ? "【录制模式】" : "【劫持模式】"));

    if (url.indexOf("doSign/decode") !== -1) {
        let obj;
        try {
            obj = JSON.parse(body);
        } catch (e) {
            console.log("❌ JSON解析失败");
            return $done({});
        }

        if (isCaptureMode) {
            // --- 录制逻辑 ---
            let payload = obj.aesReq;
            if (payload) {
                // 使用 v3 作为 key 避免旧数据干扰
                $persistentStore.write(payload, "ihr_gold_v3");
                $notification.post("i人事助手", "✅ 录制成功", "最新加密包已存入本地 v3 库");
                console.log("🔔 [录制] 已捕获 aesReq: " + payload.substring(0, 20) + "...");
            }
            $done({});
        } else {
            // --- 劫持逻辑 ---
            let savedPayload = $persistentStore.read("ihr_gold_v3");
            if (savedPayload && savedPayload.length > 100) {
                obj.aesReq = savedPayload;
                $notification.post("i人事助手", "🛠 劫持生效", "正在使用预存位置");
                console.log("🚀 [劫持] 成功注入本地加密包");
                $done({ body: JSON.stringify(obj) });
            } else {
                $notification.post("i人事助手", "❌ 劫持失败", "本地缓存 v3 为空！请先开启抓取模式打卡");
                console.log("❌ [劫持] 读取本地存储失败");
                $done({});
            }
        }
    } else {
        $done({});
    }
})();
