//delete//
const db = require('../config/db')
const Sequelize = db.sequelize;
//delete//
//Sequelize//
const Company = Sequelize.import('../schema/company');
Company.sync({force: false});
//Sequelize//
class CompanyModel {
  /**
   * 创建Company信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createCompany(data) {
    return await Company.create({
      ...data
    })
  }
     /**
   * 获取Company详情数据
   * @param userId  Company的userId
   * @returns {Promise<Model>}
   */
  static async getCompanyDetailByOwnerId(userId) {
    return await Company.findOne({
      where: {
        ownerId: userId,
      },
    })
  }

  static async updateCompany(companyId, data) {
    await Company.update({
      ...data
    }, {
      where: {
        companyId
      },
      fields: Object.keys(data)
    })
    return true
  }

}
//exports//
module.exports = CompanyModel
//exports//