//delete//
const db = require('../config/db')
const Sequelize = db.sequelize;
const { START_YEAR } = require("../config/consts")
//delete//
class FlowDataInfoByDayModel {
  /**
   * 创建FlowDataInfoByDay信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createFlowDataInfoByDay(data) {

    let keys = ""
    let values = ""
    const keyArray = [`id`, `createdAt`, `updatedAt`, `companyId`, `projectId`, `flowOrigin`, `flowType`, `monthName`, "dayName", "flowCount"]
    keyArray.forEach((key, index) => {
      if (index == keyArray.length - 1) {
        keys += "`" + key + "`"
        let val = data[key]
        if (val != undefined) {
          values += "'" + val + "'"
        } else {
          values += "DEFAULT"
        }
      } else {
        keys += "`" + key + "`, "
        let val = data[key]
        // createdAt， updatedAt 不能位于 keyArray的最后一个
        switch (key) {
          case "id":
            val = new Date().getTime() + Utils.getUuid()
            break
          case "createdAt":
          case "updatedAt":
            // 填写创建时间
            val = new Date().Format("yyyy-MM-dd hh:mm:ss")
            break
          default:
            break
        }

        if (val != undefined) {
          values += "'" + val + "', "

        } else {
          values += "DEFAULT, "
        }
      }
    })
    const dateEnd = new Date().Format("yyyyMMdd")
    const table = "FlowDataInfoByDay" + dateEnd
    let sql = "INSERT INTO " + table + " (" + keys + ") VALUES (" + values + ")"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.INSERT })
  }

  static async createFlowDataInfosByDay(flowArray, dayName, monthName) {
    let valueSql = ""
    for (let i = 0; i < flowArray.length; i++) {
      const { flowCount } = flowArray[i]
      if (flowCount === 0) continue
      valueSql += FlowDataInfoByDayModel.handleFlowArray(flowArray[i], dayName, monthName)
    }
    valueSql = valueSql.substring(0, valueSql.length - 1)
    const dateEnd = dayName.substring(0, 4)
    const table = "FlowDataInfoByDay" + dateEnd
    let sql = ""
    if (valueSql) {
      sql = `INSERT INTO ${table} (companyId, projectId, flowOrigin, flowType, monthName, dayName, flowCount, createdAt, updatedAt) 
      VALUES
      ${valueSql}
      `
    }
    if (sql) {
      return await Sequelize.query(sql, { type: Sequelize.QueryTypes.INSERT })
    }
    return await Promise.resolve("无数据")
  }

  static handleFlowArray(flowData, dayName, monthName) {
    const createdAt = new Date().Format("yyyy-MM-dd hh:mm:ss")
    const updatedAt = createdAt
    const { companyId, projectId, flowType, flowCount } = flowData
    const flowOrigin = "subscribe"
    let sqlStr = `('${companyId}', '${projectId}', '${flowOrigin}', '${flowType}', '${monthName}', '${dayName}', ${flowCount}, '${createdAt}', '${updatedAt}'),`
    return sqlStr
  }
  static async getMonthFlowDataForCompanyId(companyId) {
    const nowMonth = new Date().Format("yyyy-MM")
    const nowYear = new Date().getFullYear()
    const tableName = "FlowDataInfoByDay" + nowYear
    let sql = `SELECT flowOrigin, sum(flowCount) as count, monthName FROM ${tableName} where companyId = '${companyId}' and flowType = 'total_flow_count' and monthName='${nowMonth}' group by flowOrigin`
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT })
  }
  static async getTotalFlowDataForCompanyId(companyId) {
    const nowYear = new Date().getFullYear()
    let sql = ""
    for (let i = START_YEAR; i <= nowYear; i++) {
      const tableName = "FlowDataInfoByDay" + i
      sql += `SELECT sum(flowCount) as count, min(dayName) as minDay  FROM ${tableName} where companyId = '${companyId}' and flowType = 'total_flow_count'`
      if (i < nowYear) {
        sql += `
          UNION
        `
      }
    }
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT })
  }
  /**
  * 事件趋势
  * @param {String} companyId 公司ID
  * @param {String} startDate 起始时间  '2022-07-28'
  * @param {String} endDate 截止时间 '2023-07-28'
  * @returns 
  */
  static async getFlowTrendDataForCompanyIdByDate(companyId, startDate = '', endDate = '') {
    const nowYear = new Date().getFullYear()
    const startYear = startDate ? parseInt(startDate.substring(0, 4)) : nowYear
    const endYear = endDate ? parseInt(endDate.substring(0, 4)) : nowYear
    let sql = ""
    for (let i = startYear; i <= endYear; i++) {
      const tableName = "FlowDataInfoByDay" + i
      if (startDate && endDate) {
        sql += `SELECT dayName, sum(flowCount) as count FROM ${tableName} where companyId = '${companyId}' and flowType='total_flow_count' and dayName between '${startDate}' and '${endDate}' group by dayName`
      } else {
        sql += `SELECT dayName, sum(flowCount) as count FROM ${tableName} where companyId = '${companyId}' and flowType='total_flow_count' group by dayName`
      }
      if (i < nowYear) {
        sql += `
          UNION
        `
      }
    }
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT })
  }
  /**
   * 事件分布
   * @param {String} companyId 公司ID
   * @param {String} startDate 起始时间
   * @param {String} endDate 截止时间
   * @returns 
   */
  static async getFlowDistributeDataForCompanyIdByDate(companyId, startDate = '', endDate = '') {
    const nowYear = new Date().getFullYear()
    const startYear = startDate ? parseInt(startDate.substring(0, 4)) : nowYear
    const endYear = endDate ? parseInt(endDate.substring(0, 4)) : nowYear
    let sql = ""
    for (let i = startYear; i <= endYear; i++) {
      const tableName = "FlowDataInfoByDay" + i
      if (startDate && endDate) {
        sql += `SELECT productType, sum(flowCount) as count FROM ${tableName} where companyId = '${companyId}' and flowType='total_flow_count' and dayName between '${startDate}' and '${endDate}' group by productType`
      } else {
        sql += `SELECT productType, sum(flowCount) as count FROM ${tableName} where companyId = '${companyId}' and flowType='total_flow_count' group by productType`
      }
      if (i < nowYear) {
        sql += `
          UNION
        `
      }
    }
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT })
  }

  /**
  * 事件分布
  * @param {String} companyId 公司ID
  * @param {String} productType 产品类型 监控 埋点
  * @param {Number} page 页码 起始位为1
  * @param {Number} pageSize 每页查询条数
  * @param {String} projectName 项目名称
  * @returns 
  */
  static async getFlowTableListDataForCompanyId({ companyId, productType, page, pageSize, projectName }) {
    // TOTAL_FLOW_COUNT: "total_flow_count", // 总流量
    // PV_FLOW_COUNT: "pv_flow_count", // PV流量
    // BEHAVIOR_FLOW_COUNT: "behavior_flow_count", // 行为流量
    // HTTP_FLOW_COUNT: "http_flow_count", // 接口流量(请求，返回，错误)
    // ERROR_FLOW_COUNT: "error_flow_count", // 错误流量(代码错误，静态资源错误)
    // PERF_FLOW_COUNT: "perf_flow_count", // 性能流量(页面加载)
    // OTHER_FLOW_COUNT: "other_flow_count", // 其他流量(自定义日志)
    // FLOW_PACKAGE_COUNT: "flow_package_count", // 流量包

    const _offset = (page - 1) * pageSize
    const nowYear = new Date().getFullYear()
    let sql = ""
    let nameCondition = projectName ? `and projectName like '%${projectName}%'` : ''
    for (let i = START_YEAR; i <= nowYear; i++) {
      const tableName = "FlowDataInfoByDay" + i
      sql += `SELECT sum(if(flowType='total_flow_count', flowCount, 0)) as totalCount, 
              sum(if(flowType='pv_flow_count', flowCount, 0)) as pvCount,  
              sum(if(flowType='http_flow_count', flowCount, 0)) as httpCount, 
              sum(if(flowType='behavior_flow_count', flowCount, 0)) as behaviorCount,  
              sum(if(flowType='error_flow_count', flowCount, 0)) as errorCount, 
              sum(if(flowType='perf_flow_count', flowCount, 0)) as perfCount, 
              sum(if(flowType='other_flow_count', flowCount, 0)) as otherCount, 
              sum(if(flowType='flow_package_count', flowCount, 0)) as flowCount, 
              projectId, companyId, productType, projectName
              FROM ${tableName} where companyId = '${companyId}' and productType = '${productType}' ${nameCondition} group by projectId, projectName LIMIT ${Number(_offset)},${Number(pageSize)} `

      if (i < nowYear) {
        sql += `
          UNION
        `
      }
    }
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT })
  }

  /**
  * 获取流量流量列表总条数
  * @param {String} companyId 公司ID
  * @param {String} productType 产品类型 监控 埋点
  * @param {String} projectName 项目名称
  * @returns 
  */
  static async getFlowTotalCountForCompanyId(companyId, productType = 'monitor', projectName = '') {
    const nowYear = new Date().getFullYear()
    let sql = ""
    let nameCondition = projectName ? `and projectName like '%${projectName}%'` : ''
    for (let i = START_YEAR; i <= nowYear; i++) {
      const tableName = "FlowDataInfoByDay" + i
      sql += `SELECT COUNT(DISTINCT projectId) as count FROM ${tableName} where companyId = '${companyId}' and productType = '${productType}' ${nameCondition} group by projectId`
      if (i < nowYear) {
        sql += `
          UNION
        `
      }
    }
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT })
  }
}
//exports//
module.exports = FlowDataInfoByDayModel
//exports//