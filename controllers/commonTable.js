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
    const day = Utils.addDays(timeSize)
    const dateStr = day.replace(/-/g, "")
    CommonTableModel.createInfoTable(dateStr)
    const yearStr = day.substring(0, 4)
    CommonTableModel.createInfoTableByYear(yearStr)
  }
}
//exports//
module.exports = CommonTableController
//exports//