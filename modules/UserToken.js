//delete//
const db = require('../config/db')
const Sequelize = db.sequelize;
//delete//
//Sequelize//
const UserToken = Sequelize.import('../schema/userToken');
UserToken.sync({force: false});
//Sequelize//
class UserTokenModel {
  /**
   * 创建UserToken信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createUserToken(data) {
    return await UserToken.create({
      ...data
    })
  }
     /**
   * 获取UserToken详情数据
   * @param userId  UserToken的userId
   * @returns {Promise<Model>}
   */
  static async getUserTokenDetail(userId) {
    return await UserToken.findOne({
      where: {
        userId,
      },
    })
  }

  /**
   * 获取UserToken详情数据
   * @param accessToken
   * @returns {Promise<Model>}
   */
  static async getUserTokenDetailByToken(accessToken) {
    return await UserToken.findOne({
      where: {
        accessToken,
      },
    })
  }

  static async updateUserToken(userId, data) {
    await UserToken.update({
      ...data
    }, {
      where: {
        userId
      },
      fields: Object.keys(data)
    })
    return true
  }

  static async deleteUserToken(userId) {
    await UserToken.destroy({
      where: {
        userId,
      }
    })
    return true
  }

  static async getAllTokens() {
    let sql = "select userId, accessToken from UserToken"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 检查token是否存在
   * @param userId  UserToken的userId
   * @returns {Promise<Model>}
   */
  static async checkTokenExist(userId, accessToken) {
    return await UserToken.findOne({
      where: {
        userId,
        accessToken,
      },
    })
  }
}
//exports//
module.exports = UserTokenModel
//exports//