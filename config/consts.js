// 流量数据类型
const FLOW_TYPE = {
    TOTAL_FLOW_COUNT: "total_flow_count", // 总流量
    PV_FLOW_COUNT: "pv_flow_count", // PV流量
    BEHAVIOR_FLOW_COUNT: "behavior_flow_count", // 行为流量
    HTTP_FLOW_COUNT: "http_flow_count", // 接口流量(请求，返回，错误)
    ERROR_FLOW_COUNT: "error_flow_count", // 错误流量(代码错误，静态资源错误)
    PERF_FLOW_COUNT: "perf_flow_count", // 性能流量(页面加载)
    OTHER_FLOW_COUNT: "other_flow_count", // 其他流量(自定义日志)
    FLOW_PACKAGE_COUNT: "flow_package_count", // 流量包
}

const USER_INFO = {
    USER_TYPE_ADMIN: "admin", // 管理员类型
}

const PROJECT_INFO = {
    PROJECT_VERSION: "1.0.3",
    MONITOR_VERSION: "1.0.0"
}

const PROJECT_API = {
    MONITOR_PROJECT_SIMPLE_LIST_BY_WEBMONITOR_IDS: "/server/projectSimpleListByWebmonitorIds",
    MONITOR_ADD_VIEWERS: "/server/addViewers",
    MONITOR_BASE_INFO: "/server/monitorBaseInfo",
    FORBIDDEN_PROJECT: "/server/forbiddenProject",
    DELETE_PROJECT: "/server/deleteProject",

    EVENT_PROJECT_SIMPLE_LIST_BY_WEBMONITOR_IDS: "/tracker/buryPointProject/projectSimpleListByWebmonitorIds",
    EVENT_ADD_VIEWERS: "/tracker/buryPointProject/addViewers",
    EVENT_BASE_INFO: "/tracker/eventBaseInfo",
}

const START_YEAR = 2023

module.exports = {
    FLOW_TYPE,
    USER_INFO,
    PROJECT_INFO,
    PROJECT_API,
    START_YEAR
}