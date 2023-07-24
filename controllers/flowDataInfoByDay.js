//delete//
const FlowDataInfoByDayModel = require('../modules/flowDataInfoByDay')
const statusCode = require('../util/status-code')
//delete//
class FlowDataInfoByDayController {
  /**
   * 创建信息
   * @param ctx
   * @returns {Promise.<void>}
   */
  static async createFlowDataInfoByDay(ctx) {
    const param = ctx.request.body
    const { flowArray, dayName = "" } = param
    let valueSql = ""
    for (let i = 0; i < flowArray.length; i ++) {
      const { flowCount } = flowArray[i]
      if (flowCount === 0) continue
      valueSql += FlowDataInfoByDayController.handleFlowArray(flowArray[i])
    }
    valueSql = valueSql.substring(0, valueSql.length - 1)

    const dateEnd = dayName.substring(0, 4)
    const table = "FlowDataInfoByDay" + dateEnd
    let sql = ""
    if (valueSql) {
      sql = `INSERT INTO ${table} (companyId, projectId, flowType, monthName, dayName, flowCount, createdAt, updatedAt) 
      VALUES
      ${valueSql}
      `
    }
    if (sql) {
      FlowDataInfoByDayModel.createFlowDataInfosByHour(sql)
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('创建信息成功', 0)
  }

  static async getTotalFlowData(ctx) {
    const { companyId } = ctx.wfParam
    // 获取当月流量数据
    const monthFlowRes = await FlowDataInfoByDayModel.getMonthFlowDataForCompanyId(companyId)
    let monthFlowCount = monthFlowRes && monthFlowRes.length ? monthFlowRes[0].count : 0
    // 获取当月剩余数据
    

    // 获取总消耗流量
    const totalFlowRes = await FlowDataInfoByDayModel.getTotalFlowDataForCompanyId(companyId)
    let totalFlowCount = 0
    totalFlowRes.forEach((item) => {
      totalFlowCount += item.count
    })
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', { monthFlowCount, monthLeftFlowCount: 0, totalFlowCount })
  }
  static async getFlowTrendData(ctx) {
    const { companyId } = ctx.wfParam
    // 获取当月流量数据
    const monthFlowRes = await FlowDataInfoByDayModel.getMonthFlowDataForCompanyId(companyId)
    let monthFlowCount = monthFlowRes && monthFlowRes.length ? monthFlowRes[0].count : 0

    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', { monthFlowCount, monthLeftFlowCount: 0, totalFlowCount })
  }
}
//exports//
module.exports = FlowDataInfoByDayController
//exports//