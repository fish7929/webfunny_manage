//delete//
const ApplicationConfigModel = require('../modules/applicationConfig')
const statusCode = require('../util/status-code')
//delete//
class ApplicationConfigController {
    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async create(ctx) {
        let req = ctx.request.body;

        if (req.title && req.author && req.content && req.category) {
            let ret = await ApplicationConfigModel.createApplicationConfig(req);
            let data = await ApplicationConfigModel.getApplicationConfigDetail(ret.id);

            ctx.response.status = 200;
            ctx.body = statusCode.SUCCESS_200('创建信息成功', data)
        } else {

            ctx.response.status = 412;
            ctx.body = statusCode.ERROR_412('创建信息失败，请求参数不能为空！')
        }
    }
    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async updateSysConfigInfo(ctx) {
        let param = JSON.parse(ctx.request.body);
        const { serverDomain, adminDomain, editType } = param

        // 先检查对应配置是否存在
        const checkRes = await ApplicationConfigModel.getApplicationConfigByConfigName(editType)
        if (checkRes && checkRes.length) {
            // 如果存在，则更新
            await ApplicationConfigModel.updateApplicationConfig(editType, {configValue: JSON.stringify({serverDomain, adminDomain})})
        } else {
            // 如果不存在，则新建
            await ApplicationConfigModel.createApplicationConfig({systemName: editType, configValue: JSON.stringify({serverDomain, adminDomain})})
        }

        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('创建信息成功', 0)
    }

    /**
     * 更新域名配置信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async setInitSysConfigInfo(serverDomain, adminDomain, editType) {
        // 如果对应配置不存在，则新建
        const checkRes = await ApplicationConfigModel.getApplicationConfigByConfigName(editType)
        if (checkRes && checkRes.length === 0) {
            await ApplicationConfigModel.createApplicationConfig({systemName: editType, configValue: JSON.stringify({serverDomain, adminDomain})})
        }
    }

    /**
     * 创建信息
     * @param ctx
     * @returns {Promise.<void>}
     */
    static async getSysConfigInfo(ctx) {
        let param = JSON.parse(ctx.request.body);

        // 先检查对应配置是否存在
        const checkRes = await ApplicationConfigModel.getAllApplicationConfig()

        ctx.response.status = 200;
        ctx.body = statusCode.SUCCESS_200('创建信息成功', checkRes)
    }
}
//exports//
module.exports = ApplicationConfigController
//exports//