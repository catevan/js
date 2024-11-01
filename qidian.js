[Argument]
CaptureCookie = switch, false, true, tag = 捕获Cookie, desc = 此开关控制插件是否捕获Cookie
[Script]
cron "30 10 * * *" script-path=https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/Scripts/myScripts/qidian/qidian.js, timeout=10, enabled=true, tag=起点读书
http-request https\:\/\/h5\.if\.qidian\.com\/argus\/api\/v1\/video\/adv\/finishWatch script-path=https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/Scripts/myScripts/qidian/qidian.cookie.js, requires-body=true, timeout=10, enable = {CaptureCookie},tag=qidian.cookie
http-response https\:\/\/h5\.if\.qidian\.com\/argus\/api\/v1\/video\/adv\/mainPage script-path=https://raw.githubusercontent.com/MCdasheng/QuantumultX/main/Scripts/myScripts/qidian/qidian.taskId.js, requires-body=true, timeout=10, enable = {CaptureCookie},tag=qidian.taskId
