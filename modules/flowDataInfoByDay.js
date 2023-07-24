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
    const keyArray = [`id`,`createdAt`,`updatedAt`,`companyId`,`projectId`, `flowOrigin`, `flowType`, `monthName`, "dayName","flowCount"]
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
        switch(key) {
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
    for (let i = 0; i < flowArray.length; i ++) {
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
      return await Sequelize.query(sql, { type: Sequelize.QueryTypes.INSERT})
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
    let sql = `SELECT sum(flowCount) as count FROM ${tableName} where companyId = '${companyId}' and monthName='${nowMonth}'`
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  static async getTotalFlowDataForCompanyId(companyId) {
    const nowYear = new Date().getFullYear()
    let sql = ""
    for (let i = START_YEAR; i <= nowYear; i ++) {
      const tableName = "FlowDataInfoByDay" + i
      sql += `SELECT sum(flowCount) as count FROM ${tableName} where companyId = '${companyId}'`
      if (i < nowYear) {
        sql += `
          UNION
        `
      }
    }
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
}
//exports//
module.exports = FlowDataInfoByDayModel
//exports//