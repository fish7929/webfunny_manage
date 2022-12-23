const apis = [
  {
    title: "激活用户",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "用户注册后，默认是未激活状态，需要管理员激活",
    url: "/wfManage/activeRegisterMember",
    method: "POST",
    headers: [
      { name: "access-token", type: "string", isRequired: true, des: "登录后的token", defaultValue: "", example: "xxxx123xxx" }
    ],
    params: [
      { name: "userId", type: "string", isRequired: true, des: "用户id", defaultValue: "", example: "1234-xxx-1234" },
      { name: "emailName", type: "string", isRequired: true, des: "登录名（邮箱）", defaultValue: "", example: "xxx@163.com" },
    ],
    correctResultExample: {
      "code": 200,
      "msg": "查询信息列表成功！",
      "data": "",
      "dataDes": ""
    },
    incorrectResultExample: "",
    ps: "无",
    logs: [
      {
        date: "2022-12-23",
        des: "初始化"
      },
    ]
  },
  {
    title: "删除用户",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "删除用户",
    url: "/wfManage/deleteRegisterMember",
    method: "POST",
    headers: [
      { name: "access-token", type: "string", isRequired: true, des: "登录后的token", defaultValue: "", example: "xxxx123xxx" }
    ],
    params: [
      { name: "userId", type: "string", isRequired: true, des: "用户id", defaultValue: "", example: "1234-xxx-1234" },
    ],
    correctResultExample: {
      "code": 200,
      "msg": "查询信息列表成功！",
      "data": "",
      "dataDes": ""
    },
    incorrectResultExample: "",
    ps: "无",
    logs: [
      {
        date: "2022-12-23",
        des: "初始化"
      },
    ]
  },
  {
    title: "设置管理员",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "将用户设置为管理员",
    url: "/wfManage/setAdmin",
    method: "POST",
    headers: [
      { name: "access-token", type: "string", isRequired: true, des: "登录后的token", defaultValue: "", example: "xxxx123xxx" }
    ],
    params: [
      { name: "userId", type: "string", isRequired: true, des: "用户id", defaultValue: "", example: "1234-xxx-1234" },
      { name: "setType", type: "string", isRequired: true, des: "角色类型", defaultValue: "", example: "customer, admin, superAdmin" },
    ],
    correctResultExample: {
      "code": 200,
      "msg": "管理员设置成功",
      "data": "",
      "dataDes": ""
    },
    incorrectResultExample: "",
    ps: "无",
    logs: [
      {
        date: "2022-12-23",
        des: "初始化"
      },
    ]
  },
  {
    title: "交接超级管理员",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "将超级管理员移交给其他人",
    url: "/wfManage/resetSuperAdmin",
    method: "POST",
    headers: [
      { name: "access-token", type: "string", isRequired: true, des: "登录后的token", defaultValue: "", example: "xxxx123xxx" }
    ],
    params: [
      { name: "userId", type: "string", isRequired: true, des: "用户id", defaultValue: "", example: "1234-xxx-1234" },
      { name: "userType", type: "string", isRequired: true, des: "角色类型", defaultValue: "", example: "customer, admin, superAdmin" },
    ],
    correctResultExample: {
      "code": 200,
      "msg": "管理员设置成功",
      "data": "",
      "dataDes": ""
    },
    incorrectResultExample: "",
    ps: "无",
    logs: [
      {
        date: "2022-12-23",
        des: "初始化"
      },
    ]
  },
  {
    title: "获取超级管理员数量",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "如果没有超级管理员，则跳转至管理员注册页面",
    url: "/wfManage/hasSuperAdminAccount",
    method: "POST",
    headers: [
      { name: "access-token", type: "string", isRequired: true, des: "登录后的token", defaultValue: "", example: "xxxx123xxx" }
    ],
    params: [
      { name: "userId", type: "string", isRequired: true, des: "用户id", defaultValue: "", example: "1234-xxx-1234" },
      { name: "userType", type: "string", isRequired: true, des: "角色类型", defaultValue: "", example: "customer, admin, superAdmin" },
    ],
    correctResultExample: {
      "code": 200,
      "msg": "管理员设置成功",
      "data": "",
      "dataDes": ""
    },
    incorrectResultExample: "",
    ps: "无",
    logs: [
      {
        date: "2022-12-23",
        des: "初始化"
      },
    ]
  },
]
module.exports = apis