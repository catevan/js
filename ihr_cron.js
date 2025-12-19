/**
 * i人事：Cron 自动打卡 - 强制录制修复版
 * 版本：Force_Record_V1
 * 说明：此版本已移除开关判断，强制拦截并录制 Token/Body。
 */

const STORAGE_KEY = "ihr_cron_data_v1";

// ==========================================
// 1. Cron 后台定时执行模块
// ==========================================
if (typeof $cron !== 'undefined') {
    const savedData = JSON.parse($persistentStore.read(STORAGE_KEY) || "{}");

    if (!savedData.url || !savedData.headers || !savedData.body) {
        console.log("❌ [i人事Cron] 失败：无录制数据");
        $notification.post("i人事Cron", "执行失败", "请先打开 App 手动打卡一次以录制数据！");
        $done();
    } else {
        console.log("🚀 [i人事Cron] 开始后台自动打卡...");
        
        const playRequest = {
            url: savedData.url,
            headers: savedData.headers,
            body: savedData.body
        };

        $httpClient.post(playRequest, (error, response, data) => {
            if (error) {
                console.log("❌ [i人事Cron] 网络错误: " + error);
                $notification.post("i人事Cron", "网络错误", "请求发送失败");
            } else {
                if (response.status === 200) {
                    console.log("✅ [i人事Cron] 成功: " + data);
                    $notification.post("i人事Cron", "✅ 后台打卡成功", "服务器已接收请求");
                } else {
                    console.log("⚠️ [i人事Cron] 异常状态码: " + response.status);
                    $notification.post("i人事Cron", "⚠️ 打卡异常", "状态码: " + response.status);
                }
            }
            $done();
        });
    }
}

// ==========================================
// 2. HTTP 前台拦截录制模块
// ==========================================
if (typeof $request !== 'undefined') {
    const url = $request.url;
    
    // 匹配核心打卡接口
    if (url.indexOf("doSign/decode") !== -1) {
        
        // 【关键修改】这里直接强制为 true，无视插件开关状态
        const isCaptureMode = true; 
        
        console.log("⚠️ [强制模式] 正在执行数据录制...");

        if ($request.body && isCaptureMode) {
            const recordData = {
                url: $request.url,
                headers: $request.headers,
                body: $request.body
            };
            
            // 写入持久化存储
            const success = $persistentStore.write(JSON.stringify(recordData), STORAGE_KEY);
            
            if (success) {
                // 成功录制后，发送弹窗通知
                $notification.post("i人事助手", "✅ Token录制成功", "数据已保存，Cron 任务将使用此凭证自动打卡");
                console.log("🔔 [录制] 数据保存成功，Body长度: " + $request.body.length);
            } else {
                $notification.post("i人事助手", "❌ 存储失败", "Loon 写入权限异常");
            }
        }
        
        // 录制完成后放行请求，确保本次手动打卡正常完成
        $done({});
    } else {
        $done({});
    }
}
