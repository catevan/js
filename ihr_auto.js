/**
 * i人事：自动存储与劫持脚本 (分离版)
 */

(function() {
    // 基础校验
    if (typeof $request === 'undefined' || !$request.body) {
        return $done({});
    }

    const url = $request.url;
    const body = $request.body;
    
    // 获取插件面板开关状态
    let isCaptureMode = false;
    if (typeof $argument !== 'undefined' && $argument) {
        // 兼容不同版本的参数解析
        isCaptureMode = (String($argument.captureMode) === "true");
    }

    // 目标接口校验
    if (url.indexOf("doSign/decode") !== -1) {
        let obj;
        try {
            obj = JSON.parse(body);
        } catch (e) {
            console.log("❌ JSON解析失败");
            return $done({});
        }

        if (isCaptureMode) {
            // --- 录制模式 ---
            let currentPayload = obj.aesReq;
            if (currentPayload) {
                $persistentStore.write(currentPayload, "ihr_gold_payload");
                $notification.post("i人事助手", "✅ 加密包录制成功", "已存入本地缓存，现在可以关闭开关了");
                console.log("🔔 [录制] 已捕获加密包");
            }
            $done({});
        } else {
            // --- 劫持模式 ---
            let savedPayload = $persistentStore.read("ihr_gold_payload");
            if (savedPayload) {
                obj.aesReq = savedPayload;
                $notification.post("i人事助手", "🛠 位置劫持已生效", "正在使用预存的黄金加密包打卡");
                console.log("🚀 [劫持] 成功注入本地加密包");
                $done({ body: JSON.stringify(obj) });
            } else {
                $notification.post("i人事助手", "❌ 劫持失败", "请先开启抓取模式录制一次");
                $done({});
            }
        }
    } else {
        $done({});
    }
})();
