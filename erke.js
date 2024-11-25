[MITM]
hostname = hope.demogic.com

cron "15 9 * * *" script-path=https://raw.githubusercontent.com/Former-Years/Surge/refs/heads/main/Script/erke.js, tag=鸿星尔克

http-request ^https:\/\/hope\.demogic\.com\/gic-wx-app\/get-member-asset\.json script-path=https://raw.githubusercontent.com/Former-Years/Surge/refs/heads/main/Script/erke.js, tag=鸿星尔克Cookie
