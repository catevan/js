/**
 * i人事：Cron 定时打卡脚本 (增强修复版)
 */

// 判断是否为 Cron 模式：Cron 任务没有 $request 对象
const isCronTask = (typeof $request === 'undefined');

if (!isCronTask) {
    // --- 【抓取模式】 ---
    const url = $request.url;
    const body = $request.body;
    
    // 强制检查参数
    let isCaptureMode = false;
    if (typeof $argument !== 'undefined' && $argument) {
        isCaptureMode = (String($argument.captureMode) === "true");
    }

    if (url.indexOf("doSign/decode") !== -1 && body) {
        if (isCaptureMode) {
            let obj = JSON.parse(body);
            if (obj.aesReq) {
                // 存入所有核心弹药
                $persistentStore.write(obj.aesReq, "ihr_gold_payload");
                $persistentStore.write(JSON.stringify($request.headers), "ihr_gold_headers");
                $persistentStore.write(url, "ihr_gold_url");
                
                $notification.post("i人事助手", "✅ 录制成功", "数据已存入弹药库，可关闭开关");
                console.log("📍 [录制] 成功捕获数据包");
            }
        } else {
            // 如果没开开关，我们也静默更新 Token，确保 Cron 里的 Token 永远是最新的
            $persistentStore.write(JSON.stringify($request.headers), "ihr_gold_headers");
            console.log("🔄 [静默] 已同步最新 Token");
        }
    }
    $done({});

} else {
    // --- 【Cron 定时打卡模式】 ---
    const payload = $persistentStore.read("ihr_gold_payload");
    const headers = $persistentStore.read("ihr_gold_headers");
    const targetUrl = $persistentStore.read("ihr_gold_url");

    if (payload && headers && targetUrl) {
        const requestGroup = {
            url: targetUrl,
            headers: JSON.parse(headers),
            body: JSON.stringify({ "aesReq": payload })
        };

        $httpClient.post(requestGroup, function(error, response, data) {
            if (!error && response.status === 200) {
                $notification.post("i人事助手", "✨ 定时打卡成功", "协议已自动提交");
            } else {
                $notification.post("i人事助手", "⚠️ 定时打卡失败", "原因: " + (error || "Token过期"));
            }
        });
    } else {
        $notification.post("i人事助手", "❌ 任务终止", "缺少数据包，请先开启开关打一次卡");
    }
}
