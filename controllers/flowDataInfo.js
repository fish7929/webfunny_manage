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
    const data = JSON.parse(param.data)

    let ret = await FlowDataInfoModel.createFlowDataInfo(data);
    ctx.response.status = 200;
    ctx.body = statusCode.SUCCESS_200('创建信息成功', ret)
  }
  
}
//exports//
module.exports = FlowDataInfoController
//exports//