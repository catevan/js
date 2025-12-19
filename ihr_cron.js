/**
 * i人事：Cron 自动打卡重放脚本
 * 核心原理：录制真实请求的 Header 和 Body，在后台定时重放。
 */

const STORAGE_KEY = "ihr_cron_data_v1";

// 判断运行环境
const isCron = typeof $cron !== 'undefined';
const isRequest = typeof $request !== 'undefined';

// --- 1. Cron 定时执行模式 ---
if (isCron) {
    const savedData = JSON.parse($persistentStore.read(STORAGE_KEY) || "{}");

    if (!savedData.url || !savedData.headers || !savedData.body) {
        console.log("❌ [i人事Cron] 失败：未找到录制数据，请先手动打卡一次");
        $notification.post("i人事Cron", "执行失败", "无录制数据，请先在 App 内手动打卡");
        $done();
    } else {
        console.log("🚀 [i人事Cron] 开始后台自动打卡...");
        
        // 构造请求
        const playRequest = {
            url: savedData.url,
            headers: savedData.headers, // 使用录制时的 Token
            body: savedData.body        // 使用录制时的 AES 加密包
        };

        $httpClient.post(playRequest, (error, response, data) => {
            if (error) {
                console.log("❌ [i人事Cron] 网络错误: " + error);
                $notification.post("i人事Cron", "网络错误", "请求发送失败");
            } else {
                console.log("✅ [i人事Cron] 服务器响应: " + data);
                // 简单判断：通常 200 且返回 code=0 或 success 表示成功
                if (response.status === 200) {
                    $notification.post("i人事Cron", "后台打卡已执行", "请打开 App 确认考勤状态");
                } else {
                    $notification.post("i人事Cron", "打卡异常", "状态码: " + response.status);
                }
            }
            $done();
        });
    }
}

// --- 2. HTTP 拦截录制模式 ---
if (isRequest) {
    // 获取插件开关
    let isCaptureMode = false;
    if (typeof $argument !== 'undefined' && $argument) {
        isCaptureMode = (String($argument.captureMode) === "true");
    }

    const url = $request.url;
    
    if (url.indexOf("doSign/decode") !== -1) {
        if (isCaptureMode) {
            // 录制：保存 URL、Headers、Body
            const recordData = {
                url: $request.url,
                headers: $request.headers,
                body: $request.body
            };
            
            $persistentStore.write(JSON.stringify(recordData), STORAGE_KEY);
            $notification.post("i人事助手", "✅ Token与数据录制成功", "Cron 脚本现在有了最新的通行证");
            console.log("🔔 [录制] 已保存 Headers 和 Body");
        } 
        // 录制模式下不阻止原请求，正常放行
        $done({});
    } else {
        $done({});
    }
}
