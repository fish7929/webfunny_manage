//delete//
const Utils = require('../util/utils')
const CommonSql = require('../util/commonSql')
const db = require('../config/db')
const { FLOW_TYPE } = require('../config/consts')
const Sequelize = db.sequelize;
//delete//
class FlowDataInfoByHourModel {
  /**
   * 创建FlowDataInfoByHour信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createFlowDataInfoByHour(data) {

    let keys = ""
    let values = ""
    const keyArray = [`id`, `createdAt`, `updatedAt`, `companyId`, `projectId`, `flowOrigin`, `flowType`, "hourName", "flowCount"]
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
    const table = "FlowDataInfoByHour" + dateEnd
    let sql = "INSERT INTO " + table + " (" + keys + ") VALUES (" + values + ")"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.INSERT })
  }

  static async createFlowDataInfosByHour(insertSql) {
    return await Sequelize.query(insertSql, { type: Sequelize.QueryTypes.INSERT })
  }
  /**
   * 计算当天各种流量数据
   */
  static async calculateFlowCountByDay(dayIndex) {
    const tableName = CommonSql.setTableName("FlowDataInfoByHour", dayIndex, "")
    let sql = ` select companyId, projectId, projectName, flowType, productType, sum(flowCount) as flowCount from ${tableName} group by companyId, projectId, projectName, flowType, productType `
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT })
  }
  /**
   * 计算当天各公司的总流量数据
   */
  static async calculateTotalFlowCountByDay(dayIndex) {
    const tableName = CommonSql.setTableName("FlowDataInfoByHour", dayIndex, "")
    let sql = ` select companyId, sum(flowCount) as flowCount from ${tableName} where flowType='${FLOW_TYPE.TOTAL_FLOW_COUNT}' group by companyId`
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT })
  }
  static async getHourFlowTrendDataForCompanyId(companyId, productType, projectIds) {
    const nowDay = new Date().Format("yyyyMMdd")
    const tableName = "FlowDataInfoByHour" + nowDay
    //把参数ids处理下添加'' 
    const ids = projectIds.split(',').map(item => `'${item}'`).join(',')
    let sql = `SELECT projectId, productType, sum(flowCount) as count, hourName FROM ${tableName} where companyId = '${companyId}' and flowType='total_flow_count' and productType='${productType}' and projectId in (${ids}) group by hourName, projectId order by field(projectId, ${ids})`
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT })
  }
}
//exports//
module.exports = FlowDataInfoByHourModel
//exports//