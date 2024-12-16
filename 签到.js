const axios = require('axios');
const { exec } = require('child_process');

// 青龙通知函数
function sendNotify(title, message) {
  // 使用 Python3 调用 notify.py 发送通知
  exec(`python3 /ql/data/scripts/notify.py "${title}" "${message}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`通知发送失败: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`通知发送失败: ${stderr}`);
      return;
    }
    console.log(`通知发送成功: ${stdout}`);
  });
}

// 请求参数
let url = "https://api.landacloud.com/landa-attendance/app/clockin?corpId=d2ec2c45-931d-4533-8e8f-a9b0cdc490f7";
let headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Content-Length': '631',
    'Origin': 'https://micappstore.landacloud.com',
    'Host': 'api.landacloud.com',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
    'Sec-Fetch-Dest': 'empty',
    'Connection': 'keep-alive',
    'Referer': 'https://micappstore.landacloud.com/',
    'Accept-Language': 'en-US,en;q=0.9',
    'Sec-Fetch-Mode': 'cors',
    'Content-Type': 'application/json',
    'Sec-Fetch-Site': 'same-site',
};

let body = {
    "type": 0,
    "location": "东莞安朴酒店",
    "lat": "22.87069920846594",
    "lng": "113.8818050116321",
    "image": null,
    "userCode": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5MzEwODY3YzA0NTU0MWEwYWZhMzVjNTM0MDllYjliYiIsInVuaW9uaWQiOiJjNWZiMDk4MGVhM2U0ZjUyOTQ5OTFmMTJlY2VlODNjYSIsImlzcyI6ImxhbmRhIiwiYXVkIjoiTEFOREFfTUFTX1NTTyIsImV4cCI6MTczNjEyMTY1MywibmJmIjoxNzI4MzQ1NjUyfQ.NEGAXqKJeNpgPtLoIPQlx23P_pBwps9XLUHelSdxl2g",
    "remark": "在打卡范围内,计算的位置编号:7,设置距离:300,打卡位置:113.8818050116321,22.87069920846594,计算距离:240.50667030137936",
    "clock_explain": "",
    "corpId": "d2ec2c45-931d-4533-8e8f-a9b0cdc490f7"
};

// 发起请求
axios.post(url, body, { headers: headers })
    .then(response => {
        console.log("Response Status: " + response.status);
        console.log("Response Headers: " + JSON.stringify(response.headers));
        console.log("Response Body: " + JSON.stringify(response.data));
        
        if (response.status === 200 && response.data.msg === '打卡成功!') {
            // 打卡成功
            console.log("打卡成功", response.data);
            sendNotify("打卡成功", `状态码: ${response.status}\n返回数据: ${JSON.stringify(response.data)}`);
        } else {
            // 打卡失败
            console.log("打卡失败", response.data);
            sendNotify("打卡失败", `状态码: ${response.status}\n返回数据: ${JSON.stringify(response.data)}`);
        }
    })
    .catch(error => {
        console.error("请求错误: ", error);
        // 请求失败
        sendNotify("请求错误", `错误信息: ${error.message}`);
    });
