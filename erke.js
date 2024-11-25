[Argument]
CaptureCookie = switch, false, true, tag = 捕获Cookie, desc = 此开关控制插件是否捕获Cookie
[MITM]
hostname = hope.demogic.com

[Script]

http-request ^https:\/\/hope\.demogic\.com\/gic-wx-app\/get-member-asset\.json script-path=https://raw.githubusercontent.com/Former-Years/Surge/refs/heads/main/Script/erke.js, enable = {CaptureCookie},tag=鸿星尔克Cookie

cron "15 9 * * *" script-path=https://raw.githubusercontent.com/Former-Years/Surge/refs/heads/main/Script/erke.js, tag=鸿星尔克

[MITM]
hostname = hope.demogic.com
