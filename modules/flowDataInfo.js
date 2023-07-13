//delete//
const db = require('../config/db')
const Sequelize = db.sequelize;
//delete//
class FlowDataInfoModel {
  /**
   * 创建FlowDataInfo信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createFlowDataInfo(data) {
    
    let keys = ""
    let values = ""
    const keyArray = [`id`,`createdAt`,`updatedAt`,`companyId`,`projectId`,`flowType`,"dayName","hourName","flowCount"]
    keyArray.forEach((key, index) => {
      if (index == keyArray.length - 1) {
        keys += "`" + key + "`"
        let val = data[key]
        if (val != undefined) {
          values += "'" + val + "'"
        } else {
          values += "DEFAULT"
        }
      } else {
        keys += "`" + key + "`, "
        let val = data[key]
        // createdAt， updatedAt 不能位于 keyArray的最后一个
        switch(key) {
          case "id":
            val = new Date().getTime() + Utils.getUuid()
            break
          case "createdAt":
          case "updatedAt":
            // 填写创建时间
            val = new Date().Format("yyyy-MM-dd hh:mm:ss")
            break
          default:
            break
        }

        if (val != undefined) {
          values += "'" + val + "', "

        } else {
          values += "DEFAULT, "
        }
      }
    })
    const dateEnd = new Date().Format("yyyyMMdd")
    const table = "FlowDataInfo" + dateEnd
    let sql = "INSERT INTO " + table + " (" + keys + ") VALUES (" + values + ")"
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.INSERT })
  }

  static async createFlowDataInfos(insertSql) {
    return await Sequelize.query(insertSql, { type: Sequelize.QueryTypes.INSERT})
  }

}
//exports//
module.exports = FlowDataInfoModel
//exports//