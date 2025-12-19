/**
 * i人事：强制录制调试脚本
 */
(function() {
    if (typeof $request === 'undefined' || !$request.body) return $done({});

    const url = $request.url;
    const body = $request.body;

    // 目标接口拦截
    if (url.indexOf("doSign/decode") !== -1) {
        let obj = JSON.parse(body);
        let payload = obj.aesReq;

        if (payload) {
            // 无论开关状态，只要抓到 payload 就尝试强制写入 v4 缓存
            let saveStatus = $persistentStore.write(payload, "ihr_gold_payload_v4");
            if (saveStatus) {
                $notification.post("i人事助手", "🔔 强制录制测试", "成功捕获并存入 v4 缓存");
                console.log("✅ 成功录制 Payload");
            }
        }
    }
    $done({}); 
})();
