[MITM]
hostname = api.tuhu.cn

[Script]
http-request https:\/\/api\.tuhu\.cn\/User\/GetInternalCenterInfo tag=途虎养车#, script-path=https://raw.githubusercontent.com/Sliverkiss/GoodNight/master/Script/tuhu.js,requires-body=0

cron "17 7 * * *" script-path=https://raw.githubusercontent.com/Sliverkiss/GoodNight/master/Script/tuhu.js,tag = 途虎养车,enable=true
