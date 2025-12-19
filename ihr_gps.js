/**
 * i人事 - 百度地图定位劫持 (调试修复版)
 * 2025-12-19 强制日志版
 */

const STORAGE_KEY = "ihr_baidu_gold_data";

// 0. 强制打印：只要脚本加载，必须在日志里看到这一行
console.log("🔥 [调试] 脚本已启动！URL: " + $request.url);

// 获取开关参数 (record=true 代表录制模式)
let isRecordMode = false;
if (typeof $argument !== 'undefined' && $argument) {
    isRecordMode = ($argument.indexOf("record=true") !== -1);
    console.log("ℹ️ [模式] 当前参数: " + $argument);
}

const url = $request.url;

// 匹配百度定位接口
if (url.indexOf("loc.map.baidu.com") !== -1) {
    
    if (isRecordMode) {
        // >>>>>>>>>> 模式 1：录制 (在公司用) <<<<<<<<<<
        console.log("🔴 [录制模式] 正在捕获真实定位...");
        
        if ($response.body) {
            const success = $persistentStore.write($response.body, STORAGE_KEY);
            if (success) {
                $notification.post("i人事", "✅ 录制成功", "公司坐标已锁定！请立即关闭录制开关。");
                console.log("🔔 [录制] 数据已保存，长度: " + $response.body.length);
            } else {
                console.log("❌ [录制] 写入存储失败");
            }
        }
        $done({});
        
    } else {
        // >>>>>>>>>> 模式 2：伪装 (在家用) <<<<<<<<<<
        const savedLocData = $persistentStore.read(STORAGE_KEY);
        
        if (savedLocData) {
            console.log("🚀 [劫持模式] 正在注入公司坐标...");
            $done({ body: savedLocData });
        } else {
            console.log("⚠️ [跳过] 本地无数据，请先开启录制模式去公司抓包！");
            $done({});
        }
    }
} else {
    console.log("⚠️ [跳过] 非目标URL");
    $done({});
}
