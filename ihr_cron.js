/**
 * i人事：Cron 自动打卡录制脚本 (调试增强版)
 * 更新时间：2025-12-19
 */

const STORAGE_KEY = "ihr_cron_data_v1";

// --- 1. Cron 定时执行模式 (后台运行) ---
if (typeof $cron !== 'undefined') {
    const savedData = JSON.parse($persistentStore.read(STORAGE_KEY) || "{}");

    if (!savedData.url || !savedData.headers || !savedData.body) {
        console.log("❌ [i人事Cron] 失败：无录制数据");
        $notification.post("i人事Cron", "执行失败", "请先去插件里开启开关并手动打卡一次！");
        $done();
    } else {
        console.log("🚀 [i人事Cron] 开始后台执行...");
        
        const playRequest = {
            url: savedData.url,
            headers: savedData.headers,
            body: savedData.body
        };

        $httpClient.post(playRequest, (error, response, data) => {
            if (error) {
                $notification.post("i人事Cron", "网络错误", "请求发送失败: " + error);
            } else {
                if (response.status === 200) {
                    console.log("✅ [i人事Cron] 成功: " + data);
                    $notification.post("i人事Cron", "✅ 后台打卡成功", "服务器已接收请求");
                } else {
                    console.log("⚠️ [i人事Cron] 异常: " + response.status);
                    $notification.post("i人事Cron", "⚠️ 打卡异常", "状态码: " + response.status);
                }
            }
            $done();
        });
    }
}

// --- 2. HTTP 拦截录制模式 (前台手动打卡) ---
if (typeof $request !== 'undefined') {
    const url = $request.url;
    
    // 调试日志：证明脚本触发了
    console.log("🔍 [i人事调试] 捕获到接口: " + url);

    // 获取开关状态 (增强兼容性)
    let isCaptureMode = false;
    if (typeof $argument !== 'undefined' && $argument) {
        // 强制转换为字符串比较，防止类型错误
        isCaptureMode = (String($argument.captureMode) === "true");
        console.log("ℹ️ [i人事调试] 开关状态: " + isCaptureMode);
    } else {
        console.log("⚠️ [i人事调试] 未获取到 argument 参数，默认为关闭");
    }

    // 匹配核心接口
    if (url.indexOf("doSign/decode") !== -1) {
        if (isCaptureMode) {
            // --- 录制逻辑 ---
            if ($request.body) {
                const recordData = {
                    url: $request.url,
                    headers: $request.headers,
                    body: $request.body
                };
                // 写入存储
                const success = $persistentStore.write(JSON.stringify(recordData), STORAGE_KEY);
                
                if (success) {
                    $notification.post("i人事助手", "✅ Token录制成功", "数据已保存，Cron 任务将使用此凭证");
                    console.log("🔔 [录制] 数据保存成功，长度: " + $request.body.length);
                } else {
                    $notification.post("i人事助手", "❌ 存储失败", "Loon 写入权限异常");
                }
            } else {
                $notification.post("i人事助手", "⚠️ 录制失败", "请求体为空");
            }
        } else {
            // --- 非录制模式 ---
            // 只有你在查看日志时才会看到这条，证明脚本活着但没做事
            console.log("ℹ️ [i人事] 抓取开关为 OFF，静默放行...");
            
            // 如果你想确认脚本是否生效，可以临时取消下面这行的注释：
            // $notification.post("i人事调试", "脚本正常", "但开关没开，没录制数据");
        }
        $done({});
    } else {
        $done({});
    }
}
