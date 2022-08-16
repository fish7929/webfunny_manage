//delete//
const db = require('../config/db')
const Sequelize = db.sequelize;
const CommonSql = require("../util/commonSql")
//delete//
//Sequelize//
const Message = Sequelize.import('../schema/message');
Message.sync({force: false});
//Sequelize//
class MessageModel {
  /**
   * 创建Message信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createMessage(data) {
    return await Message.create({
      ...data
    })
  }

  static async deleteMessage(id) {
    await Message.destroy({
      where: {
        id,
      }
    })
    return true
  }

  static async getAllMessage() {
    let sql = "select * from Message"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  static async getMessageByType(param) {
    const { messageType, page, pageSize, userId } = param
    const start = page * pageSize
    const userIdSql = userId ? ` and userId='${userId}' ` : ''
    let sql = `select * from Message where type='${messageType}' ${userIdSql} order by createdAt desc limit ${start},${pageSize}`
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  static async getUnReadMessageCountByType(param) {
    const { userId, messageType } = param
    // let sql = `select count(*) as unReadCount from Message where type='${messageType}' and userId='${userId}' and isRead=0`
    let sql = `select isRead, count(isRead) as count from Message where  type='${messageType}' and userId='${userId}' GROUP BY isRead`
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  static async readAll(userId, messageType) {
    // let sql = `UPDATE Message SET isRead = 1 WHERE type='${messageType}' and userId = '${userId}'`
    // await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
    const data = {isRead: 1}
    await Message.update({
      ...data
    }, {
      where: {
        userId,
        type: messageType,
      },
      fields: Object.keys(data)
    })
    return true
  }
  /**
   * 获取Message详情数据
   * @param id  Message的ID
   * @returns {Promise<Model>}
   */
  static async getMessageDetail(id) {
    return await Message.findOne({
      where: {
        id,
      },
    })
  }

  static async updateMessage(id, data) {
    await Message.update({
      ...data
    }, {
      where: {
        id
      },
      fields: Object.keys(data)
    })
    return true
  }
}
//exports//
module.exports = MessageModel
//exports//