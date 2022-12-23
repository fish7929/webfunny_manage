const apis = [
  {
    title: "登录",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "登录webfunny系统，获取token",
    url: "/wfManage/login",
    method: "POST",
    headers: [
    ],
    params: [
      { name: "emailName", type: "string", isRequired: true, des: "登录名（邮箱）", defaultValue: "", example: "xxx@163.com" },
      { name: "password", type: "string", isRequired: true, des: "密码", defaultValue: "", example: "1234" },
      { name: "code", type: "string", isRequired: true, des: "验证码", defaultValue: "", example: "1aa1" },
      { name: "webfunnyToken", type: "string", isRequired: false, des: "登录token,用来验证token是否失效", defaultValue: "", example: "token" },
    ],
    correctResultExample: {
      "code": 200,
      "msg": "登录成功",
      "data": "eyJhbGciOiJIU...",
      "dataDes": "登录后生成的token"
    },
    incorrectResultExample: "",
    ps: "无",
    logs: [
    ]
  },
  {
    title: "API登录",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "通过接口登录webfunny系统，获取token",
    url: "/wfManage/loginForApi",
    method: "POST",
    headers: [
    ],
    params: [
      {
        name: "emailName",
        type: "string",
        isRequired: true,
        des: "登录名",
        defaultValue: "",
        example: "xxx@163.com",
      },
      {
        name: "password",
        type: "string",
        isRequired: true,
        des: "登录密码",
        defaultValue: "",
        example: "123",
      }
    ],
    correctResultExample: {
      "code": 200,
      "msg": "登录成功",
      "data": "eyJhbGciOiJIU...",
      "dataDes": "登录后生成的token"
    },
    incorrectResultExample: "",
    ps: "无",
    logs: [
    ]
  },
  {
    title: "获取登录验证码",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "获取登录页面验证码",
    url: "/wfManage/getValidateCode",
    method: "POST",
    headers: [
    ],
    params: [
    ],
    correctResultExample: {
      "code": 200,
      "msg": "success",
      "data": "HAGb"
    },
    incorrectResultExample: "",
    ps: "无",
    logs: [
    ]
  },
  {
    title: "刷新登录验证码",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "登录页面验证码，点击验证码可以刷新",
    url: "/wfManage/refreshValidateCode",
    method: "POST",
    headers: [
    ],
    params: [
    ],
    correctResultExample: {
      "code": 200,
      "msg": "success",
      "data": "HAGb"
    },
    incorrectResultExample: "",
    ps: "无",
    logs: [
    ]
  },
  {
    title: "忘记密码",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "忘记密码，重新生成密码",
    url: "/wfManage/forgetPwd",
    method: "POST",
    headers: [
    ],
    params: [
      {
        name: "email",
        type: "string",
        isRequired: true,
        des: "用户的注册邮箱",
        defaultValue: "",
        example: "xxx@163.com",
      }
    ],
    correctResultExample: {
      "code": 200,
      "msg": "success",
      "data": "",
      "dataDes": "无"
    },
    incorrectResultExample: "",
    ps: "无",
    logs: [
    ]
  },
  {
    title: "重置密码",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "重置密码，邮箱将会收到新密码",
    url: "/wfManage/resetPwd",
    method: "POST",
    headers: [
    ],
    params: [
      { name: "email", type: "string", isRequired: true, des: "登录名（邮箱）", defaultValue: "", example: "xxx@163.com" },
      { name: "password", type: "string", isRequired: true, des: "密码", defaultValue: "", example: "1234" },
      { name: "emailCode", type: "string", isRequired: true, des: "验证码", defaultValue: "", example: "1aa1" },
    ],
    correctResultExample: {
      "code": 200,
      "msg": "success",
      "data": "",
      "dataDes": "无"
    },
    incorrectResultExample: "",
    ps: "无",
    logs: [
    ]
  }
]
module.exports = apis