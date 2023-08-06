//delete//
const db = require('../config/db')
const Sequelize = db.sequelize;
//delete//
//Sequelize//
const Product = Sequelize.import('../schema/product');
Product.sync({force: false});
//Sequelize//
class ProductModel {
  /**
   * 创建Product信息
   * @param data
   * @returns {Promise<*>}
   */
  static async createProduct(data) {
    return await Product.create({
      ...data
    })
  }
     /**
   * 获取Product详情数据
   * @param userId  Product的userId
   * @returns {Promise<Model>}
   */
  static async getProductDetail(id) {
    return await Product.findOne({
      where: {
        id,
      },
    })
  }

  static async getProductDetailByCompanyId(companyId) {
    return await Product.findOne({
      where: {
        companyId,
      },
    })
  }
  static async updateProduct(companyId, data) {
    await Team.update({
      ...data
    }, {
      where: {
        companyId
      },
      fields: Object.keys(data)
    })
    return true
  }

  static async deleteProduct(id) {
    await Product.destroy({
      where: {
        id,
      }
    })
    return true
  }

  static async getProjectByCompanyIdForMonth(companyId, month) {
    let sql = `select * from Product where companyId='${companyId}' and month='${month}'`
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT})
  }

}
//exports//
module.exports = ProductModel
//exports//