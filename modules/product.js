//delete//
const db = require('../config/db')
const Sequelize = db.sequelize;
//delete//
//Sequelize//
const Product = Sequelize.import('../schema/product');
Product.sync({ force: false });
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
    await Product.update({
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
    let sql = `select * from Product where companyId='${companyId}' and month='${month}' and isValid=1`
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT })
  }
  //1 流量套餐，2 流量包
  static async getProjectPackageByCompanyId(companyId) {
    let sql = `select * from Product where companyId='${companyId}' and productType=2 and isValid=1`
    return await Sequelize.query(sql, { type: Sequelize.QueryTypes.SELECT })
  }
  //批量根据订单号查询查找有效的产品
  static async batchQueryProductByOrderId(ids) {
    return Product.findAll({
      where: {
        orderId: ids,
        isValid: 1
      },
      attributes: ['orderId', 'month', 'usedFlowCount', 'maxFlowCount', 'companyId', 'productType']
    });
  }
  // 批量增加数据
  static async batchCreateProduct(data) {
    return await Product.bulkCreate(data)
  }

  // 批量更新数据
  static async batchUpdateProductByOrderId(ids, data) {
    return await Product.update({
      ...data
    }, {
      where: {
        orderId: ids
      },
      fields: Object.keys(data)
    })
  }
}
//exports//
module.exports = ProductModel
//exports//