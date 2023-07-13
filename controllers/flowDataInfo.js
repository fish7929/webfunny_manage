//delete//
const FlowDataInfoModel = require('../modules/flowDataInfo')
const statusCode = require('../util/status-code')
//delete//
class FlowDataInfoController {
  /**
   * 创建信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async createFlowDataInfo(ctx) {
    const param = ctx.request.body
    const { flowArray, dayName = "" } = param
    let valueSql = ""
    const createdAt = new Date().Format("yyyy-MM-dd hh:mm:ss")
    const updatedAt = createdAt
    for (let i = 0; i < flowArray.length; i ++) {
      const { companyId, projectId, flowType, dayName, hourName, flowCount } = flowArray[i]
      if (flowCount === 0) continue
      valueSql +=`('${companyId}', '${projectId}', '${flowType}', '${dayName}', '${hourName}', ${flowCount}, '${createdAt}', '${updatedAt}'),`
    }
    valueSql = valueSql.substring(0, valueSql.length - 1)

    const dateEnd = dayName.replace(/-/g, "")
    const table = "FlowDataInfo" + dateEnd
    let sql = ""
    if (valueSql) {
      sql = `INSERT INTO ${table} (companyId, projectId, flowType, dayName, hourName, flowCount, createdAt, updatedAt) 
      VALUES
      ${valueSql}
      `
    }
    if (sql) {
      FlowDataInfoModel.createFlowDataInfos(sql)
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('创建信息成功', 0)
  }
  
}
//exports//
module.exports = FlowDataInfoController
//exports//