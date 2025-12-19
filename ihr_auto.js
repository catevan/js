/**
 * i人事：全自动助手 (硬核调试版)
 */

(function() {
    if (typeof $request === 'undefined' || !$request.body) return $done({});

    const url = $request.url;
    const body = $request.body;
    
    // 1. 强制解析参数并弹出模式提醒
    let isCaptureMode = false;
    if (typeof $argument !== 'undefined' && $argument) {
        isCaptureMode = (String($argument.captureMode) === "true");
    }

    // 2. 仅在目标接口执行逻辑
    if (url.indexOf("doSign/decode") !== -1) {
        let obj = JSON.parse(body);

        if (isCaptureMode) {
            // --- 录制模式 ---
            let payload = obj.aesReq;
            if (payload) {
                // 尝试写入
                let saveStatus = $persistentStore.write(payload, "ihr_gold_payload_v3");
                if (saveStatus) {
                    $notification.post("i人事助手", "✅ 录制成功", "数据已存入 v3 缓存，请关闭开关测试");
                } else {
                    $notification.post("i人事助手", "❌ 写入失败", "存储空间受限");
                }
            } else {
                $notification.post("i人事助手", "⚠️ 字段错误", "未能在 Body 中找到 aesReq");
            }
            $done({});
        } else {
            // --- 劫持模式 ---
            let savedData = $persistentStore.read("ihr_gold_payload_v3");
            if (savedData) {
                obj.aesReq = savedData;
                $notification.post("i人事助手", "🛠 劫持生效", "已注入预存位置");
                $done({ body: JSON.stringify(obj) });
            } else {
                // 如果弹出此信息，说明你还没有成功执行过“录制模式”
                $notification.post("i人事助手", "❌ 劫持失败", "缓存仍为空，请先开启抓取模式录制一次");
                $done({});
            }
        }
    } else {
        $done({});
    }
})();
