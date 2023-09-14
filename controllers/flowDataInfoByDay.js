//delete//
const FlowDataInfoByDayModel = require('../modules/flowDataInfoByDay')
const ProductModel = require('../modules/product')
const statusCode = require('../util/status-code')
const ProductTypeMap = {
  monitor: '监控',
  event: '埋点'
}
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
    for (let i = 0; i < flowArray.length; i++) {
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
  /**
   * 获取事件/流量橄榄数据
   * @param {Object} ctx 请求参数
   * @returns {Promise.<void>}
   */
  static async getTotalFlowData(ctx) {
    const { companyId } = ctx.wfParam
    const date = new Date()
    const nowYear = date.getFullYear()
    let nowMonth = date.getMonth() + 1
    nowMonth = nowMonth < 10 ? '0' + nowMonth : nowMonth //月份补 0
    let curDay = date.getDate()       //获取当前的天
    curDay = curDay < 10 ? '0' + curDay : curDay //天补 0
    const dateInterval = `${nowYear}/${nowMonth}/1~${nowYear}/${nowMonth}/${curDay}`
    // 获取当月流量数据
    // const monthFlowRes = await FlowDataInfoByDayModel.getMonthFlowDataForCompanyId(companyId)
    // console.log('getTotalFlowData ---monthFlowRes', monthFlowRes)
    // const packageRes = monthFlowRes && monthFlowRes.length ? monthFlowRes.find(item => item.flowOrigin === 'package') : null
    // const subscribeRes = monthFlowRes && monthFlowRes.length ? monthFlowRes.find(item => item.flowOrigin === 'subscribe') : null

    // // 已消耗流量 usedFlowCount  // 流量上限 maxFlowCount
    const _month = date.Format("yyyy-MM")
    //套餐数据
    const subscribeProductRes = await ProductModel.getProjectByCompanyIdForMonth(companyId, _month)
    // console.log('subscribeProductRes-->', subscribeProductRes)
    //流量包数据
    const packageProductRes = await ProductModel.getProjectPackageByCompanyId(companyId)
    // console.log('packageProductRes-->', packageProductRes)
    //套餐-subscribe，流量包-package
    const monthFlow = {
      packageCount: packageProductRes && packageProductRes.length ? parseInt(packageProductRes[0].usedFlowCount) : 0,
      subscribeCount: subscribeProductRes && subscribeProductRes.length ? parseInt(subscribeProductRes[0].usedFlowCount) : 0,
      dateInterval
    }
    // 获取当月剩余数据
    const monthLeftFlow = {
      packageCount: packageProductRes && packageProductRes.length ? packageProductRes[0].maxFlowCount - packageProductRes[0].usedFlowCount : 0,
      subscribeCount: subscribeProductRes && subscribeProductRes.length ? subscribeProductRes[0].maxFlowCount - subscribeProductRes[0].usedFlowCount : 0,
      dateInterval
    }

    // 获取总消耗流量
    const totalFlowRes = await FlowDataInfoByDayModel.getTotalFlowDataForCompanyId(companyId)
    // console.log('totalFlowRes-->', totalFlowRes)
    let totalFlowCount = 0
    let minDayArr = []
    if (totalFlowRes && totalFlowRes.length && totalFlowRes[0].minDay) {
      totalFlowRes.forEach((item) => {
        totalFlowCount += item.count
        minDayArr.push(item.minDay)
      })
    }
    //获取最小的日期
    const minDay = minDayArr.length ? (minDayArr.sort()[0]).replace(/-/g, '/') : '/'
    const totalFlow = {
      totalFlowCount,
      dateInterval: `${minDay}~${nowYear}/${nowMonth}/${curDay}`
    }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', { monthFlow, monthLeftFlow, totalFlow })
  }

  /**
   * 获取流量分布和趋信息
   * @param {Object} ctx 请求参数
   * @returns {Promise.<void>}
   */
  static async getFlowTrendData(ctx) {
    const { companyId, startDate = '', endDate = '' } = ctx.wfParam
    // 获取事件趋势信息
    const flowTrend = await FlowDataInfoByDayModel.getFlowTrendDataForCompanyIdByDate(companyId, startDate, endDate)
    // console.log('flowTrendRes--->', flowTrend)

    // 获取事件分布信息
    const flowDistributeRes = await FlowDataInfoByDayModel.getFlowDistributeDataForCompanyIdByDate(companyId, startDate, endDate)
    const flowDistribute = []
    // console.log('flowTrendRes--->', flowDistributeRes)
    if (flowDistributeRes && flowDistributeRes.length) {
      flowDistributeRes.forEach((item) => {
        const { productType, count } = item
        // 产品类型, 监控-monitor，埋点-event
        //只是填入埋点和监控数据
        if (ProductTypeMap[productType]) {
          flowDistribute.push({ productType, value: count, name: ProductTypeMap[productType] })
        }
      })
    }

    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', { flowTrend, flowDistribute })
  }
  /**
   * 获取流量列表信息
   * @param {Object} ctx 请求参数
   * @returns {Promise.<void>}
   */
  static async getFlowTableListData(ctx) {
    const { companyId, productType = 'monitor', projectName = '', page = 1, pageSize = 10 } = ctx.wfParam
    //获取事件总数
    let total = 0;
    const flowTotalCountRes = await FlowDataInfoByDayModel.getFlowTotalCountForCompanyId(companyId, productType, projectName)
    if (flowTotalCountRes && flowTotalCountRes.length) {
      flowTotalCountRes.forEach((item) => {
        total += Number(item.count)
      })
    }
    // 获取事件趋势信息
    const flowTableRes = await FlowDataInfoByDayModel.getFlowTableListDataForCompanyId({ companyId, productType, projectName, page, pageSize })
    // console.log('flowTableRes--->', flowTableRes)
    let list = flowTableRes && flowTableRes.length ? flowTableRes : []
    // if (flowTableRes && flowTableRes.length) {
    // list = flowTableRes.map((item, index) => {
    //   //todo 需要查询接口获取状态
    //   return { ...item, status: index % 2 === 0 ? 0 : 1 }
    // })
    // }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', { list, total })
  }
  /**
  * 获取流量列表信息
  * @param {Object} ctx 请求参数
  * @returns {Promise.<void>}
  */
  static async getFlowListByCompanyIdAndProjectIds(ctx) {
    const { companyId, projectIds = '' } = ctx.wfParam
    // 获取事件趋势信息
    const flowList = await FlowDataInfoByDayModel.getFlowListByCompanyIdAndProjectIds(companyId, projectIds)
    // console.log('getFlowListByCompanyIdAndProjectIds--->', flowList)
    const ids = projectIds.split(',')
    const data = flowList && flowList.length ? flowList : []
    // if (flowList && flowList.length) {
    //   ids.forEach(id => {
    //     obj[id] = flowList.find(item => item.projectId == id)
    //   });
    // }
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('查询信息列表成功！', data)
  }
}
//exports//
module.exports = FlowDataInfoByDayController
//exports//