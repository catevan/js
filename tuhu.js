[Argument]
CaptureCookie = switch, false, true, tag = 捕获Cookie, desc = 此开关控制插件是否捕获Cookie

[MITM]
hostname = api.tuhu.cn

[Script]
http-request https:\/\/api\.tuhu\.cn\/User\/GetInternalCenterInfo tag=途虎养车#, script-path=https://raw.githubusercontent.com/Sliverkiss/GoodNight/master/Script/tuhu.js,requires-body=0,enable = {CaptureCookie}

cron "17 7 * * *" script-path=https://raw.githubusercontent.com/Sliverkiss/GoodNight/master/Script/tuhu.js,tag = 途虎养车,enable=true
