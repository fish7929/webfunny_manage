//delete//
const db = require('../config/db')
const Sequelize = db.sequelize;
//delete//
//Sequelize//
const ApplicationConfig = Sequelize.import('../schema/applicationConfig');
ApplicationConfig.sync({force: false});
//Sequelize//
class ApplicationConfigModel {
  /**
   * 创建Config信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createApplicationConfig(data) {
    return await ApplicationConfig.create({
      ...data
    })
  }
     /**
   * 获取Config详情数据
   * @param id  Config的ID
   * @returns {Promise<Model>}
   */
  static async getApplicationConfigDetail(id) {
    return await ApplicationConfig.findOne({
      where: {
        id,
      },
    })
  }

  static async updateApplicationConfig(systemName, data) {
    await ApplicationConfig.update({
      ...data
    }, {
      where: {
        systemName
      },
      fields: Object.keys(data)
    })
    return true
  }

  static async getApplicationConfigByConfigName(systemName) {
    let sql = "select * from ApplicationConfig where systemName='" + systemName + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  static async getAllApplicationConfig() {
    let sql = "select systemName, configValue from ApplicationConfig"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
}
//exports//
module.exports = ApplicationConfigModel
//exports//