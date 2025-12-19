/**
 * i人事 - 百度地图底层劫持 (最终解决版)
 * 原理：拦截地图接口，注入真实的公司定位数据。
 * 效果：App 认为在公司，并使用【当前最新时间】生成打卡包，完美绕过时间戳检测。
 */

const STORAGE_KEY = "ihr_baidu_gold_data";

// 检查参数：是否为录制模式
let isRecordMode = false;
if (typeof $argument !== 'undefined' && $argument) {
    isRecordMode = ($argument.indexOf("record=true") !== -1);
}

const url = $request.url;

// 匹配百度定位接口
if (url.indexOf("loc.map.baidu.com") !== -1) {
    
    if (isRecordMode) {
        // >>>>>>>>>> 模式 1：录制 (在公司用) <<<<<<<<<<
        if ($response.body) {
            // 保存百度返回的原始定位数据 (可能是二进制或特殊编码，原样保存)
            const success = $persistentStore.write($response.body, STORAGE_KEY);
            
            if (success) {
                $notification.post("i人事-GPS", "✅ 定位录制成功", "公司坐标已锁定，请立即去配置里关闭录制脚本！");
                console.log("🔔 [录制] 百度定位数据已保存，长度: " + $response.body.length);
            }
        }
        $done({});
        
    } else {
        // >>>>>>>>>> 模式 2：伪装 (在家用) <<<<<<<<<<
        const savedLocData = $persistentStore.read(STORAGE_KEY);
        
        if (savedLocData) {
            console.log("🚀 [劫持] 拦截到定位请求，正在注入公司坐标...");
            // 将录制的数据作为响应返回给 App
            $done({ body: savedLocData });
        } else {
            // 如果没数据，正常放行，不影响 App 使用
            $done({});
        }
    }
} else {
    $done({});
}
