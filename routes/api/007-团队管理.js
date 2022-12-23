const apis = [
  {
    title: "创建团队",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "新建团队",
    url: "/wfManage/createNewTeam",
    method: "POST",
    headers: [
      { name: "access-token", type: "string", isRequired: true, des: "登录后的token", defaultValue: "", example: "xxxx123xxx" }
    ],
    params: [
      { name: "teamName", type: "string", isRequired: true, des: "团队名称", defaultValue: "", example: "1234-xxx-1234" },
    ],
    correctResultExample: {
      "code": 200,
      "msg": "创建信息成功",
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
    title: "接口API创建团队",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "接口API创建团队",
    url: "/wfManage/createNewTeamForApi",
    method: "POST",
    headers: [
      { name: "access-token", type: "string", isRequired: true, des: "登录后的token", defaultValue: "", example: "xxxx123xxx" }
    ],
    params: [
      { name: "teamName", type: "string", isRequired: true, des: "团队名称", defaultValue: "", example: "1234-xxx-1234" },
    ],
    correctResultExample: {
      "code": 200,
      "msg": "创建信息成功",
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
    title: "获取团队列表",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "获取团队列表，包含团队的详细信息",
    url: "/wfManage/getTeamList",
    method: "POST",
    headers: [
      { name: "access-token", type: "string", isRequired: true, des: "登录后的token", defaultValue: "", example: "xxxx123xxx" }
    ],
    params: [
      { name: "userId", type: "string", isRequired: true, des: "用户Id", defaultValue: "", example: "1234-xxx-1234" },
      { name: "userType", type: "string", isRequired: true, des: "用户类型", defaultValue: "", example: "admin" },
    ],
    correctResultExample: {
      "code": 200,
      "msg": "创建信息成功",
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
    title: "获取团队列表-简化",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "获取团队列表，包含团队的简单信息",
    url: "/wfManage/getSimpleTeamList",
    method: "POST",
    headers: [
      { name: "access-token", type: "string", isRequired: true, des: "登录后的token", defaultValue: "", example: "xxxx123xxx" }
    ],
    params: [
      { name: "userId", type: "string", isRequired: true, des: "用户Id", defaultValue: "", example: "1234-xxx-1234" },
      { name: "userType", type: "string", isRequired: true, des: "用户类型", defaultValue: "", example: "admin" },
    ],
    correctResultExample: {
      "code": 200,
      "msg": "创建信息成功",
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
    title: "团队添加成员",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "团长可以给团队添加成员",
    url: "/wfManage/addTeamMember",
    method: "POST",
    headers: [
      { name: "access-token", type: "string", isRequired: true, des: "登录后的token", defaultValue: "", example: "xxxx123xxx" }
    ],
    params: [
      { name: "id", type: "string", isRequired: true, des: "团队Id", defaultValue: "", example: "12" },
      { name: "members", type: "string", isRequired: true, des: "用户userId", defaultValue: "", example: "xxx123xxx" },
    ],
    correctResultExample: {
      "code": 200,
      "msg": "创建信息成功",
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
    title: "删除团队",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "删除团队，前提是团队下没有项目了",
    url: "/wfManage/deleteTeam",
    method: "POST",
    headers: [
      { name: "access-token", type: "string", isRequired: true, des: "登录后的token", defaultValue: "", example: "xxxx123xxx" }
    ],
    params: [
      { name: "id", type: "string", isRequired: true, des: "团队Id", defaultValue: "", example: "12" },
    ],
    correctResultExample: {
      "code": 200,
      "msg": "团队删除成功",
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
    title: "移动项目到其他团队",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "将某个项目迁移到其他团队中去",
    url: "/wfManage/moveProToTeam",
    method: "POST",
    headers: [
      { name: "access-token", type: "string", isRequired: true, des: "登录后的token", defaultValue: "", example: "xxxx123xxx" }
    ],
    params: [
      { name: "showMoveMonitorId", type: "string", isRequired: true, des: "项目的webMonitorId", defaultValue: "", example: "webfunny_pro_xx" },
      { name: "chooseTeamId", type: "string", isRequired: true, des: "目标团队Id", defaultValue: "", example: "12" },
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
    title: "根据项目标识获取团队下的成员",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "根据项目标识（webMonitorId）获取团队下的成员",
    url: "/wfManage/getTeamMembersByWebMonitorId",
    method: "POST",
    headers: [
      { name: "access-token", type: "string", isRequired: true, des: "登录后的token", defaultValue: "", example: "xxxx123xxx" }
    ],
    params: [
      { name: "webMonitorId", type: "string", isRequired: true, des: "项目的webMonitorId", defaultValue: "", example: "webfunny_pro_xx" },
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
    title: "获取所有团队列表",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "根据项目标识（webMonitorId）获取团队下的成员",
    url: "/wfManage/getAllTeamList",
    method: "POST",
    headers: [
      { name: "access-token", type: "string", isRequired: true, des: "登录后的token", defaultValue: "", example: "xxxx123xxx" }
    ],
    params: [
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
    title: "团长移交",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "将团长移交给其他人",
    url: "/wfManage/resetTeamLeader",
    method: "POST",
    headers: [
      { name: "access-token", type: "string", isRequired: true, des: "登录后的token", defaultValue: "", example: "xxxx123xxx" }
    ],
    params: [
      { name: "userId", type: "string", isRequired: true, des: "用户Id", defaultValue: "", example: "1234" },
      { name: "teamId", type: "string", isRequired: true, des: "团队Id", defaultValue: "", example: "teamId" },
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
    title: "根据userId获取团队列表",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "根据userId获取团队列表，一个userId有可能在多个团队中",
    url: "/wfManage/findTeamListByLeaderId",
    method: "POST",
    headers: [
      { name: "access-token", type: "string", isRequired: true, des: "登录后的token", defaultValue: "", example: "xxxx123xxx" }
    ],
    params: [
      { name: "userId", type: "string", isRequired: true, des: "用户Id", defaultValue: "", example: "1234" },
      { name: "teamId", type: "string", isRequired: true, des: "团队Id", defaultValue: "", example: "teamId" },
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
    title: "根据teamId获取团队详情",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "根据teamId获取团队详情",
    url: "/wfManage/getTeamDetail",
    method: "POST",
    headers: [
      { name: "access-token", type: "string", isRequired: true, des: "登录后的token", defaultValue: "", example: "xxxx123xxx" }
    ],
    params: [
      { name: "chooseTeamId", type: "string", isRequired: true, des: "团队Id", defaultValue: "", example: "teamId" },
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
    title: "更新团队项目",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "更新团队的项目列表",
    url: "/wfManage/updateTeam",
    method: "POST",
    headers: [
      { name: "access-token", type: "string", isRequired: true, des: "登录后的token", defaultValue: "", example: "xxxx123xxx" }
    ],
    params: [
      { name: "id", type: "string", isRequired: true, des: "团队Id", defaultValue: "", example: "teamId" },
      { name: "webMonitorIds", type: "string", isRequired: true, des: "项目标识列表", defaultValue: "", example: "teamId" },
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
    title: "添加观察者",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "给团队添加观察者，观察者可以查看这个项目的数据",
    url: "/wfManage/addViewers",
    method: "POST",
    headers: [
      { name: "access-token", type: "string", isRequired: true, des: "登录后的token", defaultValue: "", example: "xxxx123xxx" }
    ],
    params: [
      { name: "viewerList", type: "string", isRequired: true, des: "观察者列表", defaultValue: "", example: "id1,id2,id3" },
      { name: "webMonitorId", type: "string", isRequired: true, des: "项目标识", defaultValue: "", example: "webMonitorId" },
      { name: "sysType", type: "string", isRequired: true, des: "系统类型", defaultValue: "", example: "monitor/event" },
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
    title: "禁用项目权限验证",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "判断是否有权限可以禁用某个项目",
    url: "/wfManage/forbiddenRightCheck",
    method: "POST",
    headers: [
      { name: "access-token", type: "string", isRequired: true, des: "登录后的token", defaultValue: "", example: "xxxx123xxx" }
    ],
    params: [
      { name: "webMonitorId", type: "string", isRequired: true, des: "项目标识", defaultValue: "", example: "webMonitorId" },
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
    title: "禁用项目",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "在删除项目前，需要先禁用",
    url: "/wfManage/forbiddenProject",
    method: "POST",
    headers: [
      { name: "access-token", type: "string", isRequired: true, des: "登录后的token", defaultValue: "", example: "xxxx123xxx" }
    ],
    params: [
      { name: "id", type: "string", isRequired: true, des: "项目id", defaultValue: "", example: "id" },
      { name: "webMonitorId", type: "string", isRequired: true, des: "项目标识", defaultValue: "", example: "webMonitorId" },
      { name: "sysType", type: "string", isRequired: true, des: "项目类型", defaultValue: "", example: "monitor/event" },
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
    title: "删除项目权限验证",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "判断是否有权限可以删除某个项目",
    url: "/wfManage/deleteProjectRightCheck",
    method: "POST",
    headers: [
      { name: "access-token", type: "string", isRequired: true, des: "登录后的token", defaultValue: "", example: "xxxx123xxx" }
    ],
    params: [
      { name: "webMonitorId", type: "string", isRequired: true, des: "项目标识", defaultValue: "", example: "webMonitorId" },
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
    title: "删除项目",
    author: "webfunny",
    creatTime: new Date().Format("yyyy-MM-dd"),
    des: "删除项目",
    url: "/wfManage/deleteProject",
    method: "POST",
    headers: [
      { name: "access-token", type: "string", isRequired: true, des: "登录后的token", defaultValue: "", example: "xxxx123xxx" }
    ],
    params: [
      { name: "id", type: "string", isRequired: true, des: "项目id", defaultValue: "", example: "id" },
      { name: "webMonitorId", type: "string", isRequired: true, des: "项目标识", defaultValue: "", example: "webMonitorId" },
      { name: "sysType", type: "string", isRequired: true, des: "项目类型", defaultValue: "", example: "monitor/event" },
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