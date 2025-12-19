/**
 * i人事：全自动助手 (劫持生效版)
 */
(function() {
    if (typeof $request === 'undefined' || !$request.body) return $done({});

    const url = $request.url;
    const body = $request.body;
    
    // 获取插件开关状态
    let isCaptureMode = false;
    if (typeof $argument !== 'undefined' && $argument) {
        isCaptureMode = (String($argument.captureMode) === "true");
    }

    if (url.indexOf("doSign/decode") !== -1) {
        let obj = JSON.parse(body);

        if (isCaptureMode) {
            // --- 录制模式 (您刚才已经成功跑通这一步) ---
            let payload = obj.aesReq;
            if (payload) {
                $persistentStore.write(payload, "ihr_gold_payload_v4");
                $notification.post("i人事助手", "✅ 录制成功", "数据已更新至 v4 缓存");
            }
            $done({});
        } else {
            // --- 劫持模式 (现在我们要用的模式) ---
            // 尝试读取刚才录制成功的 v4 数据
            let savedData = $persistentStore.read("ihr_gold_payload_v4");
            
            if (savedData && savedData.length > 100) {
                obj.aesReq = savedData;
                $notification.post("i人事助手", "🛠 劫持已生效", "已注入 v4 预存位置，打卡中...");
                console.log("🚀 [劫持] 成功注入加密包");
                $done({ body: JSON.stringify(obj) });
            } else {
                $notification.post("i人事助手", "❌ 劫持失败", "本地 v4 缓存为空，请先开启抓取模式");
                $done({});
            }
        }
    } else {
        $done({});
    }
})();
