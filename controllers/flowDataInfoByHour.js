//delete//
const FlowDataInfoByHourModel = require('../modules/flowDataInfoByHour')
const statusCode = require('../util/status-code')
//delete//
class FlowDataInfoByHourController {
  /**
   * 创建信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async createFlowDataInfoByHour(ctx) {
    const param = ctx.request.body
    const { flowArray, dayName = "" } = param
    let valueSql = ""
    for (let i = 0; i < flowArray.length; i ++) {
      const { flowCount } = flowArray[i]
      if (flowCount === 0) continue
      valueSql += FlowDataInfoByHourController.handleFlowArray(flowArray[i])
    }
    valueSql = valueSql.substring(0, valueSql.length - 1)

    const dateEnd = dayName.replace(/-/g, "")
    const table = "FlowDataInfoByHour" + dateEnd
    let sql = ""
    if (valueSql) {
      sql = `INSERT INTO ${table} (companyId, projectId, projectName, flowOrigin, productType, flowType, hourName, flowCount, createdAt, updatedAt)
      VALUES
      ${valueSql}
      `
    }
    if (sql) {
      FlowDataInfoByHourModel.createFlowDataInfosByHour(sql)
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('创建信息成功', 0)
  }
  static handleFlowArray(flowData) {
    const createdAt = new Date().Format("yyyy-MM-dd hh:mm:ss")
    const updatedAt = createdAt
    const { companyId, projectId, projectName, productType, flowType, hourName, flowCount } = flowData
    // 如果流量套餐到期，则使用流量包
    const flowOrigin = "subscribe"
    let sqlStr = `('${companyId}', '${projectId}', '${projectName}', '${flowOrigin}', '${productType}', '${flowType}', '${hourName}', ${flowCount}, '${createdAt}', '${updatedAt}'),`
    return sqlStr
  }
}
//exports//
module.exports = FlowDataInfoByHourController
//exports//