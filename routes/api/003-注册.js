const apis = [
  {
    title: "发送注册验证码",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "发送注册验证码",
    url: "/wfManage/sendRegisterEmail",
    method: "POST",
    params: [
      {
        name: "email",
        type: "string",
        isRequired: true,
        des: "登录名（邮箱）",
        defaultValue: "",
        example: "xxx@163.com",
      }
    ],
    correctResultExample: {
      "code": 200,
      "msg": "验证码已发送",
      "data": 0,
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
    title: "超级管理员获取注册验证码",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "超级管理员可以直接获取验证码，用户内网环境无法发送邮件的场景",
    url: "/wfManage/getRegisterEmailForSupperAdmin",
    method: "POST",
    params: [
    ],
    correctResultExample: {
      "code": 200,
      "msg": "success",
      "data": "1234",
      "dataDes": "注册验证码"
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
    title: "管理员发送确认邮件",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "普通成员注册后，都会给管理员发送确认邮件，管理员确认后，才能正常登录",
    url: "/wfManage/registerCheck",
    method: "POST",
    params: [
      {
        name: "name",
        type: "string",
        isRequired: true,
        des: "用户昵称",
        defaultValue: "",
        example: "喵喵",
      },
      {
        name: "email",
        type: "string",
        isRequired: true,
        des: "登录名（邮箱）",
        defaultValue: "",
        example: "xxx@163.com",
      },
      {
        name: "emailCode",
        type: "string",
        isRequired: true,
        des: "邮箱验证码",
        defaultValue: "",
        example: "1234",
      },
      {
        name: "password",
        type: "string",
        isRequired: true,
        des: "密码",
        defaultValue: "",
        example: "1234",
      }
    ],
    correctResultExample: {
      "code": 200,
      "msg": "success",
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
    title: "管理员注册接口",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "超级管理员是单独的注册接口",
    url: "/wfManage/registerForAdmin",
    method: "POST",
    params: [
      { name: "name", type: "string", isRequired: true, des: "用户昵称", defaultValue: "", example: "喵喵" },
      { name: "email", type: "string", isRequired: true, des: "登录名（邮箱）", defaultValue: "", example: "xxx@163.com" },
      { name: "password", type: "string", isRequired: true, des: "密码", defaultValue: "", example: "1234" },
      { name: "userType", type: "string", isRequired: true, des: "用户类型（customer, admin, superAdmin）", defaultValue: "", example: "superAdmin" },
      { name: "phone", type: "string", isRequired: true, des: "手机号", defaultValue: "", example: "1560000xxxx" },
    ],
    correctResultExample: {
      "code": 200,
      "msg": "success",
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
    title: "注册账号",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "普通成员注册账号",
    url: "/wfManage/register",
    method: "POST",
    params: [
      { name: "name", type: "string", isRequired: true, des: "用户昵称", defaultValue: "", example: "喵喵" },
      { name: "email", type: "string", isRequired: true, des: "登录名（邮箱）", defaultValue: "", example: "xxx@163.com" },
      { name: "password", type: "string", isRequired: true, des: "密码", defaultValue: "", example: "1234" },
      { name: "phone", type: "string", isRequired: true, des: "手机号", defaultValue: "", example: "1560000xxxx" },
    ],
    correctResultExample: {
      "code": 200,
      "msg": "success",
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
    title: "API接口注册账号",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "普通成员注册账号",
    url: "/wfManage/registerForApi",
    method: "POST",
    params: [
      { name: "name", type: "string", isRequired: true, des: "用户昵称", defaultValue: "", example: "喵喵" },
      { name: "email", type: "string", isRequired: true, des: "登录名（邮箱）", defaultValue: "", example: "xxx@163.com" },
      { name: "password", type: "string", isRequired: true, des: "密码", defaultValue: "", example: "1234" },
      { name: "phone", type: "string", isRequired: true, des: "手机号", defaultValue: "", example: "1560000xxxx" },
    ],
    correctResultExample: {
      "code": 200,
      "msg": "success",
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