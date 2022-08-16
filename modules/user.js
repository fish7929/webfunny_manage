//delete//
const db = require('../config/db')
const Sequelize = db.sequelize;
//delete//
//Sequelize//
const User = Sequelize.import('../schema/user');
User.sync({force: false});
//Sequelize//
class UserModel {
  /**
   * 创建User信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createUser(data) {
    return await User.create({
      ...data
    })
  }

  /**
   * 更新User数据
   * @param id  用户ID
   * @param status  事项的状态
   * @returns {Promise.<boolean>}
   */
  static async updateUser(id, data) {
    await User.update({
      ...data
    }, {
      where: {
        id
      },
      fields: Object.keys(data)
    })
    return true
  }

  /**
   * 重置密码
   * @returns {Promise.<boolean>}
   */
  static async resetPwd(emailName, data) {
    await User.update({
      ...data
    }, {
      where: {
        emailName
      },
      fields: Object.keys(data)
    })
    return true
  }
  /**
   * 获取User列表
   * @returns {Promise<*>}
   */
  static async getUserList() {
    let sql = "select id, userId, nickname from User where registerStatus='1'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 获取管理员账号
   * @returns {Promise<*>}
   */
  static async getUserForAdmin() {
    let sql = "select * from User where userType='admin' or userType='superAdmin'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

   /**
   * 获取User列表
   * @returns {Promise<*>}
   */
  static async getUserListByAdmin(registerStatus) {
    let registerStatusSql = ""
    switch(registerStatus) {
      case 0:
      case 1:
          registerStatusSql = ` where registerStatus=${registerStatus} `
        break
      default:
        break
    }

    let sql = "select id, userId, userType, nickname, emailName, avatar, registerStatus, groupId, createdAt, updatedAt from User " + registerStatusSql
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  static async getUserInfo(userId) {
    let sql = `select userId, userType, phone, nickname, emailName, avatar from User where userId='${userId}'`
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  static async getUserListByMembers(members) {
    let sql = "select * from User where FIND_IN_SET(userId, '" + members + "')"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  static async getUserListByViewers(viewers) {
    let sql = "select * from User where FIND_IN_SET(userId, '" + viewers + "')"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  static async getAllUserInfoForSimple() {
    let sql = "select id, userId, nickname, emailName, avatar from User where registerStatus='1'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  static async getUsersByUserIds(userIds) {
    let userIdStr = ''
    userIds.forEach((userId, index) => {
      if (index === userIds.length - 1) {
        userIdStr += `'${userId}'`
      } else {
        userIdStr += `'${userId}',`
      }
    })
    const userSql = userIdStr.length ? ` where userId in (${userIdStr}) ` : ''
    let sql = `select userId, nickName, emailName, phone, avatar from User ${userSql}`
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 激活用户
   */
  static async activeRegisterMember(userId) {
    const data = {registerStatus: 1}
    await User.update({
      ...data
    }, {
      where: {
        userId
      },
      fields: Object.keys(data)
    })
    return true
  }
  
  /**
   * 获取User详情数据
   * @param id  User的ID
   * @returns {Promise<Model>}
   */
  static async getUserDetail(id) {
    return await User.findOne({
      where: {
        id,
      },
    })
  }

  /**
   * 根据用户名密码
   * @param id  User的ID
   * @returns {Promise<Model>}
   */
  static async getUserForPwd(data) {
    return await User.findOne({
      where: {
        ...data
      },
    })
  }

  /**
   * 根据类型获取管理员邮箱
   * @param id  User的ID
   * @returns {Promise<Model>}
   */
  static async getAdminByType(userType) {
    return await User.findOne({
      where: {
        userType
      },
    })
  }
  /**
   * 检查账号是否已经存在
   * @param id  User的ID
   * @returns {Promise<Model>}
   */
  static async checkUserAccount(email) {
    return await User.findOne({
      where: {
        emailName: email
      },
    })
  }
  /**
   * 判断是否是管理员账号
   * @param id  User的ID
   * @returns {Promise<Model>}
   */
  static async isAdminAccount(email, userType) {
    return await User.findOne({
      where: {
        emailName: email,
        userType
      },
    })
  }
  /**
   * 删除User
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteUser(id) {
    await User.destroy({
      where: {
        id,
      }
    })
    return true
  }

  static async checkAdminAccount() {
    let sql = "select count(id) as count from User where userType='superAdmin'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  /**
   * 删除User
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async deleteUserByUserId(userId) {
    await User.destroy({
      where: {
        userId,
      }
    })
    return true
  }

  /**
   * 将成员设置为管理员
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async setAdmin(userId, setType) {
    let data = {userType: 'admin'}
    if (setType === 'a') {
      data = {userType: 'admin'}
    } else if (setType === 'c') {
      data = {userType: 'customer'}
    }
    await User.update({
      ...data
    }, {
      where: {
        userId
      },
      fields: Object.keys(data)
    })
    return true
  }
  /**
   * 将超级管理员移交给他人
   * @param id listID
   * @returns {Promise.<boolean>}
   */
  static async resetSuperAdmin(userId, targetUserId) {
    // 设置超级管理员
    const targetData = {userType: 'superAdmin'}
    await User.update({
      ...targetData
    }, {
      where: {
        userId: targetUserId
      },
      fields: Object.keys(targetData)
    })
    // 移除当前用户超级管理员的角色
    const data = {userType: 'customer'}
    await User.update({
      ...data
    }, {
      where: {
        userId
      },
      fields: Object.keys(data)
    })
    return true
  }
}
//exports//
module.exports = UserModel
//exports//