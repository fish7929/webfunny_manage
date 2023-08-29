//delete//
const db = require('../config/db')
const Sequelize = db.sequelize;
const CommonSql = require("../util/commonSql")
//delete//
//Sequelize//
const Team = Sequelize.import('../schema/team');
Team.sync({force: false});
//Sequelize//
class TeamModel {
  /**
   * 创建Team信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createTeam(data) {
    return await Team.create({
      ...data
    })
  }

  static async deleteTeam(id) {
    await Team.destroy({
      where: {
        id,
      }
    })
    return true
  }

  /**
   * 获取Team详情数据
   * @param id  Team的ID
   * @returns {Promise<Model>}
   */
  static async getTeamDetail(id) {
    return await Team.findOne({
      where: {
        id,
      },
    })
  }

  /**
   * 根据名称获取Team详情数据
   * @param id  Team的ID
   * @returns {Promise<Model>}
   */
  static async getTeamDetailByName(teamName) {
    return await Team.findOne({
      where: {
        teamName,
      },
    })
  }

  static async updateTeam(id, data) {
    await Team.update({
      ...data
    }, {
      where: {
        id
      },
      fields: Object.keys(data)
    })
    return true
  }

  static async getTeamList(userId, userType, companyId) {
    let sql = ""
    if (userType === "admin" || userType === "superAdmin") {
      sql = `select * from Team where companyId='${companyId}'`
    } else {
      sql = `select * from Team where companyId='${companyId}' and members like '%${userId}%'`
      // sql = "select * from Team"
    }
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  static async getAllTeamList() {
    let sql = "select * from Team"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  static async getTeamMembersByWebMonitorId(webMonitorId) {
    let sql = `select leaderId, members from Team where FIND_IN_SET('${webMonitorId}', webMonitorIds)`
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  static async findTeamListByLeaderId(userId) {
    let sql = "select * from Team where FIND_IN_SET('" + userId + "', members)" //leaderId='" + userId + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  // 检查是不是团长
  static async checkTeamLeader(teamId, userId) {
    let sql = `select * from Team where id='${teamId}' and leaderId='${userId}'` //leaderId='" + userId + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

  // 检查是不是团队成员
  static async checkTeamMember(teamId, userId) {
    let sql = `select * from Team where id='${teamId}' and  FIND_IN_SET('${userId}', members)` //leaderId='" + userId + "'"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
}
//exports//
module.exports = TeamModel
//exports//