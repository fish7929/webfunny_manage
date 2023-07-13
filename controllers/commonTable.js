//delete//
const CommonTableModel = require('../modules/commonTable')
const Utils = require('../util/utils')
const AccountConfig = require('../config/AccountConfig')
const { accountInfo } = AccountConfig
//delete//
class CommonTableController {
  /**
   * 创建数据库辩驳
   */
  static async createTable(timeSize = 0) {
    const dateStr = Utils.addDays(timeSize).replace(/-/g, "")
    CommonTableModel.createInfoTable(dateStr)
  }
}
//exports//
module.exports = CommonTableController
//exports//