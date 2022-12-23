const apis = [
  {
    title: "获取用户信息",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "根据userId获取用户信息",
    url: "/wfManage/getUserInfo",
    method: "POST",
    headers: [
      {
        name: "access-token",
        type: "string",
        isRequired: true,
        des: "登录后的token",
        defaultValue: "",
        example: "xxxx123xxx",
      }
    ],
    params: [
    ],
    correctResultExample: {
      "code": 200,
      "msg": "查询信息列表成功！",
      "data": {
        "userId": "dd1685b0-d530-11ec-9bd6-3d0b63aef8ce",
        "userType": "superAdmin",
        "phone": "1850000000",
        "nickname": "超级管理员",
        "emailName": "jiang@163.com",
        "avatar": "6"
      },
      "dataDes": {
        "userId": "用户UserId",
        "userType": "用户类型",
        "phone": "手机号",
        "nickname": "昵称",
        "emailName": "邮箱",
        "avatar": "头像标识"
      }
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
    title: "获取用户信息列表",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "获取所有用户列表，只包含简单信息",
    url: "/wfManage/getAllUserInfoForSimple",
    method: "POST",
    headers: [
      {
        name: "access-token",
        type: "string",
        isRequired: true,
        des: "登录后的token",
        defaultValue: "",
        example: "xxxx123xxx",
      }
    ],
    params: [
    ],
    correctResultExample: {
      "code": 200,
      "msg": "查询信息列表成功！",
      "data": "用户列表",
      "dataDes": "用户列表",
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
    title: "管理员获取用户列表",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "获取所有用户列表，只有管理员才能调用，包含详细信息",
    url: "/wfManage/getUserListByAdmin",
    method: "POST",
    headers: [
      {
        name: "access-token",
        type: "string",
        isRequired: true,
        des: "登录后的token",
        defaultValue: "",
        example: "xxxx123xxx",
      }
    ],
    params: [
    ],
    correctResultExample: {
      "code": 200,
      "msg": "查询信息列表成功！",
      "data": "用户列表",
      "dataDes": "用户列表",
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