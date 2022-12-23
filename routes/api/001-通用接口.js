const apis = [
  {
    title: "获取基础配置信息",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "获取监控和埋点的基础配置信息，如接口域名，可视化界面域名",
    url: "/wfManage/getSysConfigInfo",
    method: "POST",
    headers: [
    ],
    params: [
    ],
    correctResultExample: {
      "code": 200,
      "msg": "创建信息成功",
      "data": {
        "monitor": {},
        "event": {}
      },
      "dataDes": {
        "monitor": "监控配置",
        "event": "埋点配置"
      }
    },
    incorrectResultExample: "",
    ps: "无",
    logs: [
      {
        date: "2022-12-23",
        des: "初始化"
      }
    ]
  }
]
module.exports = apis