//delete//
const ProductModel = require('../modules/product')
const statusCode = require('../util/status-code')
//delete//
class ProductController {
    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async create(ctx) {
        let req = ctx.request.body;
        await ProductModel.createProduct(req);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('创建信息成功', data)
    }
    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getProjectByCompanyIdForMonth(ctx) {
        const { companyId } = ctx.wfParam
        const month = new Date().Format("yyyy-MM")
        await ProductModel.getProjectByCompanyIdForMonth(companyId, month);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('创建信息成功', data)
    }
}
//exports//
module.exports = ProductController
//exports//