/**
 * i人事：全自动助手 (修复增强版)
 */

(function() {
    if (typeof $request === 'undefined' || !$request.body) return $done({});

    const url = $request.url;
    const body = $request.body;
    
    // 兼容逻辑：处理 Loon 对参数的不同解析方式
    let isCaptureMode = false;
    if (typeof $argument !== 'undefined' && $argument) {
        // 将 argument 转换为字符串进行比对，防止布尔值判断失败
        isCaptureMode = (String($argument.captureMode) === "true");
    }

    if (url.indexOf("doSign/decode") !== -1) {
        let obj = JSON.parse(body);

        if (isCaptureMode) {
            // --- 录制模式 ---
            let payload = obj.aesReq;
            if (payload && payload.length > 100) {
                // 执行写入并获取结果
                let saveStatus = $persistentStore.write(payload, "ihr_gold_payload_v2");
                if (saveStatus) {
                    $notification.post("i人事助手", "✅ 录制并存储成功", "数据长度：" + payload.length);
                    console.log("🔔 [录制模式] 成功写入缓存 Key: ihr_gold_payload_v2");
                } else {
                    $notification.post("i人事助手", "❌ 存储失败", "请检查 Loon 权限或空间");
                }
            } else {
                $notification.post("i人事助手", "⚠️ 录制失败", "未能从请求中提取到有效的加密包");
            }
            $done({});
        } else {
            // --- 劫持模式 ---
            // 使用新的 Key 尝试读取
            let savedData = $persistentStore.read("ihr_gold_payload_v2");
            
            if (savedData && savedData.length > 100) {
                obj.aesReq = savedData;
                $notification.post("i人事助手", "🛠 劫持生效", "已注入预存的加密数据包");
                $done({ body: JSON.stringify(obj) });
            } else {
                $notification.post("i人事助手", "❌ 劫持失败", "本地缓存为空！请开启抓取模式录制");
                $done({});
            }
        }
    } else {
        $done({});
    }
})();
