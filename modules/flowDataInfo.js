//delete//
const db = require('../config/db')
const Sequelize = db.sequelize;
//delete//
//Sequelize//
const FlowDataInfo = Sequelize.import('../schema/flowDataInfo');
FlowDataInfo.sync({force: false});
//Sequelize//
class FlowDataInfoModel {
  /**
   * 创建FlowDataInfo信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createFlowDataInfo(data) {
    return await FlowDataInfo.create({
      ...data
    })
  }

}
//exports//
module.exports = FlowDataInfoModel
//exports//