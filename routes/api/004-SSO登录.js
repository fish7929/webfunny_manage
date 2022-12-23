const apis = [
  {
    title: "检查sso的登录token是否有效",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "验证sso的登录token是否有效",
    url: "/wfManage/checkSsoToken",
    method: "POST",
    params: [
      {
        name: "token",
        type: "string",
        isRequired: true,
        des: "sso登录后的token",
        defaultValue: "",
        example: "xxxx123xxx",
      }
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
        date: "2022-12-22",
        des: "新增了1个字段"
      },
      {
        date: "2022-12-23",
        des: "新增了1个字段"
      }
    ]
  },
  {
    title: "检查登录token是否有效",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "检查token是否有效，用于判断防止登录互踢",
    url: "/wfManage/checkToken",
    method: "POST",
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
        date: "2022-12-22",
        des: "新增了1个字段"
      }
    ]
  }
]
module.exports = apis