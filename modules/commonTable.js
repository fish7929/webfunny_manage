//delete//
const { DataTypes } = require("sequelize");
const db = require('../config/db')
const Sequelize = db.sequelize;
const infoSchemaList = require("../schema/infoSchemaListByDay")
const infoSchemaListByYear = require("../schema/infoSchemaListByYear")
//delete//
class CommonTableModel {
  /**
   * 删除表结构
   */
  static async dropTable(tableNameStr) {
    let sql = `
    DROP TABLE 
    ${tableNameStr} 
    `
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }
  /**
   * 动态建表（分析类）
   */
  static async createInfoTable(dateStr) {
    infoSchemaList.forEach((schema) => {
      const SchemaModal = Sequelize.define(schema.name + dateStr, schema.fields, schema.index);
      SchemaModal.sync({force: false});
    })
  }

  /**
   * 动态建表（分析类）,按年份建表
   */
  static async createInfoTableByYear(yearStr) {
    infoSchemaListByYear.forEach((schema) => {
      const SchemaModal = Sequelize.define(schema.name + yearStr, schema.fields, schema.index);
      SchemaModal.sync({force: false});
    })
  }
}
//exports//
module.exports = CommonTableModel
//exports//