/**
 * i人事：Cron 定时打卡脚本 (方案B)
 */

const isCron = typeof $argument === 'undefined' || $argument === null;

if (!isCron) {
    // --- 逻辑 A：录制/抓取模式 (手动打开 App 触发) ---
    const url = $request.url;
    const isCaptureMode = $argument.captureMode === "true";

    if (url.indexOf("doSign/decode") !== -1 && isCaptureMode) {
        let obj = JSON.parse($request.body);
        if (obj.aesReq) {
            // 存储加密位置包
            $persistentStore.write(obj.aesReq, "ihr_gold_payload");
            // 存储完整的 Headers (包含 Token/Cookie)
            $persistentStore.write(JSON.stringify($request.headers), "ihr_gold_headers");
            // 存储请求的 URL (包含 u_id 等参数)
            $persistentStore.write(url, "ihr_gold_url");
            
            $notification.post("i人事助手", "✅ 录制成功", "已更新位置包、Token和URL");
        }
    }
    $done({});

} else {
    // --- 逻辑 B：Cron 定时模式 (到点自动执行) ---
    const savedPayload = $persistentStore.read("ihr_gold_payload");
    const savedHeaders = $persistentStore.read("ihr_gold_headers");
    const savedUrl = $persistentStore.read("ihr_gold_url");

    if (savedPayload && savedHeaders && savedUrl) {
        const requestGroup = {
            url: savedUrl,
            headers: JSON.parse(savedHeaders),
            body: JSON.stringify({ "aesReq": savedPayload })
        };

        $httpClient.post(requestGroup, function(error, response, data) {
            if (!error && response.status === 200) {
                $notification.post("i人事助手", "✨ 定时打卡成功", "数据已静默提交服务器");
                console.log("🚀 [Cron] 响应结果: " + data);
            } else {
                $notification.post("i人事助手", "⚠️ 定时打卡异常", "Token可能已过期或网络波动，建议打开App刷新Token");
                console.log("❌ [Cron] 错误: " + error);
            }
        });
    } else {
        $notification.post("i人事助手", "❌ 定时任务终止", "缺少录制数据，请先手动打卡一次录制");
    }
    // Cron 脚本不需要 $done
}
