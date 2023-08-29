//delete//
const Utils = require('../util/utils');
const CompanyModel = require('../modules/company')
const statusCode = require('../util/status-code')
//delete//
class CompanyController {
    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async updateCompany(ctx) {
        const {userId, companyName, companyTax, bankName, bankNumber, companyAddress, companyPhone} = JSON.parse(ctx.request.body);
        // 查询userId是否已经绑定公司了
        const companyRes = await CompanyModel.getCompanyDetailByOwnerId(userId);
        let isComplete = 0
        if (companyRes) {
            if (companyName && companyTax) {
                isComplete = 1
            }
            await CompanyModel.updateCompany(companyRes.companyId, {
                ownerId: userId,
                companyName,
                companyTax,
                companyAddress: companyAddress,
                companyPhone: companyPhone,
                bankName,
                bankNumber,
                isComplete
            })
        } else {
            if (companyName && companyTax) {
                isComplete = 1
            }
            await CompanyModel.createCompany({
                ownerId: userId,
                companyId: Utils.getUuid(),
                companyName,
                companyTax,
                companyAddress: companyAddress,
                companyPhone: companyPhone,
                bankName,
                bankNumber,
                isComplete
            });
        }

        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('创建信息成功', 0)
    }
    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getCompanyInfo(ctx) {
        const {companyId} = JSON.parse(ctx.request.body);
        // 查询userId是否已经绑定公司了
        const company = await CompanyModel.getCompanyInfo(companyId);
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询成功', company)
    }
    /**
     * 获取公司列表
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getCompanyList(ctx) {
        // 查询userId是否已经绑定公司了
        const companyList = await CompanyModel.getCompanyList();
        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('查询成功', companyList)
    }
}
//exports//
module.exports = CompanyController
//exports//